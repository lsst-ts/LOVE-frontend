/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile.

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
import { Remarkable } from 'remarkable';
import AceEditor from 'react-ace';
import 'brace/mode/json';
import 'brace/theme/solarized_dark';
import Select from 'components/GeneralPurpose/Select/Select';
import Input from 'components/GeneralPurpose/Input/Input';
import Button from 'components/GeneralPurpose/Button/Button';
import Modal from 'components/GeneralPurpose/Modal/Modal';
import ScriptQueue from 'components/ScriptQueue/ScriptQueue';
import StatusText from 'components/GeneralPurpose/StatusText/StatusText.jsx';
import HelpIcon from 'components/icons/HelpIcon/HelpIcon';
import WarningIcon from 'components/icons/WarningIcon/WarningIcon';
import { ATCSCommands, MTCSCommands } from 'Config.js';
import ManagerInterface from 'Utils';
import styles from './TCSCommands.module.css';
import JSONPretty from 'react-json-pretty';

var md = new Remarkable();

const angleRegExp = new RegExp(/(\d\d(:| )\d\d(:| )\d\d)+(\.\d{1,10})?$/);
const floatRegExp = new RegExp(/^-?\d*(\.\d+)?$/);
const timeRegExp = new RegExp(/^(\d\d\d\d-\d\d-\d\d)(T| )(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]+(\.\d{1,10})?$/);

export default class CommandPanel extends Component {
  static propTypes = {
    title: PropTypes.string,
    nameTCS: PropTypes.string,
    hasRawMode: PropTypes.bool,
    scriptQueueIndex: PropTypes.number,
    subscribeToStreams: PropTypes.func,
    unsubscribeToStreams: PropTypes.func,
    state: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedCommand: null,
      paramValues: {},
      paramWarnings: {},
      docstrings: {},
      isModalOpen: false,
    };
    this.TCSCommands = {};
    if (props.nameTCS === 'aux') this.TCSCommands = ATCSCommands;
    if (props.nameTCS === 'main') this.TCSCommands = MTCSCommands;
  }

  isAuxTCS = () => {
    if (this.props.nameTCS === 'aux') {
      return true;
    }
    return false;
  };

  isMainTCS = () => {
    if (this.props.nameTCS === 'main') {
      return true;
    }
    return false;
  };

  componentDidMount = () => {
    this.props.subscribeToStreams();
    if (this.isAuxTCS()) {
      ManagerInterface.getATCSDocstrings().then((data) => {
        this.setState({
          docstrings: data,
        });
      });
    }
    if (this.isMainTCS()) {
      ManagerInterface.getMTCSDocstrings().then((data) => {
        this.setState({
          docstrings: data,
        });
      });
    }
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStreams();
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
    const testValue = value ?? '';
    this.setState({
      paramWarnings: {
        ...this.state.paramWarnings,
        [name]: Number.isNaN(parseFloat(testValue.match(floatRegExp))) && !angleRegExp.test(testValue),
      },
    });
  };

  checkInvalidTime = (name, value) => {
    const testValue = value ?? '';
    this.setState({
      paramWarnings: {
        ...this.state.paramWarnings,
        [name]: !timeRegExp.test(testValue),
      },
    });
  };

  renderParam = (name, param) => {
    const [paramType, defaultValue] = param;
    const { paramValues } = this.state;
    return (
      <div className={[styles.paramContainer, paramType === 'boolean' ? styles.checkboxParam : ''].join(' ')}>
        <div className={styles.paramLabel}>{name}</div>
        {paramType === 'string' && (
          <Input value={paramValues[name]} onChange={(e) => this.updateParamValue(name, e.target.value, paramType)} />
        )}
        {paramType === 'number' && (
          <Input value={paramValues[name]} onChange={(e) => this.updateParamValue(name, e.target.value, paramType)} />
        )}
        {paramType === 'angle' && (
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
        {paramType === 'boolean' && (
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
        {paramType === 'time' && (
          <>
            <Input
              value={paramValues[name]}
              onChange={(e) => this.updateParamValue(name, e.target.value, paramType)}
              onBlur={() => this.checkInvalidTime(name, paramValues[name])}
            />
            {this.state.paramWarnings[name] && (
              <div className={styles.paramWarning}>
                Time should be a string (YYYY-MM-DDTHH:MM:SS.ssss or YYYY-MM-DD HH:MM:SS.ssss)
              </div>
            )}
          </>
        )}
        {paramType === 'dict' && (
          <>
            <AceEditor
              value={paramValues[name]}
              onChange={(val) => {
                try {
                  this.updateParamValue(name, val, paramType);
                } catch (error) {
                  console.error(error);
                }
              }}
              mode="json"
              className={styles.rndEditor}
              theme="solarized_dark"
              name="UNIQUE_ID_OF_DIV"
              width={'100%'}
              height="100px"
              editorProps={{ $blockScrolling: true }}
              fontSize={14}
            />
            <JSONPretty data={paramValues[name]} />
          </>
        )}
      </div>
    );
  };

  selectCommand = (commandName) => {
    const paramsDict = this.TCSCommands[commandName] ?? {};
    const paramNames = Object.keys(paramsDict);
    const paramValues = {};
    paramNames.forEach((paramName) => (paramValues[paramName] = paramsDict[paramName][1]));
    this.setState({ selectedCommand: commandName, paramValues });
  };

  render() {
    const paramsDict = this.TCSCommands[this.state.selectedCommand] ?? {};
    const queueState = {
      statusText: ScriptQueue.stateStyleDict[this.props.state],
      name: this.props.state,
    };
    const isAvailable = queueState.name !== 'Running';
    return (
      <div className={[styles.container, !isAvailable ? styles.containerExtraRow : ''].join(' ')}>
        <Modal
          displayTopBar={false}
          isOpen={!!this.state.isModalOpen}
          onRequestClose={() => this.setState({ isModalOpen: false })}
          contentLabel="Component selection modal"
          size={50}
        >
          {this.state.docstrings[this.state.selectedCommand] ? (
            <div
              className={styles.markdown}
              dangerouslySetInnerHTML={{
                __html: md.render(this.state.docstrings[this.state.selectedCommand]),
              }}
            ></div>
          ) : (
            <div className={styles.markdown}>No documentation available</div>
          )}
        </Modal>
        <div className={[styles.queueStateContainer, !isAvailable ? '' : styles.removed].join(' ')}>
          <span className={styles.queueStateLabel}>
            {this.props.nameTCS && this.props.nameTCS.toUpperCase()} TEL QUEUE STATE
          </span>
          <StatusText status={queueState.statusText}>{queueState.name}</StatusText>
          <span className={styles.warningText}>
            <span className={styles.warningIcon}>
              <WarningIcon></WarningIcon>
            </span>
            <span>
              {this.props.nameTCS && this.props.nameTCS.toUpperCase()} TCS commands are not allowed while queue is
              running
            </span>
          </span>
        </div>

        <div className={styles.selectContainer}>
          <Select
            controlClassName={styles.select}
            options={Object.keys(this.TCSCommands)}
            option={this.state.selectedCommand}
            placeholder="Select a command"
            onChange={(selection) => this.selectCommand(selection?.value)}
          />
          <div
            onClick={() => this.setState({ isModalOpen: true })}
            className={this.state.selectedCommand ? styles.buttonWrapper : styles.hidden}
          >
            <HelpIcon></HelpIcon>
          </div>
        </div>
        <div className={styles.commandParamsContainer}>
          {Object.keys(paramsDict).map((key, index) => {
            const param = paramsDict[key];
            return <div key={index}>{this.renderParam(key, param)}</div>;
          })}
        </div>
        {this.state.selectedCommand && (
          <div className={styles.sendButtonContainer}>
            {this.isAuxTCS() && (
              <Button
                status="info"
                disabled={!this.props.commandExecutePermission || !isAvailable}
                onClick={() => ManagerInterface.runATCSCommand(this.state.selectedCommand, this.state.paramValues)}
              >
                SEND
              </Button>
            )}
            {this.isMainTCS() && (
              <Button
                status="info"
                disabled={!this.props.commandExecutePermission || !isAvailable}
                onClick={() => ManagerInterface.runMTCSCommand(this.state.selectedCommand, this.state.paramValues)}
              >
                SEND
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }
}
