import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './CSCRealm.module.css';
import CSCGroup from '../CSCGroup/CSCGroup';

export default class CSCRealm extends Component {
  static propTypes = {
    name: PropTypes.string,
    groups: PropTypes.object,
    data: PropTypes.object,
    onCSCClick: PropTypes.func,
    selectedCSCs: PropTypes.array,
    hierarchy: PropTypes.object,
    clearCSCErrorCodes: PropTypes.func,
    clearCSCLogMessages: PropTypes.func,
    heartbeatsData: PropTypes.arrayOf(PropTypes.object),
    summaryStateData: PropTypes.object,
  };

  static defaultProps = {
    name: '',
    groups: {},
    data: {},
    onCSCClick: () => 0,
    selectedCSCs: [],
    hierarchy: {},
    clearCSCErrorCodes: () => 0,
    clearCSCLogMessages: () => 0,
    heartbeatsData: [],
    summaryStateData: {},
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
                data={this.props.data}
                heartbeatsData={this.props.heartbeatsData}
                summaryStateData={this.props.summaryStateData}
                cscs={this.props.groups[group]}
                onCSCClick={this.props.onCSCClick}
                selectedCSCs={this.props.selectedCSCs}
                hierarchy={this.props.hierarchy}
                clearCSCErrorCodes={this.props.clearCSCErrorCodes}
                clearCSCLogMessages={this.props.clearCSCLogMessages}
              />
            </div>
          );
        })}
      </div>
    );
  }
}
