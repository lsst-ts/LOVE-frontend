import React, { Component } from 'react';
import styles from './CSCSummary.module.css';
import CSCRealm from './CSCRealm/CSCRealm';
import Panel from '../GeneralPurpose/Panel/Panel';
import ManagerInterface from '../../Utils';
import { hasFakeData, CSCSummaryHierarchy } from '../../Config';

export default class CSCSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hierarchy: CSCSummaryHierarchy,
      data: {
        ScriptQueue: {
          summaryState: { priority: 1, summaryState: 2 },
          detailedState: {},
        },
        ScriptQueue3: {
          summaryState: { priority: 1, summaryState: 4 },
          detailedState: {},
        },
        ScriptQueue4: {
          summaryState: { priority: 1, summaryState: 2 },
          detailedState: {},
          errorCode: [
            {
              errorCode: 1,
              errorReport: 'errorReport',
              traceback: 'traceback1',
              timestamp: '2018/04/25 18:03:10',
            },
            {
              errorCode: 1,
              errorReport: 'errorReport',
              traceback: 'traceback1',
              timestamp: '2018/04/25 20:03:12',
            },
            {
              errorCode: 1,
              errorReport: 'errorReport',
              traceback: 'traceback1',
              timestamp: '2018/04/25 22:03:14',
            },
          ],
        },
        Scheduler13: {
          summaryState: { priority: 1, summaryState: 3 },
          detailedState: {},
          errorCode: [
            {
              errorCode: 4,
              errorReport: `errorReporterrorReporterrorReporterrorReporterrorReporterrorReporterror
                ReporterrorReporterrorReporterrorReporterrorReporterrorReporterrorReporterror
                ReporterrorReporterrorReporterrorReporterrorReporterrorReporterrorReporterror
                ReporterrorReporterrorReporterrorReporterrorReporterrorReporterrorReporterror
                ReporterrorReporterrorReporterrorReporterrorReporterrorReporterrorReporterror
                ReporterrorReporterrorReporterrorReporterrorReporterrorReporterrorReporterror
                ReporterrorReporterrorReporterrorReporterrorReporterrorReporterrorReporterror
                ReporterrorReporterrorReporterrorReporterrorReporterrorReporterrorReporterror
                ReporterrorReporterrorReporterrorReporterrorReporterrorReporterrorReporterror
                ReporterrorReporterrorReporterrorReporterrorReporterrorReporterrorReporterror
                ReporterrorReporterrorReporterrorReporterrorReporterrorReporterrorReporterror
                ReporterrorReporterrorReporterrorReporterrorReporterrorReporterrorReporterror
                ReporterrorReporterrorReporterrorReporterrorReporterrorReporterrorReport`,
              traceback: 'traceback1',
              timestamp: '2018/04/25 19:03:10',
            },
            {
              errorCode: 4,
              errorReport: 'errorReport',
              traceback: 'traceback1',
              timestamp: '2018/04/25 19:03:11',
            },
            {
              errorCode: 4,
              errorReport: 'errorReport',
              traceback: 'traceback1',
              timestamp: '2018/04/25 19:03:12',
            },
            {
              errorCode: 4,
              errorReport: 'errorReport',
              traceback: 'traceback1',
              timestamp: '2018/04/25 19:03:13',
            },
            {
              errorCode: 4,
              errorReport: 'errorReport',
              traceback: 'traceback1',
              timestamp: '2018/04/25 21:03:12',
            },
            {
              errorCode: 4,
              errorReport: 'errorReport',
              traceback: 'traceback1',
              timestamp: '2018/04/25 23:03:14',
            },
          ],
          logMessage: [
            {
              level: 40,
              message: `long long long long long long long long long long long long long 
                long long long long long long long long long long long long long 
                long long long long long long long long long long long long long 
                long long long long long long long long long long long long long 
                long long long long long long long long long long long long long 
                long long long error message`,
              traceback: 'traceback1',
              timestamp: '2018/04/25 20:03:10',
            },
            {
              level: 10,
              message: 'debug message debug message debug message ',
              traceback: '',
              timestamp: '2018/04/25 20:03:11',
            },
            {
              level: 20,
              message: `info message info message info message info message info message 
                info message info message info message info message info message info message 
                info message info message info message info message info message info message 
                info message info message info message`,
              traceback: 'traceback1',
              timestamp: '2018/04/25 20:03:12',
            },
            {
              level: 30,
              message: 'warning message',
              traceback: 'traceback1',
              timestamp: '2018/04/25 20:03:13',
            },
            {
              level: 40,
              message: `error message error message error message error message error message 
              error message error message error message error message error message error message 
              error message error message error message error message error message error message`,
              traceback: '',
              timestamp: '2018/04/25 20:03:14',
            },
            {
              level: 40,
              message: 'error message',
              traceback: `traceback traceback traceback traceback traceback traceback traceback 
              traceback traceback traceback traceback traceback traceback traceback traceback 
              traceback traceback traceback `,
              timestamp: '2018/04/25 20:03:15',
            },
            {
              level: 40,
              message: 'error message',
              traceback: 'traceback1',
              timestamp: '2018/04/25 20:03:16',
            },
          ],
        },
        Scheduler14: {
          summaryState: { priority: 1, summaryState: 2 },
          detailedState: {},
          logMessage: [
            {
              level: 10,
              message: 'debug message debug message debug message ',
              traceback: '',
              timestamp: '2018/04/25 20:03:10',
            },
            {
              level: 20,
              message: 'info message',
              traceback: 'traceback1',
              timestamp: '2018/04/25 20:03:11',
            },
            {
              level: 30,
              message: 'warning message',
              traceback: 'traceback1',
              timestamp: '2018/04/25 20:03:12',
            },
            {
              level: 40,
              message: 'error message',
              traceback: 'traceback1',
              timestamp: '2018/04/25 20:03:13',
            },
            {
              level: 40,
              message: 'error message',
              traceback: 'traceback1',
              timestamp: '2018/04/25 20:03:14',
            },
            {
              level: 40,
              message: 'error message',
              traceback: 'traceback1',
              timestamp: '2018/04/25 20:03:15',
            },
            {
              level: 40,
              message: 'error message',
              traceback: 'traceback1',
              timestamp: '2018/04/25 20:03:16',
            },
            {
              level: 40,
              message: 'error message',
              traceback: 'traceback1',
              timestamp: '2018/04/25 20:03:17',
            },
            {
              level: 40,
              message: 'error message',
              traceback: 'traceback1',
              timestamp: '2018/04/25 20:03:18',
            },
            {
              level: 40,
              message: 'error message',
              traceback: 'traceback1',
              timestamp: '2018/04/25 20:03:19',
            },
            {
              level: 40,
              message: 'error message',
              traceback: 'traceback1',
              timestamp: '2018/04/25 20:03:20',
            },
            {
              level: 40,
              message: 'error message',
              traceback: 'traceback1',
              timestamp: '2018/04/25 20:03:21',
            },
            {
              level: 40,
              message: 'error message',
              traceback: 'traceback1',
              timestamp: '2018/04/25 20:03:22',
            },
            {
              level: 40,
              message: `long long long long long long long long long long long long long 
                long long long long long long long long long long long long long 
                long long long long long long long long long long long long long 
                long long long long long long long long long long long long long 
                long long long long long long long long long long long long long 
                long long long error message`,
              traceback: 'traceback1',
              timestamp: '2018/04/25 20:03:23',
            },
          ],
        },
        Scheduler2: {
          summaryState: { priority: 1, summaryState: 2 },
          detailedState: {},
        },
        CSC2: {
          summaryState: { priority: 1, summaryState: 3 },
          detailedState: {},
        },
        CSC3: {
          summaryState: { priority: 1, summaryState: 0 },
          detailedState: {},
        },
      },
      selectedCSCs: [],
      // selectedCSCs: [{ realm: 'Aux Telescope', group: 'CSC Group 1', csc: 'ATCamera' }],
    };
    this.managerInterface = new ManagerInterface();
  }

  componentDidMount = () => {
    this.subscribeToCSCs();
  };

  componentWillUnmount = () => {
    this.unsubscribeToCSCs();
  };

  processHeartbeat = (data) => {
    const newData = { ...this.state.data };
    Object.keys(data).forEach((cscKey) => {
      newData[cscKey] = { ...newData[cscKey], heartbeat: data[cscKey] };
    });
    return newData;
  };

  onReceiveMessage = (msg) => {
    const data = JSON.parse(msg.data);
    if (!(data.data instanceof Object)) return;
    let newData = { ...this.state.data };
    Object.keys(data.data).forEach((cscKey) => {
      if (cscKey === 'Heartbeat') {
        newData = this.processHeartbeat(data.data[cscKey]);
        return;
      }
      if (newData[cscKey] === undefined) newData[cscKey] = {};
      else newData[cscKey] = { ...newData[cscKey] };
      Object.keys(data.data[cscKey]).forEach((stream) => {
        // console.log(stream);
        const newMessage = {};
        Object.keys(data.data[cscKey][stream][0]).forEach((param) => {
          newMessage[param] = data.data[cscKey][stream][0][param].value;
        });
        if (stream === 'summaryState') {
          if (newData[cscKey][stream] === undefined) newData[cscKey][stream] = {};
          else newData[cscKey][stream] = { ...newData[cscKey][stream] };
          if (hasFakeData) {
            newMessage.summaryState = [0, 1, 2, 3, 4][Math.floor(Math.random() * 5)];
          }
          newData[cscKey][stream] = newMessage;
        } else if (stream === 'logMessage') {
          // Process logMessage
          if (newData[cscKey][stream] === undefined) newData[cscKey][stream] = [];
          if (hasFakeData) {
            newMessage.timestamp = new Date().toISOString();
            newMessage.level = [10, 20, 30, 40][Math.floor(Math.random() * 4)];
          }
          newData[cscKey][stream].unshift(newMessage);
          newData[cscKey][stream].length = 100;
        } else if (stream === 'errorCode') {
          // Process errorCode
          if (newData[cscKey][stream] === undefined) newData[cscKey][stream] = [];
          if (hasFakeData) newMessage.timestamp = new Date().toISOString();
          newData[cscKey][stream].unshift(newMessage);
          newData[cscKey][stream].length = 100;
        } else {
          // Process everything else
          if (newData[cscKey][stream] === undefined) newData[cscKey][stream] = {};
          newData[cscKey][stream] = newMessage;
        }
      });
    });
    this.setState({
      data: { ...newData },
    });
  };

  onReceiveHeartbeat = (msg) => {
    const data = JSON.parse(msg.data);
    if (!(data.data instanceof Object)) return;
    const newData = { ...this.state.data };
    Object.keys(data.data).map((cscKey) => {
      [newData[cscKey].heartbeat] = data.data[cscKey].heartbeat;
      return 0;
    });
    this.setState({
      data: newData,
    });
  };

  subscribeToCSCs = () => {
    this.managerInterface.subscribeToEvents('Heartbeat', 'all', this.onReceiveMessage);
    Object.keys(this.state.hierarchy).map((realm) => {
      const groupsDict = this.state.hierarchy[realm];
      Object.keys(groupsDict).map((group) => {
        groupsDict[group].map((csc) => {
          this.managerInterface.subscribeToEvents(csc, 'summaryState', this.onReceiveMessage);
          this.managerInterface.subscribeToEvents(csc, 'logMessage', this.onReceiveMessage);
          this.managerInterface.subscribeToEvents(csc, 'errorCode', this.onReceiveMessage);
          return 0;
        });
        return 0;
      });
      return 0;
    });
  };

  unsubscribeToCSCs = () => {
    this.managerInterface.subscribeToEvents('Heartbeat', 'all', () => 0);
    Object.keys(this.state.hierarchy).map((realm) => {
      const groupsDict = this.state.hierarchy[realm];
      Object.keys(groupsDict).map((group) => {
        groupsDict[group].map((csc) => {
          this.managerInterface.unsubscribeToEvents(csc, 'summaryState', () => 0);
          this.managerInterface.unsubscribeToEvents(csc, 'logMessage', () => 0);
          this.managerInterface.unsubscribeToEvents(csc, 'errorCode', () => 0);
          return 0;
        });
        return 0;
      });
      return 0;
    });
  };

  toggleCSCExpansion = (realm, group, csc) => {
    const newSelectedCSCs = [...this.state.selectedCSCs];
    for (let i = 0; i < this.state.selectedCSCs.length; i += 1) {
      const currentCSC = this.state.selectedCSCs[i];
      if (realm === currentCSC.realm && group === currentCSC.group) {
        newSelectedCSCs.splice(i, 1);
        if (csc === currentCSC.csc) {
          this.setState({ selectedCSCs: newSelectedCSCs });
          return;
        }
      }
    }
    this.setState({
      selectedCSCs: [...newSelectedCSCs, { realm, group, csc }],
    });
  };

  clearCSCErrorCodes = (realm, group, csc) => {
    const data = { ...this.state.data };
    if (csc === 'all') {
      this.state.hierarchy[realm][group].forEach((cscKey) => {
        if (data[cscKey]) data[cscKey].errorCode = undefined;
      });
    } else {
      data[csc].errorCode = undefined;
    }
    this.setState({
      data,
    });
  };

  clearCSCLogMessages = (realm, group, csc) => {
    const data = { ...this.state.data };
    data[csc].logMessage = undefined;
    this.setState({
      data,
    });
  };

  render() {
    return (
      <Panel title="CSC Summary" className={styles.panel}>
        <div className={styles.CSCSummaryContainer}>
          {Object.keys(this.state.hierarchy).map((realm) => {
            return (
              <div key={realm} className={styles.CSCRealmContainer}>
                <CSCRealm
                  name={realm}
                  data={this.state.data}
                  groups={this.state.hierarchy[realm]}
                  onCSCClick={this.toggleCSCExpansion}
                  selectedCSCs={this.state.selectedCSCs}
                  hierarchy={this.state.hierarchy}
                  clearCSCErrorCodes={this.clearCSCErrorCodes}
                  clearCSCLogMessages={this.clearCSCLogMessages}
                />
              </div>
            );
          })}
        </div>
      </Panel>
    );
  }
}
