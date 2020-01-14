import React from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import styles from './ConfigForm.module.css';
import Button from '../../Button/Button';
import { indexes } from '../ComponentIndex';

import 'brace/mode/javascript';
import 'brace/mode/json';
import 'brace/theme/solarized_dark';

function ConfigForm({ componentName, componentConfig }) {
  const componentDict = indexes.map((index) => index.index[componentName]).find((elem) => elem !== undefined);
  const schema = componentDict ? componentDict.schema : {};
  const componentProps = schema ? schema.props : {};

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2> {`${componentName} configuration`} </h2>
        <div>
          {Object.keys(componentProps).map((key) => {
            let configElementInput = <input defaultValue={componentConfig[key]} />;
            if (['array', 'object', 'function'].includes(componentProps[key].type)) {
              let value = JSON.stringify(componentConfig[key], null, 2);
              let mode = 'json';
              let options = {};
              if (componentProps._functionProps && componentProps._functionProps.default.includes(key)) {
                value = eval(`(${value})`);
                mode = 'javascript';
                options = { useWorker: false };
              }
              configElementInput = (
                <AceEditor
                  mode={mode}
                  theme="solarized_dark"
                  name="UNIQUE_ID_OF_DIV"
                  onChange={() => {}}
                  width={'100%'}
                  height={`${Math.min(
                    Math.max(10, JSON.stringify(componentConfig[key], null, 2).split('\n').length),
                    20,
                  )}em`}
                  value={value}
                  setOptions={options}
                  onValidate={() => true}
                  editorProps={{ $blockScrolling: true }}
                  fontSize={18}
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
        <Button status="default" onClick={() => {}}>
          Cancel
        </Button>
        <Button status="primary" onClick={() => {}}>
          Insert
        </Button>
      </div>
    </div>
  );
}

ConfigForm.propTypes = {};

export default ConfigForm;
