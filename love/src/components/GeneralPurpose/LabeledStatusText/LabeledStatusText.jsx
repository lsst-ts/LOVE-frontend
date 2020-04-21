import React, { Component } from 'react';
import StatusText from '../StatusText/StatusText';
import PropTypes from 'prop-types';
import styles from './LabeledStatusText.module.css';

export default class LabeledStatusText extends Component {
  static propTypes = {
    accessor: PropTypes.func,
  };

  static defaultProps = {
    accessor: (event) => event.state.value,
  };

  componentDidMount = () => {
    this.props.subscribeToStream(this.props.groupName);
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStream(this.props.groupName);
  };

  render() {
    const stateValue = this.props.streamState ? this.props.accessor(this.props.streamState[this.props.streamState.length - 1]): 0;
    const stateLabel = this.props.stateToLabelMap[stateValue];
    const stateStyle = this.props.stateToStyleMap[stateValue];
    return (
      <div className={[styles.container, this.props.stacked ? styles.stacked : ''].join(' ')}>
        <div>{this.props.label}</div>
        <StatusText title={stateLabel} status={stateStyle || 'invalid'}>{stateLabel || 'unknown'}</StatusText>
      </div>
    );
  }
}
