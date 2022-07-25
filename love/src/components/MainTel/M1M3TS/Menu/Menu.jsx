import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Menu.module.css';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Toggle from 'components/GeneralPurpose/Toggle/Toggle';

export default class Menu extends Component {
  static propTypes = {
    showFcuIDs: PropTypes.bool,
    showDifferentialTemp: PropTypes.bool,
    showWarnings: PropTypes.bool,
    toggleFcuIDs: PropTypes.func,
    toggleTemperature: PropTypes.func,
    toggleWarnings: PropTypes.func,
      };
  static defaultProps = {
    showFcuIDs: true,
    showDifferentialTemp: true,
    showWarnings: true,
    toggleFcuIDs: (show) => { console.log('Selector.defaultProps.toggleFcuIDs(', show, ')')},
    toggleTemperature: (show) => { console.log('Selector.defaultProps.toggleTemperature(', show, ')')},
    toggleWarnings: (show) => { console.log('Selector.defaultProps.toggleWarnings(', show, ')')},
  };

  toggleFcuIDs = (show) => {
    this.props.toggleFcuIDs(show);
  };

  toggleTemperature = (show) => {
    this.props.toggleTemperature(show);
  };

  toggleWarnings = (show) => {
    this.props.toggleWarnings(show);
  };

  render() {
    const {
      showFcuIDs,
      showDifferentialTemp,
      showWarnings,
    } = this.props;

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
                <Toggle labels={['Absolute', 'Differential']} isLive={showDifferentialTemp} setLiveMode={this.toggleTemperature} />
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
