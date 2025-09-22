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
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import { addGroup, removeGroup } from 'redux/actions/ws';
import { getSummaryStateValue, getNightreportObservatoryState } from 'redux/selectors/selectors';
import { NIGHTREPORT_CSCS_TO_REPORT } from 'Config';
import CreateNightReport from './CreateNightReport';

export const schema = {
  description: 'Night report writting service',
  defaultSize: [77, 32],
  props: {
    title: {
      type: 'string',
      description: 'Name displayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Log Service',
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: true,
      default: true,
    },
    allowSendingOldReports: {
      type: 'boolean',
      description:
        'Whether the user can edit and send not sent reports for past days.' +
        ' If true a dropdown to select the day will be shown at the top of the component' +
        ' and the user will be able to select an obs day to edit and send.' +
        ' As this feature queries the EFD, the oldest obs day able to be selected' +
        ' depends on the EFD data retention policy.' +
        ' For past reports, the EFD queries will define a timestamp cutoff at' +
        ' the end of the selected obs day, i.e. 12 UTC of the next calendar day.',
      isPrivate: false,
      default: false,
    },
  },
};

const CreateNightReportContainer = ({ ...props }) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return <CreateNightReport {...props} />;
};

const mapStateToProps = (state) => {
  const cscStates = NIGHTREPORT_CSCS_TO_REPORT.reduce((acc, cscIndex) => {
    const [csc, index] = cscIndex.split(':');
    const key = `event-${csc}-${index}-summaryState`;
    acc[cscIndex] = getSummaryStateValue(state, key);
    return acc;
  }, {});
  const observatoryState = getNightreportObservatoryState(state);
  return {
    cscStates,
    observatoryState,
  };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptionsSummaryState = NIGHTREPORT_CSCS_TO_REPORT.map((cscIndex) => {
    const [csc, index] = cscIndex.split(':');
    return `event-${csc}-${index}-summaryState`;
  });

  const subscriptionsObservatoryState = [
    'telemetry-MTMount-0-azimuth',
    'telemetry-MTMount-0-elevation',
    'telemetry-MTDome-0-azimuth',
    'telemetry-MTRotator-0-rotation',
    'telemetry-ATMCS-0-mount_AzEl_Encoders',
    'telemetry-ATDome-0-position',
    'event-MTMount-0-mirrorCoversMotionState',
    'event-MTMount-0-oilSupplySystemState',
    'event-MTMount-0-mainAxesPowerSupplySystemState',
    'event-MTMount-0-elevationLockingPinMotionState',
    'event-ATPneumatics-0-m1CoverState',
  ];

  const subscriptions = [...subscriptionsSummaryState, ...subscriptionsObservatoryState];
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateNightReportContainer);
