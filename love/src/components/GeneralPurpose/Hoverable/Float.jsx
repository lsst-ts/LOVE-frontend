import React from 'react';

const Float = (props) => {
  let vOff = 0;
  if (props.middle) vOff = 50;
  if (props.top) vOff = 100;

  let hOff = 0;
  if (props.center) hOff = 50;
  if (props.left) hOff = 100;

  let style = {
    position: 'absolute',
    left: props.position[0],
    top: props.position[1],
  };
  if (hOff !== 0 || vOff !== 0) style.transform = `translate(-${hOff}%, -${vOff}%)`;
  const newProps = {
    style,
    onMouseLeave: () => props.hide(),
  };
  return React.cloneElement(props.children, newProps);
};

export default Float;
