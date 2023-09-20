/** This file is part of LOVE-frontend.

Developed for Inria Chile Tech Team.

See the COPYRIGHT file at the top-level directory of this distribution
for details of code ownership.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.*/

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import CSCDetail from '../CSCDetail/CSCDetail';
import CSCItem from '../CSCItem/CSCItem';
import styles from './CSCGroup.module.css';

export default class CSCGroup extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    cscs: PropTypes.array.isRequired,
    authlist: PropTypes.objectOf(
      PropTypes.shape({
        authorized_user: PropTypes.arrayOf(PropTypes.string),
        non_authorized_csc: PropTypes.arrayOf(PropTypes.string),
      }),
    ).isRequired,
    authlistRequests: PropTypes.arrayOf(PropTypes.object),
    reloadData: PropTypes.func,
  };

  static defaultProps = {
    name: '',
    cscs: [],
    authlist: {},
    authlistRequests: [],
  };

  state = {
    selectedCSC: null,
  };

  setSelectedCSC = (csc) => this.setState({ selectedCSC: csc });

  getRequets(csc) {
    const { authlistRequests } = this.props;
    return authlistRequests.filter((req) => req.target_csc === csc);
  }

  renderItems() {
    const { name, cscs, authlist, username, reloadData } = this.props;
    return (
      <>
        <div className={styles.CSCGroupTitle}>{name}</div>
        <div className={styles.separator}>
          <div />
        </div>
        <div className={styles.CSCDetailsContainer}>
          {cscs.map((item, index) => (
            <CSCItem
              key={index}
              csc={item.name}
              authlist={authlist[item.name]}
              authlistRequests={this.getRequets(item.name)}
              username={username}
              onClick={() => this.setSelectedCSC(item.name)}
              reloadData={reloadData}
            />
          ))}
        </div>
      </>
    );
  }

  renderDetail() {
    const { name, authlist } = this.props;
    const { selectedCSC } = this.state;
    return (
      <>
        <div className={styles.CSCGroupTitle}>
          <div className={styles.backButton} onClick={() => this.setSelectedCSC(null)}>
            {'<'} back
          </div>
          {name} {'>'} <b>{selectedCSC}</b>
        </div>
        <div className={styles.separator}>
          <div />
        </div>
        <CSCDetail authlist={authlist[selectedCSC]} />
      </>
    );
  }

  render() {
    let content;
    if (this.state.selectedCSC !== null) {
      content = this.renderDetail();
    } else {
      content = this.renderItems();
    }
    return <div className={styles.CSCGroupContainer}>{content}</div>;
  }
}
