import React, { useRef } from 'react';

const ProgressBar = (props) => {
  const ref = useRef(null);
  const { targetValue, completed, height = 20 } = props;
  const padding = 4;

  const parentDiv = {
    display: 'flex',
  };

  const containerStyles = {
    height: 20,
    width: '100%',
    backgroundColor: '#455a64',
    marginBottom: '5px',
    float: 'rigth',
    position: 'relative',
    padding: `${padding}px`,
  };

  const fillerStyles = {
    height: '100%',
    width: `${completed}%`,
    backgroundColor: 'var(--second-quaternary-background-color)',
    textAlign: 'right',
  };

  const labelStyles = {
    padding: 5,
    color: 'white',
    fontWeight: 'bold',
  };

  const targetValueLine = {
    stroke: 'white',
    strokeWidth: 1,
    strokeDasharray: 1.3,
    strokeOpacity: 0.5,
  };

  const progressCommandedLine = {
    position: 'absolute',
    top: padding,
    right: padding,
    bottom: padding,
    left: padding,
    overflow: 'visible',
  };

  const width = ref.current?.clientWidth ?? 0;
  const targetValuePixels = ((width - 2 * padding) * targetValue) / 100;

  return (
    <div style={parentDiv}>
      <div>
        <span style={labelStyles}>{`${completed}%`}</span>
      </div>
      <div ref={ref} style={containerStyles}>
        <svg width={width - 2 * padding} height={height} style={progressCommandedLine}>
          <line
            style={targetValueLine}
            x1={targetValuePixels}
            y1={-padding}
            x2={targetValuePixels}
            y2={height + padding}
          />
        </svg>
        <div style={fillerStyles}></div>
      </div>
    </div>
  );
};

export default ProgressBar;
