import React from 'react';
import styles from './Palette.module.css';

function Palette(props) {
  const fontSizes = [
    '--font-size-smaller',
    '--font-size-small',
    '--font-size-medium',
    '--font-size-large',
    '--font-size-larger',
  ];

  const fontColors = [
    '--base-font-color',
    '--second-base-font-color',
    '--secondary-font-color',
    '--secondary-font-dimmed-color',
    '--tertiary-font-color',
    '--highlighted-font-color',
  ]

  const backgroundColors = [
    '--base-background-color',
    '--secondary-background-color',
    '--secondary-background-dimmed-color',
    '--tertiary-background-color',
    '--quaternary-background-color',
    '--quinary-background-color',
    '--overlay-background-color',
    '--second-primary-background-color',
    '--second-primary-background-color-dimmed',
    '--second-secondary-background-color',
    '--second-tertiary-background-color',
    '--second-quaternary-background-color',
    '--second-quaternary-background-dimmed-color',
    '--second-quinary-background-color',
    '--second-senary-background-color',
    '--second-senary-background-dimmed-color',
    '--sidebar-background-color',
  ];
  return (
    <div className={styles.container}>
      <div className={styles.texts}>
        <div>
          <h1> h1 HEADER </h1>
          <h2> h2 HEADER </h2>
          <h4> h4 HEADER </h4>
          <h5> h5 HEADER </h5>
          <h6> h6 HEADER </h6>
          Normal text
        </div>
        <div>
          {fontSizes.map( fontSize => (
            <div style={{fontSize: `var(${fontSize})`}}> {fontSize} </div>
          ))}
        </div>
      </div>

      <h1> REGULAR BACKGROUNDS AND FOREGROUNDS </h1>
      {fontColors.map(fontColor => (
        <>
          <h2> Font color: {fontColor} </h2>
          <div className={styles.grid}>
            {backgroundColors.map(backgroundColor => {
              const style = {
                backgroundColor: `var(${backgroundColor})`,
                color: `var(${fontColor})`,
              }
              return (
                <div style={style}>
                  <p> {fontColor} </p>
                  <p> {backgroundColor} </p>
                </div>
              );
            })}
          </div>
        </>
      ))}
    </div>
  );
}

export default Palette;
