import React from 'react';
import styles from './GlobalState.module.css';
import scriptStyles from '../Scripts/Scripts.module.css';
import StatusText from 'components/GeneralPurpose/StatusText/StatusText.jsx';

const GlobalState = ({summaryState, queueState}) => {
  console.log('summaryState, queueState', summaryState, queueState);
  return (
    <div className={styles.globalStateWrapper}>
      <div className={styles.globalStateControls}>
        <div
          className={[scriptStyles.buttonContainer, scriptStyles.noBackgroundButton].join(' ')}
          // onClick={(e) => this.props.onClickContextMenu(e, this.props.index)}
        >
          <span className={styles.threeDotsButton}>&#8943;</span>
        </div>
      </div>
      <div className={styles.globalStateContainer}>
        <div className={styles.stateContainer}>
          Summary State
          <StatusText status={summaryState.statusText}>{summaryState.name}</StatusText>
        </div>
        <div className={styles.stateContainer}>
          Queue state
          <StatusText status={queueState.statusText}>{queueState.name}</StatusText>
        </div>
      </div>
    </div>
  );
};

export default GlobalState;
