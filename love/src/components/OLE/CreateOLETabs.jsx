import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ExposureAdd from './Exposure/ExposureAdd';
import NonExposureEdit from './NonExposure/NonExposureEdit';
import styles from './OLETabs.module.css';

export default class CreateOLETabs extends Component {
  static propTypes = {
    tabs: PropTypes.arrayOf(PropTypes.object),
    isLogCreate: PropTypes.bool,
  };

  static defaultProps = {
    tabs: [
    ],
    isLogCreate: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedTab: props.tabs[0].value,
    };
  }

  changeTab(tab) {
    this.setState({ selectedTab: tab });
  }

  componentDidMount() {
    this.props.subscribeToStreams();
  }

  componentWillUnmount() {
    this.props.unsubscribeToStreams();
  }

  getComponent(tab) {
    if (tab === 'exposure') {
      return (
        <ExposureAdd
          isLogCreate={this.props.isLogCreate}
          props={this.props}
        />
      );
    }
    if (tab === 'non-exposure') {
      return (
        <NonExposureEdit
          isLogCreate={this.props.isLogCreate}
          props={this.props}
        />
      );
    }
  }

  render() {
    const tabs = this.props.tabs;
    const selectedTab = this.state.selectedTab;

    const html = tabs.map((item, index) => {
      return (
        <div
          className={[styles.tab, selectedTab === item.value ? styles.selected : ''].join(' ')}
          key={index}
          onClick={() => this.changeTab(item.value)}
        >
          <div className={styles.tabLabel}>{item.name}</div>
        </div>
      );
    });
    
    return (
      <div className={styles.tabsWrapper}>
        <div className={styles.tabsRow}>
          { html }
        </div>
        <div className={styles.tableWrapper}>
          { this.getComponent(selectedTab) }
        </div>
      </div>
    );
  }
}