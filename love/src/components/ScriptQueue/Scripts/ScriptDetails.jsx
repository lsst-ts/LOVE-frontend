import React from 'react';
import scriptStyles from './Scripts.module.css';

export default ({ classname, description, remotes, pause_checkpoints, stop_checkpoints, log_level, ...props }) => {
    console.log(props);
  return (
    <div className={[scriptStyles.expandedSection].join(' ')}>
      <div className={scriptStyles.expandedSubSection}>
        <div className={scriptStyles.subSectionTitle}>DESCRIPTION</div>
        <div className={scriptStyles.subSectionRow}>
          <span className={scriptStyles.subSectionLabel}>Classname:</span>
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
          <span className={scriptStyles.subSectionValue}> {log_level} </span>
        </div>
        {/* <div className={scriptStyles.subSectionTitle}>
      SCHEMA
    </div> */}
      </div>
    </div>
  );
};
