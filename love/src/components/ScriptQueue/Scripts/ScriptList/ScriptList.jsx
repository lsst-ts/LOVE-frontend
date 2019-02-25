import React, { Component } from 'react';
import styles from './ScriptList.module.css';

export default class ScriptList extends Component {
  render() {
    return (
      <div className={styles.scriptListWrapper}>
        <div className={styles.scriptListContainer}>{this.props.children}</div>
      </div>
    );
  }
}
