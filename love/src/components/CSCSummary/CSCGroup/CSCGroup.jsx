import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './CSCGroup.module.css';
import CSCDetail from '../CSCDetail/CSCDetail';

export default class CSCGroup extends Component {
  static propTypes = {
    name: PropTypes.string,
    realm: PropTypes.string,
    cscs: PropTypes.array,
    data: PropTypes.object,
    onCSCClick: PropTypes.func,
  };

  static defaultProps = {
    name: '',
    realm: '',
    cscs: [],
    data: {},
    onCSCClick: () => 0,
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
      <div className={styles.CSCGroupContainer}>
        <div className={styles.CSCGroupTitle}>{this.props.name}</div>
        <div className={styles.CSCDetailsContainer}>
          {this.props.cscs.map((csc) => {
            return (
              <div key={csc} className={styles.CSCDetailContainer}>
                <CSCDetail
                  realm={this.props.realm}
                  group={this.props.name}
                  name={csc}
                  data={this.props.data}
                  onCSCClick={this.props.onCSCClick}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
