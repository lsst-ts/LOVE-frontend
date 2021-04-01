import React, { useState, memo } from 'react';
import PropTypes from 'prop-types';
import InfoIcon from '../../icons/InfoIcon/InfoIcon';
import WarningIcon from '../../icons/WarningIcon/WarningIcon';
import ErrorIcon from '../../icons/ErrorIcon/ErrorIcon';
import Button from '../../GeneralPurpose/Button/Button';
import styles from './LogMessageDisplay.module.css';
import { formatTimestamp } from '../../../Utils';

function LogMessageDisplay({ logMessageData, clearCSCLogMessages }) {
  const [messageFilters, setMessageFilters] = useState({
    10: { value: true, name: 'Debug' },
    20: { value: true, name: 'Info' },
    30: { value: true, name: 'Warning' },
    40: { value: true, name: 'Error' },
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
                <input
                  onChange={(event) => updateFilter(key, event.target.checked)}
                  type="checkbox"
                  alt={`select ${key}`}
                  checked={messageFilters[key].value}
                />
                <span>{messageFilters[key].name}</span>
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
                      {msg.message?.value}
                    </div>
                    <div className={styles.messageTraceback}>{msg.traceback.value}</div>
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
  logMessageData: PropTypes.array,
  clearCSCLogMessages: PropTypes.func,
};

export default memo(LogMessageDisplay, arePropsEqual);
