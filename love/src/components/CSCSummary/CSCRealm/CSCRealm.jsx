import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './CSCRealm.module.css';
import CSCGroupContainer from '../CSCGroup/CSCGroup.container';

export default class CSCRealm extends Component {
  static propTypes = {
    name: PropTypes.string,
    groups: PropTypes.object,
    hierarchy: PropTypes.object,
  };

  static defaultProps = {
    name: '',
    groups: {},
    hierarchy: {},
  };

  render() {
    return (
      <div className={styles.CSCRealmContainer}>
        <div className={styles.CSCRealmTitle}>{this.props.name}</div>
        {Object.keys(this.props.groups).map((group) => {
          return (
            <div key={group} className={styles.CSCGroupContainer}>
              <CSCGroupContainer
                name={group}
                cscs={this.props.groups[group]}
                embedded={true}
                subscribeToStreamCallback={this.props.subscribeToStreamCallback}
              />
            </div>
          );
        })}
      </div>
    );
  }
}
