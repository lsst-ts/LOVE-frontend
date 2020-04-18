import React from 'react';
import { connect } from 'react-redux';
import { getTimeData } from '../../redux/selectors';
import TimeDisplay from './TimeDisplay';

export const schema = {
  description: `Component displaying the clocks with relevant times, such as UTC, TAI, summit time, etc`,
  defaultSize: [63, 17],
  props: {
    titleBar: {
      type: 'boolean',
      description: 'Whether to display the title bar',
      isPrivate: false,
      default: true,
    },
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'TimeDisplay',
    },
    margin: {
      type: 'boolean',
      description: 'Whether to display component with a margin',
      isPrivate: false,
      default: true,
    },
  },
};

const TimeDisplayContainer = ({ ...props }) => {
  return (
    <TimeDisplay
      {...props}
    />
  );
};

const mapStateToProps = (state) => {
  const timeData = getTimeData(state);
  return { timeData };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(TimeDisplayContainer);
