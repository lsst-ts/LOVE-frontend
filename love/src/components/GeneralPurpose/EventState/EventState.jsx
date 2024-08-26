import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './EventState.module.css';

function EventState({ subscription, streamData, stateMap, subscribeToStreams, unsubscribeToStreams, ...props }) {
  useEffect(() => {
    subscribeToStreams(subscription);
    return () => {
      unsubscribeToStreams(subscription);
    };
  }, []);

  const state = streamData?.[0].state.value;
  const stateText = stateMap[state];

  const colorMap = {
    0: 'unknown',
    1: 'alert',
    2: 'ok',
    7: 'warning',
  };

  console.log(state, stateText);

  return <div className={styles[colorMap[state]]}>EventState: {stateText}</div>;
}

EventState.propTypes = {};

export default EventState;
