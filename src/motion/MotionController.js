/**
 * MotionController - Core motion detection engine
 * Uses MediaPipe Tasks Vision for hand and face landmark detection.
 * All processing is local in-browser. No camera frames are uploaded.
 *
 * Gestures:
 * ☝️ Point       → Move cursor
 * 🤏 Pinch       → Click
 * 👍 Thumbs Up   → Scroll up
 * 👎 Thumbs Down → Scroll down
 * ✊ Fist        → Next
 * 🖐️ Open Palm   → Back
 */

import { GESTURES, MOTION_STATE } from '../context/MotionContext.jsx';

function lerp(a, b, t) {
  return a + (b - a) * t;
}

class SmoothValue {
  constructor(initial = 0.5, factor = 0.28) {
    this.value = initial;
    this.factor = factor;
  }

  update(target) {
    this.value = lerp(this.value, target, this.factor);
    return this.value;
  }
}

function mapCoordinate(normVal, minIn = 0.15, maxIn = 0.85) {
  const t = (normVal - minIn) / (maxIn - minIn);
  return Math.min(Math.max(t, 0), 1);
}

class GestureStabilizer {
  constructor(windowSize = 5, threshold = 0.55) {
    this.history = [];
    this.windowSize = windowSize;
    this.threshold = threshold;
  }

  push(gesture) {
    this.history.push(gesture);
    if (this.history.length > this.windowSize) {
      this.history.shift();
    }
  }

  stable() {
    if (this.history.length < 3) {
      return GESTURES.NONE;
    }

    const counts = {};
    for (const g of this.history) {
      counts[g] = (counts[g] || 0) + 1;
    }

    let best = GESTURES.NONE;
    let bestCount = 0;

    for (const [g, c] of Object.entries(counts)) {
      if (c > bestCount) {
        best = g;
        bestCount = c;
      }
    }

    return bestCount / this.history.length >= this.threshold
      ? best
      : GESTURES.NONE;
  }

  reset() {
    this.history = [];
  }
}

export class MotionController {
  constructor(callbacks) {
    this.callbacks = callbacks || {};

    this.stream = null;
    this.videoEl = null;
    this.animFrameId = null;

    this.handLandmarker = null;
    this.faceDetector = null;

    this.isRunning = false;
    this.isPaused = false;

    this.cursorX = new SmoothValue(0.5, 0.28);
    this.cursorY = new SmoothValue(0.5, 0.28);

    this.stabilizer = new GestureStabilizer(5, 0.55);
    this.faceDetectionStreak = 0;
    this.faceIsActive = false;

    this.lastPinchTime = 0;
    this.PINCH_COOLDOWN = 650;
    this.pinchActive = false;

    this.lastScrollTime = 0;
    this.SCROLL_COOLDOWN = 450;

    this.lastNavigationTime = 0;
    this.NAVIGATION_COOLDOWN = 1200;
    this.navigationGestureHeld = false;

    this.FRAME_INTERVAL = 1000 / 24;
    this.lastFrameTime = 0;

    this.lastEmittedGesture = GESTURES.NONE;

    this._mediapipeLoaded = false;
  }

  async start(videoElement) {
    if (!videoElement) {
      this.callbacks.onError?.('Video preview element not available');
      return;
    }

    this.videoEl = videoElement;
    this.callbacks.onStateChange?.(MOTION_STATE.CAMERA_STARTING);

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Your browser does not support webcam access.');
      }

      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
        audio: false,
      });

      this.videoEl.srcObject = this.stream;

      await new Promise((resolve, reject) => {
        this.videoEl.onloadedmetadata = () => {
          this.videoEl.play().then(resolve).catch(reject);
        };

        this.videoEl.onerror = reject;

        setTimeout(
          () => reject(new Error('Webcam metadata timed out')),
          10000
        );
      });

      await this._loadMediaPipe();

      this.isRunning = true;
      this.callbacks.onStateChange?.(MOTION_STATE.ACTIVE);
      this._loop();
    } catch (err) {
      console.error('[MotionController] start failed:', err);

      let msg = err.message || 'Unable to access camera.';

      if (
        err.name === 'NotAllowedError' ||
        err.name === 'PermissionDeniedError'
      ) {
        msg =
          'Camera permission denied. Please allow camera access in your browser to use motion control.';
      } else if (
        err.name === 'NotFoundError' ||
        err.name === 'DevicesNotFoundError'
      ) {
        msg = 'No camera found. Please connect a webcam and try again.';
      } else if (
        err.name === 'NotReadableError' ||
        err.name === 'TrackStartError'
      ) {
        msg = 'Camera is currently in use by another application.';
      }

      this.callbacks.onError?.(msg);
      this.callbacks.onStateChange?.(MOTION_STATE.ERROR);
    }
  }

  stop() {
    this.isRunning = false;

    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    if (this.stream) {
      this.stream.getTracks().forEach(track => {
        try {
          track.stop();
        } catch {}
      });
      this.stream = null;
    }

    if (this.videoEl) {
      try {
        this.videoEl.srcObject = null;
      } catch {}
      this.videoEl = null;
    }

    this.faceIsActive = false;
    this.faceDetectionStreak = 0;
    this.navigationGestureHeld = false;
    this.stabilizer.reset();

    this.callbacks.onStateChange?.(MOTION_STATE.OFF);
    this.callbacks.onGesture?.(GESTURES.NONE);
    this.callbacks.onFace?.(false);
    this.callbacks.onCursor?.(0, 0, false);
  }

  pause() {
    this.isPaused = true;
    this.callbacks.onStateChange?.(MOTION_STATE.PAUSED);
    this.callbacks.onGesture?.(GESTURES.NONE);
    this.callbacks.onCursor?.(0, 0, false);
  }

  resume() {
    this.isPaused = false;
    this.callbacks.onStateChange?.(MOTION_STATE.ACTIVE);
  }

  async _loadMediaPipe() {
    if (
      this._mediapipeLoaded &&
      this.handLandmarker &&
      this.faceDetector
    ) {
      return;
    }

    const {
      HandLandmarker,
      FaceDetector,
      FilesetResolver,
    } = await import('@mediapipe/tasks-vision');

    let vision;

    try {
      vision = await FilesetResolver.forVisionTasks('/wasm');
    } catch {
      vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
      );
    }

    const handModels = [
      '/models/hand_landmarker.task',
      'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
    ];

    let handLandmarker = null;

    for (const modelPath of handModels) {
      try {
        handLandmarker = await HandLandmarker.createFromOptions(
          vision,
          {
            baseOptions: {
              modelAssetPath: modelPath,
              delegate: 'GPU',
            },
            runningMode: 'VIDEO',
            numHands: 1,
            minHandDetectionConfidence: 0.5,
            minHandPresenceConfidence: 0.5,
            minTrackingConfidence: 0.5,
          }
        );
        break;
      } catch {
        try {
          handLandmarker = await HandLandmarker.createFromOptions(
            vision,
            {
              baseOptions: {
                modelAssetPath: modelPath,
                delegate: 'CPU',
              },
              runningMode: 'VIDEO',
              numHands: 1,
              minHandDetectionConfidence: 0.5,
              minHandPresenceConfidence: 0.5,
              minTrackingConfidence: 0.5,
            }
          );
          break;
        } catch {}
      }
    }

    if (!handLandmarker) {
      throw new Error('Could not load Hand Tracking model.');
    }

    this.handLandmarker = handLandmarker;

    const faceModels = [
      '/models/blaze_face_short_range.tflite',
      'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite',
    ];

    let faceDetector = null;

    for (const modelPath of faceModels) {
      try {
        faceDetector = await FaceDetector.createFromOptions(
          vision,
          {
            baseOptions: {
              modelAssetPath: modelPath,
              delegate: 'GPU',
            },
            runningMode: 'VIDEO',
            minDetectionConfidence: 0.5,
          }
        );
        break;
      } catch {
        try {
          faceDetector = await FaceDetector.createFromOptions(
            vision,
            {
              baseOptions: {
                modelAssetPath: modelPath,
                delegate: 'CPU',
              },
              runningMode: 'VIDEO',
              minDetectionConfidence: 0.5,
            }
          );
          break;
        } catch {}
      }
    }

    if (!faceDetector) {
      throw new Error('Could not load Face Detection model.');
    }

    this.faceDetector = faceDetector;
    this._mediapipeLoaded = true;
  }

  _loop() {
    if (!this.isRunning) return;

    this.animFrameId = requestAnimationFrame(() => this._loop());

    const now = performance.now();

    if (now - this.lastFrameTime < this.FRAME_INTERVAL) {
      return;
    }

    this.lastFrameTime = now;

    if (!this.videoEl || this.videoEl.readyState < 2) {
      return;
    }

    if (this.isPaused) return;

    if (!this.handLandmarker || !this.faceDetector) {
      return;
    }

    try {
      this._processFrame(now);
    } catch (err) {
      console.warn(
        '[MotionController] frame processing warning:',
        err
      );
    }
  }

  _processFrame(timestamp) {
    const video = this.videoEl;

    let faceDetectedRaw = false;

    try {
      const faceResult =
        this.faceDetector.detectForVideo(video, timestamp);

      faceDetectedRaw =
        (faceResult?.detections?.length ?? 0) > 0;
    } catch {}

    if (faceDetectedRaw) {
      this.faceDetectionStreak =
        Math.min(this.faceDetectionStreak + 1, 10);
    } else {
      this.faceDetectionStreak =
        Math.max(this.faceDetectionStreak - 1, 0);
    }

    const stableFace = this.faceDetectionStreak >= 3;

    if (stableFace !== this.faceIsActive) {
      this.faceIsActive = stableFace;
      this.callbacks.onFace?.(stableFace);
    }

    let handResult = null;

    try {
      handResult =
        this.handLandmarker.detectForVideo(video, timestamp);
    } catch {}

    const hasHand =
      handResult?.landmarks?.length > 0;

    if (!hasHand) {
      this.stabilizer.push(GESTURES.NONE);

      const stable = this.stabilizer.stable();

      this._emitGesture(stable);
      this.callbacks.onCursor?.(0, 0, false);

      this.navigationGestureHeld = false;

      return;
    }

    const landmarks = handResult.landmarks[0];

    const rawX = 1 - landmarks[8].x;
    const rawY = landmarks[8].y;

    const mappedX = mapCoordinate(rawX, 0.15, 0.85);
    const mappedY = mapCoordinate(rawY, 0.15, 0.85);

    const cx = this.cursorX.update(mappedX);
    const cy = this.cursorY.update(mappedY);

    const px = Math.round(cx * window.innerWidth);
    const py = Math.round(cy * window.innerHeight);

    const gesture = this._classifyGesture(landmarks);

    this.stabilizer.push(gesture);

    const stableGesture = this.stabilizer.stable();

    const displayGesture =
      stableGesture !== GESTURES.NONE
        ? stableGesture
        : gesture;

    const isCursorActive =
      [GESTURES.POINTING, GESTURES.PINCH].includes(gesture) ||
      [GESTURES.POINTING, GESTURES.PINCH].includes(stableGesture);

    this.callbacks.onCursor?.(
      px,
      py,
      isCursorActive
    );

    if (
      gesture === GESTURES.PINCH ||
      stableGesture === GESTURES.PINCH
    ) {
      this._handlePinch(px, py, timestamp);
    }

    if (stableGesture === GESTURES.THUMBS_UP) {
      this._handleThumbScroll(-1, timestamp);
    } else if (stableGesture === GESTURES.THUMBS_DOWN) {
      this._handleThumbScroll(1, timestamp);
    }

    if (
      stableGesture === GESTURES.FIST ||
      stableGesture === GESTURES.OPEN_PALM
    ) {
      this._handleNavigation(
        stableGesture === GESTURES.FIST ? 'next' : 'back',
        timestamp
      );
    } else {
      this.navigationGestureHeld = false;
    }

    this._emitGesture(displayGesture);
  }

  _classifyGesture(lm) {
    const isExtended = (tip, pip) =>
      lm[tip].y < lm[pip].y - 0.025;

    const indexExtended = isExtended(8, 6);
    const middleExtended = isExtended(12, 10);
    const ringExtended = isExtended(16, 14);
    const pinkyExtended = isExtended(20, 18);

    const thumbTip = lm[4];
    const thumbIP = lm[3];

    const pinchDistance = Math.hypot(
      thumbTip.x - lm[8].x,
      thumbTip.y - lm[8].y
    );

    if (
      pinchDistance < 0.075 &&
      !middleExtended &&
      !ringExtended
    ) {
      return GESTURES.PINCH;
    }

    const extendedCount = [
      indexExtended,
      middleExtended,
      ringExtended,
      pinkyExtended,
    ].filter(Boolean).length;

    if (extendedCount >= 3) {
      return GESTURES.OPEN_PALM;
    }

    if (
      indexExtended &&
      !middleExtended &&
      !ringExtended &&
      !pinkyExtended
    ) {
      return GESTURES.POINTING;
    }

    const otherFingersFolded =
      !indexExtended &&
      !middleExtended &&
      !ringExtended &&
      !pinkyExtended;

    if (otherFingersFolded) {
      if (
        thumbTip.y <
          thumbIP.y - 0.025 &&
        thumbTip.y <
          lm[6].y - 0.02
      ) {
        return GESTURES.THUMBS_UP;
      }

      if (
        thumbTip.y >
          thumbIP.y + 0.025 &&
        thumbTip.y >
          lm[6].y + 0.02
      ) {
        return GESTURES.THUMBS_DOWN;
      }

      if (pinchDistance > 0.085) {
        return GESTURES.FIST;
      }
    }

    return GESTURES.NONE;
  }

  _handleThumbScroll(direction, timestamp) {
    if (
      timestamp - this.lastScrollTime <
      this.SCROLL_COOLDOWN
    ) {
      return;
    }

    this.lastScrollTime = timestamp;

    window.scrollBy({
      top: direction * 180,
      behavior: 'smooth',
    });
  }

  _handleNavigation(direction, timestamp) {
    if (this.navigationGestureHeld) {
      return;
    }

    if (
      timestamp - this.lastNavigationTime <
      this.NAVIGATION_COOLDOWN
    ) {
      return;
    }

    this.lastNavigationTime = timestamp;
    this.navigationGestureHeld = true;

    try {
      window.dispatchEvent(
        new CustomEvent(
          'motioneats:navigation',
          {
            detail: { direction },
          }
        )
      );
    } catch {}
  }

  _handlePinch(screenX, screenY, timestamp) {
    if (
      timestamp - this.lastPinchTime <
      this.PINCH_COOLDOWN
    ) {
      return;
    }

    if (this.pinchActive) {
      return;
    }

    this.lastPinchTime = timestamp;
    this.pinchActive = true;

    this._showClickRipple(screenX, screenY);

    const cursorEl =
      document.getElementById('motion-cursor');

    if (cursorEl) {
      cursorEl.classList.add('clicking');

      setTimeout(
        () => cursorEl.classList.remove('clicking'),
        250
      );
    }

    try {
      const el =
        document.elementFromPoint(screenX, screenY);

      if (el) {
        const clickable =
          el.closest(
            'button, a, input, select, textarea, [role="button"], [role="tab"], [tabindex]'
          );

        if (clickable) {
          clickable.click();
          clickable.focus?.();
        } else {
          el.click();
        }
      }
    } catch (e) {
      console.warn(
        '[MotionController] click dispatch error:',
        e
      );
    }

    setTimeout(() => {
      this.pinchActive = false;
    }, this.PINCH_COOLDOWN);
  }

  _showClickRipple(x, y) {
    const ripple =
      document.createElement('div');

    ripple.className = 'click-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    document.body.appendChild(ripple);

    setTimeout(() => {
      try {
        ripple.remove();
      } catch {}
    }, 450);
  }

  _emitGesture(gesture) {
    if (gesture === this.lastEmittedGesture) {
      return;
    }

    this.lastEmittedGesture = gesture;
    this.callbacks.onGesture?.(gesture);

    if (gesture !== GESTURES.NONE) {
      this._emitGestureEvent(gesture);
    }
  }

  _emitGestureEvent(gesture) {
    try {
      window.dispatchEvent(
        new CustomEvent(
          'motioneats:gesture',
          {
            detail: { gesture },
          }
        )
      );
    } catch {}
  }
}
