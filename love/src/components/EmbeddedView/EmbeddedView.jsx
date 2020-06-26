import React, { Component } from 'react';
import styles from './EmbeddedView.module.css';

export default class EmbeddedView extends Component {
  render() {
    return (
      <div className={styles.container}>
        Embedded
      </div>
    );
  }
}
