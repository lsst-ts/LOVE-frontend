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
import { getCCTempControlStatus, getCCFocalPlaneReb, getCCFocalPlaneCCD } from '../../../redux/selectors';
import CCCamera from './CCCamera';

export const schema = {
  description: 'View of Commissioning Camera',
  defaultSize: [40, 23],
  props: {
    title: {
      type: 'string',
      description: 'Name displayed in the title bar (if visible)',
      isPrivate: false,
      default: 'CCCamera',
    },
    salindex: {
      type: 'number',
      description: 'Salindex of CCCamera',
      isPrivate: false,
      default: 1,
    },
  },
};

const CCCameraContainer = ({
  subscribeToStreams,
  unsubscribeToStreams,
  tempControlActive,
  hVBiasSwitch,
  anaV,
  power,
  gDV,
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
    <CCCamera
      subscribeToStreams={subscribeToStreams}
      unsubscribeToStreams={unsubscribeToStreams}
      tempControlActive={tempControlActive}
      hVBiasSwitch={hVBiasSwitch}
      anaV={anaV}
      power={power}
      gDV={gDV}
      oDV={oDV}
      oGV={oGV}
      rDV={rDV}
      temp={temp}
    />
  );
};

const mapStateToProps = (state) => {
  const tempControl = getCCTempControlStatus(state);
  const focalPlaneReb = getCCFocalPlaneReb(state);
  const focalPlaneCCD = getCCFocalPlaneCCD(state);
  return {
    ...tempControl,
    ...focalPlaneReb,
    ...focalPlaneCCD,
  };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    'event-CCCamera-0-focal_plane_Raft_RaftTempControlStatusConfiguration',
    'telemetry-CCCamera-0-focal_plane_Reb',
    'telemetry-CCCamera-0-focal_plane_Ccd',
  ];
  return {
    subscriptions,
    subscribeToStreams: () => {
      subscriptions.forEach((s) => dispatch(addGroup(s)));
    },
    unsubscribeToStreams: () => {
      subscriptions.forEach((s) => dispatch(removeGroup(s)));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CCCameraContainer);
