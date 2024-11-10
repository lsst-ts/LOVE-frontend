import React, { memo, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import CopyIcon from 'components/icons/CopyIcon/CopyIcon';
import ManagerInterface, { copyToClipboard } from 'Utils';
import styles from './ScriptConfig.module.css';

function ScriptConfig({ index, timestampProcessStart, timestampConfigureEnd, defaultEfdInstance = 'summit_efd' }) {
  const [coppiedToClipboard, setCoppiedToClipboard] = useState(false);
  const [appliedConfiguration, setAppliedConfiguration] = useState('');

  const handleCopyToClipboard = useCallback(() => {
    copyToClipboard(appliedConfiguration, () => {
      setCoppiedToClipboard(true);
      setTimeout(() => {
        setCoppiedToClipboard(false);
      }, 2000);
    });
  }, []);

  const getAppliedConfiguration = useCallback((scriptIndex, start, end) => {
    const cscs = {
      Script: {
        [scriptIndex]: {
          command_configure: ['private_rcvStamp', 'config'],
        },
      },
    };

    // Convert to ISO format and remove Z at the end
    const startDateIso = new Date(start * 1000).toISOString().slice(0, -1);
    const endDateIso = new Date(end * 1000).toISOString().slice(0, -1);

    // ManagerInterface.getEFDLogs(startDateIso, endDateIso, cscs, defaultEfdInstance, 'tai').then((res) => {
    //   if (res) {
    //     setAppliedConfiguration(res[`Script-${scriptIndex}-command_configure`][0]?.config);
    //   }
    // });
  }, []);

  useEffect(() => {
    if (index && timestampProcessStart && timestampConfigureEnd) {
      getAppliedConfiguration(index, timestampProcessStart, timestampConfigureEnd);
    }
    if (!index) {
      setAppliedConfiguration('');
    }
  }, [index, timestampProcessStart, timestampConfigureEnd]);

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
  /** Default EFD instance */
  defaultEfdInstance: PropTypes.string,
};

export default memo(ScriptConfig);
