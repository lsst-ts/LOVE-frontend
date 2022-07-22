import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Menu.module.css';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Toggle from 'components/GeneralPurpose/Toggle/Toggle';

export default class Menu extends Component {
  static propTypes = {};
  static defaultProps = {
    toggleFcuIDs: (show) => { console.log('Selector.defaultProps.toggleFcuIDs(', show, ')')},
    toggleTemperature: (show) => { console.log('Selector.defaultProps.toggleTemperature(', show, ')')},
    toggleWarnings: (show) => { console.log('Selector.defaultProps.toggleWarnings(', show, ')')},
  };

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
    this.props.toggleFcuIDs(show);
  };

  toggleTemperature = (show) => {
    this.setState({ showTemperature: show });
    this.props.toggleTemperature(show);
  };

  toggleWarnings = (show) => {
    this.setState({ showWarnings: show });
    this.props.toggleWarnings(show);
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
