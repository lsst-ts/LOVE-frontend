import React from 'react';
import Button from '../GeneralPurpose/Button/Button';
import styles from './Palette.module.css';

function Palette(props) {
  const fontSizes = [
    '--font-size-smaller',
    '--font-size-small',
    '--font-size-medium',
    '--font-size-large',
    '--font-size-larger',
  ];

  const fontWeights = ['lighter', 'normal', 'bold', 'bolder', , '100', '200', '300', '400', '500', '700', '800', '900'];

  const fontColors = [
    '--base-font-color',
    '--second-base-font-color',
    '--secondary-font-color',
    '--secondary-font-dimmed-color',
    '--tertiary-font-color',
    '--highlighted-font-color',
  ];

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

  const statusColors = [
    '--status-ok-color',
    '--status-ok-dimmed-color',
    '--status-ok-dimmed-color-2',
    '--status-ok-dimmed-color-3',
    '--status-warning-color',
    '--status-warning-dimmed-color',
    '--status-warning-dimmed-color-2',
    '--status-warning-dimmed-color-3',
    '--status-alert-color',
    '--status-alert-dimmed-color',
    '--status-alert-dimmed-color-2',
    '--status-alert-dimmed-color-3',
    '--status-disabled-color',
    '--status-disabled-dimmed-color',
    '--status-disabled-dimmed-color-2',
    '--status-running-color',
    '--status-running-dimmed-color',
    '--status-running-dimmed-color-2',
    '--status-running-dimmed-color-3',
  ];

  const scriptColors = ['--script-ok-color', '--script-ok-dimmed-color'];

  const statuses = ['default', 'primary', 'info', 'success', 'warning', 'danger', 'link'];
  const sizes = ['large', 'default', 'small', 'extra-small'];
  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <div>
          <h1> Headers </h1>
          <h1> h1 HEADER </h1>
          <h2> h2 HEADER </h2>
          <h4> h4 HEADER </h4>
          <h5> h5 HEADER </h5>
          <h6> h6 HEADER </h6>
          Normal text
        </div>
        <div>
          <h1> Font Sizes </h1>

          {fontSizes.map((fontSize) => (
            <div style={{ fontSize: `var(${fontSize})` }}> {fontSize} </div>
          ))}
        </div>

        <div>
          <h1> Font Weights </h1>

          {fontWeights.map((fontWeight) => (
            <div style={{ fontWeight: `${fontWeight}` }}> font-weight: {fontWeight} </div>
          ))}
        </div>

        <div>
          <h1> Buttons </h1>
          <div className={styles.buttons}>
            <span> Enabled: </span>
            {statuses.map((status) => (
              <Button status={status}> {status} </Button>
            ))}

            <span> Disabled: </span>
            {statuses.map((status) => (
              <Button status={status} disabled>
                {' '}
                {status}{' '}
              </Button>
            ))}

            {sizes.map((size) => (
              <>
                <span> {size}: </span>
                {statuses.map((status) => (
                  <Button status={status} size={size}>
                    {' '}
                    {status}{' '}
                  </Button>
                ))}
              </>
            ))}
          </div>
        </div>
      </div>

      <h1> Regular Backgrounds and Foregrounds </h1>
      {fontColors.map((fontColor) => (
        <>
          <h2> Font color: {fontColor} </h2>
          <div className={styles.grid}>
            {backgroundColors.map((backgroundColor) => {
              const style = {
                backgroundColor: `var(${backgroundColor})`,
                color: `var(${fontColor})`,
              };
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

      <h1> Status colors </h1>
      <div className={styles.grid}>
        {statusColors.map((color) => {
          const style = {
            backgroundColor: `var(${color})`,
          };
          return (
            <div style={style}>
              <p> {color} </p>
            </div>
          );
        })}
      </div>

      <h1> Script colors </h1>
      <div className={styles.grid}>
        {scriptColors.map((color) => {
          const style = {
            backgroundColor: `var(${color})`,
          };
          return (
            <div style={style}>
              <p> {color} </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Palette;
