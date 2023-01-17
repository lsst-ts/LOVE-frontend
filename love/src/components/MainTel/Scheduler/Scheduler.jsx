import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Scheduler.modules.css';

export default class Scheduler extends Component {
    static propTypes = {
        /** Function to subscribe to streams to receive */
        subscribeToStreams: PropTypes.func,
        /** Function to unsubscribe to streams to stop receiving */
        unsubscribeToStreams: PropTypes.func,
    };
    static defaultProps = {

    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount = () => {
        this.props.subscribeToStream();
      };
    
    componentWillUnmount = () => {
    this.props.unsubscribeToStream();
    };

    render() {
        return (
            <div>
                <h2>Scheduler components</h2>
            </div>
        );
    };
}
