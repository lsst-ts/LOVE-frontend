import React, { Component } from 'react';
import styles from './TCSCommands.module.css';
import Select from 'components/GeneralPurpose/Select/Select';
import Input from 'components/GeneralPurpose/Input/Input';
import Button from 'components/GeneralPurpose/Button/Button';
import { TCSCommands } from 'Config.js';
import ManagerInterface, { parseCommanderData } from 'Utils';

const angleRegExp = new RegExp(/(\d\d(:| )\d\d(:| )\d\d)+(\.\d{1,10})?$/);
const floatRegExp = new RegExp(/^-?\d*(\.\d+)?$/);

export default class CommandPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCommand: null,
      paramValues: {},
      paramWarnings: {},
      docstrings: {},
    };
  }

  componentDidMount = () => {
    ManagerInterface.getATCSDocstrings().then((data) => {
      this.setState({
        docstrings: data,
      })
    });
  };

  updateParamValue = (name, value, paramType) => {
    this.setState({
      paramValues: {
        ...this.state.paramValues,
        [name]: value,
      },
    });
  };

  checkInvalidAngle = (name, value) => {
    console.log(value, angleRegExp.test(value), isNaN(parseFloat(value, 10)));
    const testValue = value ?? '';
    this.setState({
      paramWarnings: {
        ...this.state.paramWarnings,
        [name]: isNaN(parseFloat(testValue.match(floatRegExp))) && !angleRegExp.test(testValue),
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
          <Input value={paramValues[name]} onChange={(e) => this.updateParamValue(name, e.target.value, paramType)} />
        )}
        {paramType == 'number' && (
          <Input value={paramValues[name]} onChange={(e) => this.updateParamValue(name, e.target.value, paramType)} />
        )}
        {paramType == 'angle' && (
          <>
            <Input
              value={paramValues[name]}
              onChange={(e) => this.updateParamValue(name, e.target.value, paramType)}
              onBlur={() => this.checkInvalidAngle(name, paramValues[name])}
            />
            {this.state.paramWarnings[name] && (
              <div className={styles.paramWarning}>
                Angle should be a float (deg) or a sexagesimal string (DD:MM:SS.S or DD MM SS.S)
              </div>
            )}
          </>
        )}
        {paramType == 'boolean' && (
          <input
            type="checkbox"
            defaultChecked={defaultValue}
            onChange={(e) => this.updateParamValue(name, e.target.checked, paramType)}
          />
        )}
        {Array.isArray(paramType) && (
          <Select
            options={paramType}
            option={paramValues[name]}
            onChange={(selection) => this.updateParamValue(name, selection, paramType)}
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
          {this.state.selectedCommand && <div>{this.state.docstrings[this.state.selectedCommand]}</div>}
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
