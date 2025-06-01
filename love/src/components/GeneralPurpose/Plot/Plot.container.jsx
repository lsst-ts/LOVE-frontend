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
import { addGroup, removeGroup } from 'redux/actions/ws';
import { getStreamsData, getTaiToUtc, getTopicsFieldsInfo } from 'redux/selectors';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import Plot from './Plot';

export const defaultStyles = [
  {
    color: '#ff7bb5',
    shape: 'circle',
    filled: false,
    orient: 'left',
    dash: [4, 0],
  },
  {
    color: '#00b7ff',
    shape: 'square',
    filled: true,
    orient: 'right',
    dash: [4, 0],
  },
  {
    color: '#97e54f',
    shape: 'diamond',
    filled: true,
    orient: 'left',
    dash: [4, 0],
  },
];

export const schema = {
  description: 'Time series plot for any data stream coming from SAL',
  defaultSize: [60, 30],
  props: {
    titleBar: {
      type: 'boolean',
      description: 'Whether to display the title bar',
      isPrivate: false,
      default: false,
    },
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Time series plot',
    },
    inputs: {
      externalStep: 'TimeSeriesConfigure',
      type: 'object',
      description: 'list of inputs',
      isPrivate: false,
      default: {
        'ATMCS Elevation': {
          type: 'line',
          ...defaultStyles[0],
          values: [
            {
              variable: 'y',
              category: 'telemetry',
              csc: 'ATMCS',
              salindex: '0',
              topic: 'mount_AzEl_Encoders',
              item: 'elevationCalculatedAngle',
              accessor: '(x) => x[0]',
              isArray: true,
              arrayIndex: 0,
            },
          ],
        },
        'ATMCS Azimuth': {
          type: 'line',
          ...defaultStyles[1],
          values: [
            {
              variable: 'y',
              category: 'telemetry',
              csc: 'ATMCS',
              salindex: '0',
              topic: 'mount_AzEl_Encoders',
              item: 'azimuthCalculatedAngle',
              accessor: '(x) => x[0]',
              isArray: true,
              arrayIndex: 0,
            },
          ],
        },
      },
    },
    xAxisTitle: {
      type: 'string',
      description: 'Title of the horizontal axis of this plot',
      default: 'Time',
      isPrivate: false,
    },
    yAxisTitle: {
      type: 'string',
      description: 'Title of the vertical axis of this plot',
      default: '',
      isPrivate: false,
    },
    legendPosition: {
      type: 'string',
      description:
        "Whether to display the legend to the right of the plot or at the bottom. One of 'right' or 'bottom'",
      default: 'right',
      isPrivate: false,
    },
    controls: {
      type: 'boolean',
      description: "Whether to display controls to configure periods of time'",
      default: true,
      isPrivate: false,
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: false,
      default: true,
    },
  },
};

const PlotContainer = ({ subscriptions, subscribeToStreams, unsubscribeToStreams, ...props }) => {
  /**
   * The containerNode prop is a React ref (with the current parameter).
   * It is used to get the parent node of the plot. If no containerNode is passed as a prop,
   * the Plot component will be wrapped on a div and that node will
   * be used as the containerNode. Note this case will only happen when adding a plot directly
   * from the UI framework. Other components using the PlotContainer component
   * should ALWAYS pass containerNode as a prop. Also due to the way CSS works, the parent
   * node of the plot must have a height defined and its overflow should be `hidden`,
   * otherwise the plot will not be rendered correctly.
   *
   * It is mandatory to call containerNode.current on this component and not on the parent ones.
   * This is because when calling containerNode.current on the parent component, the ref is not yet
   * populated so it will return null until the parent component is rendered again.
   * This will cause the plot to be rendered with a null parent node producing rendering problems.
   * By calling containerNode.current on this component, we ensure that the ref is populated as
   * the parent must have been already rendered at this point.
   *
   * Note that components are not re-rendered when their refs changes,
   * so this is the safe way to pass the node. See:
   * https://react.dev/learn/referencing-values-with-refs
   */
  const { containerNode } = props;

  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={subscriptions}></SubscriptionTableContainer>;
  }

  if (!containerNode) {
    const containerRef = React.useRef(null);
    return (
      <div style={{ height: '100%', overflow: 'hidden' }} ref={containerRef}>
        <Plot
          {...props}
          subscriptions={subscriptions}
          subscribeToStreams={subscribeToStreams}
          unsubscribeToStreams={unsubscribeToStreams}
          containerNode={containerRef?.current}
        />
      </div>
    );
  } else {
    return (
      <Plot
        {...props}
        subscriptions={subscriptions}
        subscribeToStreams={subscribeToStreams}
        unsubscribeToStreams={unsubscribeToStreams}
        containerNode={containerNode.current}
      />
    );
  }
};

const getGroupNames = (inputs) => {
  const inputsMap = Object.values(inputs).map((inputConfig) => {
    if (inputConfig.values) {
      const values = Object.values(inputConfig.values).map((value) => {
        return `${value?.category}-${value?.csc}-${value?.salindex}-${value?.topic}`;
      });
      return values;
    } else {
      return `${inputConfig?.category}-${inputConfig?.csc}-${inputConfig?.salindex}-${inputConfig?.topic}`;
    }
  });
  return [...new Set(inputsMap.flat())];
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const inputs = ownProps.inputs || schema.props.inputs.default;
  const subscriptions = getGroupNames(inputs);
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

const mapStateToProps = (state, ownProps) => {
  const inputs = ownProps.inputs || schema.props.inputs.default;
  const groupNames = getGroupNames(inputs);
  const streams = getStreamsData(state, groupNames);
  const taiToUtc = getTaiToUtc(state);
  const topicsFieldsInfo = getTopicsFieldsInfo(state);
  return {
    inputs,
    streams,
    taiToUtc,
    topicsFieldsInfo,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PlotContainer);
