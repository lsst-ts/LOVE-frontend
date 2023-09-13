import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import * as THREE from "three";

const Vector = (props) => {
  const ref = useRef();
  const [hovered, setHover] = useState(false);
  const isSelected = props.selectedSensor === props.sensorId;

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
  }, [hovered])

  const points = [];
  const v1 = new THREE.Vector3(props.start.x, props.start.z, props.start.y);
  let v2 = undefined;
  if (props.end !== undefined && props.angle === undefined ) {
    v2 = new THREE.Vector3(props.end.x, props.end.z, props.end.y);
  } else {
    const angleRadians = THREE.MathUtils.degToRad(props.angle); //degree to radians
    v2 = new THREE.Vector3(Math.cos(angleRadians), Math.sin(angleRadians), 0).normalize();
  }
  points.push(v1);
  points.push(v2);

  const direction = new THREE.Vector3();
  const distance = v1.distanceTo(v2);
  direction.subVectors(v2, v1).normalize();

  const conePosition = new THREE.Vector3().copy(v1).addScaledVector(direction, distance - 0.2);
  const coneRotation = new THREE.Euler().setFromQuaternion(
    new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction)
  );

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <>
      <group
        onPointerEnter={(e) => setHover(true)}
        onPointerLeave={(e) => setHover(false)}
        onClick={(e) => {
          props.setSensor(props.sensorId);
          setHover(true);
        }}
      >
        <line
          {...props}
          ref={ref}
          geometry={lineGeometry}
        >
          <lineBasicMaterial color={hovered ? 0xffffff : props.color}
            linewidth={3} linecap={'round'} linejoin={'round'}
          />
        </line>
        <mesh
          {...props}
          ref={ref}
          position={conePosition}
          rotation={coneRotation}
        >
          <coneGeometry args={[0.2, 0.5, 32]} />
          <meshBasicMaterial color={hovered ? 0xffffff : props.color}/>
        </mesh>
      </group>
    </>
  );
}

const comparator = (prevProps, nextProps) => {
  return (
    prevProps.sensorId === nextProps.sensorId &&
    prevProps.angle === nextProps.angle &&
    prevProps.color === nextProps.color &&
    isEqual(prevProps.start, nextProps.start) && 
    isEqual(prevProps.end, nextProps.end)
  );
};

Vector.propTypes = {
  sensorId: PropTypes.number,
  start: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    z: PropTypes.number,
  }),
  end: PropTypes.oneOf([PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    z: PropTypes.number,
  }), undefined]),
  angle: PropTypes.oneOf([PropTypes.number, undefined]),
  color: PropTypes.number,
  setSensor: PropTypes.func,
};

Vector.defaultProps = {
  sensorId: 0,
  start: {x: 0, y: 0, z: 0},
  end: undefined,
  angle: undefined,
  color: 0xffff00,
  setSensor: (id) => {console.log('Sensor Arrow default setSensor(', id, ')')},
};

export default React.memo(Vector, comparator);
