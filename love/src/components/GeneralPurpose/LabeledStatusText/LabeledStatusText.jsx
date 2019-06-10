import React, { Component } from 'react';
import StatusText from '../StatusText/StatusText';
// import PropTypes from 'prop-types';
import styles from './LabeledStatusText.module.css';

export default class LabeledStatusText extends Component {
  static propTypes = {
    // raftsDetailedState: PropTypes.string,
    // imageReadinessDetailedState: PropTypes.string,
    // calibrationDetailedState: PropTypes.string,
    // shutterDetailedState: PropTypes.string,
    // imageSequence: PropTypes.object,
  };

  componentDidMount = () => {
    this.props.subscribeToStream(this.props.groupName);
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStream(this.props.groupName);
  };

  render() {
    const stateValue = this.props.streamState ? this.props.accessor(this.props.streamState[this.props.streamState.length - 1]): undefined;
    const stateLabel = this.props.stateToLabelMap[stateValue];
    const stateStyle = this.props.stateToStyleMap[stateValue];
    return (
      <div className={styles.container}>
        <div>{this.props.label}: </div>
        <StatusText title={stateLabel} status={stateStyle}>{stateLabel}</StatusText>
        {/* <div>
          {JSON.stringify(this.props.streamState)}
        </div> */}
      </div>
    );
  }
}
