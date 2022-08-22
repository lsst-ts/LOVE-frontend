import PropTypes from 'prop-types';
import React, { Component } from 'react';
import lodash from 'lodash';
import isEqual from 'lodash/isEqual';
import ManagerInterface, { getUserHost } from 'Utils';
import { AUTHLIST_REQUEST_ACCEPTED } from 'Constants';
import SimpleTable from 'components/GeneralPurpose/SimpleTable/SimpleTable';
import Hoverable from 'components/GeneralPurpose/Hoverable/Hoverable';
import Modal from 'components/GeneralPurpose/Modal/Modal';
import Button from 'components/GeneralPurpose/Button/Button';
import Select from 'components/GeneralPurpose/Select/Select';
import Input from 'components/GeneralPurpose/Input/Input';
import SimplePanel from 'components/GeneralPurpose/SimplePanel/SimplePanel';
import TextArea from 'components/GeneralPurpose/TextArea/TextArea';
import InfoIcon from 'components/icons/InfoIcon/InfoIcon';
import styles from './SummaryAuthList.module.css';

const MAX_MESSAGE_LEN = 320;
const MAX_DURATION = 60;
const MIN_DURATION = 0;
export default class SummaryAuthList extends Component {
  static propTypes = {
    subscriptions: PropTypes.arrayOf(PropTypes.string).isRequired,
    subscribeToStream: PropTypes.func,
    unsubscribeToStream: PropTypes.func,
    authlistState: PropTypes.object,
    user: PropTypes.string,
    authlistAdminPermission: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.id = lodash.uniqueId('summary-authlist-');
    this.state = {
      selectedCSC: 'All',
      selectedUser: 'All',
      keywords: '',
      cscOptions: ['All'],
      userOptions: ['All'],
      removeIdentityModalShown: false,
      removeIdentityModalText: '',
      removeIdentityRequest: null,
      requestPanelActive: false,
      csc_to_change: '',
      authorize_users: '',
      unauthorize_cscs: '',
      message: '',
      duration: '',
      wrong_csc_to_change: false,
      wrong_input_users: false,
      wrong_input_cscs: false,
    };
  }

  componentDidMount() {
    this.props.subscribeToStream();

    if (this.props.subscriptions) {
      const subscribedCSCs = this.props.subscriptions.map((x) => {
        const tokens = x.split('-');
        return `${tokens[1]}:${tokens[2]}`;
      });
      this.setState({ cscOptions: ['All', ...subscribedCSCs] });
    }

    if (this.props.authlistState) {
      const userOptions = new Set();
      Object.entries(this.props.authlistState).forEach(([, val]) => {
        val?.[0]?.authorizedUsers?.value.split(',').forEach((x) => userOptions.add(x));
      });
      this.setState({ userOptions: ['All', ...Array.from(userOptions)] });
    }
  }

  componentWillUnmount() {
    this.props.unsubscribeToStream();
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.subscriptions, this.props.subscriptions)) {
      const subscribedCSCs = this.props.subscriptions.map((x) => {
        const tokens = x.split('-');
        return `${tokens[1]}:${tokens[2]}`;
      });
      this.setState({ cscOptions: ['All', ...subscribedCSCs] });
    }

    if (!isEqual(prevProps.authlistState, this.props.authlistState)) {
      const userOptions = new Set();
      Object.entries(this.props.authlistState).forEach(([, val]) => {
        val?.[0]?.authorizedUsers?.value.split(',').forEach((x) => userOptions.add(x));
      });
      this.setState({ userOptions: ['All', ...Array.from(userOptions)] });
    }
  }

  formatList = (target, identities, type) => {
    if (!identities || identities === '') {
      return <span>None</span>;
    }

    const { host } = window.location;
    const { user } = this.props;
    // const selfRemove = getUserHost(user, host) == identities;}
    return (
      <div className={styles.identitiesCell}>
        {identities.split(',').map((v, i) => (
          <div key={i} className={styles.authlistIdentity}>
            <span>{v}</span>
            {this.props.authlistAdminPermission || v === getUserHost(user, host) ? (
              <Hoverable top={true} center={true} inside={true}>
                <span onClick={() => this.removeIdentity(target, v, type)}>x</span>
                <div className={styles.removalTooltip}>Request {type} removal</div>
              </Hoverable>
            ) : (
              ''
            )}
          </div>
        ))}
      </div>
    );
  };

  removeIdentity = (targetCSC, identityToRemove, type) => {
    const { host } = window.location;
    const { user } = this.props;
    const userIdentity = getUserHost(user, host);
    let modalText = '';
    if (type === 'CSC') {
      modalText = (
        <span>
          You are about to request the removal of <b>{identityToRemove}</b> from <b>{targetCSC}</b> unauthorization
          list.
          <br></br>
          Are you sure?
        </span>
      );
    } else if (type === 'User') {
      if (userIdentity !== identityToRemove) {
        modalText = (
          <span>
            You are about to request the removal of <b>{identityToRemove}</b> from <b>{targetCSC}</b> authorization list
            <br></br>
            Are you sure?
          </span>
        );
      } else {
        modalText = (
          <span>
            You are about to relinquish your authorization.
            <br></br>
            <b>This action will be resolved automatically and won't need verification</b>
            <br></br>
            Are you sure?
          </span>
        );
      }
    }

    this.setState({
      removeIdentityModalShown: true,
      removeIdentityModalText: modalText,
    });

    if (type === 'User') {
      this.setState({
        removeIdentityRequest: () => {
          ManagerInterface.requestAuthListAuthorization(user, targetCSC, `-${identityToRemove}`, '').then((response) => {
            this.sendAuthorizeCommands(response);
            this.setState({ removeIdentityModalShown: false });
          });
        },
      });
    } else if (type === 'CSC') {
      this.setState({
        removeIdentityRequest: () => {
          ManagerInterface.requestAuthListAuthorization(user, targetCSC, '', `-${identityToRemove}`).then((response) => {
            this.sendAuthorizeCommands(response);
            this.setState({ removeIdentityModalShown: false });
          });
        },
      });
    }
  };

  restoreToDefault(cscToChange) {
    const { user, authlistState } = this.props;
    const authlist = Object.entries(authlistState).find(([key]) => {
      const keyTokens = key.split('-');
      const csc = `${keyTokens[1]}:${keyTokens[2]}`;
      return csc === cscToChange;
    })[1]?.[0];
    if (!authlist) return;

    const authorizedUsers =
      authlist.authorizedUsers.value !== ''
        ? authlist.authorizedUsers.value
            .split(',')
            .map((x) => `-${x}`)
            .join(',')
        : '';
    const nonAuthorizedCSCs =
      authlist.nonAuthorizedCSCs.value !== ''
        ? authlist.nonAuthorizedCSCs.value
            .split(',')
            .map((x) => `-${x}`)
            .join(',')
        : '';

    let modalText = '';
    modalText = (
      <span>
        You are about to empty the authorization list of <b>{cscToChange}</b>.<br></br>
        <b>This action will be resolved automatically and won't need verification</b>
        <br></br>
        Are you sure?
      </span>
    );

    this.setState({
      removeIdentityModalShown: true,
      removeIdentityModalText: modalText,
      removeIdentityRequest: () => {
        ManagerInterface.requestAuthListAuthorization(user, cscToChange, authorizedUsers, nonAuthorizedCSCs).then(
          (response) => {
            this.sendAuthorizeCommands(response);
            this.setState({ removeIdentityModalShown: false });
          },
        );
      },
    });
  }

  restoreAllToDefault() {
    const { user, authlistState } = this.props;
    const requests = [];
    Object.entries(authlistState).forEach(([key, val]) => {
      if (
        !val
        || (val[0].authorizedUsers.value === '' && val[0].nonAuthorizedCSCs.value === '')
      ) return;

      const keyTokens = key.split('-');
      const csc = `${keyTokens[1]}:${keyTokens[2]}`;

      const authorizedUsers =
        val[0].authorizedUsers.value !== ''
          ? val[0].authorizedUsers.value
              .split(',')
              .map((x) => `-${x}`)
              .join(',')
          : '';

      const nonAuthorizedCSCs =
        val[0].nonAuthorizedCSCs.value !== ''
          ? val[0].nonAuthorizedCSCs.value
              .split(',')
              .map((x) => `-${x}`)
              .join(',')
          : '';

      requests.push(() => ManagerInterface.requestAuthListAuthorization(user, csc, authorizedUsers, nonAuthorizedCSCs).then((response) => {
        this.sendAuthorizeCommands(response);
      }));
    });

    let modalText = '';
    modalText = (
      <span>
        You are about to empty <b>all</b> the authorization lists.<br></br>
        <b>This action will be resolved automatically and won't need verification</b>
        <br></br>
        Are you sure?
      </span>
    );

    this.setState({
      removeIdentityModalShown: true,
      removeIdentityModalText: modalText,
      removeIdentityRequest: () => {
        requests.forEach((request) => request());
        this.setState({ removeIdentityModalShown: false });
      },
    });
  }

  HEADERS = [
    {
      field: 'csc',
      title: 'CSC',
      render: (cell) => <b>{cell}</b>,
    },
    {
      field: 'authorizedUsers',
      title: 'Authorized users',
      render: (cell, row) => this.formatList(row.csc, cell.value, 'User'),
      className: styles.authlistIdentityColum,
    },
    {
      field: 'nonAuthorizedCSCs',
      title: 'Unauthorized CSCs',
      render: (cell, row) => this.formatList(row.csc, cell.value, 'CSC'),
      className: styles.authlistIdentityColum,
    },
    {
      field: 'actions',
      title: 'Actions',
      render: (_, row) => (
        <Button
          status="default"
          disabled={!this.props.authlistAdminPermission}
          onClick={() => this.restoreToDefault(row.csc)}
        >
          Restore to default
        </Button>
      ),
    },
  ];

  renderModalFooter = () => {
    const { removeIdentityRequest } = this.state;
    return (
      <div className={styles.modalFooter}>
        <Button
          className={styles.borderedButton}
          onClick={() => this.setState({ removeIdentityModalShown: false })}
          status="transparent"
        >
          Cancel request
        </Button>
        <Button onClick={removeIdentityRequest} status="default">
          Request removal
        </Button>
      </div>
    );
  };

  formatInputText = (value) => {
    let tokens = value.split(',');
    tokens = tokens.map((x) => x.trim());
    const returnValue = tokens.join(',');
    return returnValue;
  };

  handleMessageChange = (message) => {
    const trimmedMessage = message.substr(0, MAX_MESSAGE_LEN);
    this.setState({ message: trimmedMessage });
  };

  handleDurationChange = (evt) => {
    const value = evt.target.value;
    let duration = value === '' || isNaN(value) ? 0 : parseInt(value, 10);
    if (duration <= MIN_DURATION) duration = MIN_DURATION;
    else if (duration >= MAX_DURATION) duration = MAX_DURATION;
    this.setState({ duration });
  };

  renderRequestPanel = () => {
    return (
      <div className={styles.boxNewRequest}>
        <div className={styles.labelsInputsNewRequest}>
          <div className={styles.itemsBoxNewRequest}>
            <div className={styles.label2}>CSCs to change</div>
            <div className={styles.label2}>Authorized Users</div>
            <div className={styles.label2}>Non-Authorized CSCs</div>
            {this.props.authlistAdminPermission && <div className={styles.labelMsg}>Message</div>}
            {this.props.authlistAdminPermission && (
              <div className={styles.labelDuration}>
                <span>Duration (minutes)</span>
                <Hoverable top={true} center={true} inside={true}>
                  <span className={styles.infoIcon}>
                    <InfoIcon />
                  </span>
                  <div className={styles.hover}>A duration of 0 or blank equals to no limit</div>
                </Hoverable>
              </div>
            )}
          </div>
          <div className={styles.itemsBoxNewRequest}>
            <div className={styles.inputNewRequest}>
              <Input
                value={this.state.csc_to_change}
                placeholder="Insert items separated by commas"
                onChange={(e) => this.setState({ csc_to_change: this.formatInputText(e.target.value) })}
              ></Input>
              <div>
                <span className={styles.wrongInput}>
                  {this.state.wrong_csc_to_change ? 'This field is required' : ''}
                </span>
              </div>
            </div>
            <div className={styles.inputNewRequest}>
              <Input
                value={this.state.authorize_users}
                placeholder="Insert items separated by commas"
                onChange={(e) => this.setState({ authorize_users: this.formatInputText(e.target.value) })}
              ></Input>
              <div>
                <span className={styles.wrongInput}>
                  {this.state.wrong_input_users
                    ? 'Please insert items separated by commas with the required format: +/-<user>@<host>'
                    : ''}
                </span>
              </div>
            </div>
            <div className={styles.inputNewRequest}>
              <Input
                value={this.state.unauthorize_cscs}
                placeholder="Insert items separated by commas"
                onChange={(e) => this.setState({ unauthorize_cscs: this.formatInputText(e.target.value) })}
              ></Input>
              <div>
                <span className={styles.wrongInput}>
                  {this.state.wrong_input_cscs
                    ? 'Please insert items separated by commas with the required format: +/-<CSC>:<salindex>'
                    : ''}
                </span>
              </div>
            </div>
            {this.props.authlistAdminPermission && (
              <div className={styles.textAreaNewRequest}>
                <TextArea
                  value={this.state.message}
                  callback={this.handleMessageChange}
                  onKeyDown={() => null}
                  onKeyUp={() => null}
                />
              </div>
            )}
            {this.props.authlistAdminPermission && (
              <div className={styles.inputNewRequest}>
                <Input value={this.state.duration} onChange={this.handleDurationChange} />
              </div>
            )}
          </div>
        </div>
        <div className={styles.btnSend}>
          <Button onClick={() => this.sendRequest()}>Commit New Authorization</Button>
        </div>
      </div>
    );
  };

  sendAuthorizeCommands(responses) {
    responses.forEach((resp) => {
      if (resp.status === AUTHLIST_REQUEST_ACCEPTED) {
        const cmdPayload = {
          cmd: 'cmd_requestAuthorization',
          params: {
            cscsToChange: resp.cscs_to_change,
            authorizedUsers: resp.authorized_users,
            nonAuthorizedCSCs: resp.unauthorized_cscs,
          }
        };
        this.props.requestAuthorizeCommand(cmdPayload);
      }
    });
  }

  sendRequest() {
    const { user } = this.props;
    const { csc_to_change, authorize_users, unauthorize_cscs, message, duration, wrong_csc_to_change } = this.state;

    this.setState({ wrong_input_users: false, wrong_input_cscs: false });

    const passA = authorize_users.split(',').every((x) => x.charAt(0) === '+' || x.charAt(0) === '-');
    const passB = unauthorize_cscs.split(',').every((x) => x.charAt(0) === '+' || x.charAt(0) === '-');

    const emptyA = authorize_users === '';
    const emptyB = unauthorize_cscs === '';

    if (csc_to_change === '') {
      this.setState({ wrong_csc_to_change: true });
    } else {
      this.setState({ wrong_csc_to_change: false });
    }

    if (!passA) {
      // send error message for authorized users
      this.setState({ wrong_input_users: true });
    }
    if (!passB) {
      // send error message for unauthorized cscs
      this.setState({ wrong_input_cscs: true });
    }
    if (!(csc_to_change === '') && ((passA && passB) || (passA && emptyB) || (passB && emptyA))) {
      ManagerInterface.requestAuthListAuthorization(
        user,
        csc_to_change,
        authorize_users,
        unauthorize_cscs,
        message,
        duration,
      ).then((response) => {
        this.sendAuthorizeCommands(response);
        this.setState({
          csc_to_change: '',
          authorize_users: '',
          unauthorize_cscs: '',
          message: '',
          duration: '',
          isActive: false,
          wrong_csc_to_change: false,
          wrong_input_users: false,
          wrong_input_cscs: false,
        });
      });
    }
  }

  render() {
    const { authlistState, authlistAdminPermission } = this.props;
    const {
      selectedCSC,
      selectedUser,
      keywords,
      cscOptions,
      userOptions,
      removeIdentityModalShown,
      removeIdentityModalText,
    } = this.state;

    const tableData = Object.entries(authlistState).map(([key, val]) => {
      const keyTokens = key.split('-');
      return { csc: `${keyTokens[1]}:${keyTokens[2]}`, ...(val?.[0] ?? {}) };
    });

    const filteredByData = tableData.filter(
      (row) =>
        (row.authorizedUsers && row.authorizedUsers?.value !== '') ||
        (row.nonAuthorizedCSCs && row.nonAuthorizedCSCs.value !== ''),
    );

    const filteredTableData = filteredByData.filter((row) => {
      if (selectedCSC === 'All' && selectedUser === 'All') return true;
      if (selectedCSC === 'All' && selectedUser !== 'All' && row.authorizedUsers.value.includes(selectedUser))
        return true;
      if (selectedCSC !== 'All' && row.csc.includes(selectedCSC)) return true;
      return false;
    });

    const filteredByKeywordsTableData = filteredTableData.filter((row) => {
      if (keywords === '') return true;
      if (JSON.stringify(row).includes(keywords)) return true;
      return false;
    });

    return (
      <div id={this.id} ref={this.container} className={styles.summaryAuthlistContainer}>
        <div className={styles.filters}>
          <div className={styles.label}>CSC</div>
          <Select
            options={cscOptions}
            option={selectedCSC}
            onChange={({ value }) => this.setState({ selectedCSC: value })}
            className={styles.select}
          />
          <div className={styles.label}>Users</div>
          <Select
            options={userOptions}
            option={selectedUser}
            onChange={({ value }) => this.setState({ selectedUser: value })}
            className={styles.select}
          />
          <Input placeholder="Filter by keywords" onChange={(e) => this.setState({ keywords: e.target.value })} />
          <Button status="default" disabled={!authlistAdminPermission} onClick={() => this.restoreAllToDefault()}>
            Restore all CSCs to default
          </Button>
        </div>
        <SimpleTable headers={this.HEADERS} data={filteredByKeywordsTableData} />
        <Button
          onClick={() => this.setState((prevState) => ({ requestPanelActive: !prevState.requestPanelActive }))}
          className={!this.state.requestPanelActive ? styles.buttonNewRequest : styles.buttonCancelNewRequest}
        >
          <span className={styles.textNewRequest}>
            {!this.state.requestPanelActive ? '+ New CSC Request Form' : '- Cancel New CSC Request Form'}
          </span>
        </Button>
        <SimplePanel content={this.renderRequestPanel()} maxHeight={500} isActive={this.state.requestPanelActive} />
        <Modal
          displayTopBar={false}
          isOpen={!!removeIdentityModalShown}
          onRequestClose={() => this.setState({ removeIdentityModalShown: false })}
          contentLabel="Component selection modal"
          parentSelector={() => document.querySelector(`#${this.id}`)}
        >
          {removeIdentityModalText}
          {this.renderModalFooter()}
        </Modal>
      </div>
    );
  }
}
