import React, { useRef, useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { Canvas, useFrame } from 'react-three-fiber';
import { isEqual } from 'lodash';
import * as THREE from "three";

function createTextCanvas(text, color) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  context.font = `bold 100px Arial`;
  const textWidth = context.measureText(text).width;

  canvas.width = textWidth;
  canvas.height = 120;

  context.font = `bold 100px Arial`;
  context.fillStyle = color;
  context.fillText(text, 0, 100);
  return canvas;
}

function angleOfPercentOpen(percent) {
  return (-1) * percent * 90 / 100;
}

const Louver = (props) => {

  const textRef = useRef();
  const textShadowRef = useRef();
  const canvas = createTextCanvas(props.name, 'white');
  const canvas2 = createTextCanvas(props.name, 'black');

  const textTexture = new THREE.CanvasTexture(canvas);
  const textTexture2 = new THREE.CanvasTexture(canvas2);

  const angleRadians = THREE.MathUtils.degToRad(props.angle); //degree to radians
  const angleOpen = THREE.MathUtils.degToRad(angleOfPercentOpen(props.percentOpen));

  const frame = {
    'I': [6.15, 4.1],
    'II': [5.125, 3.28],
  }[props.type];

  return (
    <>
      <group
        position={[props.position.x, props.position.z, props.position.y]}
        onClick={(e) => props.setLouver(props.name)}
        rotation-y={angleRadians}
      >
        <group
          rotation-x={angleOpen}
        >
          <mesh ref={textRef}
            position={[0, 0, 0.2]}
          >
            <planeGeometry args={[0.5, 0.5]} />
            <meshBasicMaterial map={textTexture} side={THREE.DoubleSide} transparent />
          </mesh>
          <mesh ref={textShadowRef}
            position={[0, 0, 0.175]}
          >
            <planeGeometry args={[0.5, 0.5]} />
            <meshBasicMaterial map={textTexture2} side={THREE.DoubleSide} transparent />
          </mesh>
          <mesh>
            <planeBufferGeometry attach="geometry" args={frame} />
            <meshPhongMaterial attach="material" color={0x3f7b9d} side={THREE.DoubleSide} transparent opacity={0.8} />
          </mesh>
        </group>
        <mesh
          position={[0, 0, -0.05]}
        >
          <boxGeometry args={[frame[0], frame[1], 0.05]} />
          <meshBasicMaterial color={0x3f7b9d} wireframe transparent opacity={0.8} />
        </mesh>
      </group>
    </>
  );
};

Louver.propTypes = {
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    z: PropTypes.number,
  }),
  name: PropTypes.string,
  id: PropTypes.number,
  angle: PropTypes.number,
  percentOpen: PropTypes.number,
  type: PropTypes.string,
};

Louver.defaultProps = {
  position: {x: 0, y: 0, z: 0},
  name: '',
  id: 1,
  angle: 0,
  percentOpen: 50,
  type: 'I',
  setLouver: (name) => {console.log('name', name)}
};

const comparator = (prevProps, nextProps) => {
  return (
      isEqual(nextProps.position, prevProps.position) && 
      prevProps.name === nextProps.name && 
      prevProps.angle === nextProps.angle && 
      prevProps.percentOpen === nextProps.percentOpen
    );
};

export default React.memo(Louver, comparator);
