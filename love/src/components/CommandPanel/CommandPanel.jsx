import React, { Component } from 'react';
// import DomeCloseButton from './DomeCloseButton/DomeCloseButton';
import StopAllTSCButton from './StopAllTSCButton/StopAllTSCButton';
import styles from './CommandPanel.module.css';

export default class CommandPanel extends Component {
  render() {
    return (
      <div className={styles.container}>
        {/* <DomeCloseButton {...this.props}></DomeCloseButton> */}
        <StopAllTSCButton {...this.props}></StopAllTSCButton>
      </div>
    );
  }
}
