import React, { useRef, useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { LouversPositionESS } from 'Config';
import Louver from './Louver';

export function Louvers(props) {
  const ids = props.ids ?? [1];
  const percentOpen = props.percentOpen ?? [0];
  return (
    LouversPositionESS.map((louver) => {
      const index = ids.indexOf(louver.id ?? 1);
      return (
        <Louver
          key={`louver-${index}`}
          position={louver.position}
          id={louver.id}
          name={louver.name}
          angle={louver.angle}
          type={louver.type}
          percentOpen={percentOpen[index]}
        />
      )
    })
  );
}

Louvers.propTypes = {
  louvers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    position: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
      z: PropTypes.number,
    }),
    angle: PropTypes.number,
    type: PropTypes.string,
  })),
  percentOpen: PropTypes.arrayOf(PropTypes.number),
  ids: PropTypes.arrayOf(PropTypes.number),
};

Louvers.defaultProps = {
  louvers: [{
    id: 1,
    position: {x: 0, y: 0, z: 0},
    name: '',
    angle: 0,
    type: 'I',
  },],
  percentOpen: [],
  ids: [1],
};
