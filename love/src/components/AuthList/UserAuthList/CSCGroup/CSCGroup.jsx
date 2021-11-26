import PropTypes from 'prop-types';
import React, { Component } from 'react';
import CSCDetail from '../CSCDetail/CSCDetail';
import CSCItem from '../CSCItem/CSCItem';
import styles from './CSCGroup.module.css';

export default class CSCGroup extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    cscs: PropTypes.array.isRequired,
    authlist: PropTypes.objectOf(
      PropTypes.shape({
        authorized_user: PropTypes.arrayOf(PropTypes.string),
        non_authorized_csc: PropTypes.arrayOf(PropTypes.string),
      }),
    ).isRequired,
    authlistRequests: PropTypes.arrayOf(PropTypes.object),
    reloadData: PropTypes.func,
  };

  static defaultProps = {
    name: '',
    cscs: [],
    authlist: {},
    authlistRequests: [],
  };

  state = {
    selectedCSC: null,
  };

  setSelectedCSC = (csc) => this.setState({ selectedCSC: csc });

  getRequets(csc) {
    const { authlistRequests } = this.props;
    return authlistRequests.filter((req) => req.target_csc === csc);
  }

  renderItems() {
    const { name, cscs, authlist, username, reloadData } = this.props;
    return (
      <>
        <div className={styles.CSCGroupTitle}>{name}</div>
        <div className={styles.separator}>
          <div />
        </div>
        <div className={styles.CSCDetailsContainer}>
          {cscs.map((item, index) => (
            <CSCItem
              key={index}
              csc={item.name}
              authlist={authlist[item.name]}
              authlistRequests={this.getRequets(item.name)}
              username={username}
              onClick={() => this.setSelectedCSC(item.name)}
              reloadData={reloadData}
            />
          ))}
        </div>
      </>
    );
  }

  renderDetail() {
    const { name, authlist } = this.props;
    const { selectedCSC } = this.state;
    return (
      <>
        <div className={styles.CSCGroupTitle}>
          <div className={styles.backButton} onClick={() => this.setSelectedCSC(null)}>
            {'<'} back
          </div>
          {name} {'>'} <b>{selectedCSC}</b>
        </div>
        <div className={styles.separator}>
          <div />
        </div>
        <CSCDetail authlist={authlist[selectedCSC]} />
      </>
    );
  }

  render() {
    let content;
    if (this.state.selectedCSC !== null) {
      content = this.renderDetail();
    } else {
      content = this.renderItems();
    }
    return <div className={styles.CSCGroupContainer}>{content}</div>;
  }
}
