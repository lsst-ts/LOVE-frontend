import React from 'react';
import scriptStyles from './Scripts.module.css';

const logLevelLabels = {
  '-1': '...',
  10: 'Info',
  20: 'Warning',
  30: 'Debug',
  40: 'Error',
};

export default ({ classname, description, remotes, pause_checkpoints, stop_checkpoints, log_level, ...props }) => {
  const logLevelLabel = logLevelLabels[log_level] ? logLevelLabels[log_level] : log_level;

  const fields = [
    {
      label: 'Classname:',
      defaultDisplayed: '""',
      defaultValue: '',
      value: classname,
    },
    {
      label: 'Description:',
      defaultDisplayed: '""',
      defaultValue: '',
      value: description,
    },
    {
      label: 'Remotes:',
      defaultDisplayed: '""',
      defaultValue: '',
      value: remotes,
    },
    {
      label: 'Pause checkpoints:',
      defaultDisplayed: '""',
      defaultValue: '',
      value: pause_checkpoints,
    },
    {
      label: 'Stop checkpoints:',
      defaultDisplayed: '""',
      defaultValue: '',
      value: stop_checkpoints,
    },
    {
      label: 'Log level:',
      defaultDisplayed: '...',
      defaultValue: -1,
      value: logLevelLabel,
    },
  ];

  const { label, defaultDisplayed, defaultValue, value } = fields[0];
  return (
    <div className={[scriptStyles.expandedSection].join(' ')}>
      <div className={scriptStyles.expandedSubSection}>
        <div className={scriptStyles.subSectionTitle}>DESCRIPTION</div>

        {fields.map(({ label, defaultDisplayed, defaultValue, value }) => {
          return (
            <div key={label} className={scriptStyles.subSectionRow}>
              <span className={scriptStyles.subSectionLabel}>{label}</span>
              {value === defaultValue ? (
                <span className={[scriptStyles.subSectionValue, scriptStyles.subSectionValueUnknown]}>
                  {' '}
                  {defaultDisplayed}
                </span>
              ) : (
                <span className={scriptStyles.subSectionValue}> {value}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
