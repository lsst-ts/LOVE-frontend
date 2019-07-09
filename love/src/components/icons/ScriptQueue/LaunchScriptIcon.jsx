import React, { Component } from 'react';
import styles from './LaunchScriptIcon.module.css';

export default class LaunchScriptIcon extends Component {
  static defaultProps = {
    style: '',
    title: '',
  };

  render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26.5 24" style={{verticalAlign: 'top'}}>
        <title>{this.props.title}</title>
        <defs />
        <polyline className={styles.classOne} points="14.5 15.5 21.5 15.5 21.5 11 26 15.5 21.5 20 21.5 18" />
        <path
          className={styles.classOne}
          d="M18.39,13.89V4.7L14.61,1.09H2.3A1.41,1.41,0,0,0,.89,2.49v20.2a1.41,1.41,0,0,0,1.41,1.4H17a1.4,1.4,0,0,0,1.4-1.4V18.41"
          transform="translate(-.39 -.59)"
        />
        <path
          className={styles.classOne}
          d="M18.39,5.48H15.56A1.6,1.6,0,0,1,13.89,4V1.59"
          transform="translate(-.39 -.59)"
        />
        <path
          className={styles.classTwo}
          d="M6.77,10.9v.6a1.26,1.26,0,0,1-1.26,1.26V14a1.27,1.27,0,0,1,1.26,1.26v.61a1.92,1.92,0,0,0,1.92,1.92h.1V16.55H8.44A.41.41,0,0,1,8,16.13v-.85a2.52,2.52,0,0,0-.84-1.87,0,0,0,0,1,0,0A2.53,2.53,0,0,0,8,11.5v-.84a.41.41,0,0,1,.41-.42h.35V9h-.1A1.92,1.92,0,0,0,6.77,10.9Z"
          transform="translate(-.39 -.59)"
        />
        <path
          className={styles.classTwo}
          d="M13.13,15.76v-.58a1.26,1.26,0,0,1,1.26-1.26V12.66a1.27,1.27,0,0,1-1.26-1.26v-.59A1.92,1.92,0,0,0,11.2,8.88h-.09v1.26h.33a.43.43,0,0,1,.43.43v.83a2.51,2.51,0,0,0,.83,1.86s0,0,0,.05a2.53,2.53,0,0,0-.83,1.87V16a.44.44,0,0,1-.43.44h-.33V17.7h.09A1.93,1.93,0,0,0,13.13,15.76Z"
          transform="translate(-.39 -.59)"
        />
      </svg>
    );
  }
}
