import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ResumeIcon from 'components/icons/GenericCamera/ResumeIcon/ResumeIcon';
import StopIcon from 'components/icons/GenericCamera/StopIcon/StopIcon';
import styles from './StartStopLiveViewButton.module.css';
/**
 * Handles starting and stopping the live view of the Generic camera
 */
export default function StartStopLiveViewButton({ onChange }) {
  const [isLatched, setLatched] = useState(false);

  const triggerLatch = () => {
    setLatched(!isLatched);
    if (typeof onChange === 'function') {
      onChange(!isLatched);
    }
  };

  return (
    <div className={styles.buttonWrapper}>
      <button className={isLatched ? styles.buttonLatched : styles.button} onClick={triggerLatch}>
        {isLatched ? <StopIcon /> : <ResumeIcon />}
        <span className={styles.buttonLabel}>{isLatched ? 'Stop' : 'Start'} Live View</span>
      </button>
    </div>
  );
}

StartStopLiveViewButton.propTypes = {
  /**
   * Callback to get state
   */
  onChange: PropTypes.func,
};

// StartStopLiveViewButton.defaultProps = {
//   onChange: (),
// };
