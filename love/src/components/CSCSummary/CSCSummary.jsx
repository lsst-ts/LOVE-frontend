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
          'CSC Group 1': ['ScriptQueue', 'CSC2', 'CSC3'],
        },
        'Main Tel': {
          'CSC Group 1': ['CSC4', 'CSC5', 'CSC6','CSC4', 'CSC5', 'CSC6'],
          'CSC Group 2': ['CSC7', 'CSC8', 'CSC9'],
        },
        Observatory: {
          'CSC Group 1': ['CSC10', 'CSC11', 'CSC12'],
        },
      },
      data: {
        ScriptQueue: {
          summaryState: -1,
          detailedState: {},
        },
        CSC2: {
          summaryState: -1,
          detailedState: {},
        },
        CSC3: {
          summaryState: -1,
          detailedState: {},
        },
      },
    };
    this.managerInterface = new ManagerInterface();
  }

  subscribeToCSCs = () => {
    Object.keys(this.state.hierarchy).map((realm) => {
      const groupsDict = this.state.hierarchy[realm];
      Object.keys(groupsDict).map((group) => {
        groupsDict[group].map((csc) => {
          console.log('csc', csc);
        });
      });
    });
  };

  componentDidMount() {
    this.subscribeToCSCs();
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
