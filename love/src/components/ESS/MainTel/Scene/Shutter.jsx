import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import * as THREE from "three";

export function Shutter (props) {

  const ref = useRef();

  const width = 6.55;
  const window = 11.3 / 2;
  const open = props.position.y > 0 ? window * props.openPercent/100 : (-1) * window * props.openPercent/100;

  const frame = [
    [width, 1.4],
    [width, 13.48],
    [width, 14.1],
    [width, 0.7],
  ];

  const angle = [
    90,
    57.7,
    19.29,
    0,
  ];

  const displaces = [
    [-17.2, 0, 0],
    [-17.2, 1.4, 0],
    [-10, 12.8, 0],
    [3.3, 17.455, 0],
  ]

  const iter = Array.from({length: 4});

  const dpos = iter.map((_, index) => {
    const size = frame[index][1];
    const angleRad = THREE.MathUtils.degToRad(angle[index]);
    const dx = Math.cos(angleRad);
    const dy = Math.sin(angleRad);
    return [
      size/2 * dx,
      size/2 * dy,
      0,
    ];
  });

  const positions = displaces.map((disp, index) => {
    return [disp[0] + dpos[index][0], disp[1] + dpos[index][1], disp[2] + dpos[index][2]];
  })

  return (
    <>
      <group
        position={[props.position.x, props.position.z, props.position.y + open]}
      >
        { positions.map((pos, index) => {
          return (
            <mesh
              ref={ref}
              rotation-x={THREE.MathUtils.degToRad(90)}
              rotation-z={THREE.MathUtils.degToRad(90)}
              rotation-y={THREE.MathUtils.degToRad(angle[index])}
              position={pos}
            >
              <planeBufferGeometry attach="geometry" args={frame[index]} />
              <meshPhongMaterial attach="material" color={0x3f7b9d} side={THREE.DoubleSide} transparent opacity={0.8} />
            </mesh>
          );
        })}

      </group>
    </>
  );
}

Shutter.propTypes = {
  name: PropTypes.string,
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    z: PropTypes.number,
  }),
  openPercent: PropTypes.number,
};

Shutter.defaultProps = {
  name: 'shutter 1',
  position: {
    x: 0,
    y: 3.3,
    z: 7,
  },
  openPercent: 100,
};

const comparator = (prevProps, nextProps) => {
  return (
    prevProps.name === nextProps.name &&
    prevProps.openPercent === nextProps.openPercent &&
    isEqual(prevProps.position, nextProps.position)
  );
}

export default React.memo(Shutter, comparator);
