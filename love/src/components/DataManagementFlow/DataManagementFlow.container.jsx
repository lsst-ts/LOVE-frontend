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
    // weather: getStreamData(state, `telemetry-WeatherStation-${ownProps.salindex}-weather`),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
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
