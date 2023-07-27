import React, { useRef, useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { LouversPositionESS } from 'Config';
import { Canvas, useFrame } from 'react-three-fiber';
import * as THREE from "three";


function createTextCanvas(text) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const fontSize = 120;

  context.font = `${fontSize}px Arial`;
  const textWidth = context.measureText(text).width;

  canvas.width = textWidth;
  canvas.height = fontSize * 1.5;

  context.font = `${fontSize}px Arial`;
  context.fillStyle = 'black';
  context.fillText(text, 0, fontSize);

  return canvas;
}

export function Louver (props) {

  const ref = useRef();
  const canvas = createTextCanvas(props.name);
  const textTexture = new THREE.CanvasTexture(canvas);

  const angleRadians = THREE.MathUtils.degToRad(props.angle); //degree to radians

  return (
    <>
      <group
        position={[props.position.x, props.position.z, props.position.y]}
        onClick={(e) => props.setLouver(props.name)}
        rotation-y={angleRadians}
      >
        <mesh ref={ref}
          position={[0, 0, 0.5]}
        >
          <planeGeometry args={[0.5, 0.5]} />
          <meshBasicMaterial map={textTexture} side={THREE.DoubleSide} transparent />
        </mesh>
        <mesh
          {...props}
          position={[0, 0, 0]}
        >
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshBasicMaterial color='lightgray' transparent opacity={0.6} />
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
};

Louver.defaultProps = {
  position: {x: 0, y: 0, z: 0},
  color: 0xffff00,
  name: '',
  angle: 0,
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
  })),
};

Louvers.defaultProps = {
  louvers: [{
    position: {x: 0, y: 0, z: 0},
    color: 0xffff00,
    name: '',
    angle: 0,
  },],
};
