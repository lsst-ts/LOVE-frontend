import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './CSCRealm.module.css';
import CSCGroup from '../CSCGroup/CSCGroup';

export default class CSCRealm extends Component {
  static propTypes = {
    username: PropTypes.string,
    name: PropTypes.string,
    groups: PropTypes.object,
    hierarchy: PropTypes.object,
    authlist: PropTypes.object,
  };

  static defaultProps = {
    name: '',
    groups: {},
    hierarchy: {},
  };

  render() {
    const { authlist, username, groups, name, authlistRequests, reloadData } = this.props;
    return (
      <div className={styles.CSCRealmContainer}>
        <div className={styles.CSCRealmTitle}>{name}</div>
        {Object.keys(groups).map((group) => (
          <CSCGroup
            key={group}
            username={username}
            name={group}
            cscs={groups[group]}
            authlist={authlist}
            authlistRequests={authlistRequests}
            reloadData={reloadData}
          />
        ))}
      </div>
    );
  }
}
