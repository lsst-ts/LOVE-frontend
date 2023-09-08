/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './CSCGroup.module.css';
import CSCDetailContainer from '../CSCDetail/CSCDetail.container';
import CSCExpandedContainer from '../CSCExpanded/CSCExpanded.container';
import CSCGroupLogContainer from '../CSCGroupLog/CSCGroupLog.container';

export default class CSCGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCSC: undefined,
    };
  }

  static propTypes = {
    name: PropTypes.string,
    cscs: PropTypes.array,
    onCSCClick: PropTypes.func,
    embedded: PropTypes.bool,
    subscribeToStreams: PropTypes.func,
    unsubscribeToStreams: PropTypes.func,
  };

  static defaultProps = {
    name: '',
    cscs: [],
    subscribeToStreams: () => 0,
    unsubscribeToStreams: () => 0,
    selectedCSC: undefined,
    embedded: false,
  };

  componentDidMount = () => {
    if (this.props.cscs !== undefined) {
      this.props.cscs.forEach((csc) => {
        this.props.subscribeToStreams(csc.name, csc.salindex);
      });
    }
  };

  componentWillUnmount = () => {
    if (this.props.cscs !== undefined) {
      this.props.cscs.forEach((csc) => {
        this.props.unsubscribeToStreams(csc.name, csc.salindex);
      });
    }
  };

  renderExpandedView = (selectedCSC) => {
    const groupView = selectedCSC.csc === 'all';

    return groupView ? (
      <CSCGroupLogContainer
        group={selectedCSC.group}
        name={selectedCSC.csc}
        onCSCClick={this.onCSCClick}
        cscList={this.props.cscs}
        embedded={true}
      />
    ) : (
      <CSCExpandedContainer
        group={selectedCSC.group}
        name={selectedCSC.csc}
        salindex={selectedCSC.salindex}
        onCSCClick={this.onCSCClick}
      />
    );
  };

  onCSCClick = ({ group, csc, salindex }) => {
    if (!csc) {
      this.setState({
        selectedCSC: undefined,
      });
      return;
    }

    this.setState({
      selectedCSC: {
        group,
        csc,
        salindex,
      },
    });
  };
  render() {
    let { selectedCSC } = this.state;
    return selectedCSC ? (
      this.renderExpandedView(selectedCSC)
    ) : (
      <div className={styles.CSCGroupContainer}>
        <div className={styles.CSCGroupTitle} onClick={() => this.onCSCClick({ group: this.props.name, csc: 'all' })}>
          {this.props.name}
        </div>
        <div className={styles.CSCDetailsContainer}>
          {this.props.cscs.map((csc) => {
            return (
              <div key={csc.name + csc.salindex} className={styles.CSCDetailContainer}>
                <CSCDetailContainer
                  group={this.props.name}
                  name={csc.name}
                  salindex={csc.salindex}
                  hasHeartbeat={csc.hasHeartbeat}
                  onCSCClick={this.onCSCClick}
                  embedded={true}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
