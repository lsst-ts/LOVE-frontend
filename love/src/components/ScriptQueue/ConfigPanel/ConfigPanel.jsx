import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import { Rnd } from 'react-rnd';
import Ajv from 'ajv';
import YAML from 'yaml';

import 'brace/mode/yaml';
import 'brace/theme/solarized_dark';
import styles from './ConfigPanel.module.css';
import Button from '../../GeneralPurpose/Button/Button';
import TextField from '../../TextField/TextField';
import ErrorIcon from '../../icons/ErrorIcon/ErrorIcon';
import RotateIcon from '../../icons/RotateIcon/RotateIcon';
import CloseIcon from '../../icons/CloseIcon/CloseIcon';
import Hoverable from '../../GeneralPurpose/Hoverable/Hoverable';
import InfoPanel from '../../GeneralPurpose/InfoPanel/InfoPanel';
import ManagerInterface from '../../../Utils';

const NO_SCHEMA_MESSAGE = '# ( waiting for schema . . .)';

const requestConfigValidation = (config, schema) =>
  fetch(`${ManagerInterface.getApiBaseUrl()}validate-config-schema/`, {
    method: 'POST',
    headers: ManagerInterface.getHeaders(),
    body: JSON.stringify({
      schema,
      config,
    }),
  });

const VALID = 'VALID';
const ERROR = 'ERROR';
const VALIDATING = 'VALIDATING';
const EMPTY = 'EMPTY';
const SERVER_ERROR = 'SERVER_ERROR';

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
      value: `# Insert your config here:
# e.g.:
# wait_time: 3600
# fail_run: false
# fail_cleanup: false
`,
      autoFilledValue: '',
      width: 500,
      height: 500,
      loading: false,
      pauseCheckpoint: '',
      stopCheckpoint: '',
      logLevel: 20,
      orientation: 'stacked',
      sizeWeight: 0.5,
      resizingStart: undefined,
      configErrors: [],
      configErrorTitle: '',
      validationStatus: EMPTY,
    };
  }

  validateConfig = (newValue) => {
    this.setState({ value: newValue });
    /** Do nothing if schema is not available */
    let schema = this.props.configPanel.configSchema;
    if (!schema) {
      this.setState({ validationStatus: EMPTY });
      return;
    }

    /** Request validation otherwise */
    requestConfigValidation(newValue, this.props.configPanel.configSchema)
      .then((r) => {
        if (!r.ok) {
          this.setState({ validationStatus: SERVER_ERROR });
          return;
        }
        return r.json();
      })
      .then((r) => {
        /** Handle response not ok */
        if (!r) return;

        /** Valid schema should show no message */
        if (r.output) {
          this.setState({
            validationStatus: VALID,
            autoFilledValue: YAML.stringify(r.output),
            configErrors: [],
            configErrorTitle: '',
          });
          return;
        }
        if (!r.error) return;

        /** Handle yaml syntax errors */
        if (r.error) {
          if (r.title === 'ERROR WHILE PARSING YAML STRING') {
            const message = `${r.error.problem}\n ${YAML.stringify({
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
            const message = `schema_path: ${r.error.schema_path.join('.')}\n config path: ${r.error.path}`;
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

  onLogLevelChange = (event) => {
    this.setState({
      logLevel: event.target.value,
    });
  };
  onResize = (event, direction, element) => {
    this.setState({
      width: parseInt(element.style.width.replace(/px/g, '')),
      height: parseInt(element.style.height.replace(/px/g, '')),
    });
  };

  closeConfigPanel = () => {
    this.props.closeConfigPanel();
  };

  rotatePanel = () => {
    this.setState({
      orientation: this.state.orientation === 'beside' ? 'stacked' : 'beside',
    });
  };

  onLaunch = () => {
    this.setState({
      loading: true,
    });
    const script = this.props.configPanel.script;
    const isStandard = script.type === 'standard';
    this.props.launchScript(
      isStandard,
      script.path,
      this.state.value,
      'description',
      2,
      this.state.pauseCheckpoint,
      this.state.stopCheckpoint,
      this.state.logLevel,
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
      const boundary = 150 / height; //150px aprox of titles and buttons
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

  render() {
    const { orientation } = this.state;

    const scriptName = this.props.configPanel.name ? this.props.configPanel.name : '';
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

    return this.props.configPanel.show ? (
      <Rnd
        default={{
          x: this.props.configPanel.x,
          y: this.props.configPanel.y,
          width: `${this.state.width}px`,
          height: `calc(${this.state.height}px)`,
        }}
        style={{ zIndex: 1000, position: 'fixed' }}
        bounds={'window'}
        enableUserSelectHack={false}
        dragHandleClassName={styles.bar}
        onResize={this.onResize}
      >
        <div className={[styles.configPanelContainer, 'nonDraggable'].join(' ')}>
          <div className={[styles.topBar, styles.bar].join(' ')}>
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
          <div className={[styles.body, orientation === 'beside' ? styles.sideBySide : ''].join(' ')}>
            <div className={styles.sidePanel}>
              <h3>
                SCHEMA <span className={styles.readOnly}>(Read only)</span>
              </h3>

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
            </div>

            <div
              className={[styles.divider, dividerClassName[orientation]].join(' ')}
              onMouseDown={this.startResizingWithMouse}
              // onMouseLeave={this.stopResizingWithMouse}
              // onMouseOut={this.stopResizingWithMouse}
            ></div>

            <div className={styles.sidePanel}>
              <div className={styles.sidePanelHeaderContainer}>
                {' '}
                {/* title={this.state.configErrorTrace */}
                <Hoverable>
                  <div style={{ display: 'flex' }}>
                    <h3>CONFIG</h3>
                    {this.state.configErrors.length > 0 && (
                      <h3 className={styles.schemaErrorIcon}>
                        <ErrorIcon svgProps={{ style: { height: '1em' } }} />
                      </h3>
                    )}
                  </div>
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
            </div>
          </div>
          <div className={[styles.bottomBar, styles.bar].join(' ')}>
            <div className={styles.checkpointsRegexpContainer}>
              <span>Pause checkpoints</span>
              <span>.*</span>
              <TextField className={styles.checkpointsInput} onChange={this.onCheckpointChange('pauseCheckpoint')} />

              <span>Stop checkpoints</span>
              <span> .*</span>
              <TextField className={styles.checkpointsInput} onChange={this.onCheckpointChange('stopCheckpoint')} />

              <span className={styles.logLevelLabel}>Log level</span>
              <select className={styles.logLevelSelect} defaultValue={this.state.logLevel}>
                {[
                  { value: 10, label: 'Debug' },
                  { value: 20, label: 'Info' },
                  { value: 30, label: 'Warning' },
                  { value: 40, label: 'Error' },
                ].map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.addBtnContainer}>
              <Button
                title="Enqueue script"
                size="large"
                onClick={this.onLaunch}
                disabled={[ERROR, VALIDATING].includes(this.state.validationStatus)}
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
