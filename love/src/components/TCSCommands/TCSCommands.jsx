import React, { Component } from 'react';
import styles from './TCSCommands.module.css';
import Select from 'components/GeneralPurpose/Select/Select';
import Input from 'components/GeneralPurpose/Input/Input';
import Button from 'components/GeneralPurpose/Button/Button';
import { TCSCommands } from 'Config.js';

export default class CommandPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCommand: null,
    };
  }

  renderParam = (name, param) => {
    const [paramType, defaultValue] = param;
    return (
      <div className={[styles.paramContainer, paramType == 'boolean' ? styles.checkboxParam : ''].join(' ')}>
        <div className={styles.paramLabel}>{name}</div>
        {paramType == 'string' && <Input placeholder={defaultValue} onChange={(e) => console.log(e)} />}
        {paramType == 'number' && <Input placeholder={defaultValue} onChange={(e) => console.log(e)} />}
        {paramType == 'angle' && <Input placeholder={defaultValue} onChange={(e) => console.log(e)} />}
        {paramType == 'boolean' && (
          <input
            type="checkbox"
            defaultChecked={defaultValue}
            onChange={() => console.log('filled', { value: !input?.filled })}
          />
        )}
        {Array.isArray(paramType) && (
          <Select
            options={paramType}
            option={defaultValue}
            placeholder={defaultValue.label}
            onChange={(selection) => console.log({ selectedCommand: selection?.value })}
          />
        )}
      </div>
    );
  };

  render() {
    console.log(TCSCommands);
    console.log(this.state.selectedCommand);
    const paramsDict = TCSCommands[this.state.selectedCommand] ?? {};

    return (
      <div className={styles.container}>
        <div className={styles.selectContainer}>
          <Select
            controlClassName={styles.select}
            options={Object.keys(TCSCommands)}
            option={this.state.selectedCommand}
            placeholder="Select a command"
            onChange={(selection) => this.setState({ selectedCommand: selection?.value })}
          />
        </div>
        <div className={styles.commandParamsContainer}>
          {Object.keys(paramsDict).map((key) => {
            const param = paramsDict[key];
            return (
              <div>
                {this.renderParam(key, param)}
              </div>
            );
          })}
        </div>
        {this.state.selectedCommand && <div className={styles.sendButtonContainer}>
          <Button status="info" disabled={false} onClick={() => console.log('click')}>
            SEND
          </Button>
        </div>}
      </div>
    );
  }
}
