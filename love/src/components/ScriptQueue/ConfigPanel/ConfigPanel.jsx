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
    schema: PropTypes.string,
    onClose: PropTypes.func,
    configPanel: PropTypes.object,
  };

  static defaultProps = {
    schema: '{}',
    onClose: () => 0,
    configPanel: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      value: `$schema: http://json-schema.org/draft-07/schema#
      $id: https://github.com/lsst-ts/ts_salobj/tree/schema/Test.yaml
      # title must end with one or more spaces followed by the schema version, which must begin with "v"
      title: Test v1
      description: Configuration for the TestCsc
      type: object
      properties:
        string0:
          type: string
          default: default value for string0
        bool0:
          type: boolean
          default: true
        int0:
          type: integer
          default: 5
        float0:
          type: number
          default: 3.14
        intarr0:
          type: array
          default: [-1, 1]
          items:
            type: integer
        multi_type:
          anyOf:
            - type: integer
              minimum: 1
            - type: string
            - type: "null"
          default: null
      
      required: [string0, bool0, int0, float0, intarr0, multi_type]
      additionalProperties: false`,
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
            <Button title="Launch Script" onClick={this.onLaunch}>
              Launch Script
            </Button>
          </div>
        </div>
      </Rnd>
    ) : null;
  }
}
