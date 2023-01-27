import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Scheduler.module.css';
import Headers from './Headers/Headers';
import Filters from './Filters/Filters';
import Pointing from './Summary/Pointing/Pointing';
import Simonyi from './Summary/Simonyi/Simonyi';
import Moon from './Summary/Moon/Moon';
import Sun from './Summary/Sun/Sun';
import CurrentTarget from './CurrentTarget/CurrentTarget';
import SkyMap from './SkyMap/SkyMap';
import Plots from './Plots/Plots';
import AccordionSummary from './AccordionSummary/AccordionSummary';

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
            <div className={styles.container}>
                <Headers/>
                <div className={styles.allComponentes}>
                    {/* column 1 */}
                    <div className={styles.leftDiv}>
                        <Filters/>
                        <Pointing/>
                        <Simonyi/>
                        <Moon/>
                        <Sun />
                    </div>
                    {/* column 2 */}
                    <div className={styles.middleDiv}>
                        <CurrentTarget/>
                        <SkyMap/>
                        <Plots/>
                    </div>
                    {/* column 3 */}
                    <div className={styles.rigthDiv}>
                        <AccordionSummary/>
                    </div>
                </div>
            </div>
        );
    };
}
