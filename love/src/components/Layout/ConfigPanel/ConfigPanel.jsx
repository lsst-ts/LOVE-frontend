import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import 'brace/mode/json';
import 'brace/theme/solarized_dark';
import Select from 'components/GeneralPurpose/Select/Select';
import styles from './ConfigPanel.module.css';
import ManagerInterface, { formatTimestamp } from 'Utils';
// import RequeueIcon from 'components/icons/ScriptQueue/RequeueIcon/RequeueIcon';
import ScriptIcon from '../../icons/ScriptIcon/ScriptIcon';

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
    const id = selection.value;
    ManagerInterface.setSelectedConfigFile(id).then((conf) => {
      console.log(conf);
      setConfig(conf);
    });
  };

  const getConfigSelectOption = (conf, index) => {
    return {
      value: conf.id,
      label: (
        <div key={index} className={styles.dropdownOption}>
          <div className={styles.dropdownOptionLeftSection}>
            <div className={styles.iconWrapper}>
              <ScriptIcon title="Config. file" className={styles.paddedIcon}></ScriptIcon>
            </div>
          </div>
          <div className={styles.dropdownOptionRightSection}>
            <div className={styles.dropdownOptionLabel}>{conf.filename}</div>
            <div className={styles.dropdownOptionDate}>{formatTimestamp(conf.update_timestamp)}</div>
          </div>
        </div>
      ),
    };
  };
  const configStr = JSON.stringify(config.content, null, 2);
  const options = configList ? configList.map((conf, index) => getConfigSelectOption(conf, index)) : [];
  const defaultOption = getConfigSelectOption(config, 0);
  return (
    <div className={styles.container}>
      <div className={styles.title}>LOVE Configuration File</div>
      <div className={styles.subTitle}>Current configuration file</div>
      <div className={styles.selectorWrapper}>
        <Select
          className={styles.logLevelSelect}
          arrowClassName={styles.changeConfigButton}
          controlClassName={styles.controlClassName}
          options={options}
          value={defaultOption}
          onChange={(selection) => onConfigSelection(selection)}
        />
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
