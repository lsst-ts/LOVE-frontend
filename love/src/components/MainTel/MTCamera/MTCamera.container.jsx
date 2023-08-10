/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile Tech Team.

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
import { connect } from 'react-redux';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import { addGroup, removeGroup } from 'redux/actions/ws';
import { getTempControlStatus, getFocalPlaneReb, getFocalPlaneCCD } from '../../../redux/selectors';
import MTCamera from './MTCamera';

export const schema = {
  description: 'View of MTCamera',
  defaultSize: [40, 23],
  props: {
    title: {
      type: 'string',
      description: 'Name displayed in the title bar (if visible)',
      isPrivate: false,
      default: 'MTCamera',
    },
    salindex: {
      type: 'number',
      description: 'Salindex of MTCamera',
      isPrivate: false,
      default: 1,
    },
  },
};

const MTCameraContainer = ({
  subscribeToStreams,
  unsubscribeToStreams,
  tempControlActive,
  hVBiasSwitch,
  anaV,
  power,
  gDV,
  oDI,
  oDV,
  oGV,
  rDV,
  temp,
  ...props
}) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return (
    <MTCamera
      subscribeToStreams={subscribeToStreams}
      unsubscribeToStreams={unsubscribeToStreams}
      tempControlActive={tempControlActive}
      hVBiasSwitch={hVBiasSwitch}
      anaV={anaV}
      power={power}
      gDV={gDV}
      oDI={oDI}
      oDV={oDV}
      oGV={oGV}
      rDV={rDV}
      temp={temp}
      {...props}
    />
  );
};

const mapStateToProps = (state) => {
  const tempControl = getTempControlStatus(state);
  const focalPlaneReb = getFocalPlaneReb(state);
  const focalPlaneCCD = getFocalPlaneCCD(state);
  return {
    ...tempControl,
    ...focalPlaneReb,
    ...focalPlaneCCD,
  };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    'event-MTCamera-0-focal_plane_Raft_RaftTempControlStatusConfiguration',
    'telemetry-MTCamera-0-focal_plane_Reb',
    'telemetry-MTCamera-0-focal_plane_Ccd',
  ];
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

export default connect(mapStateToProps, mapDispatchToProps)(MTCameraContainer);
