import React, { Component } from 'react';
import Moment from 'moment';
import PropTypes from 'prop-types';
import ManagerInterface from 'Utils';
import Button from 'components/GeneralPurpose/Button/Button';
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
      selectedDayNarrative: Moment(Date.now() + 37 * 1000),
      selectedCommentType: { value: 'all', label: 'All comment types' },
      selectedSystem: 'all',
      selectedObsTimeLoss: false,
      // Exposure filters
      instruments: [],
      selectedInstrument: null,
      selectedDayExposure: Moment(),
      selectedExposureType: 'all',
    };
  }

  componentDidMount() {
    this.props.subscribeToStreams();
    ManagerInterface.getListExposureInstruments().then((data) => {
      const instrumentsArray = Object.values(data).map((arr) => arr[0]);
      this.setState({ instruments: instrumentsArray, selectedInstrument: instrumentsArray[0] });
    });
  }

  componentWillUnmount() {
    this.props.unsubscribeToStreams();
  }

  changeDayNarrative(day) {
    const dayObs = Moment(day).format('YYYYMMDD');
    this.setState({ selectedDayNarrative: day });
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

  changeInstrumentSelect(value) {
    this.setState({ selectedInstrument: value });
  }

  changeExposureTypeSelect(value) {
    this.setState({ selectedExposureType: value });
  }

  changeDayExposure(day) {
    const dayObs = Moment(day).format('YYYYMMDD');
    this.setState({ selectedDayExposure: day });
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
            props={this.props}
          />
        );
      }
    } else {
      if (tab === 'exposure') {
        return (
          <Exposure
            props={this.props}
            instruments={this.state.instruments}
            selectedInstrument={this.state.selectedInstrument}
            changeInstrumentSelect={(value) => this.changeInstrumentSelect(value)}
            selectedExposureType={this.state.selectedExposureType}
            changeExposureTypeSelect={(value) => this.changeExposureTypeSelect(value)}
            selectedDayExposure={this.state.selectedDayExposure}
            changeDayExposure={(day) => this.changeDayExposure(day)}
          />
        );
      }
      if (tab === 'non-exposure') {
        return (
          <NonExposure
            props={this.props}
            selectedDayNarrative={this.state.selectedDayNarrative}
            changeDayNarrative={(day) => this.changeDayNarrative(day)}
            selectedCommentType={this.state.selectedCommentType}
            changeCommentTypeSelect={(value) => this.changeCommentTypeSelect(value)}
            selectedSystem={this.state.selectedSystem}
            changeSystemSelect={(value) => this.changeSystemSelect(value)}
            selectedObsTimeLoss={this.state.selectedObsTimeLoss}
            changeObsTimeLossSelect={(value) => this.changeObsTimeLossSelect(value)}
          />
        );
      }
    }
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
