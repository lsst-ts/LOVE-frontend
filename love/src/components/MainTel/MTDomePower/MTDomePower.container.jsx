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
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MtDomePower from './MTDomePower';
import { getMtDomePowerDraw } from '../../../redux/selectors';
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
  subscribeToStreams,
  unsubscribeToStreams,
  powerDrawCalibration,
  powerDrawRAD,
  powerDrawOBC,
  powerDrawFans,
  powerDrawLouvers,
  powerDrawLWS,
  powerDrawShutter,
  powerDrawElectronics,
  timestampCalibration,
  timestampRAD,
  timestampOBC,
  timestampFans,
  timestampLouvers,
  timestampLWS,
  timestampShutter,
  timestampElectronics,
  ...props
}) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return (
    <MtDomePower
      subscribeToStreams={subscribeToStreams}
      unsubscribeToStreams={unsubscribeToStreams}
      powerDrawCalibration={powerDrawCalibration}
      powerDrawRAD={powerDrawRAD}
      powerDrawOBC={powerDrawOBC}
      powerDrawFans={powerDrawFans}
      powerDrawLouvers={powerDrawLouvers}
      powerDrawLWS={powerDrawLWS}
      powerDrawShutter={powerDrawShutter}
      powerDrawElectronics={powerDrawElectronics}
      timestampCalibration={timestampCalibration}
      timestampRAD={timestampRAD}
      timestampOBC={timestampOBC}
      timestampFans={timestampFans}
      timestampLouvers={timestampLouvers}
      timestampLWS={timestampLWS}
      timestampShutter={timestampShutter}
      timestampElectronics={timestampElectronics}
    />
  );
};

const mapStateToProps = (state) => {
  const mtDomePowerDraw = getMtDomePowerDraw(state);
  return {
    ...mtDomePowerDraw,
  };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    'telemetry-MTDome-0-apertureShutter',
    'telemetry-MTDome-0-lightWindScreen',
    'telemetry-MTDome-0-louvers',
    'telemetry-MTDome-0-rearAccessDoor',
    'telemetry-ESS-301-temperature',
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

MtDomePower.propTypes = {
  /** Wheter the component is in raw mode */
  isRaw: PropTypes.bool,
  /** List of the component's subscriptions */
  subscriptions: PropTypes.array,
};

export default connect(mapStateToProps, mapDispatchToProps)(MTDomePowerContainer);
