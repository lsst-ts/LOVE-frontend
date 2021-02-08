import React, { Component } from 'react';
import styles from './TCSCommands.module.css';
import Select from 'components/GeneralPurpose/Select/Select';
import Input from 'components/GeneralPurpose/Input/Input';
import { TCSCommands } from 'Config.js';

export default class CommandPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCommand: null,
    };
  }

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
                <div>{key}</div>
                <div>
                  {JSON.stringify(param)}
                  <Input onChange={(e) => console.log(e)} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
