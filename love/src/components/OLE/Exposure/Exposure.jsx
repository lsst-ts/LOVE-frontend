import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import AddIcon from 'components/icons/AddIcon/AddIcon';
import FlagIcon from 'components/icons/FlagIcon/FlagIcon';
import AcknowledgeIcon from 'components/icons/Watcher/AcknowledgeIcon/AcknowledgeIcon';
import DownloadIcon from 'components/icons/DownloadIcon/DownloadIcon';
import SimpleTable from 'components/GeneralPurpose/SimpleTable/SimpleTable';
import Button from 'components/GeneralPurpose/Button/Button';
import Select from 'components/GeneralPurpose/Select/Select';
import DateTimeRange from 'components/GeneralPurpose/DateTimeRange/DateTimeRange';
import Hoverable from 'components/GeneralPurpose/Hoverable/Hoverable';
import { CSVLink } from 'react-csv';
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
      messages: [],
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
    if (index) {
      ManagerInterface.getListMessagesExposureLogs(index['obs_id']).then((data) => {
        this.setState({
          modeView: true,
          modeAdd: false,
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
        modeView: false,
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
    ManagerInterface.getListExposureInstruments().then((data) => {
      const instrumentsArray = Object.values(data).map((arr) => arr[0]);
      this.setState({ instruments: instrumentsArray, selectedInstrument: instrumentsArray[0] });
    });

    ManagerInterface.getListAllMessagesExposureLogs().then((data) => {
      this.setState({ messages: data });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedInstrument !== this.state.selectedInstrument) {
      ManagerInterface.getListExposureLogs(this.state.selectedInstrument).then((data) => {
        const exposureTypes = new Set();
        const exposures = data.map((exposure) => {
          exposureTypes.add(exposure.observation_type);
          // TODO: request for all the obs_id, all messages and only use exposure_flag PENDING: backend with query of flags without query to exposurelogs/messages
          // ManagerInterface.getListMessagesExposureLogs(exposure['obs_id']).then((messages) => {
          //   const flags = messages
          //     .map((message) => message['exposure_flag'])
          //     .reduce((acc, curr) => acc.find((f) => f === curr) ? acc : [...acc, curr], []);
          //   exposure['flags'] = flags;
          //   return exposure;
          // });
          return { ...exposure };
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

    // Obtain headers to create csv report
    const logExample = this.state.messages?.[0];
    const logExampleKeys = Object.keys(logExample ?? {});
    const csvHeaders = logExampleKeys.map((key) => ({ label: key, key }));

    return modeView && !modeAdd ? (
      <ExposureDetail
        back={() => {
          this.setState({ modeView: false });
        }}
        logDetail={this.state.selected}
        logMessages={this.state.selectedMessages}
        edit={(isClicked) => {
          console.log('ExposeDetail.edit', this.state.selected);
          if (isClicked) this.add(this.state.selected);
        }}
      />
    ) : modeAdd && !modeView ? (
      <ExposureAdd
        back={() => {
          this.setState({ modeAdd: false });
        }}
        logEdit={this.state.selected}
        view={(isClicked) => {
          if (isClicked) console.log('ExposeDAdd.view', this.state.selected);
          this.view(this.state.selected);
        }}
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
          <div className={styles.divExportBtn}>
            <CSVLink data={this.state.messages} headers={csvHeaders} filename="exposureLogMessages.csv">
              <Hoverable top={true} left={true} center={true} inside={true}>
                <span className={styles.infoIcon}>
                  <DownloadIcon className={styles.iconCSV} />
                </span>
                <div className={styles.hover}>Download this report as csv file</div>
              </Hoverable>
            </CSVLink>
          </div>
        </div>
        <SimpleTable headers={headers} data={filteredData} />
      </div>
    );
  }
}
