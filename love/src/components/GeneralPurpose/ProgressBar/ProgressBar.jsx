import React from 'react';

const ProgressBar = (props) => {
  const { targetValueX, completed } = props;

  const parentDiv = {
    display: 'flex',
  };

  const containerStyles = {
    height: 20,
    width: '100%',
    backgroundColor: '#455a64',
    marginBottom: '5px',
    float: 'rigth',
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

  const targetValue = {
    stroke: 'white',
    strokeWidth: 1,
    strokeDasharray: 1.3,
    strokeOpacity: 0.5,
  };

  const xMargin = 5;
  const height = 60;
  const yOffset = height / 3;

  return (
    <div style={parentDiv}>
      <div>
        <span style={labelStyles}>{`${completed}%`}</span>
      </div>
      <div style={containerStyles}>
        <div style={fillerStyles}>
          {/* <svg>
            <line
              style={targetValue}
              x1={targetValueX + xMargin}
              y1={height / 3 + yOffset}
              x2={targetValueX + xMargin}
              y2={(2 * height) / 3 + yOffset}
            />
          </svg> */}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
