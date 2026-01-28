/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile and the Telescope and Site Software team.

Developed for the Vera C. Rubin Observatory Telescope and Site Systems.

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
import Button from 'components/GeneralPurpose/Button/Button';
import InfoIcon from 'components/icons/InfoIcon/InfoIcon';
import WarningIcon from 'components/icons/WarningIcon/WarningIcon';
import Exposure from './Exposure/Exposure';
import NonExposure from './NonExposure/NonExposure';
import ExposureAdd from './Exposure/ExposureAdd';
import NonExposureEdit from './NonExposure/NonExposureEdit';
import { OLE_COMMENT_TYPE_OPTIONS, OLE_DEFAULT_SYSTEMS_FILTER_OPTION } from 'Config';
import ManagerInterface from 'Utils';
import styles from './OLE.module.css';

const tabs = [
  { name: 'Narrative Logs', value: 'non-exposure' },
  { name: 'Exposure Logs', value: 'exposure' },
];

export const iconLevelOLE = {
  info: <InfoIcon />,
  urgent: <WarningIcon />,
};

export function getIconLevel(level) {
  const icon = iconLevelOLE[level >= 100 ? 'urgent' : 'info'];
  return icon;
}

export function closeCalendar(ref) {
  const buttons = ref?.querySelectorAll('button');
  const clickEvent = new Event('click', { bubbles: true });
  if (buttons && buttons.length > 0) {
    // buttons[2] is the button to close the calendar
    // hidden by default so it can only be clicked programatically
    buttons[2].dispatchEvent(clickEvent);
  }
}

export default class OLE extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: tabs[0].value,
      clickNewLog: false,
      // Non Exposure filters
      selectedDayNarrativeStart: Moment().subtract(1, 'days'),
      selectedDayNarrativeEnd: Moment(),
      selectedCommentType: OLE_COMMENT_TYPE_OPTIONS[0],
      selectedSystem: OLE_DEFAULT_SYSTEMS_FILTER_OPTION,
      selectedObsTimeLoss: false,
      selectedJiraTickets: false,
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

  changeSystemSelect(value) {
    this.setState({ selectedSystem: value });
  }

  changeObsTimeLossSelect(value) {
    this.setState({ selectedObsTimeLoss: value });
  }

  changeJiraTicketsSelect(value) {
    this.setState({ selectedJiraTickets: value });
  }

  /** Exposure functions */
  changeInstrumentSelect(value) {
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
    const { taiToUtc } = this.props;
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
            selectedSystem={this.state.selectedSystem}
            changeSystemSelect={(value) => this.changeSystemSelect(value)}
            selectedObsTimeLoss={this.state.selectedObsTimeLoss}
            changeObsTimeLossSelect={(value) => this.changeObsTimeLossSelect(value)}
            selectedJiraTickets={this.state.selectedJiraTickets}
            changeJiraTicketsSelect={(value) => this.changeJiraTicketsSelect(value)}
            taiToUtc={taiToUtc}
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

      const instrumentsArray = Object.keys(registryMap);

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
            <Button className={styles.btn} onClick={() => this.setState(() => ({ clickNewLog: true }))}>
              + New {tabs.filter((tab) => tab.value === selectedTab)[0].name.slice(0, -1)}
            </Button>
          </div>
        </div>
        <div className={styles.tableWrapper}>{this.getComponent(this.state.clickNewLog, selectedTab)}</div>
      </div>
    );
  }
}
