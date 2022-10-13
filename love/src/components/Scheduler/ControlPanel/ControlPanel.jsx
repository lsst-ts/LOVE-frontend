import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ResumeIcon from 'components/icons/ScriptQueue/ResumeIcon/ResumeIcon';
import PauseIcon from 'components/icons/ScriptQueue/PauseIcon/PauseIcon';
import StopIcon from 'components/icons/ScriptQueue/StopIcon/StopIcon';
import Button from 'components/GeneralPurpose/Button/Button';
import Input from 'components/GeneralPurpose/Input/Input';
import Skymap from '../../AuxTel/Skymap/Skymap';
import styles from './ControlPanel.module.css';
import StatusText from 'components/GeneralPurpose/StatusText/StatusText.jsx';


export default class ControlPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            snapshotUri: "",
        };
    }

    static propTypes = {
        summaryStateData: PropTypes.object,
        detailedStateData: PropTypes.object,
        generalInfoData: PropTypes.object,
        largeFileObjectAvailableData: PropTypes.object,
        subscribeToStreams: PropTypes.func,
        unsubscribeToStreams: PropTypes.func,
        requestSALCommand: PropTypes.func,
    };

    static defaultProps = {
        summaryStateData: undefined,
        detailedStateData: undefined,
        generalInfoData: undefined,
        largeFileObjectAvailableData: undefined,
        requestSALCommand: () => 0,
    };

    static states = {
        0: {
            name: 'UNKNOWN',
            userReadable: 'Unknown',
            char: 'U',
            class: "disabled",
        },
        1: {
            name: 'DISABLED',
            userReadable: 'Disabled',
            char: 'D',
            class: "disabled",
        },
        2: {
            name: 'ENABLED',
            userReadable: 'Enabled',
            char: 'E',
            class: "ok",
        },
        3: {
            name: 'FAULT',
            userReadable: 'Fault',
            char: 'F',
            class: "alert",
        },
        4: {
            name: 'OFFLINE',
            userReadable: 'Offline',
            char: 'O',
            class: "disabled",
        },
        5: {
            name: 'STANDBY',
            userReadable: 'Standby',
            char: 'S',
            class: "warning",
        },
    };

    static detailedStates = {
        0: {
            name: 'UNKNOWN',
            userReadable: 'Unknown',
            char: 'U',
            class: "disabled",
        },
        1: {
            name: 'IDLE',
            userReadable: 'Idle',
            char: 'I',
            class: "warning",
        },
        2: {
            name: 'RUNNING',
            userReadable: 'Running',
            char: 'R',
            class: "ok",
        },
        3: {
            name: 'WAITING_NEXT_TARGET_TIMER_TASK',
            userReadable: 'Waiting',
            char: 'W',
            class: "alert",
        },
        4: {
            name: 'GENERATING_TARGET_QUEUE',
            userReadable: 'Computing',
            char: 'C',
            class: "ok",
        },
        5: {
            name: 'COMPUTING_PREDICTED_SCHEDULE',
            userReadable: 'Predicting',
            char: 'P',
            class: "warning",
        },
        6: {
            name: 'QUEUEING_TARGET',
            userReadable: 'Queueing',
            char: 'Q',
            class: "ok",
        },
    };

    componentDidMount = () => {
        this.props.subscribeToStreams();
    };

    componentWillUnmount = () => {
        this.props.unsubscribeToStreams();
    };

    componentDidUpdate = (prevProps, prevState) => {
        console.log('salIndex: %d, %d', prevProps.salIndex, this.props.salIndex)
        if (prevProps.salIndex !== this.props.salIndex) {
            this.props.unsubscribeToStreams();
            this.props.subscribeToStreams();
        }
    };

    playScheduler(event) {
        this.props.requestSALCommand(
            {
                cmd: "cmd_resume",
                csc: "Scheduler",
                salindex: this.props.salIndex,
                params: {},
            }
        );
    };

    pauseScheduler(event) {
        this.props.requestSALCommand(
            {
                cmd: "cmd_stop",
                csc: "Scheduler",
                salindex: this.props.salIndex,
                params: { abort: false },
            }
        );
    };

    stopScheduler(event) {
        this.props.requestSALCommand(
            {
                cmd: "cmd_stop",
                csc: "Scheduler",
                salindex: this.props.salIndex,
                params: { abort: true },
            }
        );
    };

    loadSnapshot(event) {
        this.props.requestSALCommand(
            {
                cmd: "cmd_load",
                csc: "Scheduler",
                salindex: this.props.salIndex,
                params: { uri: this.state.snapshotUri }
            }
        );
    };

    render() {
        const summaryStateValue = this.props.summaryStateData ? this.props.summaryStateData.summaryState.value : 0;
        const summaryState = ControlPanel.states[summaryStateValue];
        const detailedStateValue = this.props.detailedStateData ? this.props.detailedStateData.substate.value : 0;
        const detailedState = ControlPanel.detailedStates[detailedStateValue];
        const latestSnapshot = this.props.largeFileObjectAvailableData ? this.props.largeFileObjectAvailableData.url.value : null;
        const sunset_timestamp = this.props.generalInfoData ? this.props.generalInfoData.sunset.value : null;
        const sunrise_timestamp = this.props.generalInfoData ? this.props.generalInfoData.sunrise.value : null;
        const isNight = this.props.generalInfoData ? (this.props.generalInfoData.isNight.value ? "Night time" : "Daytime ") : "N/A";

        let sunset_str = "N/A";
        let sunrise_str = "N/A";

        if (sunrise_timestamp !== null) {
            var date = new Date(sunrise_timestamp * 1000);
            sunrise_str = date.toUTCString();
        }

        if (sunset_timestamp !== null) {
            var date = new Date(sunset_timestamp * 1000);
            sunset_str = date.toUTCString();
        }

        return (
            <div className={styles.container}>

                <div className={styles.stateContainer}>

                    <div className={styles.body}>

                        <span className={styles.selectorTitle}>State</span>
                        <div className={styles.row}>
                            <div>
                                <div className={styles.stateCell}>
                                    Summary State <StatusText status={summaryState.class}>{summaryState.name}</StatusText>
                                </div>
                                <div className={styles.stateCell}>
                                    Status <StatusText status={detailedState.class}>{detailedState.userReadable}</StatusText>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.controlContainer}>

                    <span className={styles.selectorTitle}>Controls</span>
                    <div className={styles.controlIconsPanel}>
                        <div className={styles.stateCell}>
                            <div className={styles.pauseIconContainer} onClick={(event) => { this.playScheduler(event) }}>
                                <div className={styles.pauseIconWrapper} title="Resume Scheduler">
                                    <ResumeIcon />
                                </div>
                            </div>
                        </div>
                        <div className={styles.stateCell}>
                            <div className={styles.pauseIconContainer} onClick={(event) => { this.pauseScheduler(event) }}>
                                <div className={styles.pauseIconWrapper} title="Pause Scheduler">
                                    <PauseIcon />
                                </div>
                            </div>
                        </div>
                        <div className={styles.stateCell}>
                            <div className={styles.pauseIconContainer} onClick={(event) => { this.stopScheduler(event) }}>
                                <div className={styles.pauseIconWrapper} title="Stop Scheduler">
                                    <StopIcon />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.loadSnapshotContainer}>
                            <Input placeholder="Load Snapshot" onChange={(e) => this.setState({ snapshotUri: e.target.value })} />
                            <Button
                                title="set state"
                                status="info"
                                shape="rounder"
                                padding='30px'
                                disabled={this.state.snapshotUri === ""}
                                onClick={(event) => {
                                    this.loadSnapshot(event);
                                }}
                                command
                            >
                                LOAD
                            </Button>

                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.loadSnapshotContainer}>
                            Latest snapshot: {latestSnapshot}
                        </div>
                    </div>

                </div>

                <div className={styles.infoContainer}>

                    <div className={styles.body}>

                        <span className={styles.selectorTitle}>INFO</span>
                        <div className={styles.row}>
                            <div>
                                <div className={styles.infoCell}>
                                    Next Sunset: {sunset_str}
                                </div>
                                <div className={styles.infoCell}>
                                    Next Sunrise: {sunrise_str}
                                </div>
                                <div className={styles.infoCell}>
                                    {isNight}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className={styles.skyMap}>
                    <Skymap></Skymap>
                </div>
            </div>
        );
    }
}