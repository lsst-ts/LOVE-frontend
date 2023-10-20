/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from 'components/GeneralPurpose/SummaryPanel/Label';
import Value from 'components/GeneralPurpose/SummaryPanel/Value';
import Title from 'components/GeneralPurpose/SummaryPanel/Title';
import StatusText from 'components/GeneralPurpose/StatusText/StatusText';
import {
  telescopeTrackingStateMap,
  telescopeTrackingModeStateMap,
  telescopeTrackingStateToStyle,
  telescopeTrackingModeStateToStyle,
} from 'Config';
import styles from './ObservatorySummary.module.css';

const POOLING_TIME = 3000;

export default class ObservatorySummary extends Component {
  static propTypes = {
    /** Simonyi Telescope Observing Mode */
    simonyiObservingMode: PropTypes.string,
    /** Simonyi Telescope Tracking State */
    simonyiTrackingState: PropTypes.string,
    /** Simonyi Telescope Tracking Mode */
    simonyiTrackingMode: PropTypes.string,
    /** Auxiliary Telescope Observing Mode */
    auxtelObservingMode: PropTypes.string,
    /** Auxiliary Telescope Tracking State */
    auxtelTrackingState: PropTypes.string,
    /** Auxiliary Telescope Tracking Mode */
    auxtelTrackingMode: PropTypes.string,
    /** Control Location */
    controlLocation: PropTypes.object,
    /** Last Updated Control Location info */
    lastUpdated: PropTypes.instanceOf(Date),
    /** Atmospheric Transmission */
    atmosphericTrans: PropTypes.string,
  };

  static defaultProps = {
    simonyiObservingMode: 'UNKNOWN',
    simonyiTrackingState: 'UNKNOWN',
    simonyiTrackingMode: 'UNKNOWN',
    auxtelObservingMode: 'UNKNOWN',
    auxtelTrackingState: 'UNKNOWN',
    auxtelTrackingMode: 'UNKNOWN',
    controlLocation: null,
    lastUpdated: null,
    atmosphericTrans: 'UNKNOWN',
  };

  componentDidMount() {
    this.props.subscribeToStream();
  }

  componentWillUnmount() {
    this.props.unsubscribeToStream();
  }

  render() {
    const {
      simonyiObservingMode,
      simonyiTrackingState,
      simonyiTrackingMode,
      auxtelObservingMode,
      auxtelTrackingState,
      auxtelTrackingMode,
      controlLocation,
      lastUpdated,
      degradation,
      atmosphericTrans,
    } = this.props;

    const controlLocationName = controlLocation
      ? controlLocation.name.charAt(0).toUpperCase() + controlLocation.name.slice(1)
      : 'UNKNOWN';

    const simonyiTrackingStateText = telescopeTrackingStateMap[simonyiTrackingState];
    const simonyiTrackingModeText = telescopeTrackingModeStateMap[simonyiTrackingMode];
    const auxtelTrackingStateText = telescopeTrackingStateMap[auxtelTrackingState];
    const auxtelTrackingModeText = telescopeTrackingModeStateMap[auxtelTrackingMode];

    return (
      <div className={styles.container}>
        <SummaryPanel className={styles.row2}>
          <Title wide>Simonyi Telescope</Title>
          <Label>Tracking</Label>
          <Value>
            <StatusText status={telescopeTrackingStateToStyle[simonyiTrackingStateText]}>
              {simonyiTrackingStateText}
            </StatusText>
          </Value>
          <Label>Operation Mode</Label>
          <Value>UNKNOWN</Value>
          <Label>Observation Mode</Label>
          <Value>{simonyiObservingMode}</Value>
          <Label>Tracking Mode</Label>
          <Value>{simonyiTrackingModeText}</Value>
          <Label>Power Source</Label>
          <Value>UNKNOWN</Value>
        </SummaryPanel>

        <SummaryPanel>
          <Title wide>Vera C. Rubin Observatory</Title>
          <Label>Control</Label>
          <Value>
            <span title={`Last updated: ${lastUpdated?.toUTCString()}`}>{controlLocationName}</span>
          </Value>
          <Label>Power Source</Label>
          <Value>UNKNOWN</Value>
          <Label>Env. Degradation</Label>
          <Value>{degradation}</Value>
        </SummaryPanel>

        <SummaryPanel>
          <Title wide>Auxiliary Telescope</Title>
          <Label>Tracking</Label>
          <Value>
            <StatusText status={telescopeTrackingStateToStyle[auxtelTrackingStateText]}>
              {auxtelTrackingStateText}
            </StatusText>
          </Value>
          <Label>Operation Mode</Label>
          <Value>UNKNOWN</Value>
          <Label>Observation Mode</Label>
          <Value>{auxtelObservingMode}</Value>
          <Label>Tracking Mode</Label>
          <Value>{auxtelTrackingModeText}</Value>
          <Label>Power Source</Label>
          <Value>UNKNOWN</Value>
          <Label>Atmos. Trans.</Label>
          <Value>{atmosphericTrans}</Value>
        </SummaryPanel>
      </div>
    );
  }
}
