import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import ManagerInterface from 'Utils';
import { iconLevelOLE } from 'Config';
import { formatSecondsToDigital, openInNewTab } from 'Utils';
import { getLinkJira, getFileURL } from 'Utils';
import { CSCSummaryHierarchy, LOG_TYPE_OPTIONS } from 'Config';
import SimpleTable from 'components/GeneralPurpose/SimpleTable/SimpleTable';
import Button from 'components/GeneralPurpose/Button/Button';
import Input from 'components/GeneralPurpose/Input/Input';
import DateTimeRange from 'components/GeneralPurpose/DateTimeRange/DateTimeRange';
import DownloadIcon from 'components/icons/DownloadIcon/DownloadIcon';
import EditIcon from 'components/icons/EditIcon/EditIcon';
import AcknowledgeIcon from 'components/icons/Watcher/AcknowledgeIcon/AcknowledgeIcon';
import RedoIcon from 'components/icons/RedoIcon/RedoIcon';
import Select from 'components/GeneralPurpose/Select/Select';
import Hoverable from 'components/GeneralPurpose/Hoverable/Hoverable';
import NonExposureDetail from './NonExposureDetail';
import NonExposureEdit from './NonExposureEdit';
import styles from './NonExposure.module.css';
import { CSVLink } from 'react-csv';

const moment = extendMoment(Moment);

export default class NonExposure extends Component {
  static propTypes = {
    selectedDateStart: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    selectedDateEnd: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    handleDateTimeRange: PropTypes.func,
    selectedCommentType: PropTypes.object,
    changeCommentTypeSelect: PropTypes.func,
    selectedSystem: PropTypes.string,
    changeSubsystemSelect: PropTypes.func,
    selectedObsTimeLoss: PropTypes.bool,
    changeObsTimeLossSelect: PropTypes.func,
  };

  static defaultProps = {
    selectedDateStart: null,
    selectedDateEnd: null,
    handleDateTimeRange: () => {},
    selectedCommentType: 'all',
    changeCommentTypeSelect: () => {},
    selectedSystem: 'all',
    changeSubsystemSelect: () => {},
    selectedObsTimeLoss: false,
    changeObsTimeLossSelect: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      modeView: false,
      modeEdit: false,
      selected: null,
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
        title: 'Timestamp',
        type: 'timestamp',
        className: styles.tableHead,
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
        title: 'Time of Incident',
        type: 'string',
        className: styles.tableHead,
        render: (_, row) => `${row.date_begin} - ${row.date_end}`,
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

  queryNarrativeLogs() {
    ManagerInterface.getListMessagesNarrativeLogs().then((data) => {
      this.setState({ logs: data });
    });
  }

  componentDidMount() {
    this.queryNarrativeLogs();
    this.setState({ range: moment.range(this.props.selectedDateStart, this.props.selectedDateEnd) });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.selectedDateStart !== this.props.selectedDateStart ||
      prevProps.selectedDateEnd !== this.props.selectedDateEnd
    ) {
      this.setState({ range: moment.range(this.props.selectedDateStart, this.props.selectedDateEnd) });
    }
  }

  render() {
    const modeView = this.state.modeView;
    const modeEdit = this.state.modeEdit;
    const headers = Object.values(this.getHeaders());

    let filteredData = this.state.logs ?? [];

    // Filter by date range
    const range = this.state.range;
    filteredData = filteredData.filter((log) => range.contains(Moment(log.date_added)));

    // Filter by type
    filteredData =
      this.props.selectedCommentType?.value !== 'all'
        ? filteredData.filter((log) => log.level === this.props.selectedCommentType.value)
        : filteredData;

    // Filter by system
    filteredData =
      this.props.selectedSystem !== 'all'
        ? filteredData.filter((log) => log.systems.includes(this.props.selectedSystem))
        : filteredData;

    // Filter by obs time loss
    filteredData = this.props.selectedObsTimeLoss ? filteredData.filter((log) => log.time_lost > 0) : filteredData;

    const tableData = filteredData;

    const logExample = this.state.logs?.[0];
    const logExampleKeys = Object.keys(logExample ?? {});
    const csvHeaders = logExampleKeys.map((key) => ({ label: key, key }));

    // const commentTypeOptions = [{ label: 'All comment types', value: 'all' }, ...LOG_TYPE_OPTIONS];
    const commentTypeOptions = [
      { label: 'All comment types', value: 'all' },
      { label: 'Urgent', value: 100 },
      { label: 'Non urgent', value: 0 },
    ];
    const selectedCommentType = this.props.selectedCommentType;

    const systemOptions = [{ label: 'All systems', value: 'all' }, ...Object.keys(CSCSummaryHierarchy)];
    const selectedSystem = this.props.selectedSystem;

    const selectedObsTimeLoss = this.props.selectedObsTimeLoss;

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
          <DateTimeRange
            onChange={(date, type) => this.props.handleDateTimeRange(date, type)}
            label="From:"
            startDate={this.props.selectedDateStart}
            endDate={this.props.selectedDateEnd}
          />

          <Select
            options={commentTypeOptions}
            option={selectedCommentType}
            onChange={(value) => this.props.changeCommentTypeSelect(value)}
            className={styles.select}
          />

          <Select
            options={systemOptions}
            option={selectedSystem}
            onChange={({ value }) => this.props.changeSubsystemSelect(value)}
            className={styles.select}
          />

          <div className={styles.checkboxText}>
            Show only logs with Obs. time loss
            <Input
              type="checkbox"
              checked={selectedObsTimeLoss}
              onChange={(event) => this.props.changeObsTimeLossSelect(event.target.checked)}
            />
          </div>

          <div className={styles.divExportBtn}>
            {/* <Button className={styles.iconBtn} onClick={() => this.queryNarrativeLogs()}>
              <RedoIcon className={styles.icon} />
            </Button> */}

            <CSVLink data={tableData} headers={csvHeaders} filename="narrativeLogs.csv">
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
