import PropTypes from 'prop-types';
import React, { Component } from 'react';
import lodash from 'lodash';
import ManagerInterface from 'Utils';
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
      userIdentity: '',
      requestPanelActive: false,
      csc_to_change: '',
      authorize_users: '',
      unauthorize_cscs: '',
      message: '',
      duration: '',
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
        val.authorizedUsers.split(',').forEach((x) => userOptions.add(x));
      });
      this.setState({ userOptions: ['All', ...Array.from(userOptions)] });
    }
  }

  componentWillUnmount() {
    this.props.unsubscribeToStream();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.subscriptions !== this.props.subscriptions) {
      const subscribedCSCs = this.props.subscriptions.map((x) => {
        const tokens = x.split('-');
        return `${tokens[1]}:${tokens[2]}`;
      });
      this.setState({ cscOptions: ['All', ...subscribedCSCs] });
    }

    if (JSON.stringify(prevProps.authlistState) !== JSON.stringify(this.props.authlistState)) {
      const userOptions = new Set();
      Object.entries(this.props.authlistState).forEach(([, val]) => {
        val.authorizedUsers.split(',').forEach((x) => userOptions.add(x));
      });
      this.setState({ userOptions: ['All', ...Array.from(userOptions)] });
    }
  }

  formatList = (target, identities, type) => {
    if (identities === '') {
      return <span>None</span>;
    }
    return (
      <div className={styles.identitiesCell}>
        {identities.split(',').map((v, i) => (
          <div key={i} className={styles.authlistIdentity}>
            <span>{v}</span>
            <Hoverable top={true} center={true} inside={true}>
              <span onClick={() => this.removeIdentity(target, v, type)}>x</span>
              <div className={styles.removalTooltip}>Request {type} removal</div>
            </Hoverable>
          </div>
        ))}
      </div>
    );
  };

  removeIdentity = (targetCSC, identityToRemove, type) => {
    const { user } = this.props;
    const { userIdentity } = this.state;
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
          ManagerInterface.requestAuthListAuthorization(user, targetCSC, `-${identityToRemove}`, '').then(() => {
            this.setState({ removeIdentityModalShown: false });
          });
        },
      });
    } else if (type === 'CSC') {
      this.setState({
        removeIdentityRequest: () => {
          ManagerInterface.requestAuthListAuthorization(user, targetCSC, '', `-${identityToRemove}`).then(() => {
            this.setState({ removeIdentityModalShown: false });
          });
        },
      });
    }
  };

  restoreToDefault(...args) {
    const { user, authlistState } = this.props;
    for (let i = 0; i < args.length; i++) {
      const selectedCSC = args[i];
      const authlist = Object.entries(authlistState).find(([key]) => {
        const keyTokens = key.split('-');
        const csc = `${keyTokens[1]}:${keyTokens[2]}`;
        return csc === selectedCSC;
      })[1];

      const cscsToChange = selectedCSC;
      const authorizedUsers = authlist.authorizedUsers
        .split(',')
        .map((x) => `-${x}`)
        .join(',');
      const nonAuthorizedCSCs = authlist.nonAuthorizedCSCs
        .split(',')
        .map((x) => `-${x}`)
        .join(',');
      console.log('Request: ', cscsToChange, authorizedUsers, nonAuthorizedCSCs);
      // ManagerInterface.requestAuthListAuthorization(user, cscsToChange, authorizedUsers, nonAuthorizedCSCs);
    }
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
      render: (cell, row) => this.formatList(row.csc, cell, 'User'),
      className: styles.authlistIdentityColum,
    },
    {
      field: 'nonAuthorizedCSCs',
      title: 'Unauthorized CSCs',
      render: (cell, row) => this.formatList(row.csc, cell, 'CSC'),
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

  renderRequestPanel = () => {
    return (
      <div className={styles.boxNewRequest}>
        <div className={styles.labelsInputsNewRequest}>
          <div className={styles.itemsBoxNewRequest}>
            <div className={styles.label2}>CSCs to change</div>
            <div className={styles.label2}>Authorized Users</div>
            <div className={styles.label2}>Non-Authorized CSCs</div>
            <div className={styles.labelMsg}>Message</div>
            <div className={styles.labelDuration}>
              <span>Duration (minutes)</span>
              <Hoverable top={true} center={true} inside={true}>
                <span className={styles.infoIcon}>
                  <InfoIcon />
                </span>
                <div className={styles.hover}>A duration of 0 or blank equals to no limit</div>
              </Hoverable>
            </div>
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
                  {this.state.csc_to_change === '' ? 'This field is required' : ''}
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
                    ? 'Please insert items separated by commas with the required format'
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
                    ? 'Please insert items separated by commas with the required format'
                    : ''}
                </span>
              </div>
            </div>
            <div className={styles.textAreaNewRequest}>
              <TextArea
                value={this.state.message}
                callback={this.handleMessageChange}
                onKeyDown={() => null}
                onKeyUp={() => null}
              />
            </div>
            <div className={styles.inputNewRequest}>
              <Input value={this.state.duration} onChange={this.handleDurationChange} />
            </div>
          </div>
        </div>
        <div className={styles.btnSend}>
          <Button onClick={() => this.sendRequest()}>Commit New Authorization</Button>
        </div>
      </div>
    );
  };

  sendRequest() {
    const { user } = this.props;
    const { csc_to_change, authorize_users, unauthorize_cscs, message, duration } = this.state;

    this.setState({ wrong_input_users: false, wrong_input_cscs: false });

    const passA = authorize_users.split(',').every((x) => x.charAt(0) === '+' || x.charAt(0) === '-');
    const passB = unauthorize_cscs.split(',').every((x) => x.charAt(0) === '+' || x.charAt(0) === '-');

    const emptyA = authorize_users === '';
    const emptyB = unauthorize_cscs === '';

    const passCSC = csc_to_change.length > 0;

    if (!passA) {
      // send error message for authorized users
      this.setState({ wrong_input_users: true });
    }
    if (!passB) {
      // send error message for unauthorized cscs
      this.setState({ wrong_input_cscs: true });
    }
    if (passCSC && ((passA && passB) || (passA && emptyB) || (passB && emptyA))) {
      ManagerInterface.requestAuthListAuthorization(
        user,
        csc_to_change,
        authorize_users,
        unauthorize_cscs,
        message,
        duration,
      ).then(() => {
        this.setState({
          csc_to_change: '',
          authorize_users: '',
          unauthorize_cscs: '',
          message: '',
          duration: '',
          isActive: false,
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

    // console.log(authlistAdminPermission);

    const tableData = Object.entries(authlistState).map(([key, val]) => {
      const keyTokens = key.split('-');
      return { csc: `${keyTokens[1]}:${keyTokens[2]}`, ...val };
    });

    const filteredByData = tableData.filter((row) => row.authorizedUsers !== '' || row.nonAuthorizedCSCs !== '');

    const filteredTableData = tableData.filter((row) => {
      if (selectedCSC === 'All' && selectedUser === 'All') return true;
      if (selectedCSC === 'All' && selectedUser !== 'All' && row.authorizedUsers.includes(selectedUser)) return true;
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
          <Button
            status="default"
            disabled={!authlistAdminPermission}
            onClick={() => this.restoreToDefault(...filteredByKeywordsTableData.map((x) => x.csc))}
          >
            Restore all CSCs to default
          </Button>
        </div>
        <SimpleTable headers={this.HEADERS} data={filteredByKeywordsTableData} />
        <Button
          onClick={() => this.setState((prevState) => ({ requestPanelActive: !prevState.requestPanelActive }))}
          className={!this.state.requestPanelActive ? styles.buttonNewRequest : styles.buttonCancelNewRequest}
        >
          <span className={styles.textNewRequest}>
            {!this.state.requestPanelActive ? '+ New CSC Request From' : '- Cancel New CSC Request From'}
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
