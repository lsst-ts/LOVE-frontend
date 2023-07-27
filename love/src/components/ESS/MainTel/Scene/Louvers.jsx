import React, { useRef, useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { LouversPositionESS } from 'Config';
import { Canvas, useFrame } from 'react-three-fiber';
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

export function Louver (props) {

  const ref = useRef();
  const canvas = createTextCanvas(props.name, 'white');
  const canvas2 = createTextCanvas(props.name, 'black');

  const textTexture = new THREE.CanvasTexture(canvas);
  const textTexture2 = new THREE.CanvasTexture(canvas2);

  const angleRadians = THREE.MathUtils.degToRad(props.angle); //degree to radians

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
        <mesh ref={ref}
          position={[0, 0, 0.2]}
        >
          <planeGeometry args={[0.5, 0.5]} />
          <meshBasicMaterial map={textTexture} side={THREE.DoubleSide} transparent />
        </mesh>
        <mesh ref={ref}
          position={[0, 0, 0.175]}
        >
          <planeGeometry args={[0.5, 0.5]} />
          <meshBasicMaterial map={textTexture2} side={THREE.DoubleSide} transparent />
        </mesh>
        {/* <mesh
          {...props}
          position={[0, 0, 0]}
        >
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshBasicMaterial color='lightgray' transparent opacity={0.6} />
        </mesh> */}
        <mesh>
          <planeBufferGeometry attach="geometry" args={frame} />
          <meshPhongMaterial attach="material" color="green" side={THREE.DoubleSide} transparent opacity={0.8}/>
        </mesh>
      </group>
    </>
  );
}

Louver.propTypes = {
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    z: PropTypes.number,
  }),
  color: PropTypes.string,
  name: PropTypes.string,
  angle: PropTypes.number,
  type: PropTypes.string,
};

Louver.defaultProps = {
  position: {x: 0, y: 0, z: 0},
  color: 0xffff00,
  name: '',
  angle: 0,
  type: 'I',
  setLouver: (name) => {console.log('name', name)}
};


export function Louvers (props) {

  return (
    LouversPositionESS.map((louver) => {
      return (
        <Louver
          position={louver.position}
          name={louver.name}
          angle={louver.angle}
          type={louver.type}
        />
      )
    })
  )
}

Louvers.propTypes = {
  louvers: PropTypes.arrayOf(PropTypes.shape({
    position: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
      z: PropTypes.number,
    }),
    color: PropTypes.string,
    angle: PropTypes.number,
    type: PropTypes.string,
  })),
};

Louvers.defaultProps = {
  louvers: [{
    position: {x: 0, y: 0, z: 0},
    color: 0xffff00,
    name: '',
    angle: 0,
    type: 'I',
  },],
};
