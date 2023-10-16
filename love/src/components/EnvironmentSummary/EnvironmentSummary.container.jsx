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

import React from 'react';
import { connect } from 'react-redux';
import EnvironmentSummary from './EnvironmentSummary';
import { addGroup, removeGroup } from 'redux/actions/ws';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import { getObservatorySubscriptions, getObservatoryState } from 'redux/selectors';

export const schema = {
  description: 'Summary view of Environment Summary.',
  defaultSize: [74, 32],
  props: {
    title: {
      type: 'string',
      description: 'Name displayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Environment Summary',
    },
  },
};

const EnvironmentSummaryContainer = ({
  subscribeToStreams,
  unsubscribeToStreams,
  simonyiTrackingState,
  simonyiRa,
  simonyiDec,
  simonyiAltitude,
  simonyiAzimuth,
  simonyiRotator,
  simonyiDomeAlt,
  simonyiDomeAz,
  simonyiMoonRa,
  simonyiMoonDec,
  simonyiMoonPhase,
  simonyiSunRa,
  simonyiSunDec,
  auxtelTrackingState,
  auxtelRa,
  auxtelDec,
  auxtelAltitude,
  auxtelAzimuth,
  auxtelRotator,
  auxtelDomeAlt,
  auxtelDomeAz,
  isRaining,
  isSnowing,
  numChannels,
  temperature,
  location,
  windDirection,
  windSpeed,
  degradation,
  atmosphericTrans,
  airTemp,
  pressure,
  humidity,
  seeing,
  ...props
}) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return (
    <EnvironmentSummary
      subscribeToStreams={subscribeToStreams}
      unsubscribeToStreams={unsubscribeToStreams}
      simonyiTrackingState={simonyiTrackingState}
      simonyiRa={simonyiRa}
      simonyiDec={simonyiDec}
      simonyiAltitude={simonyiAltitude}
      simonyiAzimuth={simonyiAzimuth}
      simonyiRotator={simonyiRotator}
      simonyiDomeAlt={simonyiDomeAlt}
      simonyiDomeAz={simonyiDomeAz}
      simonyiMoonRa={simonyiMoonRa}
      simonyiMoonDec={simonyiMoonDec}
      simonyiMoonPhase={simonyiMoonPhase}
      simonyiSunRa={simonyiSunRa}
      simonyiSunDec={simonyiSunDec}
      auxtelTrackingState={auxtelTrackingState}
      auxtelRa={auxtelRa}
      auxtelDec={auxtelDec}
      auxtelAltitude={auxtelAltitude}
      auxtelAzimuth={auxtelAzimuth}
      auxtelRotator={auxtelRotator}
      auxtelDomeAlt={auxtelDomeAlt}
      auxtelDomeAz={auxtelDomeAz}
      isRaining={isRaining}
      isSnowing={isSnowing}
      numChannels={numChannels}
      temperature={temperature}
      location={location}
      windDirection={windDirection}
      windSpeed={windSpeed}
      degradation={degradation}
      atmosphericTrans={atmosphericTrans}
      airTemp={airTemp}
      pressure={pressure}
      humidity={humidity}
      seeing={seeing}
    />
  );
};

const mapStateToProps = (state) => {
  const environmentSummary = getObservatoryState(state);
  return environmentSummary;
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = getObservatorySubscriptions();
  return {
    subscriptions,
    subscribeToStreams: () => {
      subscriptions.forEach((stream) => dispatch(addGroup(stream)));
    },
    unsubscribeToStreams: () => {
      subscriptions.forEach((stream) => dispatch(removeGroup(stream)));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EnvironmentSummaryContainer);
