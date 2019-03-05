import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './ScriptList.module.css';

export default class ScriptList extends Component {
  static propTypes = {
    children: PropTypes.array,
  };

  render() {
    return (
      <div className={styles.scriptListWrapper}>
        <div className={styles.scriptListContainer}>{this.props.children}</div>
      </div>
    );
  }
}
