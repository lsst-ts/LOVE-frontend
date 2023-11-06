/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

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
import ExposureAdd from './Exposure/ExposureAdd';
import NonExposureEdit from './NonExposure/NonExposureEdit';
import TeknikerAdd from './Tekniker/TeknikerAdd';
import styles from './OLE.module.css';

const tabs = [
  { name: 'Narrative Logs', value: 'non-exposure' },
  { name: 'Exposure Logs', value: 'exposure' },
  { name: 'TMA Logs', value: 'tekniker' },
];

export default class CreateOLE extends Component {
  static propTypes = {
    /** Boolean to indicate if this component is used for create Logs */
    isLogCreate: PropTypes.bool,
  };

  static defaultProps = {
    isLogCreate: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedTab: tabs[0].value,
    };
  }

  changeTab(tab) {
    this.setState({ selectedTab: tab });
  }

  componentDidMount() {
    this.props.subscribeToStreams();
  }

  componentWillUnmount() {
    this.props.unsubscribeToStreams();
  }

  getComponent(tab) {
    const { isLogCreate } = this.props;
    if (tab === 'exposure') {
      return <ExposureAdd isLogCreate={isLogCreate} props={this.props} />;
    } else if (tab === 'non-exposure') {
      return <NonExposureEdit isLogCreate={isLogCreate} props={this.props} />;
    } else if (tab === 'tekniker') {
      return <TeknikerAdd isLogCreate={isLogCreate} props={this.props} />;
    }
  }

  render() {
    const selectedTab = this.state.selectedTab;

    const html = tabs.map((item, index) => {
      return (
        <div
          className={[styles.tab, selectedTab === item.value ? styles.selected : ''].join(' ')}
          key={index}
          onClick={() => this.changeTab(item.value)}
        >
          <div className={styles.tabLabel}>{item.name}</div>
        </div>
      );
    });

    return (
      <div className={styles.tabsWrapper}>
        <div className={styles.tabsRow}>{html}</div>
        <div className={styles.tableWrapper}>{this.getComponent(selectedTab)}</div>
      </div>
    );
  }
}
