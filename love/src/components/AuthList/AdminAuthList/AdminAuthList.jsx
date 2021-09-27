import Moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { DATE_TIME_FORMAT } from 'Config';
import ManagerInterface from 'Utils';
import PaginatedTable from 'components/GeneralPurpose/PaginatedTable/PaginatedTable';
import DateTimeRange from 'components/GeneralPurpose/DateTimeRange/DateTimeRange';
import Button from 'components/GeneralPurpose/Button/Button';
import Select from 'components/GeneralPurpose/Select/Select';
import Input from 'components/GeneralPurpose/Input/Input';
import styles from './AdminAuthList.module.css';

const example = [
  {
    requested_by: 'saranda@inria-ThinkPad-P50-3',
    cscs_to_change: 'ATDome:0',
    authorized_users: '+saranda@inria-ThinkPad-P50-3',
    unauthorized_cscs: '+MTPtg:0',
  },
  {
    requested_by: 'tribeiro@nb-tribeiro',
    cscs_to_change: 'ATDome:0',
    authorized_users: '-saranda@inria-ThinkPad-P50-3,+tribeiro@nb-tribeiro',
    unauthorized_cscs: '+MTPtg:0',
  },
  {
    requested_by: 'tribeiro@nb-tribeiro',
    cscs_to_change: 'ATDome:0, ATMCS:0',
    authorized_users: '-saranda@inria-ThinkPad-P50-3,+tribeiro@nb-tribeiro',
    unauthorized_cscs: '+MTPtg:0',
  },
];

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
    this.state = {
      showing: STATUS_OPTIONS[0].value,
      cscOptions: ['All'],
      keywords: '',
      selectedCSC: 'All',
      selectedDatetime: 'All',
    };
  }

  setRequestStatus(id, status) {
    return () => {
      ManagerInterface.setAuthListRequestStatus(id, status).then((res) => {
        this.props.onChange();
      });
    };
  }

  PENDING_HEADERS = [
    ...COMMON_HEADERS,
    {
      field: 'actions',
      title: 'Actions',
      render: (_, row) => {
        return (
          <>
            <Button className={styles.actionButton} onClick={this.setRequestStatus(row.id, 'Authorized')}>
              Accept
            </Button>
            <Button className={styles.actionButton} onClick={this.setRequestStatus(row.id, 'Denied')}>
              Reject
            </Button>
            <Button className={styles.actionButton} onClick={this.setRequestStatus(row.id, 'More')}>
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

  handleDateTimeChange = (event, type) => console.log(event, type);

  componentDidMount() {
    ManagerInterface.getAuthListRequests().then((res) => {
      console.log(res);
      this.setState({
        authListRequests: res,
      });
    });
  }

  render() {
    const { authListRequests } = this.props;
    const { showing, cscOptions, selectedCSC, keywords } = this.state;
    console.log(selectedCSC, keywords);

    // const filtered = (authListRequests || [])
    //   .filter((req) => req.status === FILTERS[showing.value])
    //   .map((req) => ({ userhost: `${req.username}@${req.hostname}`, ...req, blocked_cscs: req.blocked_cscs || '-' }));
    const filteredTableData = example.filter((row) => {
      if (selectedCSC === 'All') return true;
      if (selectedCSC !== 'All' && row.cscs_to_change.includes(selectedCSC)) return true;
      return false;
    });

    const filteredByKeywordsTableData = filteredTableData.filter((row) => {
      if (keywords === '') return true;
      if (JSON.stringify(row).includes(keywords)) return true;
      return false;
    });
    // console.log(this.TABLE_HEADERS[showing]);

    return (
      <div className={styles.CSCAuthListAdminContainer}>
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
            <DateTimeRange onChange={this.handleDateTimeChange} label="Date & Time" />
          </div>
          <PaginatedTable headers={this.TABLE_HEADERS[showing]} data={filteredByKeywordsTableData} />
        </div>
      </div>
    );
  }
}
