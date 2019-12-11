import React from 'react';
import scriptStyles from './Scripts.module.css';

const logLevelLabels = {
    "-1": '...',
    10: 'Info',
    20: 'Warning',
    30: 'Debug',
    40: 'Error'
};

export default ({ classname, description, remotes, pause_checkpoints, stop_checkpoints, log_level, ...props }) => {
    const logLevelLabel = logLevelLabels[log_level] ? logLevelLabels[log_level] : log_level;
    return (
    <div className={[scriptStyles.expandedSection].join(' ')}>
      <div className={scriptStyles.expandedSubSection}>
        <div className={scriptStyles.subSectionTitle}>DESCRIPTION</div>
        <div className={scriptStyles.subSectionRow}>
          <span className={scriptStyles.subSectionLabel}>Class Name:</span>
          <span className={scriptStyles.subSectionValue}> {classname} </span>
        </div>
        <div className={scriptStyles.subSectionRow}>
          <span className={scriptStyles.subSectionLabel}>Description:</span>
          <span className={scriptStyles.subSectionValue}> {description} </span>
        </div>
        <div className={scriptStyles.subSectionRow}>
          <span className={scriptStyles.subSectionLabel}>Remotes:</span>
          <span className={scriptStyles.subSectionValue}> {remotes} </span>
        </div>
        <div className={scriptStyles.subSectionRow}>
          <span className={scriptStyles.subSectionLabel}>Pause checkpoints:</span>
          <span className={scriptStyles.subSectionValue}> {pause_checkpoints} </span>
        </div>

        <div className={scriptStyles.subSectionRow}>
          <span className={scriptStyles.subSectionLabel}>Stop checkpoints:</span>
          <span className={scriptStyles.subSectionValue}> {stop_checkpoints} </span>
        </div>

        <div className={scriptStyles.subSectionRow}>
          <span className={scriptStyles.subSectionLabel}>Log level:</span>
          <span className={scriptStyles.subSectionValue}> {logLevelLabel} </span>
        </div>
        {/* <div className={scriptStyles.subSectionTitle}>
      SCHEMA
    </div> */}
      </div>
    </div>
  );
};
