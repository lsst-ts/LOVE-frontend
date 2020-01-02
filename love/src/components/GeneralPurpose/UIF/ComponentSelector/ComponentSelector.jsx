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
          Blah
        </div>
      </>
    );
  }
}
