import React, { Component } from 'react';
import styles from './CSCSummary.module.css';
import CSCRealm from './CSCRealm/CSCRealm';
import Panel from '../Panel/Panel';
import ManagerInterface from '../../Utils';

export default class CSCSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hierarchy: {
        'Aux Telescope': {
          'CSC Group 1': [
            'ScriptQueue',
            'Scheduler1',
            'ScriptQueue1',
            'Scheduler2',
            'ScriptQueue2',
            'Scheduler3',
            'ScriptQueue3',
            'Scheduler4',
            'ScriptQueue4',
            'Scheduler5',
            'ScriptQueue5',
            'Scheduler6',
            'ScriptQueue6',
            'Scheduler7',
            'ScriptQueue7',
            'Scheduler8',
            'ScriptQueue8',
            'Scheduler9',
            'ScriptQueue9',
            'Scheduler10',
            'ScriptQueue10',
            'Scheduler11',
            'ScriptQueue11',
            'Scheduler12',
            'ScriptQueue12',
            'Scheduler13',
            'ScriptQueue13',
            'Scheduler14',
            'ScriptQueue14',
            'Scheduler15',
            'ScriptQueue15',
            'Scheduler16',
            'ScriptQueue16',
            'Scheduler17',
            'ScriptQueue17',
            'Scheduler18',
            'ScriptQueue18',
            'Scheduler19',
            'ScriptQueue19',
            'Scheduler20',
          ],
        },
        'Main Telescope': {
          'CSC Group 1': ['CSC4'],
          'CSC Group 2': [],
        },
        Observatory: {
          'CSC Group 1': [],
        },
      },
      data: {
        ScriptQueue: {
          summaryState: 2,
          detailedState: {},
        },
        ScriptQueue1: {
          summaryState: 2,
          detailedState: {},
        },
        ScriptQueue2: {
          summaryState: 2,
          detailedState: {},
        },
        Scheduler13: {
          summaryState: 3,
          detailedState: {},
          errorCode: [
            {
              errorCode: 4,
              errorReport: 'errorReport',
              traceback: 'traceback1',
              timestamp: '2022/04/25 20:03:10',
            },
            {
              errorCode: 4,
              errorReport: 'errorReport',
              traceback: 'traceback1',
              timestamp: '2022/04/25 20:03:12',
            },
            {
              errorCode: 4,
              errorReport: 'errorReport',
              traceback: 'traceback1',
              timestamp: '2022/04/25 20:03:14',
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
              timestamp: '2022/04/25 20:03:10',
            },
            {
              level: 10,
              message: 'debug message debug message debug message ',
              traceback: '',
              timestamp: '2022/04/25 20:03:11',
            },
            {
              level: 20,
              message: `info message info message info message info message info message 
                info message info message info message info message info message info message 
                info message info message info message info message info message info message 
                info message info message info message`,
              traceback: 'traceback1',
              timestamp: '2022/04/25 20:03:12',
            },
            {
              level: 30,
              message: 'warning message',
              traceback: 'traceback1',
              timestamp: '2022/04/25 20:03:13',
            },
            {
              level: 40,
              message: `error message error message error message error message error message 
              error message error message error message error message error message error message 
              error message error message error message error message error message error message`,
              traceback: '',
              timestamp: '2022/04/25 20:03:14',
            },
            {
              level: 40,
              message: 'error message',
              traceback: `traceback traceback traceback traceback traceback traceback traceback 
              traceback traceback traceback traceback traceback traceback traceback traceback 
              traceback traceback traceback `,
              timestamp: '2022/04/25 20:03:15',
            },
            {
              level: 40,
              message: 'error message',
              traceback: 'traceback1',
              timestamp: '2022/04/25 20:03:16',
            },
          ],
        },
        Scheduler14: {
          summaryState: 2,
          detailedState: {},
          logMessage: [
            {
              level: 10,
              message: 'debug message debug message debug message ',
              traceback: '',
              timestamp: '2022/04/25 20:03:10',
            },
            {
              level: 20,
              message: 'info message',
              traceback: 'traceback1',
              timestamp: '2022/04/25 20:03:11',
            },
            {
              level: 30,
              message: 'warning message',
              traceback: 'traceback1',
              timestamp: '2022/04/25 20:03:12',
            },
            {
              level: 40,
              message: 'error message',
              traceback: 'traceback1',
              timestamp: '2022/04/25 20:03:13',
            },
            {
              level: 40,
              message: 'error message',
              traceback: 'traceback1',
              timestamp: '2022/04/25 20:03:14',
            },
            {
              level: 40,
              message: 'error message',
              traceback: 'traceback1',
              timestamp: '2022/04/25 20:03:15',
            },
            {
              level: 40,
              message: 'error message',
              traceback: 'traceback1',
              timestamp: '2022/04/25 20:03:16',
            },
            {
              level: 40,
              message: 'error message',
              traceback: 'traceback1',
              timestamp: '2022/04/25 20:03:17',
            },
            {
              level: 40,
              message: 'error message',
              traceback: 'traceback1',
              timestamp: '2022/04/25 20:03:18',
            },
            {
              level: 40,
              message: 'error message',
              traceback: 'traceback1',
              timestamp: '2022/04/25 20:03:19',
            },
            {
              level: 40,
              message: 'error message',
              traceback: 'traceback1',
              timestamp: '2022/04/25 20:03:20',
            },
            {
              level: 40,
              message: 'error message',
              traceback: 'traceback1',
              timestamp: '2022/04/25 20:03:21',
            },
            {
              level: 40,
              message: 'error message',
              traceback: 'traceback1',
              timestamp: '2022/04/25 20:03:22',
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
              timestamp: '2022/04/25 20:03:23',
            },
          ],
        },
        Scheduler2: {
          summaryState: 2,
          detailedState: {},
        },
        CSC2: {
          summaryState: 3,
          detailedState: {},
        },
        CSC3: {
          summaryState: 0,
          detailedState: {},
        },
      },
      selectedCSCs: [{ realm: 'Aux Telescope', group: 'CSC Group 1', csc: 'Scheduler13' }],
    };
    this.managerInterface = new ManagerInterface();
  }

  onReceiveMessage = (msg) => {
    const data = JSON.parse(msg.data);
    if (!(data.data instanceof Object)) return;
    const newData = { ...this.state.data };
    Object.keys(data.data).map((cscKey) => {
      newData[cscKey].summaryState = data.data[cscKey].summaryState[0].summaryState.value;
    });
    this.setState({
      data: newData,
    });
  };

  subscribeToCSCs = () => {
    Object.keys(this.state.hierarchy).map((realm) => {
      const groupsDict = this.state.hierarchy[realm];
      Object.keys(groupsDict).map((group) => {
        groupsDict[group].map((csc) => {
          this.managerInterface.subscribeToEvents(csc, 'summaryState', this.onReceiveMessage);
        });
      });
    });
  };

  unsubscribeToCSCs = () => {
    Object.keys(this.state.hierarchy).map((realm) => {
      const groupsDict = this.state.hierarchy[realm];
      Object.keys(groupsDict).map((group) => {
        groupsDict[group].map((csc) => {
          this.managerInterface.unsubscribeToEvents(csc, 'summaryState', this.onReceiveMessage);
        });
      });
    });
  };

  componentWillUnmount() {
    this.unsubscribeToCSCs();
  }

  toggleCSCExpansion = (realm, group, csc) => {
    for (let i = 0; i < this.state.selectedCSCs.length; i += 1) {
      const currentCSC = this.state.selectedCSCs[i];
      if (realm === currentCSC.realm && group === currentCSC.group && csc === currentCSC.csc) {
        const newSelectedCSCs = [...this.state.selectedCSCs];
        newSelectedCSCs.splice(i, 1);
        this.setState({ selectedCSCs: newSelectedCSCs });
        return;
      }
    }
    this.setState({
      selectedCSCs: [...this.state.selectedCSCs, { realm, group, csc }],
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
                />
              </div>
            );
          })}
        </div>
      </Panel>
    );
  }
}
