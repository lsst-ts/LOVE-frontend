import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { CSVLink } from 'react-csv';
import { exposureFlagStateToStyle } from 'Config';
import ManagerInterface from 'Utils';
import AddIcon from 'components/icons/AddIcon/AddIcon';
import FlagIcon from 'components/icons/FlagIcon/FlagIcon';
import AcknowledgeIcon from 'components/icons/Watcher/AcknowledgeIcon/AcknowledgeIcon';
import DownloadIcon from 'components/icons/DownloadIcon/DownloadIcon';
import SimpleTable from 'components/GeneralPurpose/SimpleTable/SimpleTable';
import Button from 'components/GeneralPurpose/Button/Button';
import Select from 'components/GeneralPurpose/Select/Select';
import DateTimeRange from 'components/GeneralPurpose/DateTimeRange/DateTimeRange';
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
                    <>
                      <FlagIcon title={flag} status={this.statusFlag(flag)} className={styles.iconFlag} />{' '}
                      <span className={styles.badge}>{flags[flag]}</span>
                    </>
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
    const { selectedInstrument,  } = this.props;
    ManagerInterface.getListExposureLogs(selectedInstrument).then((data) => {
      const exposureTypes = new Set();
      const exposures = data.slice(0,10).map((exposure) => {
        exposureTypes.add(exposure.observation_type);

        ManagerInterface.getListMessagesExposureLogs(exposure['obs_id']).then((messages) => {
          const flags = messages
            .map((message) => message['exposure_flag'])
            .reduce((acc, curr) => {
              if (curr in acc) acc[curr]++;
              else acc[curr] = 1;
              return acc;
            }, {});

          this.setState((prevState) => ({
            exposureFlags: { ...prevState.exposureFlags, [exposure['obs_id']]: flags },
            messages: [...prevState.messages, ...messages]
          }));
        });

        return { ...exposure };
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
    if (prevProps.selectedInstrument !== this.props.selectedInstrument) {
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
      selectedExposureType, selectedDateStart, selectedDateEnd,
      changeDayExposure, changeDayOrRangeSelect, changeExposureTypeSelect, changeInstrumentSelect,
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
          </Button>
          <Select
            options={instrumentsOptions}
            option={selectedInstrument}
            onChange={({ value }) => changeInstrumentSelect(value)}
            className={styles.select}
          />

          <Select
            options={dayOrRangeExposureOptions}
            option={selectedDayOrRange}
            onChange={({ value }) => changeDayOrRangeSelect(value)}
            className={styles.select}
          />

          {selectedDayOrRange === 'day' ? (
            <DateTime
              value={selectedDayExposure}
              onChange={(day) => changeDayExposure(day)}
              dateFormat="YYYY/MM/DD"
              timeFormat={false}
              closeOnSelect={true}
            />
          ) : selectedDayOrRange === 'range' ? (
            <DateTimeRange
              onChange={(date, type) => {
                handleDateTimeRange(date, type);
              }}
              label="Date & Time (UTC)"
              startDate={selectedDateStart}
              endDate={selectedDateEnd}
              startDateProps={{ closeOnSelect: true }}
            />
          ) : (
            <></>
          )}

          <Select
            options={exposureTypeOptions}
            option={selectedExposureType}
            onChange={({ value }) => changeExposureTypeSelect(value)}
            className={styles.select}
          />
          <div className={styles.divExportBtn}>
            <CSVLink data={this.state.messages} headers={csvHeaders} filename="exposureLogMessages.csv">
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
