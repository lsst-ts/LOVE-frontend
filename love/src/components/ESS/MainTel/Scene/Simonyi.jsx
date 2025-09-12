import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import * as THREE from 'three';

function Simonyi(props) {
  const obj = useLoader(OBJLoader, process.env.PUBLIC_URL + '/models/myModel.obj');
  const groupRef = useRef(null);
  const ref = useRef(null);

  // optional: center + normalize the model
  useEffect(() => {
    if (!ref.current) return;
    const box = new THREE.Box3().setFromObject(ref.current);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    ref.current.position.sub(center); // center the model
    ref.current.position.set(0, 0, 0);
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 1 / maxDim; // target size = 1
    ref.current.scale.setScalar(0.01);
  }, []);

  // Change the material color
  if (obj) {
    obj.traverse((child) => {
      if (child.isMesh) {
        child.material.color.set('gray'); // Set the desired color
        // child.material.color.set('#d9f7f6');
        // child.material.color.setRGB(0 / 255, 186 / 255, 188 / 255);
      }
    });
  }

  return (
    <group ref={groupRef} {...props} dispose={null}>
      <primitive object={obj} ref={ref} />
    </group>
  );
}

Simonyi.propTypes = {};

export default Simonyi;
