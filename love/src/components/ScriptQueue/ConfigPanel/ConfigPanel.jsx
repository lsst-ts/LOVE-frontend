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
    showConfigPanel: PropTypes.bool,
  };

  static defaultProps = {
    schema: '{}',
    onClose: () => 0,
    showConfigPanel: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: 'dsaas',
      width: '500px',
      height: '500px',
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
    console.log('CLOSE')
    this.props.onClose();
  }

  render() {
    return (
      this.props.showConfigPanel ? <Rnd
        default={{
          x: 0,
          y: 0,
          width: this.state.width,
          height: `calc(${this.state.height} + 100px)`,
        }}
        style={{ zIndex: 1000 }}
        bounds={'parent'}
        enableUserSelectHack={false}
        dragHandleClassName={styles.topBar}
        onResize={this.onResize}
      >
        <div className={styles.configPanelContainer}>
          <div className={styles.topBar}>
            <span className={styles.title}>Configuration panel</span>
            <span className={styles.closeButton} onClick={this.onClose}>X</span>
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
            />
          </div>
          <div className={styles.bottomBar}>
            <Button title="Launch Script">Launch Script</Button>
          </div>
        </div>
      </Rnd> : null
    );
  }
}
