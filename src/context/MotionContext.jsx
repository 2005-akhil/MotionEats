import { createContext, useContext, useReducer, useCallback } from 'react';

const MotionContext = createContext(null);

export const MOTION_STATE = {
  OFF: 'OFF',
  CAMERA_STARTING: 'CAMERA_STARTING',
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  ERROR: 'ERROR',
};

export const GESTURES = {
  NONE: 'None',
  POINTING: 'Pointing',
  PINCH: 'Pinch',
  THUMBS_UP: 'Thumbs Up',
  THUMBS_DOWN: 'Thumbs Down',
  FIST: 'Fist',
  OPEN_PALM: 'Open Palm',
};

function motionReducer(state, action) {
  switch (action.type) {
    case 'SET_STATE':
      return { ...state, motionState: action.payload };
    case 'SET_GESTURE':
      return { ...state, currentGesture: action.payload };
    case 'SET_FACE_DETECTED':
      return { ...state, faceDetected: action.payload };
    case 'SET_CAMERA_CONNECTED':
      return { ...state, cameraConnected: action.payload };
    case 'SET_CURSOR':
      return {
        ...state,
        cursorX: action.payload.x,
        cursorY: action.payload.y,
        cursorActive: action.payload.active,
      };
    case 'SET_ERROR':
      return {
        ...state,
        motionState: MOTION_STATE.ERROR,
        errorMessage: action.payload,
      };
    case 'RESET':
      return {
        ...state,
        motionState: MOTION_STATE.OFF,
        currentGesture: GESTURES.NONE,
        faceDetected: false,
        cameraConnected: false,
        cursorActive: false,
        cursorX: 0,
        cursorY: 0,
        errorMessage: null,
      };
    default:
      return state;
  }
}

const initialState = {
  motionState: MOTION_STATE.OFF,
  currentGesture: GESTURES.NONE,
  faceDetected: false,
  cameraConnected: false,
  cursorX: 0,
  cursorY: 0,
  cursorActive: false,
  errorMessage: null,
};

export function MotionProvider({ children }) {
  const [state, dispatch] = useReducer(motionReducer, initialState);

  const setMotionState = useCallback(
    s => dispatch({ type: 'SET_STATE', payload: s }),
    []
  );
  const setGesture = useCallback(
    g => dispatch({ type: 'SET_GESTURE', payload: g }),
    []
  );
  const setFaceDetected = useCallback(
    v => dispatch({ type: 'SET_FACE_DETECTED', payload: v }),
    []
  );
  const setCameraConnected = useCallback(
    v => dispatch({ type: 'SET_CAMERA_CONNECTED', payload: v }),
    []
  );
  const setCursor = useCallback(
    (x, y, active) =>
      dispatch({
        type: 'SET_CURSOR',
        payload: { x, y, active },
      }),
    []
  );
  const setError = useCallback(
    msg => dispatch({ type: 'SET_ERROR', payload: msg }),
    []
  );
  const reset = useCallback(
    () => dispatch({ type: 'RESET' }),
    []
  );

  return (
    <MotionContext.Provider
      value={{
        ...state,
        setMotionState,
        setGesture,
        setFaceDetected,
        setCameraConnected,
        setCursor,
        setError,
        reset,
      }}
    >
      {children}
    </MotionContext.Provider>
  );
}

export function useMotion() {
  const ctx = useContext(MotionContext);
  if (!ctx) {
    throw new Error('useMotion must be used within MotionProvider');
  }
  return ctx;
}
