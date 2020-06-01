import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import styles from './ConfigForm.module.css';
import Modal from '../../GeneralPurpose/Modal/Modal';
import Button from '../../GeneralPurpose/Button/Button';
import { indexes } from '../ComponentIndex';

import JSONPretty from 'react-json-pretty';
import 'brace/mode/javascript';
import 'brace/mode/json';
import 'brace/theme/solarized_dark';

const externalStepComponents = {
  TelemetrySelectionTable: require('../../../components/HealthStatusSummary/TelemetrySelectionTable/TelemetrySelectionTable')
    .default,
  HealthStatusConfig: require('../../../components/HealthStatusSummary/HealthStatusConfig/HealthStatusConfig').default,
};
function ConfigForm({ isOpen, componentIndex, componentName, componentConfig, onCancel, onSaveConfig }) {
  const componentDict = indexes.map((index) => index.index[componentName]).find((elem) => elem !== undefined);
  const schema = componentDict ? componentDict.schema : {};
  const componentProps = schema ? schema.props : {};
  const [config, setConfig] = useState(componentConfig);
  const [externalStep, setExternalStep] = useState({
    show: false,
    component: null,
    propKey: '',
  });

  useEffect(() => {
    setConfig(componentConfig);
  }, [componentConfig]);

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

  const onExtraStepSave = (propKey, newData) => {
    updateConfig(propKey, newData);
    setExternalStep({
      show: false,
      component: undefined,
      propKey: '',
    });
  };

  const onExtraStepCancel = () => {
    setExternalStep({
      show: false,
      component: undefined,
      propKey: '',
    });
  };

  const showExtraStep = (propKey, propConfig, propData) => {
    const Component = externalStepComponents[propConfig.externalStep];
    setExternalStep({
      show: true,
      component: (
        <Component
          onSave={(newData) => onExtraStepSave(propKey, newData)}
          onCancel={onExtraStepCancel}
          initialData={propData}
        />
      ),
      propKey,
    });
  };

  if (!isOpen) {
    return null;
  }

  if (externalStep.show) {
    return (
      <Modal isOpen={externalStep.show} onRequestClose={onExtraStepCancel} contentLabel="Component configuration modal">
        {externalStep.component}
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onCancel}
      contentLabel="Component configuration modal"
      footerChildren={
        <>
          <Button status="default" onClick={onCancel}>
            Cancel
          </Button>
          <Button status="primary" onClick={() => customSaveConfig(componentIndex, config)}>
            Save
          </Button>
        </>
      }
    >
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
              const stringValue = config?.[key] ? JSON.stringify(config[key], null, 2) : "''";
              let value = stringValue;
              let mode = 'json';
              let options = {};
              if (componentProps._functionProps && componentProps._functionProps.default.includes(key)) {
                /* eslint no-eval: 0 */
                value = eval(`(${value})`);
                mode = 'javascript';
                options = { useWorker: false };
              }
              if (componentProps[key].externalStep !== undefined) {
                configElementInput = (
                  <React.Fragment>
                    <Button
                      status="default"
                      onClick={() => showExtraStep(key, componentProps[key], value)}
                      className={styles.editButton}
                    >
                      {`Edit ${key}`}
                    </Button>
                    <JSONPretty data={value} />
                  </React.Fragment>
                );
              } else {
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
                        console.error(error);
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
            }
            if (['boolean'].includes(componentProps[key].type)) {
              configElementInput = (
                <input
                  type={'checkbox'}
                  defaultChecked={componentConfig[key]}
                  onChange={(event) => {
                    updateConfig(key, event.target.checked);
                  }}
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
    </Modal>
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
