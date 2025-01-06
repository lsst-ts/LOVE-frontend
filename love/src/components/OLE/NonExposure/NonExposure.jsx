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
import {
  TIME_FORMAT,
  OLE_COMMENT_TYPE_OPTIONS,
  OLE_DEFAULT_SYSTEMS_FILTER_OPTION,
  OLE_OBS_SYSTEMS,
  iconLevelOLE,
  ISO_INTEGER_DATE_FORMAT,
  ISO_STRING_DATE_TIME_FORMAT,
  LOG_REFRESH_INTERVAL_MS,
} from 'Config';
import ManagerInterface, {
  formatSecondsToDigital,
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

export default class NonExposure extends Component {
  static propTypes = {
    /** Start date of the date range filter */
    selectedDateStart: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    /** End date of the date range filter */
    selectedDateEnd: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    /** Function to handle the date range filter */
    changeDayNarrative: PropTypes.func,
    /** Selected comment type of the comment type filter */
    selectedCommentType: PropTypes.shape({
      value: PropTypes.oneOf(['all', 0, 100]),
      label: PropTypes.string,
    }),
    /** Function to handle the comment type filter */
    changeCommentTypeSelect: PropTypes.func,
    /** Selected system of the systems filter */
    selectedSystem: PropTypes.string,
    /** Function to handle the systems filter */
    changeSystemSelect: PropTypes.func,
    /** Selected obs time loss of the obs time loss filter */
    selectedObsTimeLoss: PropTypes.bool,
    /** Selected jira ticket of the jira ticket filter */
    selectedJiraTickets: PropTypes.bool,
    /** Function to handle the obs time loss filter */
    changeObsTimeLossSelect: PropTypes.func,
    /** Function to handle the jira ticket filter */
    changeJiraTicketsSelect: PropTypes.func,
    /** Difference in seconds between UTC and TAI */
    taiToUtc: PropTypes.number,
  };

  static defaultProps = {
    selectedDateStart: null,
    selectedDateEnd: null,
    changeDayNarrative: () => {},
    selectedCommentType: OLE_COMMENT_TYPE_OPTIONS[0],
    changeCommentTypeSelect: () => {},
    selectedSystem: OLE_DEFAULT_SYSTEMS_FILTER_OPTION,
    changeSystemSelect: () => {},
    selectedObsTimeLoss: false,
    changeObsTimeLossSelect: () => {},
    selectedJiraTickets: false,
    changeJiraTicketsSelect: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      modeView: false,
      modeEdit: false,
      selected: null,
      updatingLogs: false,
      lastUpdated: null,
      logs: [],
      range: [],
    };

    this.queryLogsInterval = null;
  }

  view(index) {
    if (index) {
      this.setState({
        modeView: true,
        selected: index,
      });
    }
  }

  edit(index) {
    if (index) {
      this.setState({
        modeEdit: true,
        selected: index,
      });
    }
  }

  getLevel(value) {
    const label = value >= 100 ? 'urgent' : 'info';
    const icon = iconLevelOLE[label] ?? undefined;
    return (
      <span title={label} className={styles.levelIcon}>
        {icon}
      </span>
    );
  }

  refreshLogsRemove(nonExposure) {
    const logs = this.state.logs.filter((log) => log.id !== nonExposure.id);
    this.setState({ logs });
  }

  refreshLogs(nonExposure) {
    const logs = this.state.logs.filter((log) => log.id !== this.state.selected.id);
    this.setState({
      logs: [nonExposure, ...logs],
      selected: nonExposure,
    });
  }

  getHeaders = () => {
    const { taiToUtc } = this.props;

    return [
      {
        field: 'date_begin',
        title: 'Time of incident (UTC)',
        type: 'string',
        className: styles.tableHead,
        render: (value) => moment(value).add(taiToUtc, 'seconds').format(ISO_STRING_DATE_TIME_FORMAT),
      },
      {
        field: 'time_lost',
        title: 'Obs. Time Loss',
        type: 'string',
        className: styles.tableHead,
        render: (value, row) => {
          const dateBeginUTC = moment(row.date_begin).add(taiToUtc, 'seconds');
          const dateEndUTC = moment(row.date_end).add(taiToUtc, 'seconds');
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
        render: (value) => getObsDayFromDate(moment(value + 'Z')),
      },
      {
        field: 'level',
        title: 'Level',
        type: 'string',
        className: styles.tableHead,
        render: (value) => this.getLevel(value),
      },
      {
        field: 'components_json',
        title: 'System',
        type: 'string',
        className: styles.tableHead,
        render: (value) => {
          const system = value.name;
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
                  title="Edit"
                  onClick={() => {
                    this.edit(index);
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

  queryNarrativeLogs() {
    const { selectedDayNarrativeStart, selectedDayNarrativeEnd } = this.props;
    const dateFrom = moment(selectedDayNarrativeStart).utc().hours(12).format(ISO_STRING_DATE_TIME_FORMAT);
    const dateTo = moment(selectedDayNarrativeEnd).utc().add(1, 'day').hours(12).format(ISO_STRING_DATE_TIME_FORMAT);

    // Get list of narrative logs
    this.setState({ updatingLogs: true });
    ManagerInterface.getListMessagesNarrativeLogs(dateFrom, dateTo).then((data) => {
      this.setQueryNarritveLogsInterval();
      this.setState({
        logs: data,
        updatingLogs: false,
        lastUpdated: moment(),
      });
    });
  }

  parseCsvData(data) {
    const csvData = data.map((row) => {
      const obsDay = getObsDayFromDate(moment(row.date_added + 'Z'));
      const escapedMessageText = row.message_text.replace(/"/g, '""');
      const parsedLevel = OLE_COMMENT_TYPE_OPTIONS.find((option) => option.value === row.level).label;
      return {
        ...row,
        obs_day: obsDay,
        message_text: escapedMessageText,
        level: parsedLevel,
      };
    });
    return csvData;
  }

  setQueryNarritveLogsInterval() {
    clearInterval(this.queryLogsInterval);
    this.queryLogsInterval = setInterval(() => {
      this.queryNarrativeLogs();
    }, LOG_REFRESH_INTERVAL_MS);
  }

  componentDidMount() {
    this.queryNarrativeLogs();
    this.setQueryNarritveLogsInterval();
  }

  componentDidUpdate(prevProps) {
    if (
      (this.props.selectedDayNarrativeStart &&
        !this.props.selectedDayNarrativeStart.isSame(prevProps.selectedDayNarrativeStart)) ||
      (this.props.selectedDayNarrativeEnd &&
        !this.props.selectedDayNarrativeEnd.isSame(prevProps.selectedDayNarrativeEnd))
    ) {
      this.queryNarrativeLogs();
      if (!this.queryLogsInterval) {
        this.setQueryNarritveLogsInterval();
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.queryLogsInterval);
  }

  render() {
    const {
      selectedDayNarrativeStart,
      selectedDayNarrativeEnd,
      selectedCommentType,
      selectedSystem,
      selectedObsTimeLoss,
      selectedJiraTickets,
      changeDayNarrative,
      changeCommentTypeSelect,
      changeSystemSelect,
      changeObsTimeLossSelect,
      changeJiraTicketsSelect,
    } = this.props;
    const { logs: tableData, modeView, modeEdit } = this.state;

    const headers = this.getHeaders();
    let filteredData = [...(tableData ?? [])];

    // Filter by type
    if (selectedCommentType.value !== OLE_COMMENT_TYPE_OPTIONS[0].value) {
      filteredData = filteredData.filter((log) => log.level === selectedCommentType.value);
    }

    // Filter by system
    if (selectedSystem !== OLE_DEFAULT_SYSTEMS_FILTER_OPTION) {
      // Note that systems come inside the components_json.systems field
      filteredData = filteredData.filter((log) => log.components_json?.systems?.includes(selectedSystem));
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

    // Obtain headers to create csv report
    // obs_day, message_text and level are parsed by this.parseCsvData
    let csvHeaders = null;
    let csvData = "There aren't logs created for the current search...";
    let csvTitle = 'narrative_logs.csv';
    if (filteredData.length > 0) {
      const exportedParams = [
        'obs_day',
        'message_text',
        'level',
        'urls',
        'date_begin',
        'date_end',
        'time_lost',
        // Systems
        'components',
        // Subsystems
        'primary_software_components',
        // Components
        'primary_hardware_components',
        'user_id',
      ];
      csvHeaders = exportedParams.map((key) => ({ label: key, key }));
      csvData = this.parseCsvData(filteredData);
    }

    if (selectedDayNarrativeStart && selectedDayNarrativeEnd) {
      csvTitle = `narrative_logs_from_${selectedDayNarrativeStart.format(
        ISO_INTEGER_DATE_FORMAT,
      )}_to_${selectedDayNarrativeEnd.format(ISO_INTEGER_DATE_FORMAT)}.csv`;
    }

    const systemOptions = [OLE_DEFAULT_SYSTEMS_FILTER_OPTION, ...Object.keys(OLE_OBS_SYSTEMS).sort()];

    const renderDateTimeInput = (props) => {
      return <input {...props} readOnly />;
    };

    return modeView && !modeEdit ? (
      <NonExposureDetail
        back={() => {
          this.setState({ modeView: false, modeEdit: false });
        }}
        logDetail={this.state.selected}
        edit={(isClicked) => {
          isClicked ? this.setState({ modeEdit: true, modeView: false }) : {};
        }}
        remove={(nonExposure) => {
          this.refreshLogsRemove(nonExposure);
          this.setState({ modeView: false });
        }}
      />
    ) : modeEdit && !modeView ? (
      <NonExposureEdit
        back={() => {
          this.setState({ modeView: false, modeEdit: false });
        }}
        logEdit={this.state.selected}
        view={(isClicked) => {
          isClicked ? this.setState({ modeEdit: false, modeView: true }) : {};
        }}
        save={(nonExposure) => {
          this.refreshLogs(nonExposure);
          this.setState({ modeEdit: false, modeView: true });
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
            onChange={(value) => changeCommentTypeSelect(value)}
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
          <Button disabled={this.state.updatingLogs} onClick={() => this.queryNarrativeLogs()}>
            Refresh data
          </Button>
          <span>Last updated: {this.state.lastUpdated ? this.state.lastUpdated.format(TIME_FORMAT) : ''}</span>
          {this.state.updatingLogs && <SpinnerIcon className={styles.spinnerIcon} />}
        </div>
        <OrderableTable className={styles.table} headers={headers} data={filteredData} />
      </div>
    );
  }
}
