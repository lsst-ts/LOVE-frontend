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

import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { CSVLink } from 'react-csv';
import OrderableTable from 'components/GeneralPurpose/OrderableTable/OrderableTable';
import Button from 'components/GeneralPurpose/Button/Button';
import Input from 'components/GeneralPurpose/Input/Input';
import DateTimeRange from 'components/GeneralPurpose/DateTimeRange/DateTimeRange';
import Hoverable from 'components/GeneralPurpose/Hoverable/Hoverable';
import ClipIcon from 'components/icons/ClipIcon/ClipIcon';
import DownloadIcon from 'components/icons/DownloadIcon/DownloadIcon';
import EditIcon from 'components/icons/EditIcon/EditIcon';
import AcknowledgeIcon from 'components/icons/Watcher/AcknowledgeIcon/AcknowledgeIcon';
import InfoIcon from 'components/icons/InfoIcon/InfoIcon';
import SpinnerIcon from 'components/icons/SpinnerIcon/SpinnerIcon';
import Select from 'components/GeneralPurpose/Select/Select';
import NonExposureDetail from './NonExposureDetail';
import NonExposureEdit from './NonExposureEdit';
import { getIconLevel } from '../OLE';
import {
  TIME_FORMAT,
  OLE_COMMENT_TYPE_OPTIONS,
  OLE_DEFAULT_SYSTEMS_FILTER_OPTION,
  OLE_OBS_SYSTEMS,
  ISO_INTEGER_DATE_FORMAT,
  ISO_STRING_DATE_TIME_FORMAT,
  LOG_REFRESH_INTERVAL_MS,
} from 'Config';
import ManagerInterface, {
  formatSecondsToDigital,
  parseTaiToUtc,
  getLinkJira,
  getFilesURLs,
  jiraMarkdownToHtml,
  getObsDayFromDate,
  formatOLETimeOfIncident,
  pipe,
  convertJiraTicketNamesToHyperlinks,
} from 'Utils';
import styles from './NonExposure.module.css';

const moment = extendMoment(Moment);

const exportedCsvParams = [
  'obs_day',
  'message_text',
  'level',
  'urls',
  'date_begin',
  'date_end',
  'time_lost',
  'system',
  'user_id',
];

function NonExposure({
  selectedDayNarrativeStart,
  selectedDayNarrativeEnd,
  changeDayNarrative,
  changeCommentTypeSelect,
  changeSystemSelect,
  changeObsTimeLossSelect,
  changeJiraTicketsSelect,
  selectedCommentType,
  selectedSystem,
  taiToUtc,
  selectedObsTimeLoss = false,
  selectedJiraTickets = false,
}) {
  const bothSelectedDays = Boolean(selectedDayNarrativeStart && selectedDayNarrativeEnd);

  const [modeView, setModeView] = useState(false);
  const [modeEdit, setModeEdit] = useState(false);
  const [selectedLog, setSelectedLog] = useState();
  const [updatingLogs, setUpdatingLogs] = useState(false);
  const [lastUpdated, setLastUpdated] = useState();
  const [logs, setLogs] = useState([]);

  const getLevelIcon = (value) => {
    const icon = getIconLevel(value);
    return (
      <span title={value >= 100 ? 'urgent' : 'info'} className={styles.levelIcon}>
        {icon}
      </span>
    );
  };

  const renderDateTimeInput = (props) => {
    return <input {...props} readOnly />;
  };

  const viewLog = (log) => {
    setModeView(true);
    setSelectedLog(log);
  };

  const editLog = (log) => {
    setModeEdit(true);
    setSelectedLog(log);
  };

  const removeLog = (log) => {
    setLogs((prevLogs) => prevLogs.filter((prevLog) => prevLog.id !== log.id));
  };

  const addLog = (log) => {
    setLogs((prevLogs) => [log, ...prevLogs.filter((prevLog) => prevLog.id !== log.id)]);
    setSelectedLog(log);
  };

  const getHeaders = () => {
    return [
      {
        field: 'date_begin',
        title: 'Time of incident (UTC)',
        type: 'string',
        className: styles.tableHead,
        render: (value) => parseTaiToUtc(value, taiToUtc).format(ISO_STRING_DATE_TIME_FORMAT),
      },
      {
        field: 'time_lost',
        title: 'Obs. Time Loss',
        type: 'string',
        className: styles.tableHead,
        render: (value, row) => {
          const dateBeginUTC = parseTaiToUtc(row.date_begin, taiToUtc);
          const dateEndUTC = parseTaiToUtc(row.date_end, taiToUtc);
          const dateBeginUTCString = dateBeginUTC.format(ISO_STRING_DATE_TIME_FORMAT);
          const dateEndUTCString = dateEndUTC.format(ISO_STRING_DATE_TIME_FORMAT);
          return (
            <span title={formatOLETimeOfIncident(dateBeginUTCString, dateEndUTCString) + ' (UTC)'}>
              {formatSecondsToDigital(value * 3600)}
            </span>
          );
        },
      },
      {
        field: 'date_begin',
        title: (
          <div className={styles.obsDayTableHeader}>
            <span>Obs Day</span>
            <div className={styles.infoIcon}>
              <InfoIcon
                title="This is a calculated field based on the time of the incident set by the user.
              Constrained from 12 UTC of a day to 12 UTC of the next one."
              />
            </div>
          </div>
        ),
        type: 'string',
        className: styles.tableHead,
        render: (value) => getObsDayFromDate(parseTaiToUtc(value, taiToUtc)),
      },
      {
        field: 'level',
        title: 'Level',
        type: 'string',
        className: styles.tableHead,
        render: (value) => getLevelIcon(value),
      },
      {
        field: 'components_json',
        title: 'System',
        type: 'string',
        className: styles.tableHead,
        render: (value) => {
          const system = value?.name ?? '';
          return system;
        },
      },
      {
        field: 'message_text',
        title: 'Message',
        type: 'string',
        className: [styles.tableHead, styles.messageColumn].join(' '),
        render: (value, row) => {
          const files = getFilesURLs(row.urls);
          // We ensure to convert Jira ticket names to hyperlinks before converting the markdown to html
          const parsedValue = pipe(convertJiraTicketNamesToHyperlinks, jiraMarkdownToHtml)(value);
          return (
            <>
              <div
                className={['ql-editor', styles.wikiMarkupText].join(' ')}
                dangerouslySetInnerHTML={{ __html: parsedValue }}
              />
              {value.length > 500 && <input className={styles.expandBtn} type="checkbox" />}
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
        field: 'urls',
        title: 'Jira',
        type: 'link',
        className: styles.tableHead,
        render: (value) => {
          const link = getLinkJira(value);
          if (link) {
            const ticket = link.split('/').pop();
            return (
              <a target="_blank" href={link}>
                {ticket}
              </a>
            );
          }
        },
      },
      {
        field: 'action',
        title: 'Action',
        type: 'string',
        className: styles.tableHead,
        render: (_, row) => {
          return (
            <>
              <span className={styles.margin}>
                <Button
                  className={styles.iconBtn}
                  title="View"
                  onClick={() => {
                    viewLog(row);
                  }}
                  status="transparent"
                >
                  <AcknowledgeIcon className={styles.icon} />
                </Button>
              </span>
              <span className={styles.margin}>
                <Button
                  className={styles.iconBtn}
                  title="Edit"
                  onClick={() => {
                    editLog(row);
                  }}
                  status="transparent"
                >
                  <EditIcon className={styles.icon} />
                </Button>
              </span>
            </>
          );
        },
      },
    ];
  };

  const queryNarrativeLogs = () => {
    const dateFrom = moment(selectedDayNarrativeStart).utc().hours(12).format(ISO_STRING_DATE_TIME_FORMAT);
    const dateTo = moment(selectedDayNarrativeEnd).utc().add(1, 'day').hours(12).format(ISO_STRING_DATE_TIME_FORMAT);

    // Get list of narrative logs
    setUpdatingLogs(true);
    ManagerInterface.getListMessagesNarrativeLogs(dateFrom, dateTo)
      .then((data) => {
        setLogs(data);
        setLastUpdated(moment());
      })
      .finally(() => {
        setUpdatingLogs(false);
      });
  };

  const parseCsvData = (data) => {
    const csvData = data.map((row) => {
      const obsDay = getObsDayFromDate(moment(row.date_added + 'Z'));
      const escapedMessageText = row.message_text.replace(/"/g, '""');
      const parsedLevel = OLE_COMMENT_TYPE_OPTIONS.find((option) => option.value === row.level)?.label ?? 'Undefined';
      const system = row.components_json.name;
      return {
        ...row,
        obs_day: obsDay,
        message_text: escapedMessageText,
        level: parsedLevel,
        system,
      };
    });
    return csvData;
  };

  const setQueryNarritveLogsInterval = () => {
    return setInterval(() => {
      queryNarrativeLogs();
    }, LOG_REFRESH_INTERVAL_MS);
  };

  useEffect(() => {
    if (bothSelectedDays) {
      queryNarrativeLogs();
      const intervalId = setQueryNarritveLogsInterval();
      return () => clearInterval(intervalId);
    }
  }, [selectedDayNarrativeStart, selectedDayNarrativeEnd]);

  const getFilteredData = useMemo(() => {
    let filteredData = [...logs];

    // Filter by type
    if (selectedCommentType && selectedCommentType.value !== OLE_COMMENT_TYPE_OPTIONS[0].value) {
      filteredData = filteredData.filter((log) => log.level === selectedCommentType.value);
    }

    // Filter by system
    if (selectedSystem && selectedSystem !== OLE_DEFAULT_SYSTEMS_FILTER_OPTION) {
      // Note we currently support only 1 system, represented
      // by the root level of log.components_json.
      // Use log.component_json.name to filter
      filteredData = filteredData.filter((log) => log.components_json?.name === selectedSystem);
    }

    // Filter by obs time loss
    if (selectedObsTimeLoss) {
      filteredData = filteredData.filter((log) => log.time_lost > 0);
    }

    // Filter by jira tickets
    if (selectedJiraTickets) {
      filteredData = filteredData.filter((log) => {
        return getLinkJira(log.urls) !== '';
      });
    }
    return filteredData;
  }, [logs, selectedCommentType, selectedSystem, selectedObsTimeLoss, selectedJiraTickets]);
  const filteredData = getFilteredData;

  // Obtain headers to create csv report
  // obs_day, message_text and level are parsed by this.parseCsvData
  const csvHeaders = filteredData.length > 0 ? exportedCsvParams.map((key) => ({ label: key, key })) : [];
  const csvData =
    filteredData.length > 0 ? parseCsvData(filteredData) : "There aren't logs created for the current search...";
  const csvTitle = bothSelectedDays
    ? `narrative_logs_from_${selectedDayNarrativeStart.format(
        ISO_INTEGER_DATE_FORMAT,
      )}_to_${selectedDayNarrativeEnd.format(ISO_INTEGER_DATE_FORMAT)}.csv`
    : 'narrative_logs.csv';

  const systemOptions = [OLE_DEFAULT_SYSTEMS_FILTER_OPTION, ...Object.keys(OLE_OBS_SYSTEMS).sort()];

  return modeView && !modeEdit ? (
    <NonExposureDetail
      log={selectedLog}
      back={() => {
        setModeView(false);
        setModeEdit(false);
      }}
      edit={() => {
        setModeEdit(true);
        setModeView(false);
      }}
      remove={(log) => {
        removeLog(log);
        setModeView(false);
      }}
    />
  ) : modeEdit && !modeView ? (
    <NonExposureEdit
      log={selectedLog}
      back={() => {
        setModeEdit(false);
        setModeView(false);
      }}
      view={() => {
        setModeView(true);
        setModeEdit(false);
      }}
      save={(log) => {
        addLog(log);
        setModeView(true);
      }}
    />
  ) : (
    <div className={styles.container}>
      <div className={styles.filters}>
        <DateTimeRange
          label="From"
          className={styles.dateRange}
          startDate={selectedDayNarrativeStart}
          endDate={selectedDayNarrativeEnd}
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
          onChange={changeDayNarrative}
        />

        <div className={styles.checkboxText}>
          <Input
            type="checkbox"
            checked={selectedObsTimeLoss}
            onChange={(event) => changeObsTimeLossSelect(event.target.checked)}
          />
          Show only with time loss
        </div>

        <div className={styles.checkboxText}>
          <Input
            type="checkbox"
            checked={selectedJiraTickets}
            onChange={(event) => changeJiraTicketsSelect(event.target.checked)}
          />
          Show only with jira tickets
        </div>

        <Select
          options={OLE_COMMENT_TYPE_OPTIONS}
          option={selectedCommentType}
          onChange={(option) => changeCommentTypeSelect(option)}
          className={styles.selectComment}
        />

        <Select
          options={systemOptions}
          option={selectedSystem}
          onChange={({ value }) => changeSystemSelect(value)}
          className={styles.selectComponent}
        />

        <div className={styles.divExportBtn}>
          <CSVLink data={csvData} headers={csvHeaders} filename={csvTitle}>
            <Hoverable top={true} left={true} inside={true}>
              <span className={styles.infoIcon}>
                <DownloadIcon className={styles.iconCSV} />
              </span>
              <div className={styles.hover}>Download this report as csv file</div>
            </Hoverable>
          </CSVLink>
        </div>
      </div>
      <div className={styles.lastUpdated}>
        <Button disabled={updatingLogs} onClick={() => queryNarrativeLogs()}>
          Refresh data
        </Button>
        <span>Last updated: {lastUpdated ? lastUpdated.format(TIME_FORMAT) : ''}</span>
        {updatingLogs && <SpinnerIcon className={styles.spinnerIcon} />}
      </div>
      <OrderableTable className={styles.table} headers={getHeaders()} data={filteredData} />
    </div>
  );
}

NonExposure.propTypes = {
  /** The selected start obs day to filter displayed narrative logs,
   * in YYYYMMDD or Moment format */
  selectedDayNarrativeStart: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  /** The selected end obs day to filter displayed narrative logs,
   * in YYYYMMDD or Moment format */
  selectedDayNarrativeEnd: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  /** Function to change the selected narrative obs day range
   * @param {number} day - The new obs day, in YYYYMMDD
   * @param {string|object} type - The type of date being changed (e.g., 'start' or 'end') */
  changeDayNarrative: PropTypes.func,
  /** The selected comment **option** (object with `value` and `label` properties)
   * to filter displayed narrative logs */
  selectedCommentType: PropTypes.shape({
    value: PropTypes.oneOf(['all', 0, 100]),
    label: PropTypes.string,
  }),
  /** Function to change the selected comment type
   * @param {object} option - The new selected comment type **option**,
   * with `value` and `label` properties */
  changeCommentTypeSelect: PropTypes.func,
  /** The selected system to filter displayed narrative logs */
  selectedSystem: PropTypes.string,
  /** Function to change the selected system. */
  changeSystemSelect: PropTypes.func,
  /** Whether to display narrative logs with time loss or not */
  selectedObsTimeLoss: PropTypes.bool,
  /** Whether to display narrative logs with Jira tickets or not */
  selectedJiraTickets: PropTypes.bool,
  /** Function to toggle time loss checkbox */
  changeObsTimeLossSelect: PropTypes.func,
  /** Function to toggle Jira tickets checkbox */
  changeJiraTicketsSelect: PropTypes.func,
  /** Seconds offset between TAI and UTC. */
  taiToUtc: PropTypes.number,
};

export default NonExposure;
