import React from 'react';

const Float = (props) => {
  let vOff = 0;
  if (props.middle) vOff = 50;
  if (props.top) vOff = 100;

  let hOff = 0;
  if (props.center) hOff = 50;
  if (props.left) hOff = 100;

  const newProps = {
    style: {
      position: 'absolute',
      left: props.position[0],
      top: props.position[1],
      transform: `translate(-${hOff}%, -${vOff}%)`,
    },
    onMouseLeave: () => props.hide(),
  };
  return React.cloneElement(props.children, newProps);
};

export default Float;
