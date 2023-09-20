/** This file is part of LOVE-frontend.

Developed for Inria Chile Tech Team.

See the COPYRIGHT file at the top-level directory of this distribution
for details of code ownership.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.*/

import React from 'react';
import { connect } from 'react-redux';
import Power from './MTDomePower';
import { getDomeStatus, getLouversStatus, getApertureShutter, getLightWindScreen } from '../../../redux/selectors';
import { addGroup, removeGroup } from '../../../redux/actions/ws';
import SubscriptionTableContainer from '../../GeneralPurpose/SubscriptionTable/SubscriptionTable.container';

export const schema = {
  description:
    'Summary view of the Simonyi Dome Power. Contains general information about the Simonyi Dome moving parts power draw',
  defaultSize: [51, 45],
  props: {
    title: {
      type: 'string',
      description: 'Name displayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Simonyi Telescope Dome Power',
    },
    controls: {
      type: 'boolean',
      description: "Whether to display controls to configure periods of time'",
      default: true,
      isPrivate: false,
    },
    schema: {
      type: 'object',
      description: 'Vega-Lite JSON Schema',
      isPrivate: false,
      default: {
        data: {
          values: [{ a: 'A', b: 28 }],
        },
        width: 400,
        height: 200,
      },
    },
  },
};

const MTDomePowerContainer = ({
  subscribeToStream,
  unsubscribeToStream,
  powerDrawShutter,
  powerDrawLWS,
  powerDrawLouvers,
  atDomePosition,
  ...props
}) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return (
    <Power
      subscribeToStream={subscribeToStream}
      unsubscribeToStream={unsubscribeToStream}
      powerDrawShutter={powerDrawShutter}
      powerDrawLWS={powerDrawLWS}
      powerDrawLouvers={powerDrawLouvers}
      atDomePosition={atDomePosition}
    />
  );
};

const mapStateToProps = (state) => {
  const domeState = getDomeStatus(state);
  const louversState = getLouversStatus(state);
  const apertureShutterState = getApertureShutter(state);
  const lightWindScreenState = getLightWindScreen(state);
  return {
    ...domeState,
    ...louversState,
    ...apertureShutterState,
    ...lightWindScreenState,
  };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    'telemetry-MTDome-0-apertureShutter',
    'telemetry-MTDome-0-lightWindScreen',
    'telemetry-MTDome-0-louvers',
    'telemetry-ATDome-0-position',
  ];
  return {
    subscriptions,
    subscribeToStream: () => {
      subscriptions.forEach((stream) => dispatch(addGroup(stream)));
    },
    unsubscribeToStream: () => {
      subscriptions.forEach((stream) => dispatch(removeGroup(stream)));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MTDomePowerContainer);
