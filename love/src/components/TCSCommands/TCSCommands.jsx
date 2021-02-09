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
      paramValues: {},
    };
  }

  updateParamValue = (name, value) => {
    this.setState({
      paramValues: {
        ...this.state.paramValues,
        [name]: value,
      },
    });
  };

  renderParam = (name, param) => {
    const [paramType, defaultValue] = param;
    const { paramValues } = this.state;
    return (
      <div className={[styles.paramContainer, paramType == 'boolean' ? styles.checkboxParam : ''].join(' ')}>
        <div className={styles.paramLabel}>{name}</div>
        {paramType == 'string' && (
          <Input value={paramValues[name]} onChange={(e) => this.updateParamValue(name, e.target.value)} />
        )}
        {paramType == 'number' && (
          <Input value={paramValues[name]} onChange={(e) => this.updateParamValue(name, e.target.value)} />
        )}
        {paramType == 'angle' && (
          <Input value={paramValues[name]} onChange={(e) => this.updateParamValue(name, e.target.value)} />
        )}
        {paramType == 'boolean' && (
          <input
            type="checkbox"
            defaultChecked={defaultValue}
            onChange={(e) => this.updateParamValue(name, e.target.checked)}
          />
        )}
        {Array.isArray(paramType) && (
          <Select
            options={paramType}
            option={paramValues[name]}
            onChange={(selection) => this.updateParamValue(name, selection )}
          />
        )}
      </div>
    );
  };

  selectCommand = (commandName) => {
    const paramsDict = TCSCommands[commandName] ?? {};
    const paramNames = Object.keys(paramsDict);
    const paramValues = {};
    paramNames.forEach((paramName) => (paramValues[paramName] = paramsDict[paramName][1]));
    this.setState({ selectedCommand: commandName, paramValues });
  };

  render() {
    console.log(TCSCommands);
    console.log(this.state.selectedCommand);
    console.log(this.state.paramValues);
    const paramsDict = TCSCommands[this.state.selectedCommand] ?? {};

    return (
      <div className={styles.container}>
        <div className={styles.selectContainer}>
          <Select
            controlClassName={styles.select}
            options={Object.keys(TCSCommands)}
            option={this.state.selectedCommand}
            placeholder="Select a command"
            onChange={(selection) => this.selectCommand(selection?.value)}
          />
        </div>
        <div className={styles.commandParamsContainer}>
          {Object.keys(paramsDict).map((key) => {
            const param = paramsDict[key];
            return <div>{this.renderParam(key, param)}</div>;
          })}
        </div>
        {this.state.selectedCommand && (
          <div className={styles.sendButtonContainer}>
            <Button status="info" disabled={false} onClick={() => console.log(this.state.paramValues)}>
              SEND
            </Button>
          </div>
        )}
      </div>
    );
  }
}
