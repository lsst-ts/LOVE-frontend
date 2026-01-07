import React, { memo, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import CopyIcon from 'components/icons/CopyIcon/CopyIcon';
import { TOPIC_TIMESTAMP_ATTRIBUTE } from 'Config';
import ManagerInterface, { copyToClipboard, getEFDInstanceForHost } from 'Utils';
import styles from './ScriptConfig.module.css';

function ScriptConfig({ index, timestampProcessStart, timestampConfigureEnd }) {
  const [coppiedToClipboard, setCoppiedToClipboard] = useState(false);
  const [appliedConfiguration, setAppliedConfiguration] = useState('');

  const handleCopyToClipboard = useCallback(() => {
    copyToClipboard(appliedConfiguration, () => {
      setCoppiedToClipboard(true);
      setTimeout(() => {
        setCoppiedToClipboard(false);
      }, 2000);
    });
  }, [appliedConfiguration]);

  const getAppliedConfiguration = useCallback((scriptIndex, start, end) => {
    const efdInstance = getEFDInstanceForHost();
    if (!efdInstance) {
      return;
    }

    const cscs = {
      Script: {
        [scriptIndex]: {
          command_configure: [TOPIC_TIMESTAMP_ATTRIBUTE, 'config'],
        },
      },
    };

    // Convert to ISO format and remove Z at the end
    const startDateIso = new Date(start * 1000).toISOString().slice(0, -1);
    const endDateIso = new Date(end * 1000).toISOString().slice(0, -1);
    ManagerInterface.getEFDLogs(startDateIso, endDateIso, cscs, efdInstance, 'tai').then((res) => {
      if (res) {
        setAppliedConfiguration(res[`Script-${scriptIndex}-command_configure`][0]?.config);
      }
    });
  }, []);

  useEffect(() => {
    if (index && timestampProcessStart && timestampConfigureEnd) {
      getAppliedConfiguration(index, timestampProcessStart, timestampConfigureEnd);
    }
    if (!index) {
      setAppliedConfiguration('');
    }
  }, [index, timestampProcessStart, timestampConfigureEnd]);

  if (!appliedConfiguration) {
    return (
      <div className={styles.container}>
        <div className={styles.title}>
          <span>APPLIED CONFIGURATION</span>
          <div>No applied configuration found</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <span>APPLIED CONFIGURATION</span>
        <div className={styles.copyToClipboardIcon} onClick={handleCopyToClipboard}>
          <CopyIcon title="Copy to clipboard" />
        </div>
        {coppiedToClipboard && <div className={styles.fadeElement}>Coppied to clipboard</div>}
      </div>
      <AceEditor
        mode="yaml"
        theme="solarized_dark"
        name="UNIQUE_ID_OF_DIV"
        width={'26em'}
        height={'150px'}
        value={appliedConfiguration}
        fontSize={18}
        readOnly
        showPrintMargin={false}
      />
    </div>
  );
}

ScriptConfig.propTypes = {
  /** Index of the script */
  index: PropTypes.number.isRequired,
  /** Timestamp when the process started */
  timestampProcessStart: PropTypes.number.isRequired,
  /** Timestamp when the configuration was applied */
  timestampConfigureEnd: PropTypes.number.isRequired,
};

export default memo(ScriptConfig);
