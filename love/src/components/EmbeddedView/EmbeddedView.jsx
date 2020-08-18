import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './EmbeddedView.module.css';

export default class EmbeddedView extends Component {
  static propTypes = {
    url: PropTypes.string,
  };

  render() {
    return (
      <div className={styles.container}>
        <iframe
          id="ytplayer"
          type="text/html"
          className={styles.iframeElement}
          src={this.props.url}
          frameBorder="0"
          title={this.props.url}
        ></iframe>
      </div>
    );
  }
}
