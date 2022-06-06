import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './MessageIcon.module.css';


export default class MessageIcon extends Component {
  static propTypes = {
    title: PropTypes.string,
  };

  static defaultProps = {
    title: '',
    className: '',
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <svg
        id="Message"
        data-name="Message"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 26.36 25"
        className={[styles.fill, this.props.className].join(' ')}
      >
          <rect class={[styles.fill, this.props.className].join(' ')} width="26.36" height="18.09" rx="5.82"/>
          <path class={[styles.fill, this.props.className].join(' ')} d="M8.46,14.81l9.76,9.76a1.47,1.47,0,0,0,2.5-1v-10A1.46,1.46,0,0,0,19.21,12l-9.76.28A1.46,1.46,0,0,0,8.46,14.81Z"/>
      </svg>
    );
  }
}

