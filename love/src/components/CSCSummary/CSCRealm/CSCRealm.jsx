import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './CSCRealm.module.css';
import CSCGroup from '../CSCGroup/CSCGroup';

export default class CSCRealm extends Component {
  static propTypes = {
    name: PropTypes.string,
    groups: PropTypes.object,
    data: PropTypes.object,
  };

  static defaultProps = {
    name: '',
    groups: {},
    data: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      hierarchy: {
        'Aux Tel': {
          'CSC Group 1': ['CSC1', 'CSC2', 'CSC3'],
        },
        'Main Tel': {
          'CSC Group 1': ['CSC1', 'CSC2', 'CSC3'],
          'CSC Group 2': ['CSC1', 'CSC2', 'CSC3'],
        },
        Observatory: {
          'CSC Group 1': ['CSC1', 'CSC2', 'CSC3'],
        },
      },
    };
  }

  render() {
    return (
      <div className={styles.CSCRealmContainer}>
        <div>{this.props.name}</div>
        {Object.keys(this.props.groups).map((group) => {
          return (
            <div key={group} className={styles.CSCGroupContainer}>
                <CSCGroup name={group} data={this.props.data} cscs={this.props.groups[group]} />
            </div>
          );
        })}
      </div>
    );
  }
}
