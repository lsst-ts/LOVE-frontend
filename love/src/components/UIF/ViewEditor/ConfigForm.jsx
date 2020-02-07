import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import styles from './ConfigForm.module.css';
import Button from '../../GeneralPurpose/Button/Button';
import { indexes } from '../ComponentIndex';

import 'brace/mode/javascript';
import 'brace/mode/json';
import 'brace/theme/solarized_dark';

function ConfigForm({ componentIndex, componentName, componentConfig, onCancel, onSaveConfig }) {
  const componentDict = indexes.map((index) => index.index[componentName]).find((elem) => elem !== undefined);
  const schema = componentDict ? componentDict.schema : {};
  const componentProps = schema ? schema.props : {};
  const [config, setConfig] = useState(componentConfig);

  const updateConfig = (key, value) => {
    const newConfig = { ...config };
    newConfig[key] = value;
    setConfig(newConfig);
  };

  const customSaveConfig = () => {
    const newConfig = { ...config };
    Object.keys(newConfig).forEach((key) => {
      if (componentProps[key].type === 'number') newConfig[key] = Number(newConfig[key]);
    });
    onSaveConfig(componentIndex, newConfig);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2> {`${componentName} configuration`} </h2>
        <div>
          {Object.keys(componentProps).map((key) => {
            let configElementInput = (
              <input
                defaultValue={componentConfig[key]}
                onChange={(event) => {
                  updateConfig(key, event.target.value);
                }}
              />
            );
            if (['array', 'object', 'function'].includes(componentProps[key].type)) {
              const stringValue = JSON.stringify(config[key], null, 2);
              let value = stringValue;
              let mode = 'json';
              let options = {};
              if (componentProps._functionProps && componentProps._functionProps.default.includes(key)) {
                /* eslint no-eval: 0 */
                value = eval(`(${value})`);
                mode = 'javascript';
                options = { useWorker: false };
              }
              configElementInput = (
                <AceEditor
                  mode={mode}
                  theme="solarized_dark"
                  name={`${key}-editor`}
                  onChange={(val) => {
                    try {
                      let newConfig = val;
                      if (mode !== 'javascript') newConfig = JSON.parse(val);
                      updateConfig(key, newConfig);
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                  width={'100%'}
                  height={`${Math.min(Math.max(10, stringValue.split('\n').length), 20)}em`}
                  value={value}
                  setOptions={options}
                  editorProps={{ $blockScrolling: true }}
                  fontSize={14}
                  showPrintMargin={false}
                />
              );
            }
            return (
              !componentProps[key].isPrivate && (
                <div key={key} className={styles.configElementWrapper}>
                  <div className={styles.configElement}>
                    <div className={styles.configElementTitle}>{key.toUpperCase()}</div>
                    <div className={styles.configElementDescription}>{componentProps[key].description}</div>
                    <div>{configElementInput}</div>
                  </div>
                </div>
              )
            );
          })}
        </div>
      </div>
      <div className={styles.footer}>
        <span />
        <Button status="default" onClick={onCancel}>
          Cancel
        </Button>
        <Button status="primary" onClick={() => customSaveConfig(componentIndex, config)}>
          Save
        </Button>
      </div>
    </div>
  );
}

ConfigForm.propTypes = {
  /** Index of the component */
  componentIndex: PropTypes.number,
  /** Name of the component */
  componentName: PropTypes.string,
  /** Configuration dictionary of the component */
  componentConfig: PropTypes.object,
  /** Callback to call when pressing the cancel button */
  onCancel: PropTypes.func,
  /** Callback to call when pressing the save button */
  onSaveConfig: PropTypes.func,
};

export default ConfigForm;
