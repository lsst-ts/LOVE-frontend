import React from 'react';
import styles from './Toggle.module.css';
const Toggle = ({ isLive, setLiveMode, labels }) => {
  const handleChangeChk = () => {
    setLiveMode(!isLive);
  };
  return (
    <div className={styles.switchContainer}>
      <span
        className={[styles.modeSelection, !isLive ? styles.highlightText : ''].join(' ')}
        onClick={() => setLiveMode(false)}
      >
        { labels[0] }
      </span>
      
      <label className={styles.switch}>
        <input type="checkbox" alt="Live/query mode toggle" checked={isLive} onChange={handleChangeChk} />
        <span className={[styles.slider, styles.round].join(' ')} />
      </label>

      <span
        className={[styles.modeSelection, isLive ? styles.highlightText : ''].join(' ')}
        onClick={() => setLiveMode(true)}
      >
        { labels[1] }
      </span>
      
    </div>
  );
};

Toggle.defaultProps = {
  isLive: false,
  labels: ['Query', 'Live'],
  setLiveMode: () => null,
};

export default Toggle;
