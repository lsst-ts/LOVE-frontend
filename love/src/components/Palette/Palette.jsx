import React from 'react';
import { isConcatSpec } from 'vega-lite/build/src/spec/concat';
import Button from '../GeneralPurpose/Button/Button';

import AddIcon from 'components/icons/AddIcon/AddIcon';
import ArrowIcon from 'components/icons/ArrowIcon/ArrowIcon';
import BackArrowIcon from 'components/icons/BackArrowIcon/BackArrowIcon';
import CheckStatusIcon from 'components/icons/CheckStatusIcon/CheckStatusIcon';
import CloseIcon from 'components/icons/CloseIcon/CloseIcon';
import EmergencyContactIcon from 'components/icons/EmergencyContactIcon/EmergencyContactIcon';
import ErrorIcon from 'components/icons/ErrorIcon/ErrorIcon';
import ExitModeIcon from 'components/icons/ExitModeIcon/ExitModeIcon';
import ExportIcon from 'components/icons/ExportIcon/ExportIcon';
import FilterIcon from 'components/icons/FilterIcon/FilterIcon';
import GearIcon from 'components/icons/GearIcon/GearIcon';
import GoBackIcon from 'components/icons/GoBackIcon/GoBackIcon';
import IconBadge from 'components/icons/IconBadge/IconBadge';
import ImportIcon from 'components/icons/ImportIcon/ImportIcon';
import InfoIcon from 'components/icons/InfoIcon/InfoIcon';
import MenuIcon from 'components/icons/MenuIcon/MenuIcon';
import NotificationIcon from 'components/icons/NotificationIcon/NotificationIcon';
import RedoIcon from 'components/icons/RedoIcon/RedoIcon';
import RotateIcon from 'components/icons/RotateIcon/RotateIcon';
import ScriptIcon from 'components/icons/ScriptIcon/ScriptIcon';
import UndoIcon from 'components/icons/UndoIcon/UndoIcon';
import WarningIcon from 'components/icons/WarningIcon/WarningIcon';
import AcknowledgeIcon from 'components/icons/Watcher/AcknowledgeIcon/AcknowledgeIcon';

import styles from './Palette.module.css';


function Palette(props) {
  const fontSizes = [
    '--font-size-smaller',
    '--font-size-small',
    '--font-size-medium',
    '--font-size-large',
    '--font-size-larger',
  ];

  const fontWeights = ['normal', 'bold', '100', '200', '300', '400', '500', '700', '800', '900'];

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

  const icons = [
    <AddIcon clasName={styles.icon}/>,
    <ArrowIcon clasName={styles.icon}/>,
    <BackArrowIcon clasName={styles.icon}/>,
    <CheckStatusIcon clasName={styles.icon}/>,
    <CloseIcon clasName={styles.icon}/>,
    <EmergencyContactIcon clasName={styles.icon}/>,
    <ErrorIcon clasName={styles.icon}/>,
    <ExitModeIcon clasName={styles.icon}/>,
    <ExportIcon clasName={styles.icon}/>,
    <FilterIcon clasName={styles.icon}/>,
    <GearIcon clasName={styles.icon}/>,
    <GoBackIcon clasName={styles.icon}/>,
    <IconBadge clasName={styles.icon}/>,
    <ImportIcon clasName={styles.icon}/>,
    <InfoIcon clasName={styles.icon}/>,
    <MenuIcon clasName={styles.icon}/>,
    <NotificationIcon clasName={styles.icon}/>,
    <RedoIcon clasName={styles.icon}/>,
    <RotateIcon clasName={styles.icon}/>,
    <ScriptIcon clasName={styles.icon}/>,
    <UndoIcon clasName={styles.icon}/>,
    <WarningIcon clasName={styles.icon}/>,
    <AcknowledgeIcon clasName={styles.icon}/>,
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

          {fontSizes.map((fontSize, index) => (
            <div key={index} tyle={{ fontSize: `var(${fontSize})` }}>
              {fontSize}
            </div>
          ))}
        </div>

        <div>
          <h1> Font Weights </h1>

          {fontWeights.map((fontWeight, index) => (
            <div key={index}>
              <span style={{ fontWeight: `${fontWeight}` }}>regular {fontWeight}</span>
              <span style={{ fontWeight: `${fontWeight}`, fontStyle: 'italic' }}>italic {fontWeight}</span>
            </div>
          ))}
        </div>

        <div>
          <h1> Buttons </h1>
          <div className={styles.buttons}>
            <span> Enabled: </span>
            {statuses.map((status, index) => (
              <Button key={index} status={status}>
                {status}
              </Button>
            ))}

            <span> Disabled: </span>
            {statuses.map((status, index) => (
              <Button key={index} status={status} disabled>
                {status}
              </Button>
            ))}

            {sizes.map((size, index) => (
              <React.Fragment key={index}>
                <span> {size}: </span>
                {statuses.map((status, index) => (
                  <Button key={index} status={status} size={size}>
                    {status}
                  </Button>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <h1> Regular Backgrounds and Foregrounds </h1>
      {fontColors.map((fontColor, index) => (
        <React.Fragment key={index}>
          <h2> Font color: {fontColor} </h2>
          <div className={styles.grid}>
            {backgroundColors.map((backgroundColor, i) => {
              const style = {
                backgroundColor: `var(${backgroundColor})`,
                color: `var(${fontColor})`,
              };
              return (
                <div key={i} style={style}>
                  <p> {fontColor} </p>
                  <p> {backgroundColor} </p>
                </div>
              );
            })}
          </div>
        </React.Fragment>
      ))}

      <h1> Status colors </h1>
      <div className={styles.grid}>
        {statusColors.map((color, index) => {
          const style = {
            backgroundColor: `var(${color})`,
          };
          return (
            <div style={style} key={index}>
              <p> {color} </p>
            </div>
          );
        })}
      </div>

      <h1> Script colors </h1>
      <div className={styles.grid}>
        {scriptColors.map((color, index) => {
          const style = {
            backgroundColor: `var(${color})`,
          };
          return (
            <div style={style} key={index}>
              <p> {color} </p>
            </div>
          );
        })}
      </div>

      <h1> Icons </h1>
      <div className={styles.grid}>
        {icons.map((icon, index) => {
          return <Button key={index} className={styles.btn}>{icon}</Button>;
        })}
      </div>

    </div>
  );
}

export default Palette;
