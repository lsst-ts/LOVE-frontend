import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { CSVLink } from 'react-csv';
import { exposureFlagStateToStyle, ISO_INTEGER_DATE_FORMAT } from 'Config';
import ManagerInterface from 'Utils';
import AddIcon from 'components/icons/AddIcon/AddIcon';
import FlagIcon from 'components/icons/FlagIcon/FlagIcon';
import AcknowledgeIcon from 'components/icons/Watcher/AcknowledgeIcon/AcknowledgeIcon';
import DownloadIcon from 'components/icons/DownloadIcon/DownloadIcon';
import SpinnerIcon from 'components/icons/SpinnerIcon/SpinnerIcon';
import SimpleTable from 'components/GeneralPurpose/SimpleTable/SimpleTable';
import Button from 'components/GeneralPurpose/Button/Button';
import Select from 'components/GeneralPurpose/Select/Select';
import DateTime from 'components/GeneralPurpose/DateTime/DateTime';
import Hoverable from 'components/GeneralPurpose/Hoverable/Hoverable';
import ExposureAdd from './ExposureAdd';
import ExposureDetail from './ExposureDetail';
import styles from './Exposure.module.css';

const moment = extendMoment(Moment);

export default class Exposure extends Component {
  static propTypes = {
    // Instrument Options
    instruments: PropTypes.arrayOf(PropTypes.string),
    /** Selected observation day */
    selectedDayExposure: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    /** Selected instrument */
    selectedInstrument: PropTypes.string,
    /** Selected exposure type */
    selectedExposureType: PropTypes.string,
    /** Selected type of date filter: range or day */
    selectedDayOrRange: PropTypes.string,
    /** Selected start date */
    selectedDateStart: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    /** Selected end date */
    selectedDateEnd: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    /** Function to handle type of date filter */
    changeDayOrRangeSelect: PropTypes.func,
    /** Function to handle observation day filter*/
    changeDayExposure: PropTypes.func,
    /** Function to handle exposure type filter*/
    changeExposureTypeSelect: PropTypes.func,
    /** Function to handle instrument filter*/
    changeInstrumentSelect: PropTypes.func,
    /** Function to handle date time range filter*/
    handleDateTimeRange: PropTypes.func,
  };

  static defaultProps = {
    instruments: [],
    selectedDayExposure: null,
    selectedExposureType: 'all',
    selectedInstrument: null,
    selectedDateStart: null,
    selectedDateEnd: null,
    selectedDayOrRange: null,
    changeDayOrRangeSelect: () => {},
    changeDayExposure: () => {},
    changeExposureTypeSelect: () => {},
    changeInstrumentSelect: () => {},
    handleDateTimeRange: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      modeView: false,
      modeAdd: false,
      updatingLogs: false,
      selected: {},
      selectedMessages: [],
      exposurelogs: [],
      exposureTypes: [],
      observationIds: [],
      messages: [],
      range: [],
      exposureFlags: {},
    };
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
    return exposureFlagStateToStyle[flag] ? exposureFlagStateToStyle[flag] : 'unknown';
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
        field: 'day_obs',
        title: 'Day Observation',
        type: 'string',
        className: styles.tableHead,
      },
      {
        field: 'timespan_end',
        title: 'Date & Time (UTC)',
        type: 'timestamp',
        className: styles.tableHead,
        render: (value) => value.split('.')[0],
      },
      {
        field: 'duration',
        title: 'Duration (sec)',
        type: 'timestamp',
        className: styles.tableHead,
        render: (_, row) => {
          const start = Moment(row['timespan_begin']);
          const end = Moment(row['timespan_end']);
          const duration_s = end.diff(start, 'seconds', true);
          return duration_s.toFixed(2);
        },
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
        field: 'obs_id',
        title: 'Flags',
        type: 'string',
        className: styles.tableHead,
        render: (value, _) => {
          const flags = this.state.exposureFlags[value];
          // Render object
          if (flags) {
            return (
              <div className={styles.flags}>
                {Object.keys(flags).map((flag) => {
                  return (
                    <span key={flag}>
                      <FlagIcon title={flag} status={this.statusFlag(flag)} className={styles.iconFlag} />{' '}
                      <span className={styles.badge}>{flags[flag]}</span>
                    </span>
                  );
                })}
              </div>
            );
          } else {
            return null;
          }
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

  queryExposures(callback) {
    const { selectedInstrument, selectedDayExposure } = this.props;
    const obsDayInteger = parseInt(moment(selectedDayExposure).format(ISO_INTEGER_DATE_FORMAT));
    ManagerInterface.getListExposureLogs(selectedInstrument, obsDayInteger).then((data) => {
      const exposureTypes = new Set();
      const exposures = data.map((exposure) => {
        exposureTypes.add(exposure.observation_type);
        return exposure;
      });

      ManagerInterface.getListAllMessagesExposureLogs(obsDayInteger).then((messages) => {
        const exposureFlags = {};
        messages.forEach((message) => {
          if (!exposureFlags[message.obs_id]) {
            exposureFlags[message.obs_id] = {};
          }
          if (exposureFlags[message.obs_id]?.[message.exposure_flag]) {
            exposureFlags[message.obs_id][message.exposure_flag]++;
          } else {
            exposureFlags[message.obs_id][message.exposure_flag] = 1;
          }
        });

        this.setState({ exposureFlags, messages});
      });

      this.setState({ exposurelogs: exposures, exposureTypes: Array.from(exposureTypes) });
      if (callback) callback();
    });
  }

  componentDidMount() {
    const { selectedDateStart, selectedDateEnd } = this.props;
    this.setState({ range: moment.range(selectedDateStart, selectedDateEnd) });
    this.queryExposures();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.selectedInstrument !== this.props.selectedInstrument || prevProps.selectedDayExposure !== this.props.selectedDayExposure) {
      this.queryExposures();
    }

    if (
      prevProps.selectedDateStart !== this.props.selectedDateStart ||
      prevProps.selectedDateEnd !== this.props.selectedDateEnd
    ) {
      this.setState({ range: moment.range(this.props.selectedDateStart, this.props.selectedDateEnd) });
    }
  }

  render() {
    const {
      instruments:instrumentsOptions, selectedInstrument, selectedDayOrRange, selectedDayExposure,
      selectedExposureType, changeDayExposure, changeExposureTypeSelect, changeInstrumentSelect,
      handleDateTimeRange,
    } = this.props;
    const { exposurelogs:tableData, modeView, modeAdd, range } = this.state;

    const headers = this.getHeaders();
    
    const exposureTypeOptions = [
      { label: 'All observation types', value: 'all' },
      ...this.state.exposureTypes.map((type) => ({ label: type, value: type })),
    ];
    const dayOrRangeExposureOptions = [
      { label: 'Day Observation', value: 'day' },
      { label: 'Range', value: 'range' },
    ];

    // Filter by date range
    let filteredData = tableData;

    if (selectedDayOrRange === 'range') {
      filteredData = filteredData.filter((log) => range.contains(Moment(log.timespan_end)));
    }

    if (selectedDayOrRange === 'day') {
      filteredData = filteredData.filter((log) => {
        const format = Moment(selectedDayExposure).format('YYYYMMDD');
        return format === String(log.day_obs);
      });
    }

    // Filter by exposure type
    filteredData =
      selectedExposureType !== 'all'
        ? filteredData.filter((exp) => exp.observation_type === selectedExposureType)
        : filteredData;

    
    // Obtain headers to create csv report
    let csvHeaders = null;
    let csvData =  "There aren't logs created for the current search...";
    if (this.state.messages.length > 0) {
      const logExampleKeys = Object.keys(this.state.messages?.[0] ?? {});
      csvHeaders = logExampleKeys.map((key) => ({ label: key, key }));
      csvData = this.state.messages;
    }

    return modeView && !modeAdd ? (
      <ExposureDetail
        back={() => {
          this.setState({ modeView: false });
        }}
        logDetail={this.state.selected}
        logMessages={this.state.selectedMessages}
        edit={(isClicked) => {
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
          this.view(this.state.selected);
        }}
      />
    ) : (
      <div className={styles.margin10}>
        <div className={styles.title}>Filter</div>
        <div className={styles.filters}>
          <Button
            disabled={this.state.updatingLogs}
            onClick={() => {
              this.setState({ updatingLogs: true });
              this.queryExposures(() => {
                this.setState({ updatingLogs: false });
              });
            }}
          >
            Refresh data
            {this.state.updatingLogs && <SpinnerIcon className={styles.spinnerIcon}/>}
          </Button>
          <Select
            options={instrumentsOptions}
            option={selectedInstrument}
            onChange={({ value }) => changeInstrumentSelect(value)}
            className={styles.select}
          />

          <DateTime
            label="Observation day"
            value={selectedDayExposure}
            onChange={(day) => changeDayExposure(day)}
            dateFormat="YYYY/MM/DD"
            timeFormat={false}
            closeOnSelect={true}
          />

          <Select
            options={exposureTypeOptions}
            option={selectedExposureType}
            onChange={({ value }) => changeExposureTypeSelect(value)}
            className={styles.select}
          />
          <div className={styles.divExportBtn}>
            <CSVLink data={csvData} headers={csvHeaders} filename="exposureLogMessages.csv">
              <Hoverable top={true} left={true} center={true} inside={true}>
                <span className={styles.infoIcon}>
                  <DownloadIcon className={styles.iconCSV} />
                </span>
                <div className={styles.hover}>Download messages associated with the shown exposures</div>
              </Hoverable>
            </CSVLink>
          </div>
        </div>
        <SimpleTable headers={headers} data={filteredData} />
      </div>
    );
  }
}
