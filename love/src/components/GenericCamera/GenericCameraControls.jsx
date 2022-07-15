import React, { useState } from 'react';
import PropTypes from 'prop-types';
import StartStopLiveViewButton from './StartStopLiveViewButton/StartStopLiveViewButton';
import NumericInput from '../GeneralPurpose/Input/NumericInput';

export default function GenericCameraControls({ salIndex, requestSALCommand }) {
  const [exposureTime, changeExposureTime] = useState(5);

  const updateExposureTime = (value) => {
    const numVal = parseFloat(value);
    changeExposureTime(numVal);
  };

  const runCommand = (isLatched) => {
    if (isLatched) {
      requestSALCommand({
        cmd: 'cmd_startLiveView',
        csc: 'GenericCamera',
        salindex: salIndex,
        params: { expTime: exposureTime },
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
      <NumericInput step="any" onChange={(e) => updateExposureTime(e.target.value)} value={exposureTime} />
      <label>seconds</label>
    </div>
  );
}

GenericCameraControls.propTypes = {
  /**
   * Index of the GenericCamera to control
   */
  salIndex: PropTypes.number,
  /**
   * Function that handles calling commands on the GenericCamera
   */
  requestSALCommand: PropTypes.func,
};

GenericCameraControls.defaultProps = {
  salIndex: 1,
  requestSALCommand: () => 0,
};
