import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SimpleTable from 'components/GeneralPurpose/SimpleTable/SimpleTable';
import Hoverable from 'components/GeneralPurpose/Hoverable/Hoverable';
import Modal from 'components/GeneralPurpose/Modal/Modal';
import Button from 'components/GeneralPurpose/Button/Button';
import Select from 'components/GeneralPurpose/Select/Select';
import Input from 'components/GeneralPurpose/Input/Input';
import ManagerInterface from 'Utils';
import styles from './SummaryAuthList.module.css';

export default class SummaryAuthList extends Component {
  static propTypes = {
    subscriptions: PropTypes.arrayOf(PropTypes.string).isRequired,
    subscribeToStream: PropTypes.func,
    unsubscribeToStream: PropTypes.func,
  };

  constructor(props) {
    super(props);
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
      cscList: [],
    };
  }

  componentDidMount() {
    this.props.subscribeToStream();
    const userOptions = ['All', 'saranda@inria-ThinkPad-P50-3', 'tribeiro@nb-tribeiro'];
    this.setState({ userOptions });

    // Set CSCs list
    ManagerInterface.getTopicData('event-telemetry').then((data) => {
      const cscList = ['All'].concat(
        Object.keys(data)
          .map((x) => `${x}:0`)
          .sort(),
      );
      this.setState({ cscOptions: cscList });
    });
  }

  componentWillUnmount() {
    this.props.unsubscribeToStream();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.cscList !== this.state.cscList) {
      const subscriptions = this.state.cscList.map((csc) => {
        const [name, salindex] = csc.split(':');
        return `event-${name}-${salindex}-authList`;
      });
      console.log(subscriptions);
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
      // console.log(`Remove ${type} ${identityToRemove} from ${targetCSC}`);
      this.setState({
        removeIdentityRequest: () =>
          ManagerInterface.requestAuthListAuthorization(targetCSC, `-${identityToRemove}`, null),
      });
    } else if (type === 'CSC') {
      // console.log(`Remove ${type} ${identityToRemove} from ${targetCSC}`);
      this.setState({
        removeIdentityRequest: () =>
          ManagerInterface.requestAuthListAuthorization(targetCSC, null, `-${identityToRemove}`),
      });
    }
  };

  restoreToDefault() {
    for (let i = 0; i < arguments.length; i++) {
      // TODO restore to default endpoint
      console.log(`Restoring default on ${arguments[i]}`);
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
      field: 'unauthorizeCSCs',
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
          disabled={!this.props.commandExecutePermission}
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

  render() {
    const { subscriptions } = this.props;
    const {
      selectedCSC,
      selectedUser,
      keywords,
      cscOptions,
      userOptions,
      removeIdentityModalShown,
      removeIdentityModalText,
    } = this.state;
    const tableData = subscriptions.map((sub, i) => {
      const subParts = sub.split('-');
      let users = '';
      if (i == 0) {
        users = 'tribeiro@nb-tribeiro';
      } else if (i == 1) {
        users = 'saranda@inria-ThinkPad-P50-3';
      } else if (i == 2) {
        users = 'saranda@inria-ThinkPad-P50-3,tribeiro@nb-tribeiro';
      }
      return {
        csc: `${subParts[1]}:${subParts[2]}`,
        // authorizedUsers: this.props[sub]?.[0]?.authorizedUsers?.value ?? '',
        authorizedUsers: users,
        // unauthorizeCSCs: this.props[sub]?.[0]?.nonAuthorizedCSCs?.value ?? '',
        unauthorizeCSCs: 'MTPtg:1',
      };
    });

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
      <div id="container" className={styles.summaryAuthlistContainer}>
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
            disabled={!this.props.commandExecutePermission}
            onClick={() => this.restoreToDefault(...filteredByKeywordsTableData.map((x) => x.csc))}
          >
            Restore all CSCs to default
          </Button>
        </div>
        <SimpleTable headers={this.HEADERS} data={filteredByKeywordsTableData} />
        <Modal
          displayTopBar={false}
          isOpen={!!removeIdentityModalShown}
          onRequestClose={() => this.setState({ removeIdentityModalShown: false })}
          contentLabel="Component selection modal"
          parentSelector={() => document.querySelector('#container')}
          size={50}
        >
          {removeIdentityModalText}
          {this.renderModalFooter()}
        </Modal>
      </div>
    );
  }
}
