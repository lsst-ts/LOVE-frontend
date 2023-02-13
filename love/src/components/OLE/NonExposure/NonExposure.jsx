import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { CSVLink } from 'react-csv';
import { LSST_SYSTEMS, LSST_SUBSYSTEMS, iconLevelOLE } from 'Config';
import ManagerInterface, { formatSecondsToDigital, openInNewTab, getLinkJira, getFileURL } from 'Utils';
// import { LOG_TYPE_OPTIONS } from 'Config';
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
import Toggle from 'components/GeneralPurpose/Toggle/Toggle';
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
    selectedDateStart: null,
    selectedDateEnd: null,
    selectedCommentType: { value: 'all', label: 'All comment types' },
    selectedSystem: 'all',
    selectedObsTimeLoss: false,
    handleDateTimeRange: () => {},
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
      showDateRangeFilter: false,
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
    // Uncomment next code line to use several level options
    // const label = LOG_TYPE_OPTIONS.find((type) => type.value === value)?.label;
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
        field: 'date_added',
        title: 'Timestamp (UTC)',
        type: 'timestamp',
        className: styles.tableHead,
        render: (value) => value.split('.')[0],
      },
      {
        field: 'user_id',
        title: 'User Id',
        type: 'string',
        className: styles.tableHead,
      },
      {
        field: 'user_agent',
        title: 'Agent',
        type: 'string',
        className: styles.tableHead,
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
        field: 'level',
        title: 'Level',
        type: 'string',
        className: styles.tableHead,
        render: (value) => this.getLevel(value),
      },
      {
        field: 'systems',
        title: 'Systems',
        type: 'string',
        className: styles.tableHead,
        render: (value) => value.join(', '),
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
        render: (value) =>
          getLinkJira(value) ? (
            <Button status="link" title={getLinkJira(value)} onClick={() => openInNewTab(getLinkJira(value))}>
              view Jira ticket
            </Button>
          ) : (
            <></>
          ),
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

  queryNarrativeLogs(callback) {
    ManagerInterface.getListMessagesNarrativeLogs().then((data) => {
      this.setState({ logs: data });
      if (callback) callback();
    });
  }

  componentDidMount() {
    this.queryNarrativeLogs();
  }

  render() {
    const {
      selectedObsTimeLoss, selectedCommentType, selectedSystem, selectedDateStart, selectedDateEnd,
      handleDateTimeRange, changeCommentTypeSelect, changeSystemSelect, changeObsTimeLossSelect } = this.props;
    const { modeView, modeEdit, showDateRangeFilter } = this.state;
    const headers = Object.values(this.getHeaders());

    let filteredData = this.state.logs ?? [];

    // Filter by date range
    if (showDateRangeFilter) {
      const range = moment.range(selectedDateStart, selectedDateEnd);
      filteredData = filteredData.filter((log) => range.contains(Moment(log.date_added + 'Z'))); // Need to add Z so moment identifies date as UTC
    }

    // Filter by type
    filteredData = selectedCommentType.value !== 'all'
        ? filteredData.filter((log) => log.level === selectedCommentType.value)
        : filteredData;

    // Filter by system
    filteredData = selectedSystem !== 'all'
        ? filteredData.filter((log) => log.systems.includes(selectedSystem))
        : filteredData;

    // Filter by obs time loss
    filteredData = selectedObsTimeLoss ? filteredData.filter((log) => log.time_lost > 0) : filteredData;

    const tableData = filteredData;

    // Obtain headers to create csv report
    let csvHeaders = null;
    let csvData =  "There aren't logs created for the current search...";
    if (filteredData.length > 0) {
      const logExampleKeys = Object.keys(filteredData?.[0] ?? {});
      csvHeaders = logExampleKeys.map((key) => ({ label: key, key }));
      csvData = filteredData;
    }

    // Uncomment next code block to use several level options
    // const commentTypeOptions = [{ label: 'All comment types', value: 'all' }, ...LOG_TYPE_OPTIONS];
    const commentTypeOptions = [
      { label: 'All comment types', value: 'all' },
      { label: 'Urgent', value: 100 },
      { label: 'Non urgent', value: 0 },
    ];
    const systemOptions = [{ label: 'All systems', value: 'all' }, ...LSST_SYSTEMS];


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
          <Button
            disabled={this.state.updatingLogs}
            onClick={() => {
              this.setState({ updatingLogs: true });
              this.queryNarrativeLogs(() => {
                this.setState({ updatingLogs: false });
              });
            }}
          >
            Refresh data
            {this.state.updatingLogs && <SpinnerIcon className={styles.spinnerIcon}/>}
          </Button>

          <Toggle
            isLive={showDateRangeFilter}
            setLiveMode={(event) => this.setState({ showDateRangeFilter: event })}
            labels={['Hide date range filter', 'Show']}
          />

          {showDateRangeFilter &&
            <DateTimeRange
              onChange={(date, type) => handleDateTimeRange(date, type)}
              label="Date & Time (UTC)"
              startDate={selectedDateStart}
              endDate={selectedDateEnd}
              startDateProps={{
                maxDate: selectedDateEnd,
              }}
              endDateProps={{
                minDate: selectedDateStart,
              }}
            />
          }

          <Select
            options={commentTypeOptions}
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
            <CSVLink data={csvData} headers={csvHeaders} filename="narrativeLogs.csv">
              <Hoverable top={true} left={true} inside={true}>
                <span className={styles.infoIcon}>
                  <DownloadIcon className={styles.iconCSV} />
                </span>
                <div className={styles.hover}>Download this report as csv file</div>
              </Hoverable>
            </CSVLink>
          </div>
        </div>
        <SimpleTable headers={headers} data={tableData} />
      </div>
    );
  }
}
