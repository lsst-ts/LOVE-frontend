/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React, { useState, memo } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/GeneralPurpose/Button/Button';
import DebugIcon from 'components/icons/CSCExpanded/DebugIcon/DebugIcon';
import InfoIcon from 'components/icons/CSCExpanded/InfoIcon/InfoIcon';
import WarningIcon from 'components/icons/CSCExpanded/WarningIcon/WarningIcon';
import ErrorIcon from 'components/icons/CSCExpanded/ErrorIcon/ErrorIcon';
import styles from './LogMessageDisplay.module.css';
import { formatTimestamp } from 'Utils';

function LogMessageDisplay({ logMessageData, clearCSCLogMessages }) {
  const [messageFilters, setMessageFilters] = useState({
    10: { value: true, name: 'Debug', icon: <DebugIcon /> },
    20: { value: true, name: 'Info', icon: <InfoIcon /> },
    30: { value: true, name: 'Warning', icon: <WarningIcon /> },
    40: { value: true, name: 'Error', icon: <ErrorIcon /> },
  });

  const updateFilter = (key, value) => {
    const filters = messageFilters;
    filters[key].value = value;
    setMessageFilters({ ...filters });
  };
  return (
    <div className={[styles.logContainer, styles.messageLogContainer].join(' ')}>
      <div className={styles.logContainerTopBar}>
        <div>MESSAGE LOG</div>
        <div>
          <Button size="extra-small" onClick={() => clearCSCLogMessages()}>
            CLEAR
          </Button>
        </div>
      </div>
      <div className={styles.filtersContainer}>
        {Object.keys(messageFilters).map((key) => {
          return (
            <div key={key}>
              <label>
                <span style={{ width: '1.5em' }}>{messageFilters[key].icon}</span>
                <span>{messageFilters[key].name}</span>
                <input
                  onChange={(event) => updateFilter(key, event.target.checked)}
                  type="checkbox"
                  alt={`select ${key}`}
                  checked={messageFilters[key].value}
                />
              </label>
            </div>
          );
        })}
      </div>
      <div className={[styles.log, styles.messageLogContent].join(' ')}>
        {logMessageData.length > 0
          ? logMessageData.map((msg, index) => {
              const filter = messageFilters[msg.level.value];
              if (filter && !filter.value) return null;
              let icon = <span title="Debug">d</span>;
              if (msg.level.value === 20) icon = <InfoIcon title="Information" />;
              if (msg.level.value === 30) icon = <WarningIcon title="Warning" />;
              if (msg.level.value === 40) icon = <ErrorIcon title="Error" />;
              return (
                <div key={`${msg.private_rcvStamp.value}-${msg.level.value}-${index}`} className={styles.logMessage}>
                  <div className={styles.messageIcon}>{icon}</div>
                  <div className={styles.messageTextContainer}>
                    <div className={styles.timestamp} title="private_rcvStamp">
                      {formatTimestamp(msg.private_rcvStamp.value * 1000)}
                    </div>
                    <div className={styles.messageText}>
                      {msg.ScriptID && <div className={styles.scriptID}>Script {msg.ScriptID?.value}</div>}
                      <pre className={styles.preText}>{msg.message?.value}</pre>
                    </div>
                    <pre className={styles.preText}>{msg.traceback.value}</pre>
                  </div>
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
}

function arePropsEqual(prevProps, nextProps) {
  if (!prevProps.logMessageData || !nextProps.logMessageData) return false;
  return prevProps.logMessageData.length === nextProps.logMessageData.length;
}

LogMessageDisplay.propTypes = {
  /** Array of logMessages */
  logMessageData: PropTypes.array,
  /** Function to clear the log messages */
  clearCSCLogMessages: PropTypes.func,
};

export default memo(LogMessageDisplay, arePropsEqual);
