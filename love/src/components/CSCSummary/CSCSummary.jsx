import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './CSCSummary.module.css';
import CSCRealm from './CSCRealm/CSCRealm';

export default class CSCSummary extends Component {
  static propTypes = {
    hierarchy: PropTypes.object,
    expandHeight: PropTypes.bool,
  };

  render() {
    return (
      <div className={styles.CSCSummaryContainer}>
        {Object.keys(this.props.hierarchy).map((realm) => {
          return (
            <div key={realm} className={styles.CSCRealmContainer}>
              <CSCRealm
                name={realm}
                groups={this.props.hierarchy[realm]}
                hierarchy={this.props.hierarchy}
                subscribeToStreamCallback={this.props.subscribeToStreamCallback}
              />
            </div>
          );
        })}
      </div>
    );
  }
}
