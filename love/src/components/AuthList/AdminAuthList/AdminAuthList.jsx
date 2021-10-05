import Moment from 'moment';
import { extendMoment } from 'moment-range';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import _ from 'lodash';
import { DATE_TIME_FORMAT } from 'Config';
import ManagerInterface from 'Utils';
import PaginatedTable from 'components/GeneralPurpose/PaginatedTable/PaginatedTable';
import DateTimeRange from 'components/GeneralPurpose/DateTimeRange/DateTimeRange';
import Button from 'components/GeneralPurpose/Button/Button';
import Select from 'components/GeneralPurpose/Select/Select';
import Input from 'components/GeneralPurpose/Input/Input';
import TextArea from 'components/GeneralPurpose/TextArea/TextArea';
import Modal from 'components/GeneralPurpose/Modal/Modal';
import Hoverable from 'components/GeneralPurpose/Hoverable/Hoverable';
import InfoIcon from 'components/icons/InfoIcon/InfoIcon';
import styles from './AdminAuthList.module.css';

const example = [
  {
    requested_by: 'saranda@inria-ThinkPad-P50-3',
    cscs_to_change: 'ATDome:0',
    authorized_users: '+saranda@inria-ThinkPad-P50-3',
    unauthorized_cscs: '+MTPtg:0',
    requested_at: '2021-10-01T21:30:01.173329Z',
  },
  {
    requested_by: 'tribeiro@nb-tribeiro',
    cscs_to_change: 'ATDome:0',
    authorized_users: '-saranda@inria-ThinkPad-P50-3,+tribeiro@nb-tribeiro',
    unauthorized_cscs: '+MTPtg:0',
    requested_at: '2021-10-01T21:30:01.173329Z',
  },
  {
    requested_by: 'tribeiro@nb-tribeiro',
    cscs_to_change: 'ATDome:0, ATMCS:0',
    authorized_users: '-saranda@inria-ThinkPad-P50-3,+tribeiro@nb-tribeiro',
    unauthorized_cscs: '+MTPtg:0',
    requested_at: '2021-10-01T21:30:01.173329Z',
  },
];

const MAX_MESSAGE_LEN = 320;
const MAX_DURATION = 60;
const MIN_DURATION = 0;

const moment = extendMoment(Moment);

const formatList = (identities, type) => {
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

const COMMON_HEADERS = [
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

const ACCEPTED_HEADERS = [
  ...COMMON_HEADERS,
  { field: 'resolved_by', title: 'Authorized by' },
  { field: 'resolved_at', title: 'Approved date', render: (value) => Moment(value).format(DATE_TIME_FORMAT) },
  { field: 'message', title: 'Message' },
  { field: 'duration', title: 'Duration' },
];

const REJECTED_HEADERS = [
  ...COMMON_HEADERS,
  { field: 'resolved_by', title: 'Rejected by' },
  { field: 'resolved_at', title: 'Rejected date', render: (value) => Moment(value).format(DATE_TIME_FORMAT) },
  { field: 'message', title: 'Message' },
];

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending requests' },
  { value: 'ACCEPTED', label: 'Accepted requests' },
  { value: 'REJECTED', label: 'Rejected requests' },
];

export default class AdminAuthList extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    authListRequests: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  constructor(props) {
    super(props);
    this.id = _.uniqueId('admin-authlist-');
    this.state = {
      showing: STATUS_OPTIONS[0].value,
      cscOptions: ['All'],
      keywords: '',
      selectedCSC: 'All',
      selectedStartDate: null,
      selectedEndDate: null,
      selectedRequest: null,
      confirmationModalShown: false,
      confirmationModalText: '',
      moreModalShown: false,
      message: '',
      duration: '',
    };
  }

  setRequestStatus(id, status) {
    return () => {
      ManagerInterface.setAuthListRequestStatus(id, status).then((res) => {
        this.props.onChange();
      });
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
      return this.setState({ moreModalShown: true, selectedRequest: row });
    }

    this.setState({
      confirmationModalShown: true,
      confirmationModalText: modalText,
      selectedRequest: row,
    });
  }

  PENDING_HEADERS = [
    ...COMMON_HEADERS,
    {
      field: 'actions',
      title: 'Actions',
      render: (_, row) => {
        return (
          <>
            <Button className={styles.actionButton} onClick={() => this.setAuthorization('Accept', row)}>
              Accept
            </Button>
            <Button className={styles.actionButton} onClick={() => this.setAuthorization('Reject', row)}>
              Reject
            </Button>
            <Button className={styles.actionButton} onClick={() => this.setAuthorization('More', row)}>
              More
            </Button>
          </>
        );
      },
    },
  ];

  TABLE_HEADERS = {
    PENDING: this.PENDING_HEADERS,
    ACCEPTED: ACCEPTED_HEADERS,
    REJECTED: REJECTED_HEADERS,
  };

  handleChange = (option) => this.setState({ showing: option.value });

  handleDateTimeChange = (date, type) => {
    console.log(date, type);
    if (type === 'start') {
      this.setState({ selectedStartDate: date });
    } else if (type === 'end') {
      this.setState({ selectedEndDate: date });
    }
  };

  handleMessageChange = (message) => {
    const trimmedMessage = message.substr(0, MAX_MESSAGE_LEN);
    // console.log(trimmedMessage);
    this.setState({ message: trimmedMessage });
  };

  handleDurationChange = (evt) => {
    const value = evt.target.value;
    let duration = value === '' || isNaN(value) ? 0 : parseInt(value, 10);
    if (duration <= MIN_DURATION) duration = MIN_DURATION;
    else if (duration >= MAX_DURATION) duration = MAX_DURATION;
    this.setState({ duration });
  };

  authorizeRequest(type) {
    const { selectedRequest, message } = this.state;
    console.log(type);
    console.log('Selected request', selectedRequest);
    console.log('Message', message);
    this.setState({ confirmationModalShown: false, moreModalShown: false });
  }

  renderModalFooter = () => {
    const { removeIdentityRequest } = this.state;
    return (
      <div className={styles.modalFooter}>
        <Button
          className={styles.borderedButton}
          onClick={() => this.setState({ confirmationModalShown: false })}
          status="transparent"
        >
          Cancel request
        </Button>
        <Button onClick={(evt) => this.authorizeRequest(evt)} status="default">
          Request removal
        </Button>
      </div>
    );
  };

  componentDidMount() {
    ManagerInterface.getAuthListRequests().then((res) => {
      // console.log(res);
      this.setState({
        authListRequests: res,
      });
    });
  }

  render() {
    const { authListRequests } = this.props;
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
    } = this.state;

    // const filtered = (authListRequests || [])
    //   .filter((req) => req.status === FILTERS[showing.value])
    //   .map((req) => ({ userhost: `${req.username}@${req.hostname}`, ...req, blocked_cscs: req.blocked_cscs || '-' }));
    let filteredTableData = example.filter((row) => {
      if (selectedCSC === 'All') return true;
      if (selectedCSC !== 'All' && row.cscs_to_change.includes(selectedCSC)) return true;
      return false;
    });

    filteredTableData = filteredTableData.filter((row) => {
      if (keywords === '') return true;
      if (JSON.stringify(row).includes(keywords)) return true;
      return false;
    });
    // console.log(this.TABLE_HEADERS[showing]);

    filteredTableData = filteredTableData.filter((row) => {
      const requestedDate = Moment(row.requested_at);
      const range = moment.range(selectedStartDate, selectedEndDate);
      console.log(requestedDate);
      console.log(range);
      console.log(range.contains(requestedDate));
      return range.contains(requestedDate);
    });

    return (
      <div id={this.id} className={styles.CSCAuthListAdminContainer}>
        <div className={styles.tableContainer}>
          <div className={styles.tableSelect}>
            <span>Showing</span>
            <Select value={showing} onChange={this.handleChange} options={STATUS_OPTIONS} />
          </div>
          <hr></hr>
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
            />
          </div>
          <PaginatedTable headers={this.TABLE_HEADERS[showing]} data={filteredTableData} />
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
          size={50}
        >
          <div className={styles.moreModal}>
            <div>Request identity</div>
            <div>tribeiro@lsst.org</div>
            <div>CSC to change</div>
            <div>MTPtg, MTMount</div>
            <div>Authorized users</div>
            <div>tribeiro@lsst.org</div>
            <div>Non authorized CSCs</div>
            <div>MTPtg, MTMount</div>
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
              onClick={() => this.setState({ confirmationModalShown: false })}
              status="transparent"
            >
              Cancel request
            </Button>
            <div className={styles.confirmButtons}>
              <Button onClick={() => this.authorizeRequest('reject')} status="default">
                Reject request
              </Button>
              <Button onClick={() => this.authorizeRequest('accept')} status="default">
                Accept request
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
