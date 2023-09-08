/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React from 'react';
import scriptStyles from './Scripts.module.css';

const logLevelLabels = {
  '-1': '...',
  10: 'Debug',
  20: 'Info',
  30: 'Warning',
  40: 'Error',
  50: 'Critical',
};

export default ({
  index,
  classname,
  description,
  remotes,
  pause_checkpoints,
  stop_checkpoints,
  log_level,
  ...props
}) => {
  const logLevelLabel = logLevelLabels[log_level] ? logLevelLabels[log_level] : log_level;

  const fields = [
    {
      label: 'SAL Index:',
      defaultDisplayed: '""',
      defaultValue: '',
      value: index,
    },
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

  return (
    <div className={[scriptStyles.expandedSection].join(' ')}>
      <div>
        <div className={scriptStyles.subSectionTitle}>DESCRIPTION</div>

        {fields.map(({ label, defaultDisplayed, defaultValue, value }) => {
          return (
            <div key={label} className={[scriptStyles.subSectionRow, scriptStyles.expandedSubSection].join(' ')}>
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
