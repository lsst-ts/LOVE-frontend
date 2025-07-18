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

import React, { use, useEffect } from 'react';
import { connect } from 'react-redux';
import { addGroup, removeGroup } from '../../../redux/actions/ws';
import { getStreamData } from '../../../redux/selectors';

import CSCStateIcon from './CSCStateIcon';


/**
 * LOVE requires us to create a container component for each component that we want to use in the UI Framework.
 * This container component will manage the state and lifecycle of the internal component.
 *
 * The schema below defines the properties of the component.
 * These parameters can be configured when creating the container component in LOVE.
 */
export const schema = {
  description: 'CSC state icon component',
  defaultSize: [10, 5],  // What are the unit sizes here? Adjust as needed.
  props: {
    cscName: {
      type: 'string',
      description: 'Name of the CSC to monitor',
      isPrivate: false,
      default: 'Test',
    },
    salindex: {
      type: 'number',
      description: 'Salindex of the CSC',
      isPrivate: false,
      default: 1,
    },
  },
};


/**
 * In LOVE, we use a container component to manage the state and lifecycle of the internal component. 
 * In this case, we will create a container for the CSCStateIcon.
 *
 * As usual, the `schema` is used to define the properties of the component.
 *
 * In addition, we need to pass the `subscribeToStreams` and `unsubscribeFromStreams` functions to the component.
 * These functions are associated with the Redux actions to manage the WebSocket streams.
 *
 * Finally, we need to pass the `summaryStateData` to the object, which is obtained from the Redux state.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.cscName - The name of the CSC to monitor.
 * @param {number} props.salindex - The salindex of the CSC.
 * @param {Function} props.subscribeToStreams - Function to subscribe to the WebSocket streams. Required to get the summary state data.
 * @param {Function} props.unsubscribeFromStreams - Function to unsubscribe from the WebSocket streams. Required to stop receiving updates.
 * @param {Object} props.summaryStateData - The summary state data from the Redux state.
 * @returns {JSX.Element} The rendered CSCStateIcon component.
 */
const CSCStateIconContainer = ( { cscName, salindex, subscribeToStreams, unsubscribeFromStreams, summaryStateData } ) => {

  // Debugging: Log the props to see what is being passed
  console.log(`CSCStateIconContainer props:\n  ${cscName}:${salindex}`);

  // Render the CSCStateIcon component
  return (
    <div className="csc-state-icon-container">
      <CSCStateIcon cscName={cscName} salIndex={salindex} summaryStateData={summaryStateData} />
    </div>
  );

};


/**
 * This is one of the functions that will be used to connect the component to the Redux store.
 * It will be used to subscribe to the WebSocket streams for the CSC state.
 * It will dispatch the `addGroup` action to subscribe to the stream.
 *
 * See `love/src/redux/actions/ws.js` for more details on the `addGroup` action.
 *
 * See https://react-redux.js.org/using-react-redux/connect-mapdispatch
 * for more details on how to use `mapDispatchToProps`.
 *
 * @param {Function} dispatch - The Redux dispatch function.
 * @param {Object} ownProps - The properties passed to the component.
 * @returns {Object} The object containing the `subscribeToStreams` and `unsubscribeFrom
 */
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    subscribeToStreams: () => {
      dispatch(addGroup(`event-${ownProps.cscName}-${ownProps.salindex}-summaryState`));
    },
    unsubscribeFromStreams: () => {
      dispatch(removeGroup(`event-${ownProps.cscName}-${ownProps.salindex}-summaryState`));
    }
  }
};


/**
 * This function maps the Redux state to the component's props.
 * It retrieves the summary state data for the specified CSC from the Redux store.
 *
 * See `love/src/redux/selectors.js` for more details on the `getStreamData` selector.
 *
 * See https://react-redux.js.org/using-react-redux/connect-mapstate
 * for a more exhaustive explanation of `mapStateToProps`.
 *
 * @param {Object} state - The Redux state.
 * @param {Object} ownProps - The properties passed to the component.
 * @returns {Object} The object containing the summary state data.
 */
const mapStateToProps = (state, ownProps) => {
  const data = getStreamData(state, `event-${ownProps.cscName}-${ownProps.salindex}-summaryState`);
  return {
    summaryStateData: data,
  }
};


/**
 * This is the default export of the component.
 * It connects the component to the Redux store using the `connect` function from `react-redux
 * and the `mapStateToProps` and `mapDispatchToProps` functions.
 *
 * These must be passed as attributes to the props object of the container.
 */
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CSCStateIconContainer);
