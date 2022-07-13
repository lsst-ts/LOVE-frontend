import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './StartStopLiveViewButton.module.css';

StartStopLiveViewButton.propTypes = {
  /**
   * Callback to get state
   */
  onChange: PropTypes.func,
};

// StartStopLiveViewButton.defaultProps = {
//   onChange: (),
// };

/**
 * Handles starting and stopping the live view of the Generic camera
 */
export default function StartStopLiveViewButton({ onChange }) {
  let [isLatched, setLatched] = useState(false);

  const triggerLatch = () => {
    setLatched(!isLatched);
    if (typeof onChange === 'function') {
      onChange(!isLatched);
    }
  };

  return (
    <div className={styles.buttonWrapper}>
      <button className={styles.button} onClick={triggerLatch}>
        <span className={styles.buttonLabel}>{isLatched ? 'Stop' : 'Start'} Live View</span>
      </button>
    </div>
  );
}
