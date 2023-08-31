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
import AceEditor from 'react-ace';
import 'brace/mode/json';
import 'brace/theme/solarized_dark';
import Select from 'components/GeneralPurpose/Select/Select';
import styles from './ConfigPanel.module.css';
import ManagerInterface, { formatTimestamp } from 'Utils';
// import RequeueIcon from 'components/icons/ScriptQueue/RequeueIcon/RequeueIcon';
import ScriptIcon from '../../icons/ScriptIcon/ScriptIcon';
import Button from 'components/GeneralPurpose/Button/Button';

ConfigPanel.propTypes = {
  /** Current LOVE configuration */
  config: PropTypes.object,
  /** Set Current LOVE configuration */
  setConfig: PropTypes.func,
};

/** Contents of the Config File view Panel, displayed in a modal */
function ConfigPanel({ config, setConfig }) {
  const [ownConf, setOwnConf] = useState(config);
  const [configList, setConfigList] = useState([]);

  useEffect(() => {
    ManagerInterface.getConfigFilesList().then((list) => {
      setConfigList(list);
    });
  }, []);

  const onConfigSelection = (selection) => {
    const id = selection.value;
    ManagerInterface.getConfigFileContent(id).then((conf) => {
      setOwnConf(conf);
    });
  };

  const saveConfigSelection = (persist = false) => {
    const id = ownConf.id;
    if (persist) {
      ManagerInterface.setSelectedConfigFile(id).then((conf) => {
        setConfig(conf);
      });
    } else {
      setConfig(ownConf);
    }
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

  const configStr = JSON.stringify(ownConf.content, null, 2);
  const options = configList ? configList.map((conf, index) => getConfigSelectOption(conf, index)) : [];
  const defaultOption = getConfigSelectOption(ownConf, 0);
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
          onChange={onConfigSelection}
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
      <div className={styles.confirmSection}>
        <Button onClick={() => saveConfigSelection(true)}>Select & Save</Button>
        <Button onClick={() => saveConfigSelection()}>Select</Button>
      </div>
    </div>
  );
}
export default memo(ConfigPanel);
