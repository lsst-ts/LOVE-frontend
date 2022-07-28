import Moment from 'moment';
import { extendMoment } from 'moment-range';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import lodash from 'lodash';
import { DATE_TIME_FORMAT } from 'Config';
import ManagerInterface, { calculateTimeoutToNow, formatSecondsToDigital, relativeTime } from 'Utils';
import PaginatedTable from 'components/GeneralPurpose/PaginatedTable/PaginatedTable';
import DateTimeRange from 'components/GeneralPurpose/DateTimeRange/DateTimeRange';
import Button from 'components/GeneralPurpose/Button/Button';
import Select from 'components/GeneralPurpose/Select/Select';
import Input from 'components/GeneralPurpose/Input/Input';
import TextArea from 'components/GeneralPurpose/TextArea/TextArea';
import Modal from 'components/GeneralPurpose/Modal/Modal';
import Hoverable from 'components/GeneralPurpose/Hoverable/Hoverable';
import InfoIcon from 'components/icons/InfoIcon/InfoIcon';
import { AUTHLIST_REQUEST_PENDING, AUTHLIST_REQUEST_ACCEPTED, AUTHLIST_REQUEST_DENIED } from 'Constants';
import styles from './AdminAuthList.module.css';

const moment = extendMoment(Moment);

const MAX_MESSAGE_LEN = 320;
const MAX_DURATION = 60;
const MIN_DURATION = 0;
const DEFAULT_POLLING_TIMEOUT = 5000;

const STATUS_OPTIONS = [
  { value: AUTHLIST_REQUEST_PENDING, label: 'Pending requests' },
  { value: AUTHLIST_REQUEST_ACCEPTED, label: 'Accepted requests' },
  { value: AUTHLIST_REQUEST_DENIED, label: 'Rejected requests' },
];

const REQUEST_TYPE_TO_STATUS_MAP = {
  Accept: AUTHLIST_REQUEST_ACCEPTED,
  Reject: AUTHLIST_REQUEST_DENIED,
};

const formatList = (identities) => {
  if (identities === '') {
    return <span>None</span>;
  }
  return identities.split(',').map((v, i) => (
    <div key={i} className={styles.authlistIdentity}>
      <span>{v.substr(0, 1)}</span>
      <span>{v.substr(1)}</span>
    </div>
  ));
};

export default class AdminAuthList extends Component {
  static propTypes = {
    authListRequests: PropTypes.arrayOf(PropTypes.object),
    authlistAdminPermission: PropTypes.bool,
    pollingTimeout: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);
    this.id = lodash.uniqueId('admin-authlist-');
    this.pollingInterval = null;
    this.state = {
      authListRequests: [],
      showing: STATUS_OPTIONS[0].value,
      cscOptions: ['All'],
      keywords: '',
      selectedCSC: 'All',
      selectedStartDate: null,
      selectedEndDate: null,
      selectedRequest: null,
      authorizationType: null,
      confirmationModalShown: false,
      confirmationModalText: '',
      moreModalShown: false,
      message: null,
      duration: null,
      counter: 0,
    };
  }

  setAuthorization(type, row) {
    let modalText = '';
    if (type === 'Accept') {
      modalText = (
        <span>
          You are about to <b>accept</b> the authorization request of <b>{row.requested_by}</b>.<br></br>
          Are you sure?
        </span>
      );
    } else if (type === 'Reject') {
      modalText = (
        <span>
          You are about to <b>reject</b> the authorization request of <b>{row.requested_by}</b>.<br></br>
          Are you sure?
        </span>
      );
    } else if (type === 'More') {
      this.setState({ moreModalShown: true, selectedRequest: row });
      return;
    }

    this.setState({
      confirmationModalShown: true,
      confirmationModalText: modalText,
      selectedRequest: row,
      authorizationType: type,
      duration: null,
      message: null,
    });
  }

  authorizeRequest(type) {
    const { selectedRequest, message, duration } = this.state;
    ManagerInterface.setAuthListRequestStatus(
      selectedRequest.id,
      REQUEST_TYPE_TO_STATUS_MAP[type],
      message,
      duration,
    ).then(() => {
      ManagerInterface.getAuthListRequests().then((res) => {
        this.setState({
          authListRequests: res,
        });
      });
      this.setState({ confirmationModalShown: false, moreModalShown: false });
    });
  }

  COMMON_HEADERS = [
    { field: 'requested_by', title: 'Request identity' },
    {
      field: 'cscs_to_change',
      title: 'CSCs to change',
      render: (cell) => cell.split(',').map((csc) => <div className={styles.csc}>{csc}</div>),
    },
    {
      field: 'authorized_users',
      title: 'Authorized users',
      render: (cell) => formatList(cell, 'User'),
    },
    {
      field: 'unauthorized_cscs',
      title: 'Unauthorized cscs',
      render: (cell) => formatList(cell, 'CSC'),
    },
  ];

  ACCEPTED_HEADERS = [
    ...this.COMMON_HEADERS,
    { field: 'resolved_by', title: 'Authorized by' },
    {
      field: 'resolved_at',
      title: 'Approved date',
      render: (value) => (value ? Moment(value).format(DATE_TIME_FORMAT) : ''),
    },
    { field: 'message', title: 'Message' },
    {
      field: 'duration',
      title: 'Duration',
      render: (value, row) => {
        if (value === null) return '';
        const secondsLeft = calculateTimeoutToNow(Moment(row.resolved_at), value * 60);
        return formatSecondsToDigital(secondsLeft);
      },
    },
  ];

  REJECTED_HEADERS = [
    ...this.COMMON_HEADERS,
    { field: 'resolved_by', title: 'Rejected by' },
    {
      field: 'resolved_at',
      title: 'Rejected date',
      render: (value) => (value ? Moment(value).format(DATE_TIME_FORMAT) : ''),
    },
    { field: 'message', title: 'Message' },
  ];

  PENDING_HEADERS = [
    ...this.COMMON_HEADERS,
    {
      field: 'requested_at',
      title: 'Time elapsed since request',
      render: (value) => relativeTime(value),
    },
    {
      field: 'actions',
      title: 'Actions',
      render: (_, row) => {
        return (
          <>
            <Button
              disabled={!this.props.authlistAdminPermission}
              className={styles.actionButton}
              onClick={() => this.setAuthorization('Accept', row)}
            >
              Accept
            </Button>
            <Button
              disabled={!this.props.authlistAdminPermission}
              className={styles.actionButton}
              onClick={() => this.setAuthorization('Reject', row)}
            >
              Reject
            </Button>
            <Button
              disabled={!this.props.authlistAdminPermission}
              className={styles.actionButton}
              onClick={() => this.setAuthorization('More', row)}
            >
              More
            </Button>
          </>
        );
      },
    },
  ];

  TABLE_HEADERS = {
    [AUTHLIST_REQUEST_PENDING]: this.PENDING_HEADERS,
    [AUTHLIST_REQUEST_ACCEPTED]: this.ACCEPTED_HEADERS,
    [AUTHLIST_REQUEST_DENIED]: this.REJECTED_HEADERS,
  };

  handleChange = (option) => this.setState({ showing: option.value });

  handleDateTimeChange = (date, type) => {
    if (type === 'start') {
      this.setState({ selectedStartDate: date });
    } else if (type === 'end') {
      this.setState({ selectedEndDate: date });
    }
  };

  handleMessageChange = (message) => {
    const trimmedMessage = message.substr(0, MAX_MESSAGE_LEN);
    this.setState({ message: trimmedMessage !== '' ? trimmedMessage : null });
  };

  handleDurationChange = (evt) => {
    const value = evt.target.value;
    let duration = value === '' || isNaN(value) ? 0 : parseInt(value, 10);
    if (duration <= MIN_DURATION) duration = MIN_DURATION;
    else if (duration >= MAX_DURATION) duration = MAX_DURATION;
    this.setState({ duration: duration !== '' ? duration : null });
  };

  renderModalFooter = () => {
    const { authorizationType } = this.state;
    return (
      <div className={styles.modalFooter}>
        <Button
          className={styles.borderedButton}
          onClick={() => this.setState({ confirmationModalShown: false })}
          status="transparent"
        >
          Go back
        </Button>
        <Button onClick={() => this.authorizeRequest(authorizationType)} status="default">
          Yes
        </Button>
      </div>
    );
  };

  componentDidMount() {
    ManagerInterface.getAuthListRequests().then((res) => {
      this.setState({
        authListRequests: res,
        lastUpdate: Date.now(),
      });
    });
    // Used to poll AuthlistRequests every AUTHORIZATION_POLLING_TIMEOUT miliseconds
    if (this.pollingInterval) clearInterval(this.pollingInterva);
    this.pollingInterval = setInterval(
      () => {
        ManagerInterface.getAuthListRequests().then((res) => {
          this.setState({
            authListRequests: res,
            lastUpdate: Date.now(),
          });
        });
      },
      this.props.pollingTimeout ? this.props.pollingTimeout * 1000 : DEFAULT_POLLING_TIMEOUT,
    );

    ManagerInterface.getTopicData('event-telemetry').then((data) => {
      const cscList = ['All'].concat(
        Object.keys(data)
          .map((x) => `${x}:0`)
          .sort(),
      );
      this.setState({ cscOptions: cscList });
    });

    // Used to update Table every second and see duration animation
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.setState((prevState) => ({ counter: prevState.counter + 1 }));
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.pollingInterval);
    clearInterval(this.timer);
  }

  render() {
    const {
      showing,
      cscOptions,
      selectedCSC,
      keywords,
      confirmationModalShown,
      confirmationModalText,
      moreModalShown,
      message,
      duration,
      selectedStartDate,
      selectedEndDate,
      selectedRequest,
      authListRequests,
      lastUpdate,
    } = this.state;

    let filteredTableData = authListRequests.filter((row) => row.status === showing);

    filteredTableData = filteredTableData.filter((row) => {
      if (selectedCSC === 'All') return true;
      if (selectedCSC !== 'All' && row.cscs_to_change.includes(selectedCSC)) return true;
      return false;
    });

    filteredTableData = filteredTableData.filter((row) => {
      if (keywords === '') return true;
      if (JSON.stringify(row).includes(keywords)) return true;
      return false;
    });

    filteredTableData = filteredTableData.filter((row) => {
      const requestedDate = Moment(row.requested_at);
      const range = moment.range(selectedStartDate, selectedEndDate);
      return range.contains(requestedDate);
    });

    const nextUpdate = lastUpdate
      ? lastUpdate + (this.props.pollingTimeout ? this.props.pollingTimeout * 1000 : DEFAULT_POLLING_TIMEOUT)
      : null;
    let leftToUpdate = nextUpdate ? Math.floor(Moment(nextUpdate).diff(Date.now()) / 1000) : 'unknown';
    if (leftToUpdate <= 0) {
      leftToUpdate = `${this.props.pollingTimeout ? this.props.pollingTimeout : DEFAULT_POLLING_TIMEOUT} seconds`;
    } else if (leftToUpdate > 0 && leftToUpdate !== 1) {
      leftToUpdate = `${leftToUpdate} seconds`;
    } else if (leftToUpdate === 1) {
      leftToUpdate = '1 second';
    }

    return (
      <div id={this.id} className={styles.CSCAuthListAdminContainer}>
        <div className={styles.tableContainer}>
          <div className={styles.tableSelect}>
            <span>Showing</span>
            <Select value={showing} onChange={this.handleChange} options={STATUS_OPTIONS} />
          </div>
          <hr></hr>
          <p className={styles.lastUpdate}>Next update in {leftToUpdate}</p>
          <div className={styles.filters}>
            <div className={styles.label}>CSC</div>
            <Select
              options={cscOptions}
              option={selectedCSC}
              onChange={({ value }) => this.setState({ selectedCSC: value })}
              className={styles.select}
            />
            <Input placeholder="Filter by keywords" onChange={(e) => this.setState({ keywords: e.target.value })} />
          </div>
          <div className={styles.dateTimeContainer}>
            <DateTimeRange
              onChange={this.handleDateTimeChange}
              label="Date & Time"
              startDate={new Date() - 24 * 60 * 60 * 1000 * 5}
              endDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
            />
          </div>
          <PaginatedTable headers={this.TABLE_HEADERS[showing]} data={filteredTableData} counter={this.state.counter} />
        </div>
        <Modal
          displayTopBar={false}
          isOpen={!!confirmationModalShown}
          onRequestClose={() => this.setState({ confirmationModalShown: false })}
          parentSelector={() => document.querySelector(`#${this.id}`)}
          size={50}
        >
          {confirmationModalText}
          {this.renderModalFooter()}
        </Modal>
        <Modal
          displayTopBar={false}
          isOpen={!!moreModalShown}
          onRequestClose={() => this.setState({ moreModalShown: false })}
          parentSelector={() => document.querySelector(`#${this.id}`)}
        >
          <div className={styles.moreModal}>
            <div>Request identity</div>
            <div>{selectedRequest?.requested_by}</div>
            <div>CSC to change</div>
            <div>{selectedRequest?.cscs_to_change}</div>
            <div>Authorized users</div>
            <div>{selectedRequest?.authorized_users}</div>
            <div>Non authorized CSCs</div>
            <div>{selectedRequest?.unauthorized_cscs}</div>
            <div className={[styles.messageRow, styles.coloredCell].join(' ')}>Message</div>
            <TextArea value={message} callback={this.handleMessageChange} onKeyDown={() => null} onKeyUp={() => null} />
            <div className={styles.coloredCell}>
              <span>Duration (minutes)</span>
              <Hoverable top={true} center={true} inside={true}>
                <span className={styles.infoIcon}>
                  <InfoIcon />
                </span>
                <div className={styles.hover}>A duration of 0 or blank equals to no limit</div>
              </Hoverable>
            </div>
            <Input value={duration} onChange={this.handleDurationChange} />
          </div>
          <div className={styles.modalFooter}>
            <Button
              className={styles.borderedButton}
              onClick={() => this.setState({ moreModalShown: false })}
              status="transparent"
            >
              Go back
            </Button>
            <div className={styles.confirmButtons}>
              <Button onClick={() => this.authorizeRequest('Reject')} status="default">
                Reject request
              </Button>
              <Button onClick={() => this.authorizeRequest('Accept')} status="default">
                Accept request
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
