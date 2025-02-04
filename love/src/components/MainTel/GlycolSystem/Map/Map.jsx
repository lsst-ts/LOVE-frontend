import React from 'react';
import PropTypes from 'prop-types';

function Map({ level }) {
  return <div>Map</div>;
}

Map.propTypes = {
  /** Facility level to show */
  level: PropTypes.number,
};

export default Map;
