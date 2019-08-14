import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './CSCRealm.module.css';
import CSCGroup from '../CSCGroup/CSCGroup';

export default class CSCRealm extends Component {
  static propTypes = {
    name: PropTypes.string,
    groups: PropTypes.object,
    onCSCClick: PropTypes.func,
    selectedCSCs: PropTypes.array,
    hierarchy: PropTypes.object,
  };

  static defaultProps = {
    name: '',
    groups: {},
    onCSCClick: () => 0,
    selectedCSCs: [],
    hierarchy: {},
  };

  render() {
    return (
      <div className={styles.CSCRealmContainer}>
        <div className={styles.CSCRealmTitle}>{this.props.name}</div>
        {Object.keys(this.props.groups).map((group) => {
          return (
            <div key={group} className={styles.CSCGroupContainer}>
              <CSCGroup
                realm={this.props.name}
                name={group}
                cscs={this.props.groups[group]}
                onCSCClick={this.props.onCSCClick}
                selectedCSCs={this.props.selectedCSCs}
                hierarchy={this.props.hierarchy}
              />
            </div>
          );
        })}
      </div>
    );
  }
}
