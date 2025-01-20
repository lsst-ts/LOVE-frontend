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

import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/GeneralPurpose/Button/Button';
import DebugIcon from 'components/icons/CSCExpanded/DebugIcon/DebugIcon';
import InfoIcon from 'components/icons/CSCExpanded/InfoIcon/InfoIcon';
import WarningIcon from 'components/icons/CSCExpanded/WarningIcon/WarningIcon';
import ErrorIcon from 'components/icons/CSCExpanded/ErrorIcon/ErrorIcon';
import CopyIcon from 'components/icons/CopyIcon/CopyIcon';
import { TOPIC_TIMESTAMP_ATTRIBUTE } from 'Config';
import { formatTimestamp, copyToClipboard } from 'Utils';
import styles from './LogMessageDisplay.module.css';

function CopyToClipboard({ text }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let timeout;
    if (copied) {
      timeout = setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [copied]);

  const handleCopyToClipboard = () => {
    copyToClipboard(text);
    setCopied(true);
  };

  return (
    <div className={styles.copyToClipboardBtn} onClick={handleCopyToClipboard}>
      {copied && <span>Copied to clipboard</span>}
      <CopyIcon title="Copy to clipboard" />
    </div>
  );
}

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

              const copyToClipboardText =
                msg.message?.value + (msg.traceback?.value ? '\n\n' + msg.traceback?.value : '');
              return (
                <div
                  key={`${msg[TOPIC_TIMESTAMP_ATTRIBUTE].value}-${msg.level.value}-${index}`}
                  className={styles.logMessage}
                >
                  <div className={styles.messageIcon}>{icon}</div>
                  <div className={styles.messageTextContainer}>
                    <div className={styles.timestamp} title={TOPIC_TIMESTAMP_ATTRIBUTE}>
                      {formatTimestamp(msg[TOPIC_TIMESTAMP_ATTRIBUTE].value * 1000)}
                    </div>
                    <div className={styles.messageText}>
                      {msg.ScriptID && <div className={styles.scriptID}>Script {msg.ScriptID?.value}</div>}
                      <CopyToClipboard text={copyToClipboardText} />
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
