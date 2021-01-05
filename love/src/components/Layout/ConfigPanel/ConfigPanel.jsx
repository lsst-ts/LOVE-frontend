import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import 'brace/mode/json';
import 'brace/theme/solarized_dark';
import Select from 'components/GeneralPurpose/Select/Select';
import styles from './ConfigPanel.module.css';
import ManagerInterface, { formatTimestamp } from 'Utils';

ConfigPanel.propTypes = {
  /** Current LOVE configuration */
  config: PropTypes.object,
  /** Set Current LOVE configuration */
  setConfig: PropTypes.func,
};

/** Contents of the Config File view Panel, displayed in a modal */
function ConfigPanel({ config, setConfig }) {
  const [configList, setConfigList] = useState([]);

  useEffect(() => {
    ManagerInterface.getConfigFilesList().then((list) => {
      setConfigList(list);
    });
  }, []);

  const onConfigSelection = (selection) => {
    const id = selection?.value?.id;
    ManagerInterface.getConfigFileContent(id).then((conf) => {
      setConfig({
        content: conf.content,
        filename: conf.filename,
        lastUpdated: formatTimestamp(conf.update_timestamp),
      });
    });
  };

  const configStr = JSON.stringify(config.content, null, 2);
  return (
    <div className={styles.container}>
      <div className={styles.title}>LOVE Configuration File</div>
      <div className={styles.subTitle}>Change configuration file</div>
      <div className={styles.selectorWrapper}>
        <Select
          className={styles.logLevelSelect}
          options={
            configList
              ? configList.map((conf, index) => {
                  return {
                    key: index,
                    value: { ...conf, key: index },
                    label: `${conf.filename} - ${formatTimestamp(conf.update_timestamp)}`,
                  };
                })
              : []
          }
          onChange={(selection) => onConfigSelection(selection)}
        />
      </div>
      <div className={styles.subTitle}>Current configuration</div>
      <div className={styles.currentConfig}>
        <div className={styles.label}>File name:</div>
        <div>{config.filename}</div>
        <div className={styles.label}>Last updated:</div>
        <div>{config.lastUpdated}</div>
      </div>
      <AceEditor
        mode="json"
        className={styles.rndEditor}
        theme="solarized_dark"
        name="UNIQUE_ID_OF_DIV"
        width={'100%'}
        value={configStr}
        readOnly
        editorProps={{ $blockScrolling: true }}
        fontSize={14}
      />
    </div>
  );
}
export default memo(ConfigPanel);
