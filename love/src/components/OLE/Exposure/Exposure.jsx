import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import AddIcon from 'components/icons/AddIcon/AddIcon';
import FlagIcon from 'components/icons/FlagIcon/FlagIcon';
import AcknowledgeIcon from 'components/icons/Watcher/AcknowledgeIcon/AcknowledgeIcon';
import SimpleTable from 'components/GeneralPurpose/SimpleTable/SimpleTable';
import Button from 'components/GeneralPurpose/Button/Button';
import Select from 'components/GeneralPurpose/Select/Select';
import DateTimeRange from 'components/GeneralPurpose/DateTimeRange/DateTimeRange';
import ManagerInterface from 'Utils';
import ExposureAdd from './ExposureAdd';
import ExposureDetail from './ExposureDetail';
import styles from './Exposure.module.css';

const moment = extendMoment(Moment);

export default class Exposure extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      modeView: false,
      modeAdd: false,
      selected: {},
      selectedMessages: [],
      selectedInstrument: null,
      selectedDateStart: null,
      selectedDateEnd: null,
      selectedExposureType: 'All',
      exposurelogs: [],
      instruments: [],
      exposureTypes: [],
      observationIds: [],
    };
  }

  handleDateTimeRange(date, type) {
    if (type === 'start') {
      this.setState({ selectedDateStart: date });
    } else if (type === 'end') {
      this.setState({ selectedDateEnd: date });
    }
  }

  view(index) {
    console.log('view', index);
    if (index) {
      /* ManagerInterface.getRetrieveMessageExposureLogs(index['id']).then((data) => {
        console.log('getRetrieveMessageExposureLogs data:', data);
        this.setState({
          modeView: true,
          selected: data,
        });
      }); */

      ManagerInterface.getListMessagesExposureLogs(index['obs_id']).then((data) => {
        console.log('getListMessagesExposureLogs(', index['obs_id'], ') => data:', data);
        this.setState({
          modeView: true,
          selected: index,
          selectedMessages: data,
        });
      });
    }
  }

  add(index) {
    if (index) {
      this.setState({
        modeAdd: true,
        selected: index,
      });
    }
  }

  statusFlag(flag) {
    const result = {
      none: 'ok',
      junk: 'warning',
      questionable: 'alert',
    };
    return result[flag] ? result[flag] : 'unknown';
  }

  getHeaders = () => {
    return [
      {
        field: 'obs_id',
        title: 'Observation Id',
        type: 'string',
        className: styles.tableHead,
      },
      {
        field: 'timespan_end',
        title: 'Date & Time (TAI)',
        type: 'timestamp',
        className: styles.tableHead,
      },
      {
        field: 'instrument',
        title: 'Instrument',
        type: 'string',
        className: styles.tableHead,
      },
      {
        field: 'observation_type',
        title: 'Observation Type',
        type: 'string',
        className: styles.tableHead,
      },
      {
        field: 'flags',
        title: 'Flags',
        type: 'string',
        className: styles.tableHead,
        render: (value, row) => {
          const values = String(value).split(',');
          return values.map((val) => {
            return (
              <span>
                <FlagIcon title={val} status={this.statusFlag(val)} className={styles.iconFlag} />
              </span>
            );
          });
        },
      },
      {
        field: 'action',
        title: 'Action',
        type: 'string',
        className: styles.tableHead,
        render: (_, index) => {
          return (
            <>
              <span className={styles.margin}>
                <Button
                  className={styles.iconBtn}
                  title="View"
                  onClick={() => {
                    this.view(index);
                  }}
                  status="transparent"
                >
                  <AcknowledgeIcon className={styles.icon} />
                </Button>
              </span>
              <span className={styles.margin}>
                <Button
                  className={styles.iconBtn}
                  title="Add"
                  onClick={() => {
                    this.add(index);
                  }}
                  status="transparent"
                >
                  <AddIcon className={styles.icon} />
                </Button>
              </span>
            </>
          );
        },
      },
    ];
  };

  componentDidMount() {
    console.log('componentDidMount');
    ManagerInterface.getListExposureInstruments().then((data) => {
      const instrumentsArray = Object.values(data).map((arr) => arr[0]);
      this.setState({ instruments: instrumentsArray, selectedInstrument: instrumentsArray[0] });
      console.log('instruments', instrumentsArray);
    });
    //
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedInstrument !== this.state.selectedInstrument) {
      console.log('QUERY EXPOSURES...');
      ManagerInterface.getListExposureLogs(this.state.selectedInstrument).then((data) => {
        const exposureTypes = new Set();
        const exposures = data.map((exposure) => {
          exposureTypes.add(exposure.observation_type);
          /* ManagerInterface.getListMessagesExposureLogs(exposure['obs_id']).then((messages) => {
              const flags = messages.map((message) => message['exposure_flag']);
              // const flags = ["none","junk"];
              exposure['flags'] = flags;
              return exposure;
            }); */
          return exposure;
        });
        this.setState({ exposurelogs: exposures, exposureTypes: Array.from(exposureTypes) });
      });
    }
  }

  render() {
    const modeView = this.state.modeView;
    const modeAdd = this.state.modeAdd;
    const headers = this.getHeaders();

    const tableData = this.state.exposurelogs;
    const instrumentsOptions = this.state.instruments;
    const selectedInstrument = this.state.selectedInstrument;
    const exposureTypeOptions = [
      { label: 'All observation types', value: 'All' },
      ...this.state.exposureTypes.map((type) => ({ label: type, value: type })),
    ];
    const selectedExposureType = this.state.selectedExposureType;

    // Filter by date range
    const range = moment.range(this.state.selectedDateStart, this.state.selectedDateEnd);
    let filteredData = tableData.filter((log) => range.contains(Moment(log.timespan_end)));

    // Filter by exposure type
    filteredData =
      selectedExposureType !== 'All'
        ? filteredData.filter((exp) => exp.observation_type === selectedExposureType)
        : filteredData;

    return modeView && !modeAdd ? (
      <ExposureDetail
        back={() => {
          this.setState({ modeView: false });
        }}
        logDetail={this.state.selected}
        logMessages={this.state.selectedMessages}
      />
    ) : modeAdd && !modeView ? (
      <ExposureAdd
        back={() => {
          this.setState({ modeAdd: false });
        }}
        logEdit={this.state.selected}
      />
    ) : (
      <div className={styles.margin10}>
        <div className={styles.title}>Filter</div>
        <div className={styles.filters}>
          <Select
            options={instrumentsOptions}
            option={selectedInstrument}
            onChange={({ value }) => this.setState({ selectedInstrument: value })}
            className={styles.select}
          />

          <DateTimeRange
            onChange={(date, type) => this.handleDateTimeRange(date, type)}
            label="Date & Time"
            startDate={new Date() - 24 * 30 * 5 * 60 * 60 * 1000}
            endDate={new Date(Date.now())}
          />

          <Select
            options={exposureTypeOptions}
            option={selectedExposureType}
            onChange={({ value }) => this.setState({ selectedExposureType: value })}
            className={styles.select}
          />
        </div>
        <SimpleTable headers={headers} data={filteredData} />
      </div>
    );
  }
}
