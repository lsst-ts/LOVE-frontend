import React, { Component } from 'react';
import { SUBICON_OPTIONS, UserAndSubIcon } from '../../../icons/UserAndSubIcon/UserAndSubIcon';
import AddIcon from '../../../icons/AddIcon/AddIcon';
import MinusIcon from '../../../icons/MinusIcon/MinusIcon';
import Button from '../../../GeneralPurpose/Button/Button';
import styles from './CSCItem.module.css';
import { FRONTEND_HOST } from '../../../../Config';
import ManagerInterface from '../../../../Utils';

const STATES = {
  HAS_PERMISSION: {
    key: 'HAS_PERMISSION',
    userReadable: 'Permitido',
    icon: <UserAndSubIcon subIcon={SUBICON_OPTIONS.HAS} />,
    iconHover: <MinusIcon className={styles.minusIcon} />,
    tooltip: 'Relinquish permission',
    confirmationMsg: 'relinquish',
  },
  PERMISSION_PENDING: {
    key: 'PERMISSION_PENDING',
    userReadable: 'Pendiente',
    icon: <UserAndSubIcon subIcon={SUBICON_OPTIONS.PENDING} />,
    iconHover: <UserAndSubIcon subIcon={SUBICON_OPTIONS.PENDING} />,
    tooltip: 'Waiting for approval',
    confirmationMsg: '',
  },
  NO_PERMISSION: {
    key: 'NO_PERMISSION',
    userReadable: 'No permitido',
    icon: <UserAndSubIcon subIcon={SUBICON_OPTIONS.NO} />,
    iconHover: <AddIcon innerClass={styles.addIcon} />,
    tooltip: 'Requests permission',
    confirmationMsg: 'request',
  },
};

export default class CSCItem extends Component {
  state = {
    hover: false,
    showConfirmation: false,
  };

  static defaultProps = {
    host: FRONTEND_HOST,
  };

  setHover = (value) => this.setState({ hover: value });
  setShowConfirmation(status) {
    if (status.key !== 'PERMISSION_PENDING') {
      return (event) => {
        event.stopPropagation();
        this.setState((state) => ({
          showConfirmation: !state.showConfirmation,
        }));
      };
    } else {
      return (event) => event.stopPropagation();
    }
  }

  relinquishAuthorization(requestId) {
    return () => {};
  }

  performRequest(status) {
    if (status.key === 'NO_PERMISSION') {
      return () => {
        const { csc, username, host, reloadData } = this.props;
        ManagerInterface.requestAuthListAuthorization(csc, username, host, null).then((response) => {
          reloadData();
          this.setState((state) => ({
            showConfirmation: false,
          }));
        });
      };
    }
    if (status.key === 'HAS_PERMISSION') {
      return () => {
        // TODO search the id of the accepted request for current authorization
        // ManagerInterface.setAuthListRequestStatus(id, 'Reverted').then((res) => {
        //   this.props.reloadData();
        this.setState({ showConfirmation: false });
        // });
      };
    }
    return () => this.setState({ showConfirmation: false });
  }

  render() {
    const { csc, authlist, username, host, onClick, authlistRequests } = this.props;
    const { hover, showConfirmation } = this.state;

    const users = authlist?.authorized_user || [];
    const cscs = authlist?.non_authorized_csc || [];
    const current = `${username}@${host}`;
    let status = STATES.NO_PERMISSION;

    if (users.some((u) => u === current)) {
      status = STATES.HAS_PERMISSION;
    } else if (authlistRequests.some((req) => req.status === 'Pending')) {
      status = STATES.PERMISSION_PENDING;
    }

    const onShowDialogClick = this.setShowConfirmation(status);

    return (
      <>
        <div className={styles.CSCItemContainer} onClick={onClick}>
          <div
            className={styles.iconContainer}
            onClick={onShowDialogClick}
            onMouseEnter={() => this.setHover(true)}
            onMouseLeave={() => this.setHover(false)}
          >
            {(hover || showConfirmation) && status.iconHover}
            {hover && <div className={styles.tooltip}>{status.tooltip}</div>}
            {!hover && !showConfirmation && status.icon}
          </div>
          <div className={styles.textContainer}>{csc}</div>
          <div className={styles.counter}>
            <span>A/U</span>
            <span>{users.length}</span>
          </div>
          <div className={styles.counter}>
            <span>U/CSC</span>
            <span>{cscs.length}</span>
          </div>
        </div>
        {showConfirmation && (
          <div className={styles.confirmationBox}>
            <span>
              Confirm request to {status.confirmationMsg} permission to {csc}
            </span>
            <Button onClick={this.performRequest(status)}>DO IT!</Button>
            <Button onClick={onShowDialogClick}>Abort</Button>
          </div>
        )}
      </>
    );
  }
}
