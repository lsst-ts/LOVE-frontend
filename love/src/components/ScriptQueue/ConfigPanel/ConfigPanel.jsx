import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import { Rnd } from 'react-rnd';

import 'brace/mode/yaml';
import 'brace/theme/solarized_dark';
import styles from './ConfigPanel.module.css';
import Button from '../../GeneralPurpose/Button/Button';
import TextField from '../../TextField/TextField';

const NO_SCHEMA_MESSAGE = '# ( waiting for schema . . .)';

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
      configSchema: NO_SCHEMA_MESSAGE
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
      width: 500,
      height: 500,
      loading: false,
      pauseCheckpoint: '',
      stopCheckpoint: '',
      logLevel: 20,
      orientation: 'below',
    };
  }

  // componentDidUpdate(prevProps) {
  //   const configSchema = this.props.configPanel.configSchema;
  //   if (configSchema && configSchema !== '' && configSchema !== prevProps.configPanel.configSchema) {
  //     this.setState({
  //       value: this.props.configPanel.configSchema
  //         .split('\n')
  //         .map((x) => '# ' + x)
  //         .join('\n'),
  //     });
  //   }
  // }

  onChange = (newValue) => {
    this.setState({
      value: newValue,
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
      orientation: this.state.orientation === 'beside' ? 'below' : 'beside',
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

  render() {
    const { orientation } = this.state;

    const scriptName = this.props.configPanel.name ? this.props.configPanel.name : '';
    const sidePanelSize= {
      'below': {
        width: `${this.state.width}px`,
        height: `calc(${this.state.height / 2}px - 6em)`,
      },
      'beside':{
        width: `${this.state.width / 2}px`,
        height: `calc(${this.state.height}px - 9em)`,
      }
    }

    const dividerSizer = orientation === 'beside' ? 'height' : 'width';
    return this.props.configPanel.show ? (
      <Rnd
        default={{
          x: this.props.configPanel.x,
          y: this.props.configPanel.y,
          width: `${this.state.width}px`,
          height: `calc(${this.state.height}px)`,
        }}
        style={{ zIndex: 1000 }}
        bounds={'parent'}
        enableUserSelectHack={false}
        dragHandleClassName={styles.bar}
        onResize={this.onResize}
      >
        <div className={styles.configPanelContainer}>
          <div className={[styles.topBar, styles.bar].join(' ')}>
            <span className={styles.title}>{`Configuring script: ${scriptName}`}</span>
            <div className={styles.topButtonsContainer}>
              {orientation === 'below' ? (
                <span className={styles.rotateButton} onClick={this.rotatePanel}>
                  &#8758;
                </span>
              ) : (
                <span className={styles.rotateButton} onClick={this.rotatePanel}>
                  &#8229;{' '}
                </span>
              )}
              <span className={styles.closeButton} onClick={this.closeConfigPanel}>
                X
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
                width={sidePanelSize[orientation].width}
                height={sidePanelSize[orientation].height}
                value={
                  this.props.configPanel.configSchema === '' ? NO_SCHEMA_MESSAGE : [this.props.configPanel.configSchema,this.props.configPanel.configSchema].join('\n')
                }
                editorProps={{ $blockScrolling: true }}
                fontSize={18}
                readOnly
              />
            </div>

            {/* <div className={styles.verticalDivider} style={{ [dividerSizer]: sidePanelSize[dividerSizer] }}></div> */}

            <div className={styles.sidePanel}>
              <h3>CONFIG</h3>
              <AceEditor
                mode="yaml"
                theme="solarized_dark"
                name="UNIQUE_ID_OF_DIV"
                onChange={this.onChange}
                width={sidePanelSize[orientation].width}
                height={sidePanelSize[orientation].height}
                value={this.state.value}
                editorProps={{ $blockScrolling: true }}
                fontSize={18}
                tabSize={2}
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
              <Button title="Enqueue script" size="large" onClick={this.onLaunch}>
                Add
              </Button>
            </div>
          </div>
        </div>
      </Rnd>
    ) : null;
  }
}
