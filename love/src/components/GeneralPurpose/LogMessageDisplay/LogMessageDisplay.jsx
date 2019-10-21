import React, { useState } from 'react';
import PropTypes from 'prop-types';
import InfoIcon from '../../icons/InfoIcon/InfoIcon';
import WarningIcon from '../../icons/WarningIcon/WarningIcon';
import ErrorIcon from '../../icons/ErrorIcon/ErrorIcon';
import Button from '../../GeneralPurpose/Button/Button';
import styles from './LogMessageDisplay.module.css';

export default function LogMessageDisplay({ logMessageData, clearCSCLogMessages }) {
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
          ? logMessageData.map((msg) => {
              const filter = messageFilters[msg.level.value];
              if (filter && !filter.value) return null;
              let icon = <span title="Debug">d</span>;
              if (msg.level.value === 20) icon = <InfoIcon title="Information" />;
              if (msg.level.value === 30) icon = <WarningIcon title="Warning" />;
              if (msg.level.value === 40) icon = <ErrorIcon title="Error" />;
              return (
                <div key={`${msg.private_rcvStamp.value}-${msg.level.value}`} className={styles.logMessage}>
                  <div className={styles.messageIcon}>{icon}</div>
                  <div className={styles.messageTextContainer}>
                    <div className={styles.timestamp} title="private_rcvStamp">
                      {new Date(msg.private_rcvStamp.value * 1000).toUTCString()}
                    </div>
                    <div className={styles.messageText}>{msg.message.value}</div>
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

LogMessageDisplay.propTypes = {
  logMessageData: PropTypes.array,
  clearCSCLogMessages: PropTypes.func,
};
