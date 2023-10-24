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
import DataManagementFlow from './DataManagementFlow';

export const schema = {
  description: 'Data Management Flow',
  defaultSize: [12, 6],
  props: {
    titleBar: {
      type: 'boolean',
      description: 'Tittlebar of person',
      isPrivate: false,
      default: false,
    },
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'CSC details',
    },
    margin: {
      type: 'boolean',
      description: 'Whether to display component with a margin',
      isPrivate: false,
      default: false,
    },
    name: {
      type: 'string',
      description: 'Name of the person',
      isPrivate: false,
      default: 'Test',
    },
  },
};

const DataManagementFlowContainer = ({ ...props }) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return <DataManagementFlow {...props} />;
};

const mapStateToProps = (state, ownProps) => {
  return {
    // TODO: Add the corresponding events and telemetries when they gets integrated into SAL
    // weather: getStreamData(state, `telemetry-WeatherStation-${ownProps.salindex}-weather`),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  // TODO: Add the corresponding events and telemetries when they gets integrated into SAL
  // const subscriptions = [
  //   `telemetry-WeatherStation-${ownProps.salindex}-weather`,
  // ];
  // return {
  //   subscriptions,
  //   subscribeToStreams: () => {
  //     subscriptions.forEach((stream) => dispatch(addGroup(stream)));
  //   },
  //   unsubscribeToStreams: () => {
  //     subscriptions.forEach((stream) => dispatch(removeGroup(stream)));
  //   },
  // };
};
// const connectedContainer = connect(mapStateToProps, mapDispatchToProps)(DMFlowContainer);

// connectedContainer.defaultProps = {
//   salindex: 1,
// };

export default DataManagementFlowContainer;
