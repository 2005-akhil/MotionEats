import { useRef, useCallback, useEffect, createContext, useContext } from 'react';
import { useMotion, MOTION_STATE, GESTURES } from '../context/MotionContext.jsx';
import { MotionController } from '../motion/MotionController.js';

// Shared context so multiple components can access the same controller & videoRef
const MotionControllerContext = createContext(null);

export function MotionControllerProvider({ children }) {
  const motion = useMotion();
  const controllerRef = useRef(null);
  const videoRef = useRef(null);

  const start = useCallback(async () => {
    if (controllerRef.current) {
      controllerRef.current.stop();
      controllerRef.current = null;
    }

    motion.setMotionState(MOTION_STATE.CAMERA_STARTING);
    motion.setCameraConnected(false);
    motion.setFaceDetected(false);
    motion.setGesture(GESTURES.NONE);

    const controller = new MotionController({
      onGesture: (gesture) => motion.setGesture(gesture),
      onFace: (detected) => motion.setFaceDetected(detected),
      onCursor: (x, y, active) => motion.setCursor(x, y, active),
      onError: (msg) => { motion.setError(msg); motion.setCameraConnected(false); },
      onStateChange: (state) => {
        motion.setMotionState(state);
        if (state === MOTION_STATE.ACTIVE) motion.setCameraConnected(true);
        if (state === MOTION_STATE.OFF) motion.setCameraConnected(false);
      },
    });

    controllerRef.current = controller;
    if (!videoRef.current) {
      console.error('[MotionController] videoRef is not attached to a <video> element');
      motion.setError('Video element not ready. Please try again.');
      return;
    }
    await controller.start(videoRef.current);
  }, [motion]);

  const stop = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.stop();
      controllerRef.current = null;
    }
    motion.reset();
  }, [motion]);

  const toggle = useCallback(async () => {
    const { motionState } = motion;
    if (motionState === MOTION_STATE.OFF || motionState === MOTION_STATE.ERROR) {
      await start();
    } else {
      stop();
    }
  }, [motion, start, stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.stop();
      }
    };
  }, []);

  return (
    <MotionControllerContext.Provider value={{ videoRef, start, stop, toggle }}>
      {children}
    </MotionControllerContext.Provider>
  );
}

/**
 * Hook to access the motion controller.
 * Must be used within MotionControllerProvider.
 */
export function useMotionController() {
  const ctx = useContext(MotionControllerContext);
  if (!ctx) throw new Error('useMotionController must be used within MotionControllerProvider');
  return ctx;
}
