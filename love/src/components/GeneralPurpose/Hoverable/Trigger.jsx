import React from 'react';

const getCursorPos = (e, props) => {
  let { x, y, height, width } = e.target.getBoundingClientRect();
  let vOff = 0;
  if (props.middle) vOff = height / 2;
  if (props.bottom) vOff = height;
  let hOff = 0;
  if (props.center) hOff = width / 2;
  if (props.right) hOff = width;
  return [x + hOff, y + vOff];
};

const Trigger = (props) => {
  let newProps = {
    onMouseEnter: (e) => {
      props.show(getCursorPos(e, props));
    },
    onMouseLeave: () => props.hide(),
  };
  const trigger = props.children.length > 1 ? props.children[0] : props.children;
  const float = props.children[1];
  if (float) {
    if (trigger.props.children) {
      newProps.children = [trigger.props.children, float];
    } else newProps.children = float;
  }
  return React.cloneElement(trigger, newProps);
};

export default Trigger;
