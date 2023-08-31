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
import Moment from 'moment';
import PropTypes from 'prop-types';
import Button from 'components/GeneralPurpose/Button/Button';
import { OLE_COMMENT_TYPE_OPTIONS } from 'Config';
import ManagerInterface from 'Utils';
import Exposure from './Exposure/Exposure';
import NonExposure from './NonExposure/NonExposure';
import ExposureAdd from './Exposure/ExposureAdd';
import NonExposureEdit from './NonExposure/NonExposureEdit';
import styles from './OLE.module.css';

export default class OLE extends Component {
  static propTypes = {
    tabs: PropTypes.arrayOf(PropTypes.object),
  };

  static defaultProps = {
    tabs: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedTab: props.tabs[0].value,
      clickNewLog: false,
      // Non Exposure filters
      selectedDayNarrativeStart: Moment().subtract(1, 'days'),
      selectedDayNarrativeEnd: Moment(),
      selectedCommentType: OLE_COMMENT_TYPE_OPTIONS[0],
      selectedObsTimeLoss: false,
      // Exposure filters
      instruments: [],
      selectedInstrument: null,
      selectedDayExposureStart: Moment().subtract(1, 'days'),
      selectedDayExposureEnd: Moment(),
      selectedExposureType: 'all',
      registryMap: {},
    };
  }

  /** Non Exposure functions */
  changeDayNarrative(day, type) {
    if (type === 'start') {
      this.setState({ selectedDayNarrativeStart: day });
    } else if (type === 'end') {
      this.setState({ selectedDayNarrativeEnd: day });
    }
  }

  changeCommentTypeSelect(value) {
    this.setState({ selectedCommentType: value });
  }

  changeObsTimeLossSelect(value) {
    this.setState({ selectedObsTimeLoss: value });
  }

  /** Exposure functions */
  changeInstrumentSelect(value) {
    const { instruments } = this.state;
    const index = instruments.indexOf(value);
    this.setState({ selectedInstrument: value });
  }

  changeExposureTypeSelect(value) {
    this.setState({ selectedExposureType: value });
  }

  changeDayExposure(day, type) {
    if (type === 'start') {
      this.setState({ selectedDayExposureStart: day });
    } else if (type === 'end') {
      this.setState({ selectedDayExposureEnd: day });
    }
  }

  changeTab(tab) {
    this.setState({ selectedTab: tab });
  }

  getComponent(clickNewLog, tab) {
    if (clickNewLog === true) {
      if (tab === 'exposure') {
        return (
          <ExposureAdd
            back={() => {
              this.setState({ clickNewLog: false });
            }}
            isLogCreate={true}
            props={this.props}
          />
        );
      }
      if (tab === 'non-exposure') {
        return (
          <NonExposureEdit
            back={() => {
              this.setState({ clickNewLog: false });
            }}
            isLogCreate={true}
            props={this.props}
          />
        );
      }
    } else {
      if (tab === 'exposure') {
        return (
          <Exposure
            instruments={this.state.instruments}
            selectedInstrument={this.state.selectedInstrument}
            changeInstrumentSelect={(value) => this.changeInstrumentSelect(value)}
            selectedExposureType={this.state.selectedExposureType}
            changeExposureTypeSelect={(value) => this.changeExposureTypeSelect(value)}
            selectedDayExposureStart={this.state.selectedDayExposureStart}
            selectedDayExposureEnd={this.state.selectedDayExposureEnd}
            changeDayExposure={(day, type) => this.changeDayExposure(day, type)}
            registryMap={this.state.registryMap}
          />
        );
      }
      if (tab === 'non-exposure') {
        return (
          <NonExposure
            selectedDayNarrativeStart={this.state.selectedDayNarrativeStart}
            selectedDayNarrativeEnd={this.state.selectedDayNarrativeEnd}
            changeDayNarrative={(day, type) => this.changeDayNarrative(day, type)}
            selectedCommentType={this.state.selectedCommentType}
            changeCommentTypeSelect={(value) => this.changeCommentTypeSelect(value)}
            selectedObsTimeLoss={this.state.selectedObsTimeLoss}
            changeObsTimeLossSelect={(value) => this.changeObsTimeLossSelect(value)}
          />
        );
      }
    }
  }

  componentDidMount() {
    this.props.subscribeToStreams();
    ManagerInterface.getListExposureInstruments().then((data) => {
      const registryMap = {};
      Object.entries(data).forEach(([key, value]) => {
        value.forEach((instrument) => {
          if (!instrument) return;
          registryMap[instrument] = key;
        });
      });
      const instrumentsArray = Object.values(data)
        .map((arr) => arr[0])
        .filter((instrument) => instrument);

      this.setState({
        instruments: instrumentsArray,
        selectedInstrument: instrumentsArray[0],
        registryMap: registryMap,
      });
    });
  }

  componentWillUnmount() {
    this.props.unsubscribeToStreams();
  }

  render() {
    const tabs = this.props.tabs;
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
        <div className={styles.tabsRow}>
          {html}
          <div className={styles.btnNew}>
            <Button className={styles.btn} onClick={() => this.setState((prevState) => ({ clickNewLog: true }))}>
              + New {tabs.filter((tab) => tab.value === selectedTab)[0].name.slice(0, -1)}
            </Button>
          </div>
        </div>
        <div className={styles.tableWrapper}>{this.getComponent(this.state.clickNewLog, selectedTab)}</div>
      </div>
    );
  }
}
