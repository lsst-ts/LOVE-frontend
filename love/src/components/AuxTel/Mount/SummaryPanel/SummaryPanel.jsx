import React, { Component } from 'react';
// import styles from './SummaryTable.module.css';
import StatusText from '../../../GeneralPurpose/StatusText/StatusText';
import CurrentTargetValue from '../../../GeneralPurpose/CurrentTargetValue/CurrentTargetValue';
import PropTypes from 'prop-types';
import { stateToStyleDomeAndMount } from '../../../../Config';
import SummaryPanel from '../../../GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from '../../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../../GeneralPurpose/SummaryPanel/Title';

export default class SummaryTable extends Component {
  static propTypes = {
    currentPointing: PropTypes.object,
    targetPointing: PropTypes.object,
    domeAz: PropTypes.number,
    domeTargetAz: PropTypes.number,
    azimuthState: PropTypes.number,
    dropoutDoorState: PropTypes.number,
    mainDoorState: PropTypes.number,
    mountTrackingState: PropTypes.number,
  };

  static defaultProps = {};

  render() {
    console.log(this.props);
    return (
      <SummaryPanel>
        <Title>Track ID</Title>
        <Value>{this.props.trackID}</Value>
        {/* Dome */}
        <Title>Dome</Title>
        <Value>
          dasdsa
        </Value>
      </SummaryPanel>
    );
  }
}
