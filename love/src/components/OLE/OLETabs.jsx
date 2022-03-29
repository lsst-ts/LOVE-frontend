import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Exposure from './Exposure/Exposure';
import NonExposure from './NonExposure/NonExposure';
import Button from 'components/GeneralPurpose/Button/Button';
import AddIcon from 'components/icons/AddIcon/AddIcon';
import styles from './OLETabs.module.css';

export default class OLETabs extends Component {
  static propTypes = {
    tabs: PropTypes.arrayOf(PropTypes.object),
  };

  static defaultProps = {
    tabs: [
    ],
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
        <Exposure props={this.props}/>
      );
    }
    if (tab === 'non-exposure') {
      return (
        <NonExposure props={this.props}/>
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
          <div className={styles.btnNew}>
            <Button className={styles.btn} onClick={() => this.sendRequest()}>+ New {tabs.filter((tab) => tab.value === selectedTab)[0].name }</Button>
          </div>
        </div>
        <div className={styles.tableWrapper}>
          { this.getComponent(selectedTab) }
        </div>
      </div>
    );
  }
}