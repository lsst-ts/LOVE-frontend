import React from 'react';
import PropTypes from 'prop-types';
import { ReactComponent as Level1 } from './Level1.svg';
import { ReactComponent as Level2 } from './Level2.svg';
import { ReactComponent as Level3 } from './Level3.svg';
import { ReactComponent as Level4 } from './Level4.svg';
import { ReactComponent as Level5 } from './Level5.svg';

function Map({ level }) {
  switch (level) {
    case 1:
      return <Level1 />;
    case 2:
      return <Level2 />;
    case 3:
      return <Level3 />;
    case 4:
      return <Level4 />;
    case 5:
      return <Level5 />;
    default:
      return <Level1 />;
  }
}

Map.propTypes = {
  /** Facility level to show */
  level: PropTypes.number,
};

export default Map;
