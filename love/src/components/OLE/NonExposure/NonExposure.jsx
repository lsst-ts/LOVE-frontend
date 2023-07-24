import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { CSVLink } from 'react-csv';
import {
  OLE_COMMENT_TYPE_OPTIONS,
  LSST_SYSTEMS,
  iconLevelOLE,
  ISO_INTEGER_DATE_FORMAT,
  ISO_STRING_DATE_TIME_FORMAT,
} from 'Config';
import ManagerInterface, { formatSecondsToDigital, openInNewTab, getLinkJira, getFileURL } from 'Utils';

import SimpleTable from 'components/GeneralPurpose/SimpleTable/SimpleTable';
import Button from 'components/GeneralPurpose/Button/Button';
import Input from 'components/GeneralPurpose/Input/Input';
import DateTimeRange from 'components/GeneralPurpose/DateTimeRange/DateTimeRange';
import DownloadIcon from 'components/icons/DownloadIcon/DownloadIcon';
import EditIcon from 'components/icons/EditIcon/EditIcon';
import AcknowledgeIcon from 'components/icons/Watcher/AcknowledgeIcon/AcknowledgeIcon';
import SpinnerIcon from 'components/icons/SpinnerIcon/SpinnerIcon';
import Select from 'components/GeneralPurpose/Select/Select';
import Hoverable from 'components/GeneralPurpose/Hoverable/Hoverable';
import NonExposureDetail from './NonExposureDetail';
import NonExposureEdit from './NonExposureEdit';
import styles from './NonExposure.module.css';

const moment = extendMoment(Moment);

export default class NonExposure extends Component {
  static propTypes = {
    /** Start date of the date range filter */
    selectedDateStart: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    /** End date of the date range filter */
    selectedDateEnd: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    /** Function to handle the date range filter */
    handleDateTimeRange: PropTypes.func,
    /** Selected comment type of the comment type filter */
    selectedCommentType: PropTypes.shape({
      value: PropTypes.oneOf(['all', 0, 100]),
      label: PropTypes.string,
    }),
    /** Function to handle the comment type filter */
    changeCommentTypeSelect: PropTypes.func,
    /** Selected system of the system filter */
    selectedSystem: PropTypes.string,
    /** Function to handle the system filter */
    changeSystemSelect: PropTypes.func,
    /** Selected obs time loss of the obs time loss filter */
    selectedObsTimeLoss: PropTypes.bool,
    /** Function to handle the obs time loss filter */
    changeObsTimeLossSelect: PropTypes.func,
  };

  static defaultProps = {
    selectedDayNarrative: Moment(Date.now() + 37 * 1000),
    selectedCommentType: OLE_COMMENT_TYPE_OPTIONS[0],
    selectedSystem: 'all',
    selectedObsTimeLoss: false,
    changeDayNarrative: () => {},
    changeCommentTypeSelect: () => {},
    changeSystemSelect: () => {},
    changeObsTimeLossSelect: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      modeView: false,
      modeEdit: false,
      selected: null,
      updatingLogs: false,
      logs: [],
      range: [],
    };
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
      <>
        <span className={styles.levelIcon}>{icon}</span> {label}
      </>
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
    return [
      {
        field: 'systems',
        title: 'Systems',
        type: 'string',
        className: styles.tableHead,
        render: (value) => value.join(', '),
      },
      {
        field: 'level',
        title: 'Level',
        type: 'string',
        className: styles.tableHead,
        render: (value) => this.getLevel(value),
      },
      {
        field: null,
        title: 'Time of Incident (UTC)',
        type: 'string',
        className: styles.tableHead,
        render: (_, row) => `${row.date_begin?.split('.')[0]} - ${row.date_end?.split('.')[0]}`,
      },
      {
        field: 'time_lost',
        title: 'Obs. Time Loss',
        type: 'string',
        className: styles.tableHead,
        render: (value) => formatSecondsToDigital(value * 3600),
      },
      {
        field: 'message_text',
        title: 'Message',
        type: 'string',
        className: styles.tableHead,
        render: (value) => value,
      },
      {
        field: 'urls',
        title: 'File',
        type: 'link',
        className: styles.tableHead,
        render: (value) =>
          getFileURL(value) ? (
            <Button
              className={styles.iconBtn}
              title={getFileURL(value)}
              onClick={() => openInNewTab(getFileURL(value))}
            >
              <DownloadIcon className={styles.icon} />
            </Button>
          ) : (
            <></>
          ),
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
    const dateFrom = selectedDayNarrativeStart.format(ISO_STRING_DATE_TIME_FORMAT);
    const dateTo = selectedDayNarrativeEnd.format(ISO_STRING_DATE_TIME_FORMAT);

    // Get list of narrative logs
    this.setState({ updatingLogs: true });
    ManagerInterface.getListMessagesNarrativeLogs(dateFrom, dateTo).then((data) => {
      this.setState({ logs: data, updatingLogs: false });
    });
  }

  parseCsvData(data) {
    const csvData = data.map((row) => {
      const escapedMessageText = row.message_text.replace(/"/g, '""');
      return {
        ...row,
        message_text: escapedMessageText,
      };
    });
    return csvData;
  }

  componentDidMount() {
    this.queryNarrativeLogs();
  }

  componentDidUpdate(prevProps) {
    if (
      (this.props.selectedDayNarrativeStart &&
        !this.props.selectedDayNarrativeStart.isSame(prevProps.selectedDayNarrativeStart)) ||
      (this.props.selectedDayNarrativeEnd &&
        !this.props.selectedDayNarrativeEnd.isSame(prevProps.selectedDayNarrativeEnd))
    ) {
      this.queryNarrativeLogs();
    }
  }

  render() {
    const {
      selectedDayNarrativeStart,
      selectedDayNarrativeEnd,
      selectedCommentType,
      selectedSystem,
      selectedObsTimeLoss,
      changeDayNarrative,
      changeCommentTypeSelect,
      changeSystemSelect,
      changeObsTimeLossSelect,
    } = this.props;
    const { logs: tableData, modeView, modeEdit } = this.state;

    const headers = Object.values(this.getHeaders());

    const systemOptions = [{ label: 'System', value: 'all' }, ...LSST_SYSTEMS];

    let filteredData = [...tableData];

    // Filter by type
    if (selectedCommentType.value !== 'all') {
      filteredData = filteredData.filter((log) => log.level === selectedCommentType.value);
    }

    // Filter by system
    if (selectedSystem !== 'all') {
      filteredData = filteredData.filter((log) => log.systems.includes(selectedSystem));
    }

    // Filter by obs time loss
    if (selectedObsTimeLoss) {
      filteredData = filteredData.filter((log) => log.time_lost > 0);
    }

    // Obtain headers to create csv report
    let csvHeaders = null;
    let csvData = "There aren't logs created for the current search...";
    let csvTitle = 'narrative_logs.csv';
    if (filteredData.length > 0) {
      const exportedParams = [
        'date_added',
        'message_text',
        'level',
        'tags',
        'urls',
        'date_begin',
        'date_end',
        'time_lost',
        'systems',
        'subsystems',
        'cscs',
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
      <div className={styles.margin10}>
        <div className={styles.title}>Filter</div>
        <div className={styles.filters}>
          <Button disabled={this.state.updatingLogs} onClick={() => this.queryNarrativeLogs()}>
            Refresh data
            {this.state.updatingLogs && <SpinnerIcon className={styles.spinnerIcon} />}
          </Button>

          <DateTimeRange
            label="From"
            className={styles.dateRange}
            startDate={selectedDayNarrativeStart}
            endDate={selectedDayNarrativeEnd}
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
            onChange={changeDayNarrative}
          />

          <Select
            options={OLE_COMMENT_TYPE_OPTIONS}
            option={selectedCommentType}
            onChange={(value) => changeCommentTypeSelect(value)}
            className={styles.select}
          />

          <Select
            options={systemOptions}
            option={selectedSystem}
            onChange={({ value }) => changeSystemSelect(value)}
            className={styles.select}
          />

          <div className={styles.checkboxText}>
            Show only logs with Obs. time loss
            <Input
              type="checkbox"
              checked={selectedObsTimeLoss}
              onChange={(event) => changeObsTimeLossSelect(event.target.checked)}
            />
          </div>

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
        <SimpleTable headers={headers} data={filteredData} />
      </div>
    );
  }
}
