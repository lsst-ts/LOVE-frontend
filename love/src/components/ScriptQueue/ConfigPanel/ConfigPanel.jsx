import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import { Rnd } from 'react-rnd';

import 'brace/mode/yaml';
import 'brace/theme/solarized_dark';
import styles from './ConfigPanel.module.css';
import Button from '../../GeneralPurpose/Button/Button';

export default class ConfigPanel extends Component {
  static propTypes = {
    onScriptLaunch: PropTypes.func,
    onClose: PropTypes.func,
    configPanel: PropTypes.object,
  };

  static defaultProps = {
    onClose: () => 0,
    onScriptLaunch: () => 0,
    configPanel: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      value: `wait_time: 3600
fail_run: false
fail_cleanup: false`,
      width: '500px',
      height: '500px',
      loading: false,
    };
  }

  onChange = (newValue) => {
    this.setState({
      value: newValue,
    });
  };

  onResize = (event, direction, element) => {
    this.setState({
      width: element.style.width,
      height: element.style.height,
    });
  };

  onClose = () => {
    console.log('CLOSE');
    this.props.onClose();
  };

  onLaunch = () => {
    this.setState({
      loading: true,
    });
    const script = this.props.configPanel.script;
    const isStandard = script.type === 'standard';
    this.props.onScriptLaunch(isStandard, script.path, this.state.value, 'description', 2);
  };

  render() {
    const scriptName = this.props.configPanel.name ? this.props.configPanel.name : '';
    return this.props.configPanel.show ? (
      <Rnd
        default={{
          x: this.props.configPanel.x,
          y: this.props.configPanel.y,
          width: this.state.width,
          height: `calc(${this.state.height} + 100px)`,
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
            <span className={styles.closeButton} onClick={this.onClose}>
              X
            </span>
          </div>
          <div className={styles.body}>
            <AceEditor
              mode="yaml"
              theme="solarized_dark"
              name="UNIQUE_ID_OF_DIV"
              onChange={this.onChange}
              width={this.state.width}
              height={`calc(${this.state.height} - 4em)`}
              value={this.state.value}
              editorProps={{ $blockScrolling: true }}
              fontSize={18}
            />
          </div>
          <div className={[styles.bottomBar, styles.bar].join(' ')}>
            <Button title="Enqueue script" onClick={this.onLaunch}>
              Add to queue
            </Button>
          </div>
        </div>
      </Rnd>
    ) : null;
  }
}
