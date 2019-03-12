import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './CSCSummary.module.css';
import CSCRealm from './CSCRealm/CSCRealm';
import Panel from '../Panel/Panel';
import ManagerInterface from '../../Utils';

export default class CSCSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hierarchy: {
        'Aux Tel': {
          'CSC Group 1': [
            'ScriptQueue',
            'Scheduler1',
            'ScriptQueue1',
            'Scheduler2',
            'ScriptQueue2',
            'Scheduler',
            'ScriptQueue',
            'Scheduler',
            'ScriptQueue',
            'Scheduler',
            'ScriptQueue',
            'Scheduler',
            'ScriptQueue',
            'Scheduler',
            'ScriptQueue',
            'Scheduler',
            'ScriptQueue',
            'Scheduler',
            'ScriptQueue',
            'Scheduler',
            'ScriptQueue',
            'Scheduler',
            'ScriptQueue',
            'Scheduler',
            'ScriptQueue',
            'Scheduler',
            'ScriptQueue',
            'Scheduler',
            'ScriptQueue',
            'Scheduler',
            'ScriptQueue',
            'Scheduler',
            'ScriptQueue',
            'Scheduler',
            'ScriptQueue',
            'Scheduler',
            'ScriptQueue',
            'Scheduler',
            'ScriptQueue',
            'Scheduler',
          ],
        },
        'Main Tel': {
          'CSC Group 1': ['CSC4'],
          'CSC Group 2': [],
        },
        Observatory: {
          'CSC Group 1': [],
        },
      },
      data: {
        ScriptQueue: {
          summaryState: 3,
          detailedState: {},
        },
        ScriptQueue1: {
          summaryState: 1,
          detailedState: {},
        },
        ScriptQueue2: {
          summaryState: 2,
          detailedState: {},
        },
        Scheduler1: {
          summaryState: 4,
          detailedState: {},
        },
        Scheduler2: {
          summaryState: 5,
          detailedState: {},
        },
        CSC2: {
          summaryState: 0,
          detailedState: {},
        },
        CSC3: {
          summaryState: 0,
          detailedState: {},
        },
      },
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
    console.log(this.state.data);
  };

  subscribeToCSCs = () => {
    Object.keys(this.state.hierarchy).map((realm) => {
      const groupsDict = this.state.hierarchy[realm];
      Object.keys(groupsDict).map((group) => {
        groupsDict[group].map((csc) => {
          console.log('csc', csc);
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
          console.log('csc', csc);
          this.managerInterface.unsubscribeToEvents(csc, 'summaryState', this.onReceiveMessage);
        });
      });
    });
  };

  componentDidMount() {
    // this.subscribeToCSCs();
  }

  componentDidUnmount() {
    this.unsubscribeToCSCs();
  }

  render() {
    return (
      <Panel title="Script Queue" className={styles.panel}>
        <div className={styles.CSCSummaryContainer}>
          {Object.keys(this.state.hierarchy).map((realm) => {
            return (
              <div key={realm} className={styles.CSCRealmContainer}>
                <CSCRealm name={realm} data={this.state.data} groups={this.state.hierarchy[realm]} />
              </div>
            );
          })}
        </div>
      </Panel>
    );
  }
}
