import React from 'react';

const ProgressBar = (props) => {
  const { completed } = props;

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

  return (
    <div style={parentDiv}>
      <div>
        <span style={labelStyles}>{`${completed}%`}</span>
      </div>
      <div style={containerStyles}>
        <div style={fillerStyles}></div>
      </div>
    </div>
  );
};

export default ProgressBar;
