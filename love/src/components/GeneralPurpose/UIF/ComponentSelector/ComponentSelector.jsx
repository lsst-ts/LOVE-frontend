import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './ComponentSelector.module.css';


export default class ComponentSelector extends Component {
  static propTypes = {
    /** Children components */
    children: PropTypes.node,
    /** Last SAL command that has been sent */
    lastSALCommand: PropTypes.object,
  };

  static defaultProps = {
    lastSALCommand: undefined,
  };

  render() {
    return (
      <>
        <div className={styles.container}>
          <h2> Select Components to add to the view </h2>
          <h3> UI Framework </h3>
          <h3> Auxiliary Telescope </h3>
          <h3> Main Telescope </h3>
          <h3> General Purpose </h3>
        </div>
      </>
    );
  }
}
