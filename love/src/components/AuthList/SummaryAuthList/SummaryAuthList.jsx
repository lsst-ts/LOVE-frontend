import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SimpleTable from 'components/GeneralPurpose/SimpleTable/SimpleTable';
import styles from './SummaryAuthList.module.css';

const HEADERS = [
  { field: 'csc', title: 'CSC' },
  { field: 'authorizedUsers', title: 'Authorized users' },
  { field: 'unauthorizeCSCs', title: 'Unauthorized CSCs' },
];

export default class SummaryAuthList extends Component {
  static propTypes = {
    subscriptions: PropTypes.arrayOf(PropTypes.string).isRequired,
    subscribeToStream: PropTypes.func,
    unsubscribeToStream: PropTypes.func,
  };

  componentDidMount() {
    this.props.subscribeToStream();
  }

  componentWillUnmount() {
    this.props.unsubscribeToStream();
  }

  render() {
    const { subscriptions } = this.props;
    // const { showing } = this.state;
    const tableData = subscriptions.map((sub) => {
      const subParts = sub.split('-');
      return {
        csc: `${subParts[1]}:${subParts[2]}`,
        authorizedUsers: this.props[sub]?.[0]?.authorizedUsers?.value ?? 'None',
        unauthorizeCSCs: this.props[sub]?.[0]?.nonAuthorizedCSCs?.value ?? 'None',
      };
    });

    return (
      <div className={styles.summaryAuthlistContainer}>
        <SimpleTable headers={HEADERS} data={tableData} />
      </div>
    );
  }
}
