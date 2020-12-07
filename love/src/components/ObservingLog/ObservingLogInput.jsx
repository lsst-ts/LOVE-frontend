import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './ObservingLogInput.module.css';
import TextArea from '../GeneralPurpose/TextArea/TextArea';
import Button from '../GeneralPurpose/Button/Button';

export default class ObservingLogInput extends Component {
  static propTypes = {
    /** Function to subscribe to streams to receive the alarms */
    subscribeToStreams: PropTypes.func,
    /** Function to unsubscribe to streams to stop receiving the alarms */
    unsubscribeToStreams: PropTypes.func,
    /** Username of logged user */
    username: PropTypes.string,
    /** Function to run when the "save" button is clicked */
    sendMessage: PropTypes.func,
  };

  static defaultProps = {
    alarms: [],
  };

  constructor() {
    super();
    this.state = {
      message: '',
      keysDown: [],
    };
  }

  componentDidMount = () => {
    this.props.subscribeToStreams();
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStreams();
  };

  sendMessage = (username, message) => {
    this.props.sendMessage(this.props.username, this.state.message);
    this.setState({
      message: '',
    })
  }

  onTextChange = (content) => {
    this.setState({
      message: content,
    });
  };

  onKeyDown = (event) => {
    const keyDown = event.key;

    if (this.state.keysDown.includes(keyDown)) {
      return;
    }

    this.setState((state) => ({
      ...state,
      keysDown: [...new Set([...state.keysDown, keyDown])],
    }), () => {
      const keyCombinationPressed = ['Control', 'Enter'].every((key) => this.state.keysDown.includes(key));
      if (keyCombinationPressed) this.sendMessage(this.props.username, this.state.message);
    });
  };

  onKeyUp = (event) => {
    const keyDown = event.key;

    this.setState((state) => ({
      ...state,
      keysDown: state.keysDown.filter((key) => key !== keyDown),
    }));
  };

  render() {
    return (
      <div className={styles.container}>
        <div>
          <span className={styles.label}>User:</span>
          <span>{this.props.username}</span>
        </div>
        <div>
          <span className={styles.label}>Message:</span>
          <TextArea value={this.state.message} callback={this.onTextChange} onKeyDown={this.onKeyDown} onKeyUp={this.onKeyUp}></TextArea>
        </div>
        <Button onClick={(e) => this.sendMessage(this.props.username, this.state.message)}>Save (Ctrl+Enter)</Button>
      </div>
    );
  }
}
