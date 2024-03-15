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
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { CSVLink } from 'react-csv';
import AddIcon from 'components/icons/AddIcon/AddIcon';
import FlagIcon from 'components/icons/FlagIcon/FlagIcon';
import AcknowledgeIcon from 'components/icons/Watcher/AcknowledgeIcon/AcknowledgeIcon';
import DownloadIcon from 'components/icons/DownloadIcon/DownloadIcon';
import SpinnerIcon from 'components/icons/SpinnerIcon/SpinnerIcon';
import OrderableTable from 'components/GeneralPurpose/OrderableTable/OrderableTable';
import Button from 'components/GeneralPurpose/Button/Button';
import Select from 'components/GeneralPurpose/Select/Select';
import DateTimeRange from 'components/GeneralPurpose/DateTimeRange/DateTimeRange';
import Hoverable from 'components/GeneralPurpose/Hoverable/Hoverable';
import {
  exposureFlagStateToStyle,
  TIME_FORMAT,
  ISO_INTEGER_DATE_FORMAT,
  LOG_REFRESH_INTERVAL_MS,
  SORT_ASCENDING,
} from 'Config';
import ManagerInterface, { getFilesURLs, jiraMarkdownToHtml } from 'Utils';
import ExposureAdd from './ExposureAdd';
import ExposureDetail from './ExposureDetail';
import styles from './Exposure.module.css';

const moment = extendMoment(Moment);

export default class Exposure extends Component {
  static propTypes = {
    /** List of instruments */
    instruments: PropTypes.arrayOf(PropTypes.string),
    /**
     * Selected instrument
     * Used to build the query to the exposure logs
     */
    selectedInstrument: PropTypes.string,
    /**
     * Selected observation day start
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
    /**
     * Selected exposure type
     */
    selectedExposureType: PropTypes.string,
    /**
     * Mappings of instruments to exposures registries
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
      updatingExposures: false,
      updatingLogs: false,
      lastUpdated: null,
      selected: {},
      selectedMessages: [],
      exposurelogs: [],
      exposureTypes: [],
      observationIds: [],
      messages: [],
      exposureFlags: {},
      lastMessages: {},
    };

    this.queryExposuresInterval = null;
  }

  /**
   * Function to view an exposure
   * The list of messages associated to the selected exposure
   * is retrieved from the server
   * and parameters to change the view mode are set
   * @param {Object} exposure
   */
  view(exposure) {
    this.setState({ updatingLogs: true });
    if (exposure) {
      ManagerInterface.getListMessagesExposureLogs(exposure['obs_id']).then((data) => {
        this.setState({
          modeView: true,
          modeAdd: false,
          selected: exposure,
          selectedMessages: data,
          updatingLogs: false,
        });
      });
    }
  }

  /**
   * Function to add a log to an exposure
   * Parameters to change the view mode are set
   * @param {Object} exposure
   */
  add(exposure) {
    if (exposure) {
      this.setState({
        modeAdd: true,
        modeView: false,
        selected: exposure,
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
        sort: (row1, row2, sortingColumn, sortingDirection) => {
          const start1 = Moment(row1['timespan_begin']);
          const start2 = Moment(row2['timespan_begin']);
          const end1 = Moment(row1['timespan_end']);
          const end2 = Moment(row2['timespan_end']);
          const duration1 = end1.diff(start1, 'seconds', true);
          const duration2 = end2.diff(start2, 'seconds', true);
          return sortingDirection === SORT_ASCENDING ? duration1 - duration2 : duration2 - duration1;
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
        field: 'obs_id',
        title: 'Last Message',
        type: 'string',
        className: styles.tableHead,
        render: (value) => {
          const lastMessage = this.state.lastMessages[value];
          const parsedValue = jiraMarkdownToHtml(lastMessage?.message_text);
          const files = getFilesURLs(lastMessage?.urls);
          return (
            <>
              <div
                className={['ql-editor', styles.wikiMarkupText].join(' ')}
                dangerouslySetInnerHTML={{ __html: parsedValue }}
              />
              {files.length > 0 && (
                <h3>
                  Attachments:{' '}
                  {files.map((file, index) => {
                    return (
                      <a key={index} target="_blank" href={file} title={file}>
                        <ClipIcon className={styles.attachmentIcon} />
                      </a>
                    );
                  })}
                </h3>
              )}
            </>
          );
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
                  disabled={this.state.updatingLogs}
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

  queryExposures() {
    const { selectedInstrument, selectedDayExposureStart, selectedDayExposureEnd, registryMap } = this.props;
    const startObsDay = Moment(selectedDayExposureStart).format(ISO_INTEGER_DATE_FORMAT);
    const endObsDay = Moment(selectedDayExposureEnd).add(1, 'days').format(ISO_INTEGER_DATE_FORMAT);
    const registry = registryMap[selectedInstrument].split('_')[2];

    // Get the list of exposures
    this.setState({ updatingExposures: true });
    ManagerInterface.getListExposureLogs(selectedInstrument, startObsDay, endObsDay, registry).then((data) => {
      const exposureTypes = new Set();
      const exposures = data.map((exposure) => {
        exposureTypes.add(exposure.observation_type);
        return exposure;
      });

      // Get the list of messages and retrieve exposure flags and last message per exposure
      ManagerInterface.getListAllMessagesExposureLogs(startObsDay, endObsDay).then((messages) => {
        const exposureFlags = {};
        const lastMessages = {};
        messages?.forEach((message) => {
          // Get exposure flags per exposure
          if (!exposureFlags[message.obs_id]) {
            exposureFlags[message.obs_id] = {};
          }
          if (exposureFlags[message.obs_id]?.[message.exposure_flag]) {
            exposureFlags[message.obs_id][message.exposure_flag]++;
          } else {
            exposureFlags[message.obs_id][message.exposure_flag] = 1;
          }

          // Get last message per exposure
          if (!lastMessages[message.obs_id]) {
            lastMessages[message.obs_id] = message;
          } else {
            if (Moment(message.timestamp).isAfter(lastMessages[message.obs_id].timestamp)) {
              lastMessages[message.obs_id] = message;
            }
          }
        });

        this.setState({ exposureFlags, lastMessages, messages });
      });

      this.setState({
        exposurelogs: exposures,
        exposureTypes: Array.from(exposureTypes),
        updatingExposures: false,
        updatingLogs: false,
        lastUpdated: moment(),
      });
    });
  }

  parseCsvData(data) {
    const csvData = data.map((row) => {
      const exposureLength = Moment(row.timespan_end).diff(Moment(row.timespan_begin), 'seconds', true);
      return {
        ...row,
        seconds_length: exposureLength,
      };
    });
    return csvData;
  }

  setQueryExposuresInterval() {
    this.queryExposuresInterval = setInterval(() => {
      this.queryExposures();
    }, LOG_REFRESH_INTERVAL_MS);
  }

  componentDidMount() {
    const { selectedInstrument } = this.props;
    if (selectedInstrument) {
      this.queryExposures();
      this.setQueryExposuresInterval();
    }
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
      if (!this.queryExposuresInterval) {
        this.setQueryExposuresInterval();
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.queryExposuresInterval);
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
    const { exposurelogs: tableData, modeView, modeAdd, updatingExposures } = this.state;

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
      const exportedParams = [
        'obs_id',
        'instrument',
        'observation_type',
        'observation_reason',
        'day_obs',
        'seq_num',
        'group_name',
        'target_name',
        'science_program',
        'tracking_ra',
        'tracking_dec',
        'sky_angle',
        'timespan_begin',
        'seconds_length',
      ];
      csvHeaders = exportedParams.map((key) => ({ label: key, key }));
      csvData = this.parseCsvData(filteredData);
    }

    if (selectedDayExposureStart && selectedDayExposureEnd) {
      csvTitle = `exposures_obsday_${Moment(selectedDayExposureStart).format(ISO_INTEGER_DATE_FORMAT)}_to_${Moment(
        selectedDayExposureEnd,
      ).format(ISO_INTEGER_DATE_FORMAT)}.csv`;
    }

    if (modeView && !modeAdd) {
      return (
        <ExposureDetail
          back={() => {
            this.setState({ modeView: false });
          }}
          logDetail={this.state.selected}
          logMessages={this.state.selectedMessages}
          handleAddLog={() => {
            this.add(this.state.selected);
          }}
        />
      );
    }

    if (!modeView && modeAdd) {
      return (
        <ExposureAdd
          back={() => {
            this.setState({ modeAdd: false });
          }}
          exposure={this.state.selected}
          view={() => {
            this.view(this.state.selected);
          }}
          isLogCreate={true}
        />
      );
    }

    const renderDateTimeInput = (props) => {
      return <input {...props} readOnly />;
    };

    return (
      <div className={styles.container}>
        <div className={styles.filters}>
          <Button disabled={updatingExposures} onClick={() => this.queryExposures()}>
            Refresh data
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
              renderInput: renderDateTimeInput,
            }}
            endDateProps={{
              timeFormat: false,
              className: styles.rangeDateOnly,
              maxDate: Moment(),
              renderInput: renderDateTimeInput,
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
        <div className={styles.lastUpdated}>
          Last updated: {this.state.lastUpdated ? this.state.lastUpdated.format(TIME_FORMAT) : ''}
          {updatingExposures && <SpinnerIcon className={styles.spinnerIcon} />}
        </div>
        <OrderableTable className={styles.table} headers={headers} data={filteredData} />
      </div>
    );
  }
}
