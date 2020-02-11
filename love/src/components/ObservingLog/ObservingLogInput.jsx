import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Panel from '../GeneralPurpose/Panel/Panel';
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
      message : ''
    };
  }

  componentDidMount = () => {
    this.props.subscribeToStreams();
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStreams();
  };

  render() {
    return (
      <Panel title="Observing Log" className={styles.panel}>
        <div className={styles.container}>
          <div>
            <span className={styles.label}>User:</span>
            <span>{this.props.username}</span>
          </div>
          <div>
            <span className={styles.label}>Message:</span>
            <TextArea callback={(content) => this.setState({message: content})}></TextArea>
          </div>
          <Button onClick={(e)=>this.props.sendMessage(this.props.username, this.state.message)}>Save</Button>
        </div>
      </Panel>
    );
  }
}
