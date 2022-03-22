import React from 'react';

const ProgressBar = (props) => {
  const { bgcolor, completed } = props;

  const parentDiv = {
    display: 'flex',
  };

  const containerStyles = {
    height: 20,
    width: '100%',
    backgroundColor: '#455a64',
    // borderRadius: 50,
    // margin: 10,
    marginBottom: '5px',
    float: 'rigth',
  };

  const fillerStyles = {
    height: '100%',
    width: `${completed}%`,
    backgroundColor: bgcolor,
    // borderRadius: 'inherit',
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