/** 
This file is part of LOVE-frontend.

Developed for the Vera C. Rubin Observatory Telescope and Site Systems.

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
import WindDirection from './WindDirection';
import { addGroup, removeGroup } from 'redux/actions/ws';
import { getWindDirectionState } from 'redux/selectors';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import { MAX_WIND_SPEED_MS } from 'Config';

export const schema = {
  description: 'Wind direction component.',
  defaultSize: [15, 20],
  props: {
    title: {
      type: 'string',
      description: 'Name displayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Wind direction',
    },
    maxWindSpeed: {
      type: 'number',
      description: 'Maximum wind speed in m/s',
      isPrivate: false,
      default: MAX_WIND_SPEED_MS,
    },
    showValues: {
      type: 'boolean',
      description: 'Show wind speed and direction values',
      isPrivate: false,
      default: true,
    },
  },
};

const WindDirectionContainer = ({ ...props }) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return <WindDirection {...props} />;
};

const mapStateToProps = (state) => {
  const windDirectionState = getWindDirectionState(state);
  const windSpeed = windDirectionState.speed;
  const windDirection = windDirectionState.direction;
  return { windSpeed, windDirection };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = ['telemetry-ESS-301-airFlow'];
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

export default connect(mapStateToProps, mapDispatchToProps)(WindDirectionContainer);
