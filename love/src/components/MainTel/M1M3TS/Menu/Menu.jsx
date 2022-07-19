import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Menu.module.css';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Toggle from 'components/GeneralPurpose/Toggle/Toggle';

export default class Menu extends Component {
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      showFcuIDs: true,
      showTemperature: true,
      showWarnings: true,
    };
  }

  toggleFcuIDs = (show) => {
    this.setState({ showFcuIDs: show });
  };

  toggleTemperature = (show) => {
    this.setState({ showTemperature: show });
  };

  toggleWarnings = (show) => {
    this.setState({ showWarnings: show });
  };

  render() {
    const {
      showFcuIDs,
      showTemperature,
      showWarnings,
    } = this.state;

    return (
      <div className={styles.menuContainer}>
        <SummaryPanel className={styles.summaryPanelControls}>
          <div className={styles.controls}>
            <div className={styles.control}>
              <span>FCU IDs:</span>
              <div className={styles.toggleContainer}>
                <Toggle labels={['Hide', 'Show']} isLive={showFcuIDs} setLiveMode={this.toggleFcuIDs} />
              </div>
            </div>
            <div className={styles.control}>
              <span>Temperature:</span>
              <div className={styles.toggleContainer}>
                <Toggle labels={['Absolute', 'Differencial']} isLive={showTemperature} setLiveMode={this.toggleTemperature} />
              </div>
            </div>
            <div className={styles.control}>
              <span>Warnings:</span>
              <div className={styles.toggleContainer}>
                <Toggle labels={['Hide', 'Show']} isLive={showWarnings} setLiveMode={this.toggleWarnings} />
              </div>
            </div>
          </div>
        </SummaryPanel>
      </div>
    );
  }
}
