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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import { Rnd } from 'react-rnd';
import yaml from 'js-yaml';
import Form from '@rjsf/core';
import rjsfValidator from '@rjsf/validator-ajv8';
import { SCRIPT_DOCUMENTATION_BASE_URL } from 'Config';
import Select from 'components/GeneralPurpose/Select/Select';
import styles from './ConfigPanel.module.css';
import Button from 'components/GeneralPurpose/Button/Button';
import Input from 'components/GeneralPurpose/Input/Input';
import AddIcon from 'components/icons/AddIcon/AddIcon';
import DeleteIcon from 'components/icons/DeleteIcon/DeleteIcon';
import ErrorIcon from 'components/icons/ErrorIcon/ErrorIcon';
import RotateIcon from 'components/icons/RotateIcon/RotateIcon';
import CloseIcon from 'components/icons/CloseIcon/CloseIcon';
import SaveNewIcon from 'components/icons/SaveNewIcon/SaveNewIcon';
import SaveIcon from 'components/icons/SaveIcon/SaveIcon';
import SpinnerIcon from 'components/icons/SpinnerIcon/SpinnerIcon';
import RowExpansionIcon from 'components/icons/RowExpansionIcon/RowExpansionIcon';
import Hoverable from 'components/GeneralPurpose/Hoverable/Hoverable';
import InfoPanel from 'components/GeneralPurpose/InfoPanel/InfoPanel';
import Toggle from 'components/GeneralPurpose/Toggle/Toggle';
import { SCRIPTQUEUE_SCRIPT_LOCATION } from 'Config';
import ManagerInterface from 'Utils';

import 'brace/mode/yaml';
import 'brace/theme/solarized_dark';

// Constants for the config panel
const CONFIG_PANEL_INITIAL_WIDTH = 590;
const NO_SCHEMA_MESSAGE = '# ( waiting for schema . . .)';
const DEFAULT_CONFIG_NAME = 'last_script';
const DEFAULT_CONFIG_VALUE = `# Insert your config here:
# e.g.:
# wait_time: 3600
# fail_run: false
# fail_cleanup: false`;

// Constants for the config validation state machine
const EMPTY = 'EMPTY';
const VALIDATING = 'VALIDATING';
const VALID = 'VALID';
const ERROR = 'ERROR';
const SERVER_ERROR = 'SERVER_ERROR';
const NEED_REVALIDATION = 'NEED_REVALIDATION';

// Mapping between the log levels and their numerical values
const logLevelMap = {
  Debug: 10,
  Info: 20,
  Warning: 30,
  Error: 40,
};

/**
 * Function to get the documentation link for a given script
 * @param {string} scriptPath
 * @returns {string}
 * @example
 * getDocumentationLink('scripts/auxtel/latiss_acquire_and_take_sequence.py')
 * // returns 'https://ts-standardscripts.lsst.io/lsst.ts.standardscripts.auxtel.latissAcquireAndTakeSequence.html'
 */
const getDocumentationLink = (scriptPath) => {
  const extensionIndex = scriptPath.lastIndexOf('.');
  const cleanPath = scriptPath.substring(0, extensionIndex);
  const dirIndex = cleanPath.lastIndexOf('/');
  const scriptDirectory = dirIndex > 0 ? cleanPath.substring(0, dirIndex + 1) : '';
  const scriptName = dirIndex > 0 ? cleanPath.substring(dirIndex + 1) : cleanPath;
  const cleanScriptName = scriptName
    .split('_')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
  const cleanDirectory = scriptDirectory.split('/').join('.');
  const camelCasePath = `${cleanDirectory}${cleanScriptName}`;
  const fullPath = `lsst.ts.standardscripts.${camelCasePath}`;
  return `${SCRIPT_DOCUMENTATION_BASE_URL}/${fullPath}.html`;
};

export default class ConfigPanel extends Component {
  static propTypes = {
    launchScript: PropTypes.func,
    closeConfigPanel: PropTypes.func,
    configPanel: PropTypes.object,
  };

  static defaultProps = {
    closeConfigPanel: () => 0,
    launchScript: () => 0,
    configPanel: {
      configSchema: NO_SCHEMA_MESSAGE,
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      value: DEFAULT_CONFIG_VALUE,
      autoFilledValue: '',
      width: 580,
      height: 500,
      loading: false,
      pauseCheckpoint: '',
      stopCheckpoint: '',
      orientation: 'stacked',
      sizeWeight: 0.5,
      resizingStart: undefined,
      configErrors: [],
      configErrorTitle: '',
      validationStatus: EMPTY,
      logLevel: 'Debug',
      manualConfig: true,
      showSchema: true,
      configurationList: [],
      configurationOptions: [],
      selectedConfiguration: null,
      inputConfigurationName: DEFAULT_CONFIG_NAME,
      formData: {},
      updatingScriptSchema: false,
      queueToTop: false,
    };
  }

  /************************/
  /* RJSF templates */
  ObjectFieldTemplate = (props) => {
    return (
      <div>
        {props.title}
        {props.description}
        {props.properties.map((element) => (
          <div className="property-wrapper">{element.content}</div>
        ))}
      </div>
    );
  };

  CustomSelect = (props) => {
    return (
      <Select
        className={styles.customSelect}
        options={props.options.enumOptions}
        option={props.value}
        onChange={({ value }) => props.onChange(value)}
      />
    );
  };

  CustomCheckbox = (props) => {
    return (
      <>
        <div>{props.label}</div>
        <div>{props.schema.description}</div>
        <input
          checked={props.value}
          type="checkbox"
          onChange={() =>
            this.setState((state) => ({
              formData: { ...state.formData, [props.label]: !props.value },
            }))
          }
        ></input>
      </>
    );
  };

  CustomInput = (props) => {
    return (
      <Input
        value={props.value ?? ''}
        type={props.schema.type}
        className={styles.formInput}
        onChange={(event) => {
          props.onChange(event.target.value);
        }}
      />
    );
  };

  ArrayFieldTemplate = (props) => {
    return (
      <>
        <div className={styles.formSchemaTitleModifier}>{props.title}</div>
        <div className={styles.formSchemaDescriptionModifier}>{props.schema.description}</div>
        <div className={styles.arrayContainer}>
          {props.items.map((element) => {
            return (
              <div key={element.key} className={styles.deleteItemButtonContainer}>
                <div className={styles.arrayElement}>{element.children}</div>
                <div className={styles.deleteItem}>
                  <button
                    type="button"
                    className={styles.deleteItemButton}
                    onClick={element.onDropIndexClick(element.index)}
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </div>
            );
          })}
          <div className={styles.availableScriptTypeSeparator} />

          <div className={styles.addNewArray}>
            {props.canAdd && (
              <Button className={styles.customButton} onClick={props.onAddClick}>
                + Add new entry
              </Button>
            )}
          </div>
        </div>
      </>
    );
  };

  AddButtonTemplate = (props) => {
    const { ...btnProps } = props;
    return (
      <Button
        className={[styles.iconBtn, styles.element].join(' ')}
        title="Add"
        onClick={btnProps.onClick}
        status="transparent"
      >
        <AddIcon className={styles.icon} />
      </Button>
    );
  };

  RemoveButtonTemplate = (props) => {
    const { ...btnProps } = props;
    return (
      <Button
        className={[styles.iconBtn, styles.element].join(' ')}
        title="Remove"
        onClick={btnProps.onClick}
        status="transparent"
      >
        <DeleteIcon className={styles.icon} />
      </Button>
    );
  };

  /************************/

  /**
   * Validate the current configuration
   * @param {string} newValue, the new value to validate
   * @param {boolean} noRevalidation, if true, do not revalidate if already validating
   */
  validateConfig = (newValue, noRevalidation, postValidate=()=>{}, failValidate=()=>{}) => {
    this.setState({ value: newValue });
    /** Do nothing if schema is not available
     * stay in EMPTY state
     */
    const schema = this.props.configPanel.configSchema;
    if (!schema) {
      this.setState({
        validationStatus: EMPTY,
        configErrorTitle: 'Waiting for schema',
        configErrors: [
          {
            name: ``,
            message: `Schema not yet loaded`,
          },
        ],
      });
      return;
    }

    /** Do nothing if still validating and comes from keypress-event (!noRevalidation) */
    if (this.state.validationStatus === VALIDATING && !noRevalidation) {
      this.setState({
        validationStatus: NEED_REVALIDATION,
      });
      return;
    }

    /** Request validation otherwise, and set state VALIDATING */
    this.setState({ validationStatus: VALIDATING });
    ManagerInterface.requestConfigValidation(newValue, this.props.configPanel.configSchema)
      .then((r) => {
        /** Go to VALIDATING again and perform new request in componentDidUpdate */
        if (this.state.validationStatus === NEED_REVALIDATION) {
          this.setState({ validationStatus: VALIDATING });
        }

        /** Server error */
        if (!r.ok) {
          this.setState({
            validationStatus: SERVER_ERROR,
            configErrorTitle: 'Validation Failed',
            configErrors: [
              {
                name: ``,
                message: `There is no schema to validate or another server error was encountered`,
              },
            ],
          });
          failValidate();
          return false;
        }
        postValidate();
        return r.json();
      })
      .then((r) => {
        /** Handle SERVER_ERROR */
        failValidate();
        this.setState({
          validationStatus: SERVER_ERROR,
          configErrorTitle: 'Validation Failed',
          configErrors: [
            {
              name: ``,
              message: `There is no schema to validate or another server error was encountered`,
            },
          ],
        });
        if (!r) return;

        /** Valid schema should show no message */
        if (r.output) {
          this.setState({
            validationStatus: VALID,
            autoFilledValue: yaml.dump(r.output),
            configErrors: [],
            configErrorTitle: '',
            formData: r.output,
          });
          return;
        }
        if (!r.error) return;

        /** Handle yaml syntax errors */
        if (r.error) {
          if (r.title === 'ERROR WHILE PARSING YAML STRING') {
            const message = `${r.error.problem}\n ${yaml.dump({
              line: r.error.problem_mark.line,
              column: r.error.problem_mark.column,
              pointer: r.error.problem_mark.pointer,
              index: r.error.problem_mark.index,
            })} `;
            this.setState({
              validationStatus: ERROR,
              configErrorTitle: r.title,
              configErrors: [
                {
                  name: r.error.problem_mark.name,
                  message,
                },
              ],
            });
          }

          /** Handle validation errors */
          if (r.title === 'INVALID CONFIG YAML') {
            this.setState({
              validationStatus: ERROR,
              configErrorTitle: r.title,
              configErrors: [
                {
                  name: `.${r.error.path} `,
                  message: r.error.message,
                },
              ],
            });
          }
        }
      });
  };

  onCheckpointChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  onResize = (event, direction, element) => {
    const width = parseInt(element.style.width.replace(/px/g, ''), 10);
    this.setState({
      width: width > CONFIG_PANEL_INITIAL_WIDTH ? width : CONFIG_PANEL_INITIAL_WIDTH,
      height: parseInt(element.style.height.replace(/px/g, ''), 10),
    });
  };

  closeConfigPanel = () => {
    this.setState({
      queueToTop: false,
    });
    this.props.closeConfigPanel();
  };

  rotatePanel = () => {
    this.setState({
      orientation: this.state.orientation === 'beside' ? 'stacked' : 'beside',
    });
  };

  toggleScriptSchema = () => {
    this.setState((prevState) => ({
      showSchema: !prevState.showSchema,
    }));
  };

  saveLastUsedConfiguration = () => {
    const configuration = this.state.configurationList.find((conf) => conf.config_name === DEFAULT_CONFIG_NAME);
    if (configuration) {
      const id = configuration.id;
      const configSchema = this.state.value;
      this.updateScriptSchema(id, configSchema);
    } else {
      const scriptPath = this.props.configPanel.script.path;
      const scriptType = this.props.configPanel.script.type;
      const configName = DEFAULT_CONFIG_NAME;
      const configSchema = this.state.value;
      this.saveNewScriptSchema(scriptPath, scriptType, configName, configSchema);
    }
  };

  onLaunch = () => {
    this.setState({
      loading: true,
    });
    const { script } = this.props.configPanel ?? {};
    const isStandard = script.type === 'standard';
    const logLevel = logLevelMap[this.state.logLevel] ?? 20;
    const config = this.state.value.replace(/^#.*\n?/gm, '');
    const location = this.state.queueToTop ? SCRIPTQUEUE_SCRIPT_LOCATION.FIRST : SCRIPTQUEUE_SCRIPT_LOCATION.LAST;

    this.saveLastUsedConfiguration();

    this.props.launchScript(
      isStandard,
      script.path,
      config,
      'description',
      location,
      this.state.pauseCheckpoint,
      this.state.stopCheckpoint,
      logLevel,
    );
  };

  startResizingWithMouse = (ev) => {
    this.setState({ resizingStart: { x: ev.clientX, y: ev.clientY, sizeWeight: this.state.sizeWeight } });
    document.onmousemove = this.onMouseMove;
    document.onmouseup = this.onMouseUp;
  };

  onMouseMove = (ev) => {
    if (this.state.resizingStart) {
      const currentX = ev.clientX;
      const currentY = ev.clientY;

      const { orientation, resizingStart, width, height } = this.state;
      const displacement = orientation === 'stacked' ? currentY - resizingStart.y : currentX - resizingStart.x;
      const total = orientation === 'stacked' ? height : width;
      const boundary = 150 / height; // 150px aprox of titles and buttons
      const newWeight = Math.min(Math.max(resizingStart.sizeWeight + displacement / total, boundary), 1 - boundary);
      this.setState({
        sizeWeight: newWeight,
      });
      ev.preventDefault();
    }
  };

  onMouseUp = () => {
    document.onmousemove = null;
    document.onmouseup = null;
  };

  onLogLevelChange = (value) => {
    this.setState({ logLevel: value });
  };

  selectConfiguration = (event) => {
    const { configurationList } = this.state;
    const configuration = configurationList.find((conf) => conf.id === event.value);

    let yamlData;
    try {
      yamlData = configuration && configuration.config_schema ? yaml.load(configuration.config_schema) ?? {} : {};
    } catch {
      yamlData = {};
    }

    this.setState({
      selectedConfiguration: event,
      value: configuration?.config_schema ?? '',
      inputConfigurationName: configuration?.config_name ?? '',
      formData: yamlData,
    });
  };

  /**
   * Render the configuration panel options to select stored configurations
   * and to create new ones
   * @returns {JSX.Element}
   */
  renderConfigurationsOptions = () => {
    const { configPanel } = this.props;
    const {
      validationStatus,
      value,
      configurationList,
      configurationOptions,
      selectedConfiguration,
      inputConfigurationName,
      updatingScriptSchema,
    } = this.state;

    let configurationSchemaChanged = false;
    let configurationNameChanged = false;

    const configuration = configurationList.find((conf) => conf.id === selectedConfiguration?.value);
    if (
      (configuration && value !== configuration.config_schema) ||
      (!configuration && value !== DEFAULT_CONFIG_VALUE)
    ) {
      configurationSchemaChanged = true;
    }

    if (
      inputConfigurationName !== DEFAULT_CONFIG_NAME &&
      (configurationList.length === 0 ||
        (configurationList.length > 0 &&
          configurationList.findIndex((conf) => conf.config_name === inputConfigurationName) === -1))
    ) {
      configurationNameChanged = true;
    }

    let controlHtml;
    if (configurationSchemaChanged) {
      controlHtml = (
        <Input
          value={inputConfigurationName}
          onChange={(e) => this.setState({ inputConfigurationName: e.target.value })}
          className={styles.schemaInput}
        />
      );
    }

    if (!configurationSchemaChanged && !configurationNameChanged) {
      controlHtml = (
        <Select
          options={configurationOptions}
          placeholder="Select an option"
          value={selectedConfiguration}
          onChange={this.selectConfiguration}
        />
      );
    }

    const buttonHtml = (
      <Button
        disabled={
          [ERROR, VALIDATING, NEED_REVALIDATION, EMPTY, SERVER_ERROR].includes(validationStatus) ||
          (!configurationSchemaChanged && !configurationNameChanged)
        }
        status="transparent"
        className={styles.saveConfigurationButton}
        onClick={(e) => {
          const scriptPath = configPanel?.script?.path ?? '';
          const scriptType = configPanel?.script?.type ?? '';
          const configName = inputConfigurationName;
          const configSchema = value;
          if (
            configurationNameChanged ||
            (configName === DEFAULT_CONFIG_NAME &&
              configurationList.length >= 0 &&
              configurationList.findIndex((conf) => conf.config_name === DEFAULT_CONFIG_NAME) === -1)
          ) {
            this.saveNewScriptSchema(scriptPath, scriptType, configName, configSchema);
          } else {
            this.updateScriptSchema(selectedConfiguration.value, configSchema);
          }
        }}
      >
        {configurationNameChanged ? <SaveNewIcon /> : <SaveIcon />}
      </Button>
    );

    const spinnerHtml = (
      <div className={styles.saveConfigurationButton}>
        <SpinnerIcon />
      </div>
    );

    return (
      <div className={styles.configurationControls}>
        <div>{controlHtml}</div>
        {updatingScriptSchema ? spinnerHtml : buttonHtml}
      </div>
    );
  };

  saveNewScriptSchema = (scriptPath, scriptType, configName, configSchema) => {
    const { configurationList, value } = this.state;
    this.setState({ updatingScriptSchema: true });
    const postValidate = () => {
      ManagerInterface.postScriptConfiguration(scriptPath, scriptType, configName, configSchema).then((res) => {
        const newConfigurationList = [res, ...configurationList];
        const options = newConfigurationList.map((conf) => ({ label: conf.config_name, value: conf.id }));
        const newSelectedConfiguration = { label: res.config_name, value: res.id };
        this.setState({
          updatingScriptSchema: false,
          configurationList: newConfigurationList,
          configurationOptions: options,
          selectedConfiguration: newSelectedConfiguration,
          value: res?.config_schema ?? '',
          inputConfigurationName: res?.config_name ?? '',
          formData: yaml.load(res?.config_schema),
        });
      });
    };
    const failValidate = () => {
      this.setState({
        updatingScriptSchema: false,
      });
    };
    this.validateConfig(value, configSchema, postValidate, failValidate);
  };

  updateScriptSchema = (id, configSchema) => {
    const { configurationList, value } = this.state;
    this.setState({ updatingScriptSchema: true });

    const postValidate = () => {
      ManagerInterface.updateScriptSchema(id, configSchema).then((res) => {
        const newSelectedConfiguration = { label: res.config_name, value: res.id };
        this.setState({
          updatingScriptSchema: false,
          selectedConfiguration: newSelectedConfiguration,
          configurationList: configurationList.map((conf) => (conf.id === id ? res : conf)),
        });
      });
    }
    const failValidate = () => {
      this.setState({
        updatingScriptSchema: false,
      });
    };
    this.validateConfig(value, configSchema, postValidate, failValidate);
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (
      this.props.configPanel?.script?.path &&
      prevProps.configPanel?.script?.path !== this.props.configPanel?.script?.path
    ) {
      ManagerInterface.getScriptConfiguration(
        this.props.configPanel.script.path,
        this.props.configPanel.script.type,
      ).then((data) => {
        const options = data.map((conf) => ({ label: conf.config_name, value: conf.id }));
        const configuration = data.find((conf) => conf.config_name === DEFAULT_CONFIG_NAME);

        let yamlData;
        try {
          yamlData = configuration && configuration.config_schema ? yaml.load(configuration.config_schema) ?? {} : {};
        } catch {
          yamlData = {};
        }
        const value = configuration?.config_schema ?? DEFAULT_CONFIG_VALUE;
        this.setState((state) => ({
          configurationList: data,
          configurationOptions: options,
          selectedConfiguration: configuration ? { label: configuration.config_name, value: configuration.id } : null,
          value: value,
          inputConfigurationName: configuration?.config_name ?? DEFAULT_CONFIG_NAME,
          formData: yamlData,
        }));
        this.validateConfig(value, true);
      });
    }

    if (this.state.value !== prevState.value) {
      this.validateConfig(this.state.value, true);
    }

    if (this.state.validationStatus !== prevState.validationStatus) {
      const { validationStatus } = this.state;

      if (validationStatus === VALIDATING && prevState.validationStatus === NEED_REVALIDATION) {
        this.validateConfig(this.state.value, true);
      }
    }
  };

  render() {
    const { orientation, showSchema, queueToTop } = this.state;
    const scriptName = this.props.configPanel?.name ?? '';
    const scriptPath = this.props.configPanel?.script?.path ?? '';
    const isStandard = this.props.configPanel?.script ? this.props.configPanel.script?.type === 'standard' : false;
    const yamlSchema = this.props.configPanel?.configSchema ?? '';

    const sidePanelSize = {
      stacked: {
        firstWidth: `${this.state.width}px`,
        firstHeight: `calc(${this.state.height * this.state.sizeWeight}px - 6em)`,
        secondWidth: `${this.state.width}px`,
        secondHeight: `calc(${this.state.height * (1 - this.state.sizeWeight)}px - 8em)`,
      },
      beside: {
        firstWidth: `calc(${this.state.width * this.state.sizeWeight}px - 1em)`,
        firstHeight: `calc(${this.state.height}px - 11em)`,
        secondWidth: `calc(${this.state.width * (1 - this.state.sizeWeight)}px - 1em)`,
        secondHeight: `calc(${this.state.height}px - 11em)`,
      },
    };

    const dividerClassName = {
      stacked: styles.horizontalDivider,
      beside: styles.verticalDivider,
    };

    const configPanelBarClassName = 'configPanelBar';

    // RJSF variables
    let rjsfSchema;
    try {
      rjsfSchema = yaml.load(yamlSchema) ?? {};
    } catch {
      rjsfSchema = {};
    }

    const rjsfWidgets = {
      SelectWidget: this.CustomSelect,
      TextWidget: this.CustomInput,
      CheckboxWidget: this.CustomCheckbox,
    };
    const rjsfFields = {
      TitleField: this.CustomTitleField,
    };

    const rjsfTemplates = {
      ArrayFieldTemplate: this.ArrayFieldTemplate,
      ButtonTemplates: {
        AddButton: this.AddButtonTemplate,
        RemoveButton: this.RemoveButtonTemplate,
      },
    };

    const isBeside = orientation === 'beside';

    return this.props.configPanel.show ? (
      <Rnd
        default={{
          x: this.props.configPanel.x,
          y: this.props.configPanel.y,
          width: `${this.state.width}px`,
          height: `calc(${this.state.height}px)`,
        }}
        minWidth={CONFIG_PANEL_INITIAL_WIDTH}
        style={{ zIndex: 1000, position: 'fixed' }}
        bounds={'window'}
        enableUserSelectHack={false}
        dragHandleClassName={configPanelBarClassName}
        onResize={this.onResize}
      >
        <div className={[styles.configPanelContainer, 'nonDraggable'].join(' ')}>
          <div className={[styles.topBar, configPanelBarClassName].join(' ')}>
            <span className={styles.title}>{`Configuring script: ${scriptName}`}</span>
            <div className={styles.topButtonsContainer}>
              <span className={styles.rotateButton} onClick={this.rotatePanel}>
                <RotateIcon orientation={orientation} />
              </span>

              <span className={styles.closeButton} onClick={this.closeConfigPanel}>
                <CloseIcon />
              </span>
            </div>
          </div>
          <div
            className={[styles.body, isBeside ? styles.sideBySide : '', !showSchema ? styles.hideSchema : ''].join(' ')}
          >
            <div className={[styles.sidePanel, styles.sidePanelSchema].join(' ')}>
              <h3 onClick={this.toggleScriptSchema}>
                SCHEMA <span className={styles.readOnly}>(Read only)</span>
                <div className={styles.showSchemaIcon}>
                  <RowExpansionIcon expanded={showSchema} />
                </div>
              </h3>
              {isStandard && showSchema && (
                <a
                  className={styles.documentationLink}
                  target="_blank"
                  rel="noreferrer"
                  href={getDocumentationLink(scriptPath)}
                >
                  Go to documentation
                </a>
              )}

              {showSchema && (
                <AceEditor
                  mode="yaml"
                  theme="solarized_dark"
                  name="UNIQUE_ID_OF_DIV"
                  width={sidePanelSize[orientation].firstWidth}
                  height={sidePanelSize[orientation].firstHeight}
                  value={
                    this.props.configPanel.configSchema === '' ? NO_SCHEMA_MESSAGE : this.props.configPanel.configSchema
                  }
                  editorProps={{ $blockScrolling: true }}
                  fontSize={18}
                  readOnly
                  showPrintMargin={false}
                />
              )}
            </div>

            <div
              className={[styles.divider, dividerClassName[orientation]].join(' ')}
              onMouseDown={this.startResizingWithMouse}
              // onMouseLeave={this.stopResizingWithMouse}
              // onMouseOut={this.stopResizingWithMouse}
            ></div>

            <div className={styles.sidePanel}>
              <div className={styles.schemaConfiguration}>
                <div className={styles.configTypeTabs}>
                  <div data-active={this.state.manualConfig} onClick={() => this.setState({ manualConfig: true })}>
                    MANUAL CONFIG
                  </div>
                  <div data-active={!this.state.manualConfig} onClick={() => this.setState({ manualConfig: false })}>
                    FORM CONFIG
                  </div>
                </div>
                <div className={styles.scriptConfigError}>
                  <Hoverable>
                    <div className={styles.errorIcon}>{this.state.configErrors.length > 0 && <ErrorIcon />}</div>
                    {this.state.configErrors.length > 0 && (
                      <InfoPanel className={styles.infoPanel}>
                        <div className={styles.infoPanelBody}>
                          <div className={styles.infoPanelFirstLine}>{this.state.configErrorTitle}</div>
                          <ul>
                            {this.state.configErrors.map((error, index) => {
                              if (!error.name) {
                                return <span key={`noname-${index}`}>{error.message}</span>;
                              }
                              return (
                                <li key={`${error.name}-${index}`}>
                                  <span className={styles.errorName}>{error.name}:</span>
                                  <span> {error.message}</span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </InfoPanel>
                    )}
                  </Hoverable>
                </div>
                {this.renderConfigurationsOptions()}
              </div>
              {this.state.manualConfig ? (
                <AceEditor
                  mode="yaml"
                  theme="solarized_dark"
                  name="UNIQUE_ID_OF_DIV"
                  onChange={this.validateConfig}
                  width={sidePanelSize[orientation].secondWidth}
                  height={sidePanelSize[orientation].secondHeight}
                  value={this.state.value}
                  editorProps={{ $blockScrolling: true }}
                  fontSize={18}
                  tabSize={2}
                  showPrintMargin={false}
                />
              ) : (
                <Form
                  validator={rjsfValidator}
                  schema={rjsfSchema}
                  // uiSchema={uiSchema}
                  widgets={rjsfWidgets}
                  fields={rjsfFields}
                  children={true}
                  className={styles.scriptForm}
                  formData={this.state.formData}
                  templates={rjsfTemplates}
                  onChange={(e) => {
                    this.setState({
                      formData: e.formData,
                      value: yaml.dump(e.formData, { flowLevel: 2 }),
                    });
                  }}
                />
              )}
            </div>
          </div>
          <div className={[styles.bottomBar, configPanelBarClassName].join(' ')}>
            <div className={styles.checkpointsRegexpContainer}>
              <span>Pause checkpoints</span>
              <span>.*</span>
              <Input className={styles.checkpointsInput} onChange={this.onCheckpointChange('pauseCheckpoint')} />

              <span>Stop checkpoints</span>
              <span> .*</span>
              <Input className={styles.checkpointsInput} onChange={this.onCheckpointChange('stopCheckpoint')} />

              <span className={styles.logLevelLabel}>Log level</span>
              <Select
                className={styles.logLevelSelect}
                options={['Debug', 'Info', 'Warning', 'Error']}
                option={this.state.logLevel}
                placeholder="Debug"
                onChange={(selection) => this.onLogLevelChange(selection.value)}
              />

              <span className={styles.logLevelLabel}>Queue position</span>
              <Toggle
                toggled={queueToTop}
                labels={['Bottom', 'Top']}
                onToggle={(value) => this.setState({ queueToTop: value })}
              />
            </div>
            <div className={styles.addBtnContainer}>
              <Button
                title="Enqueue script"
                size="large"
                onClick={this.onLaunch}
                disabled={[ERROR, VALIDATING, NEED_REVALIDATION, EMPTY].includes(this.state.validationStatus)}
                command
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      </Rnd>
    ) : null;
  }
}
