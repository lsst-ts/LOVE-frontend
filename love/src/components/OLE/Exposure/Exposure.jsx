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

import React, { useMemo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { CSVLink } from 'react-csv';
import AddIcon from 'components/icons/AddIcon/AddIcon';
import FlagIcon from 'components/icons/FlagIcon/FlagIcon';
import AcknowledgeIcon from 'components/icons/Watcher/AcknowledgeIcon/AcknowledgeIcon';
import DownloadIcon from 'components/icons/DownloadIcon/DownloadIcon';
import SpinnerIcon from 'components/icons/SpinnerIcon/SpinnerIcon';
import ClipIcon from 'components/icons/ClipIcon/ClipIcon';
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

const MODES = {
  VIEW: 'view',
  ADD: 'add',
  DEFAULT: 'default',
};

const exportedCsvParams = [
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

function renderDateTimeInput(props) {
  return <input {...props} readOnly />;
}

function Exposure({
  instruments: instrumentsOptions = [],
  selectedInstrument,
  selectedDayExposureStart,
  selectedDayExposureEnd,
  selectedExposureType,
  registryMap,
  changeInstrumentSelect,
  changeDayExposure,
  changeExposureTypeSelect,
}) {
  const [mode, setMode] = useState(MODES.DEFAULT);
  const [updatingExposures, setUpdatingExposures] = useState(false);
  const [updatingLogs, setUpdatingLogs] = useState(false);
  const [lastUpdated, setLastUpdated] = useState();
  const [exposures, setExposures] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedExposure, setSelectedExposure] = useState();

  const bothSelectedDays = Boolean(selectedDayExposureStart && selectedDayExposureEnd);

  const exposureTypeOptions = useMemo(() => {
    const types = new Set();
    exposures.forEach((exposure) => {
      types.add(exposure.observation_type);
    });

    return [
      { label: 'All observation types', value: 'all' },
      ...Array.from(types).map((type) => ({ label: type, value: type })),
    ];
  }, [exposures]);

  const [exposureMessages, exposureFlagCount] = useMemo(() => {
    const exposureMessages = {};
    const exposureFlagCount = {};
    messages.forEach((message) => {
      // Get exposureMessages per exposure
      if (!exposureMessages[message.obs_id]) {
        exposureMessages[message.obs_id] = [];
      }
      exposureMessages[message.obs_id].push(message);

      // Get exposure flag count per exposure
      if (!exposureFlagCount[message.obs_id]) {
        exposureFlagCount[message.obs_id] = {};
      }
      if (!exposureFlagCount[message.obs_id][message.exposure_flag]) {
        exposureFlagCount[message.obs_id][message.exposure_flag] = 0;
      }
      exposureFlagCount[message.obs_id][message.exposure_flag]++;
    });
    return [exposureMessages, exposureFlagCount];
  }, [messages]);

  // Helper functions to manage the state and actions related to exposure logs
  const view = (exposure) => {
    if (exposure) {
      setUpdatingLogs(true);
      setMode(MODES.VIEW);
      setSelectedExposure(exposure);
      ManagerInterface.getListMessagesExposureLogs(exposure['obs_id'])
        .then((data) => {
          setMessages(data);
        })
        .finally(() => {
          setUpdatingLogs(false);
        });
    }
  };

  const add = (exposure) => {
    if (exposure) {
      setMode(MODES.ADD);
      setSelectedExposure(exposure);
    }
  };

  // Define functions to query exposure logs
  const queryExposures = () => {
    const startObsDay = Moment(selectedDayExposureStart).format(ISO_INTEGER_DATE_FORMAT);
    const endObsDay = Moment(selectedDayExposureEnd).add(1, 'days').format(ISO_INTEGER_DATE_FORMAT);
    const registry = registryMap[selectedInstrument].split('_')[2];

    // Get the list of exposures
    setUpdatingExposures(true);
    ManagerInterface.getListExposureLogs(selectedInstrument, startObsDay, endObsDay, registry)
      .then((exposures) => {
        setExposures(exposures);

        setUpdatingLogs(true);
        // Get the list of messages and retrieve exposure flags and last message per exposure
        ManagerInterface.getListAllMessagesExposureLogs(startObsDay, endObsDay)
          .then((messages) => {
            setMessages(messages);
          })
          .finally(() => {
            setUpdatingLogs(false);
          });

        setLastUpdated(moment());
      })
      .finally(() => {
        setUpdatingExposures(false);
      });
  };

  const setExposureLogsQueryInterval = () => {
    return setInterval(() => {
      queryExposures();
    }, LOG_REFRESH_INTERVAL_MS);
  };

  // Set up interval to periodically query exposure logs
  useEffect(() => {
    if (selectedInstrument && bothSelectedDays) {
      queryExposures();
      const intervalId = setExposureLogsQueryInterval();
      return () => clearInterval(intervalId);
    }
  }, [selectedInstrument, selectedDayExposureStart, selectedDayExposureEnd]);

  // Get filtered data
  const filteredData = useMemo(() => {
    let filteredData = [...exposures];

    // Filter by exposure type
    if (selectedExposureType !== 'all') {
      filteredData = filteredData.filter((exp) => exp.observation_type === selectedExposureType);
    }

    return filteredData;
  }, [exposures, selectedExposureType]);

  // Obtain headers and parsed data to create csv report
  const parseCsvData = (data) => {
    return data.map((row) => {
      const exposureLength = Moment(row.timespan_end).diff(Moment(row.timespan_begin), 'seconds', true);
      return {
        ...row,
        seconds_length: exposureLength,
      };
    });
  };

  const csvHeaders = filteredData.length > 0 ? exportedCsvParams.map((key) => ({ label: key, key })) : [];
  const csvData =
    filteredData.length > 0 ? parseCsvData(filteredData) : 'There are no exposures found by the current search...';
  const csvTitle = bothSelectedDays
    ? `exposures_obsday_${Moment(selectedDayExposureStart).format(ISO_INTEGER_DATE_FORMAT)}_to_${Moment(
        selectedDayExposureEnd,
      ).format(ISO_INTEGER_DATE_FORMAT)}.csv`
    : 'exposures.csv';

  // Get the messages for the selected exposure
  const selectedExposureMessages = selectedExposure ? exposureMessages[selectedExposure.obs_id] : [];

  const headers = [
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
        const flags = exposureFlagCount[value];
        // Render object
        if (flags) {
          return (
            <div className={styles.flags}>
              {Object.keys(flags).map((flag) => {
                const statusFlag = exposureFlagStateToStyle[flag] ?? 'unknown';
                return (
                  <span key={flag}>
                    <FlagIcon title={flag} status={statusFlag} className={styles.iconFlag} />{' '}
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
        const lastMessage = exposureMessages[value]?.[0];
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
          <div className={styles.actionButtons}>
            <Button
              className={styles.iconBtn}
              title="View"
              onClick={() => {
                view(index);
              }}
              status="transparent"
              disabled={updatingLogs}
            >
              <AcknowledgeIcon className={styles.icon} />
            </Button>
            <Button
              className={styles.iconBtn}
              title="Add"
              onClick={() => {
                add(index);
              }}
              status="transparent"
            >
              <AddIcon className={styles.icon} />
            </Button>
          </div>
        );
      },
    },
  ];

  if (mode === MODES.VIEW) {
    return (
      <ExposureDetail
        key={selectedExposure?.obs_id}
        exposure={selectedExposure}
        logMessages={selectedExposureMessages}
        back={() => {
          setMode(MODES.DEFAULT);
          queryExposures();
        }}
        add={() => {
          add(selectedExposure);
        }}
      />
    );
  }

  if (mode === MODES.ADD) {
    return (
      <ExposureAdd
        key={selectedExposure?.obs_id}
        exposure={selectedExposure}
        back={() => {
          setMode(MODES.DEFAULT);
          queryExposures();
        }}
        view={() => {
          view(selectedExposure);
        }}
        isLogCreate={true}
      />
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <Button disabled={updatingExposures} onClick={queryExposures}>
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
        Last updated: {lastUpdated ? lastUpdated.format(TIME_FORMAT) : ''}
        {updatingExposures && <SpinnerIcon className={styles.spinnerIcon} />}
      </div>
      <OrderableTable className={styles.table} headers={headers} data={filteredData} />
    </div>
  );
}

Exposure.propTypes = {
  /** List of available instruments to select */
  instruments: PropTypes.arrayOf(PropTypes.string),
  /** Selected instrument */
  selectedInstrument: PropTypes.string,
  /** Selected observing day start */
  selectedDayExposureStart: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
    PropTypes.instanceOf(Moment),
  ]),
  /** Selected observing day end */
  selectedDayExposureEnd: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
    PropTypes.instanceOf(Moment),
  ]),
  /** Selected exposure type */
  selectedExposureType: PropTypes.string,
  /** Mappings of instruments to exposures registries */
  registryMap: PropTypes.object,
  /** Function to handle instrument filter */
  changeInstrumentSelect: PropTypes.func.isRequired,
  /** Function to handle observing day filter */
  changeDayExposure: PropTypes.func.isRequired,
  /** Function to handle exposure type filter */
  changeExposureTypeSelect: PropTypes.func.isRequired,
};

export default Exposure;
