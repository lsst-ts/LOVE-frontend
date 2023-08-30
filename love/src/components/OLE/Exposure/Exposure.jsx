import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { CSVLink } from 'react-csv';
import AddIcon from 'components/icons/AddIcon/AddIcon';
import FlagIcon from 'components/icons/FlagIcon/FlagIcon';
import AcknowledgeIcon from 'components/icons/Watcher/AcknowledgeIcon/AcknowledgeIcon';
import DownloadIcon from 'components/icons/DownloadIcon/DownloadIcon';
import SpinnerIcon from 'components/icons/SpinnerIcon/SpinnerIcon';
import SimpleTable from 'components/GeneralPurpose/SimpleTable/SimpleTable';
import Button from 'components/GeneralPurpose/Button/Button';
import Select from 'components/GeneralPurpose/Select/Select';
import DateTimeRange from 'components/GeneralPurpose/DateTimeRange/DateTimeRange';
import Hoverable from 'components/GeneralPurpose/Hoverable/Hoverable';
import { exposureFlagStateToStyle, ISO_INTEGER_DATE_FORMAT } from 'Config';
import ManagerInterface from 'Utils';
import ExposureAdd from './ExposureAdd';
import ExposureDetail from './ExposureDetail';
import styles from './Exposure.module.css';

const moment = extendMoment(Moment);

export default class Exposure extends Component {
  static propTypes = {
    // Instrument Options
    instruments: PropTypes.arrayOf(PropTypes.string),
    /** Selected instrument
     * Used to build the query to the exposure logs
     */
    selectedInstrument: PropTypes.string,
    /** Selected observation day start
     * Used to build the query to the exposure logs
     */
    selectedDayExposureStart: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
      PropTypes.instanceOf(Moment),
    ]),
    /** Selected observation day end
     * Used to build the query to the exposure logs
     */
    selectedDayExposureEnd: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
      PropTypes.instanceOf(Moment),
    ]),
    /** Selected exposure type */
    selectedExposureType: PropTypes.string,
    /** Mappings of instruments to exposures registries
     * Used to build the query to the exposure logs
     */
    registryMap: PropTypes.object,
    /** Function to handle instrument filter*/
    changeInstrumentSelect: PropTypes.func,
    /** Function to handle observation day filter*/
    changeDayExposure: PropTypes.func,
    /** Function to handle exposure type filter*/
    changeExposureTypeSelect: PropTypes.func,
  };

  static defaultProps = {
    instruments: [],
    selectedInstrument: null,
    selectedDayExposureStart: null,
    selectedDayExposureEnd: null,
    selectedExposureType: 'all',
    registryMap: {},
    changeInstrumentSelect: () => {},
    changeDayExposure: () => {},
    changeExposureTypeSelect: () => {},
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
    const { selectedInstrument, selectedDayExposureStart, selectedDayExposureEnd, registryMap } = this.props;
    const startObsDay = Moment(selectedDayExposureStart).format(ISO_INTEGER_DATE_FORMAT);
    const endObsDay = Moment(selectedDayExposureEnd).add(1, 'days').format(ISO_INTEGER_DATE_FORMAT);
    const registry = registryMap[selectedInstrument].split('_')[2];

    // Get the list of exposures
    this.setState({ updatingLogs: true });
    ManagerInterface.getListExposureLogs(selectedInstrument, startObsDay, endObsDay, registry).then((data) => {
      const exposureTypes = new Set();
      const exposures = data.map((exposure) => {
        exposureTypes.add(exposure.observation_type);
        return exposure;
      });

      // Get the list of messages and retrieve exposure flags
      ManagerInterface.getListAllMessagesExposureLogs(startObsDay, endObsDay).then((messages) => {
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

        this.setState({ exposureFlags, messages });
      });

      this.setState({
        exposurelogs: exposures,
        exposureTypes: Array.from(exposureTypes),
        updatingLogs: false,
      });
    });
  }

  componentDidMount() {
    this.queryExposures();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.selectedInstrument !== this.props.selectedInstrument ||
      (this.props.selectedDayExposureStart &&
        !Moment(this.props.selectedDayExposureStart).isSame(prevProps.selectedDayExposureStart)) ||
      (this.props.selectedDayExposureEnd &&
        !Moment(this.props.selectedDayExposureEnd).isSame(prevProps.selectedDayExposureEnd))
    ) {
      this.queryExposures();
    }
  }

  render() {
    const {
      instruments: instrumentsOptions,
      selectedInstrument,
      selectedDayExposureStart,
      selectedDayExposureEnd,
      selectedExposureType,
      changeInstrumentSelect,
      changeDayExposure,
      changeExposureTypeSelect,
    } = this.props;
    const { exposurelogs: tableData, modeView, modeAdd, updatingLogs } = this.state;

    const headers = this.getHeaders();

    const exposureTypeOptions = [
      { label: 'All observation types', value: 'all' },
      ...this.state.exposureTypes.map((type) => ({ label: type, value: type })),
    ];

    let filteredData = [...tableData];

    // Filter by exposure type
    if (selectedExposureType !== 'all') {
      filteredData = filteredData.filter((exp) => exp.observation_type === selectedExposureType);
    }

    // Obtain headers to create csv report
    let csvHeaders = null;
    let csvData = "There aren't exposures created for the current search...";
    let csvTitle = 'exposure.csv';

    if (filteredData.length > 0) {
      const logExampleKeys = Object.keys(filteredData[0] ?? {});
      csvHeaders = logExampleKeys.map((key) => ({ label: key, key }));
      csvData = filteredData;
    }

    if (selectedDayExposureStart && selectedDayExposureEnd) {
      csvTitle = `exposures_obsday_${Moment(selectedDayExposureStart).format(ISO_INTEGER_DATE_FORMAT)}_to_${Moment(
        selectedDayExposureEnd,
      ).format(ISO_INTEGER_DATE_FORMAT)}.csv`;
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
          <Button disabled={updatingLogs} onClick={() => this.queryExposures()}>
            Refresh data
            {updatingLogs && <SpinnerIcon className={styles.spinnerIcon} />}
          </Button>
          <Select
            options={instrumentsOptions}
            option={selectedInstrument}
            onChange={({ value }) => changeInstrumentSelect(value)}
            className={styles.select}
          />

          <DateTimeRange
            label="From"
            className={styles.dateRange}
            startDate={selectedDayExposureStart}
            endDate={selectedDayExposureEnd}
            startDateProps={{
              timeFormat: false,
              className: styles.rangeDateOnly,
              maxDate: Moment(),
            }}
            endDateProps={{
              timeFormat: false,
              className: styles.rangeDateOnly,
              maxDate: Moment(),
            }}
            onChange={changeDayExposure}
          />

          <Select
            options={exposureTypeOptions}
            option={selectedExposureType}
            onChange={({ value }) => changeExposureTypeSelect(value)}
            className={styles.select}
          />
          <div className={styles.divExportBtn}>
            <CSVLink data={csvData} headers={csvHeaders} filename={csvTitle}>
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
