import React from 'react';

function MenuIcon(props) {
  return (
    <svg viewBox="0 0 512 512" {...props}>
      <g>
        <circle cx="256" cy="256" r="64"/>
        <circle cx="256" cy="448" r="64"/>
        <circle cx="256" cy="64" r="64"/>
      </g>
    </svg>
  );
}

export default MenuIcon;
