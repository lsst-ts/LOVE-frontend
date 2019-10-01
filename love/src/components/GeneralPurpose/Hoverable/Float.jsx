import React from 'react';

const Float = (props) => {
  let vOff = 100;
  if (props.middle) vOff = 50;
  if (props.bottom) vOff = 0;

  let hOff = 100;
  if (props.center) hOff = 50;
  if (props.right) hOff = 0;

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
