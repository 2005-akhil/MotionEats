import { useState } from 'react';
import { useMotion, MOTION_STATE, GESTURES } from '../../context/MotionContext.jsx';
import { useMotionController } from '../../hooks/useMotionController.jsx';
import styles from './MotionHUD.module.css';

const GESTURE_ICONS = {
  [GESTURES.POINTING]: '☝️',
  [GESTURES.PINCH]: '🤏',
  [GESTURES.THUMBS_UP]: '👍',
  [GESTURES.THUMBS_DOWN]: '👎',
  [GESTURES.FIST]: '✊',
  [GESTURES.OPEN_PALM]: '🖐️',
  [GESTURES.NONE]: '✋',
};

const GESTURE_LABELS = {
  [GESTURES.POINTING]: 'Pointing',
  [GESTURES.PINCH]: 'Pinch',
  [GESTURES.THUMBS_UP]: 'Thumbs Up',
  [GESTURES.THUMBS_DOWN]: 'Thumbs Down',
  [GESTURES.FIST]: 'Fist',
  [GESTURES.OPEN_PALM]: 'Open Palm',
  [GESTURES.NONE]: 'None',
};

export function MotionHUD() {
  const { motionState, currentGesture, faceDetected, cameraConnected, errorMessage, cursorActive } = useMotion();
  const { videoRef, toggle } = useMotionController();
  const [minimized, setMinimized] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const isOff = motionState === MOTION_STATE.OFF;
  const isStarting = motionState === MOTION_STATE.CAMERA_STARTING;
  const isActive = motionState === MOTION_STATE.ACTIVE;
  const isPaused = motionState === MOTION_STATE.PAUSED;
  const isError = motionState === MOTION_STATE.ERROR;

  const statusLabel = {
    [MOTION_STATE.OFF]: 'OFF',
    [MOTION_STATE.CAMERA_STARTING]: 'Starting…',
    [MOTION_STATE.ACTIVE]: 'ACTIVE',
    [MOTION_STATE.PAUSED]: 'PAUSED',
    [MOTION_STATE.ERROR]: 'ERROR',
  }[motionState] || 'OFF';

  return (
    <div className={`${styles.hud} ${minimized ? styles.minimized : ''}`} aria-label="Motion control HUD">
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <span className={styles.title}>Motion Control</span>
          <span className={`${styles.badge} ${isActive ? styles.badgeActive : isPaused ? styles.badgePaused : isError ? styles.badgeError : ''}`}>
            {statusLabel}
          </span>
        </div>
        <div className={styles.actions}>
          <button
            className={styles.iconBtn}
            onClick={() => setShowHelp(v => !v)}
            aria-label="Toggle gesture guide"
            title="Gesture Help"
          >?</button>
          <button
            className={styles.iconBtn}
            onClick={() => setMinimized(v => !v)}
            aria-label={minimized ? 'Expand motion control HUD' : 'Minimize motion control HUD'}
            title={minimized ? 'Expand' : 'Minimize'}
          >{minimized ? '▲' : '▼'}</button>
        </div>
      </div>

      {/* Body: kept mounted even when minimized to preserve video track state */}
      <div className={`${styles.body} ${minimized ? styles.bodyMinimized : ''}`}>
        {/* Status indicators */}
        <div className={styles.statusList}>
          <StatusRow
            label="Motion Control"
            value={isActive ? 'ON' : isPaused ? 'PAUSED' : isStarting ? 'Starting…' : 'OFF'}
            ok={isActive}
            loading={isStarting}
          />
          <StatusRow
            label="Camera"
            value={cameraConnected ? 'Connected' : isStarting ? 'Connecting…' : 'Not connected'}
            ok={cameraConnected}
            loading={isStarting}
          />
          <StatusRow
            label="Face"
            value={faceDetected ? 'Face detected' : 'Waiting for face'}
            ok={faceDetected}
          />
          <StatusRow
            label="Gesture"
            value={`${GESTURE_ICONS[currentGesture] || '✋'} ${GESTURE_LABELS[currentGesture] || 'None'}`}
            ok={currentGesture !== GESTURES.NONE}
            plain
          />
          <StatusRow
            label="Cursor"
            value={cursorActive && isActive ? 'Active' : 'Inactive'}
            ok={cursorActive && isActive}
          />

        </div>

        {/* Camera preview */}
        <div className={`${styles.previewWrap} ${!cameraConnected && !isStarting ? styles.previewHidden : ''}`}>
          <video
            ref={videoRef}
            className={styles.preview}
            muted
            playsInline
            aria-hidden="true"
          />
          {isStarting && (
            <div className={styles.previewOverlay}>
              <div className={styles.spinner} />
              <span>Loading AI models…</span>
            </div>
          )}
        </div>

        {/* Error message */}
        {isError && errorMessage && (
          <div className={styles.errorBox} role="alert">
            ⚠️ {errorMessage}
            <div className={styles.errorSubtext}>
              Motion control is unavailable. You can continue using mouse or touch.
            </div>
          </div>
        )}

        {/* Toggle button */}
        <button
          className={`${styles.toggleBtn} ${isOff || isError ? styles.toggleOff : styles.toggleOn}`}
          onClick={toggle}
          disabled={isStarting}
          aria-pressed={isActive || isPaused}
          aria-label={isOff || isError ? 'Enable motion control' : 'Disable motion control'}
        >
          {isStarting ? 'Starting Camera…' : isOff || isError ? '▶ Enable Motion Control' : '⏹ Disable Motion Control'}
        </button>
      </div>

      {/* Help panel */}
      {showHelp && (
        <div className={styles.helpPanel} role="dialog" aria-label="How to use Motion Control">
          <div className={styles.helpHeader}>
            <span>How to use Motion Control</span>
            <button className={styles.iconBtn} onClick={() => setShowHelp(false)} aria-label="Close guide">×</button>
          </div>
          <ul className={styles.helpList}>
            <li>
              <span>☝️</span>
              <div>
                <strong>Point</strong>
                <p>Move virtual cursor</p>
              </div>
            </li>
            <li>
              <span>🤏</span>
              <div>
                <strong>Pinch</strong>
                <p>Click / Select element</p>
              </div>
            </li>
            <li>
              <span>👍</span>
              <div>
                <strong>Thumbs Up</strong>
                <p>Scroll up</p>
              </div>
            </li>
            <li>
              <span>👎</span>
              <div>
                <strong>Thumbs Down</strong>
                <p>Scroll down</p>
              </div>
            </li>
            <li>
              <span>✊</span>
              <div>
                <strong>Fist</strong>
                <p>Next</p>
              </div>
            </li>
            <li>
              <span>🖐️</span>
              <div>
                <strong>Open Palm</strong>
                <p>Back</p>
              </div>
            </li>
          </ul>
          <p className={styles.helpNote}>
            Normal mouse, keyboard & touch controls always remain available.
          </p>
        </div>
      )}
    </div>
  );
}

function StatusRow({ label, value, ok, loading, plain }) {
  return (
    <div className={styles.statusRow}>
      <span className={styles.statusLabel}>{label}</span>
      <span className={`${styles.statusValue} ${plain ? '' : ok ? styles.statusOk : loading ? styles.statusLoading : styles.statusOff}`}>
        {!plain && (
          <span className={`${styles.dot} ${ok ? styles.dotOk : loading ? styles.dotLoading : styles.dotOff}`} />
        )}
        {value}
      </span>
    </div>
  );
}
