import React from 'react';
import PropTypes from 'prop-types';
import StartStopLiveViewButton from './StartStopLiveViewButton/StartStopLiveViewButton';

GenericCameraControls.propTypes = {
  /**
   * Index of the GenericCamera to control
   */
  salIndex: PropTypes.int,
  /**
   * Function that handles calling commands on the GenericCamera
   */
  requestSALCommand: PropTypes.func,
};

GenericCameraControls.defaultProps = {
  salIndex: 1,
  requestSALCommand: () => 0,
};

export default function GenericCameraControls({ salIndex, requestSALCommand }) {
  const runCommand = (isLatched) => {
    console.log('State:', isLatched);
    if (isLatched) {
      requestSALCommand({
        cmd: 'cmd_startLiveView',
        csc: 'GenericCamera',
        salindex: salIndex,
        params: { expTime: 5 },
      });
    } else {
      requestSALCommand({
        cmd: 'cmd_stopLiveView',
        csc: 'GenericCamera',
        salindex: salIndex,
        params: {},
      });
    }
  };

  return (
    <div>
      <StartStopLiveViewButton onChange={runCommand} />
    </div>
  );
}
