import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './CSCSummary.module.css';
import CSCRealm from './CSCRealm/CSCRealm';
import Panel from '../GeneralPurpose/Panel/Panel';

export default class CSCSummary extends Component {
  static propTypes = {
    hierarchy: PropTypes.object,
    expandHeight: PropTypes.bool,
  };

  static defaultProps = {
    hierarchy: {
      'Aux Telescope': {
        'CSC Group 1': [
          { name: 'ScriptQueue', salindex: 1 },
          { name: 'ATDome', salindex: 1 },
        ],
      },
      'Main Telescope': {
        'CSC Group 1': [{ name: 'CSC4', salindex: 0 }],
        'CSC Group 2': [],
      },
      Observatory: {
        'CSC Group 1': [],
      },
    },
  };
  render() {
    return (
      <Panel title="CSC Summary" className={styles.panel} expandHeight={this.props.expandHeight}>
        <div className={styles.CSCSummaryContainer}>
          {Object.keys(this.props.hierarchy).map((realm) => {
            return (
              <div key={realm} className={styles.CSCRealmContainer}>
                <CSCRealm name={realm} groups={this.props.hierarchy[realm]} hierarchy={this.props.hierarchy} />
              </div>
            );
          })}
        </div>
      </Panel>
    );
  }
}
