import Moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from '../../GeneralPurpose/Button/Button';
import PaginatedTable from '../../GeneralPurpose/PaginatedTable/PaginatedTable';
import Select from '../../GeneralPurpose/Select/Select';
import ManagerInterface from '../../../Utils';
import styles from './AdminAuthList.module.css';

const COMMON_HEADERS = [
  { field: 'userhost', title: 'user@host' },
  { field: 'target_csc', title: 'Target CSC' },
  { field: 'requested_at', title: 'Time elapsed since request', render: (value, row) => Moment(value).fromNow() },
  { field: 'blocked_cscs', title: 'Blocked CSCs' },
  {
    field: 'restriction_duration',
    title: 'Restriction duration',
    render: (value, row) => {
      if (isNaN(value) || value <= 0) {
        return '-';
      }
      return Moment().subtract(value, 'seconds').fromNow(true);
    },
  },
];

const REJECTED_HEADERS = [
  ...COMMON_HEADERS,
  { field: 'resolved_by', title: 'Rejected by' },
  {
    field: 'resolved_at',
    title: 'Rejection date',
    render: (value, row) => Moment(value).format('YYYY-MM-DD HH:mm:ss'),
  },
];

const REVERTED_HEADERS = [
  ...COMMON_HEADERS,
  { field: 'resolved_by', title: 'Authorized by' },
  { field: 'resolved_at', title: 'Approval date', render: (value, row) => Moment(value).format('YYYY-MM-DD HH:mm:ss') },
  { field: 'reverted_by', title: 'Reverted by' },
  { field: 'reverted_at', title: 'Reverted date', render: (value, row) => Moment(value).format('YYYY-MM-DD HH:mm:ss') },
];

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending requests' },
  { value: 'ACCEPTED', label: 'Accepted requests' },
  { value: 'REJECTED', label: 'Rejected requests' },
  { value: 'REVERTED', label: 'Reverted requests' },
];

const FILTERS = {
  PENDING: 'Pending',
  ACCEPTED: 'Authorized',
  REJECTED: 'Denied',
  REVERTED: 'Reverted',
};

export default class AdminAuthList extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    authListRequests: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  state = {
    showing: STATUS_OPTIONS[0],
  };

  setRequestStatus(id, status) {
    return () => {
      ManagerInterface.setAuthListRequestStatus(id, status).then((res) => {
        this.props.onChange();
      });
    };
  }

  pending_headers = [
    ...COMMON_HEADERS,
    {
      field: 'action',
      title: '',
      render: (value, row) => {
        console.log(row);
        return (
          <>
            <Button className={styles.actionButton} onClick={this.setRequestStatus(row.id, 'Authorized')}>
              Accept
            </Button>
            <Button className={styles.actionButton} onClick={this.setRequestStatus(row.id, 'Denied')}>
              Reject
            </Button>
          </>
        );
      },
    },
  ];

  accepted_headers = [
    ...COMMON_HEADERS,
    { field: 'resolved_by', title: 'Authorized by' },
    {
      field: 'resolved_at',
      title: 'Approval date',
      render: (value, row) => Moment(value).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      field: 'action',
      title: '',
      render: (value, row) => (
        <Button className={styles.actionButton} onClick={this.setRequestStatus(row.id, 'Reverted')}>
          Revert request
        </Button>
      ),
    },
  ];

  table_headers = {
    PENDING: this.pending_headers,
    ACCEPTED: this.accepted_headers,
    REJECTED: REJECTED_HEADERS,
    REVERTED: REVERTED_HEADERS,
  };

  handleChange = (option) => this.setState({ showing: option });

  render() {
    const { authListRequests } = this.props;
    const { showing } = this.state;

    const filtered = (authListRequests || [])
      .filter((req) => req.status === FILTERS[showing.value])
      .map((req) => ({ userhost: `${req.username}@${req.hostname}`, ...req, blocked_cscs: req.blocked_cscs || '-' }));

    return (
      <div className={styles.CSCAuthListAdminContainer}>
        <div className={styles.header}>Admin Auth List</div>
        <div className={styles.tableContainer}>
          <div className={styles.tableSelect}>
            <span>Showing</span>
            <Select value={showing} onChange={this.handleChange} options={STATUS_OPTIONS} />
          </div>
          <PaginatedTable headers={this.table_headers[showing.value]} data={filtered} />
        </div>
      </div>
    );
  }
}
