export const SIDEREAL_SECOND = 1.00273788;
export const MAX_CCW_FOLLOWING_ERROR = 2.0;
export const AUTHLIST_REQUEST_PENDING = 'Pending';
export const AUTHLIST_REQUEST_ACCEPTED = 'Authorized';
export const AUTHLIST_REQUEST_DENIED = 'Denied';
export const LOG_LEVELS = { debug: 10, info: 20, warning: 30, error: 40 };

export const cameraStates = {
  raftsDetailedState: {
    0: 'NEEDS_CLEAR',
    1: 'CLEARING',
    2: 'INTEGRATING',
    3: 'READING_OUT',
    4: 'QUIESCENT',
  },
  imageReadinessDetailedState: {
    0: 'READY',
    1: 'NOT_READY',
    2: 'GETTING_READY',
  },
  calibrationDetailedState: {
    0: 'DISABLED',
    1: 'ENABLED',
    2: 'INTEGRATING',
  },
  shutterDetailedState: {
    0: 'CLOSED',
    1: 'OPEN',
    2: 'CLOSING',
    3: 'OPENING',
  },
};

export const imageStates = {
  INTEGRATING: 'INTEGRATING',
  READING_OUT: 'READING_OUT',
  END_READOUT: 'END_READOUT',
  END_TELEMETRY: 'END_TELEMETRY',
};
