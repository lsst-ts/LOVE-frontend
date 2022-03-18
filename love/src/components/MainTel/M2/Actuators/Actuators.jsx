import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Toggle from 'components/GeneralPurpose/Toggle/Toggle';

import Inclinometer from './Inclinometer/Inclinometer.jsx';
import Selector from './Selector/Selector.jsx';
import ForceGradiant from './ForceGradiant/ForceGradiant.jsx';
import Info from './Info/Info.jsx';
import styles from './Actuators.module.css';

export default class Actuators extends Component {
    static propTypes = {
    };

    static defaultProps = {};

    constructor(props) {
        super(props);
        this.state = {
            actuators: [],
            xRadius: 0,
            yRadius: 0,
            maxRadius: 0,
            colormap: () => '#fff',
            width: 480,
            zoomLevel: 1,
            showActuatorsID: true,
            showCommandedForce: true,
            showMeasuredForce: true,
            actuatorsForce: [],
            selectedActuator: null,
            selectedActuatorTangent: null,
          };
    };

    arrayReferenceId = () => {
        const array = [];
        for (let i = 0; i < 78; i++) {
            array.push(i + 1);
        }
        return array;
    };

    toggleActuatorsID = (show) => {
        this.setState({ showActuatorsID: show });
    };
    
    toggleCommandedForce = (show) => {
        this.setState({ showCommandedForce: show });
    };
    
    toggleMeasuredForce = (show) => {
        this.setState({ showMeasuredForce: show });
    };

    actuatorSelect = (id) => {
        this.setState({
            selectedActuator: id,
            selectedActuatorTangent: null,
         });
    };

    actuatorTangentSelect = (id) => {
        this.setState({
            selectedActuatorTangent: id,
            selectedActuator: null,
        });
    };

    render() {

        const { showActuatorsID, showCommandedForce, showMeasuredForce,
                selectedActuator, selectedActuatorTangent } = this.state;

        const { zenithAngleMeasured, inclinationTelemetrySource } = this.props;

        const { actuators,
                actuatorsForce } = this.state;
        const { actuatorIlcState,
                axialActuatorSteps,
                axialEncoderPositions,
                axialForceApplied,
                axialForceMeasured,
                tangentActuatorSteps,
                tangentEncoderPositions,
                tangentForceApplied,
                tangentForceMeasured,
        } = this.props;

        const actuatorReferenceId = this.arrayReferenceId().slice(0, 72);
        const actuatorTangentReferenceId = this.arrayReferenceId().slice(0, 6);

        return (
            <div className={styles.actuatorsContainer}>
                <SummaryPanel className={styles.summaryPanelControls}>
                    <h2 className={styles.title}>Actuators</h2>
                    <div className={styles.controls}>
                        <div className={styles.control}>
                        <span>Actuators ID:</span>
                        <div className={styles.toggleContainer}>
                            <span>Show</span>
                            <Toggle hideLabels={true} isLive={showActuatorsID} setLiveMode={this.toggleActuatorsID} />
                            <span>Hide</span>
                        </div>
                        </div>
                        <div className={styles.control}>
                        <span>Commanded Force:</span>
                        <div className={styles.toggleContainer}>
                            <span>Show</span>
                            <Toggle hideLabels={true} isLive={showCommandedForce} setLiveMode={this.toggleCommandedForce} />
                            <span>Hide</span>
                        </div>
                        </div>
                        <div className={styles.control}>
                        <span>Measured Force:</span>
                        <div className={styles.toggleContainer}>
                            <span>Show</span>
                            <Toggle hideLabels={true} isLive={showMeasuredForce} setLiveMode={this.toggleMeasuredForce} />
                            <span>Hide</span>
                        </div>
                        </div>
                    </div>
                </SummaryPanel>

                <div className={styles.selectorAndInclinometerContainer}>
                    <div className={styles.selectorContainer}>
                        <Selector
                            actuatorIlcState={actuatorIlcState}
                            actuatorReferenceId={actuatorReferenceId}
                            actuatorTangentReferenceId={actuatorTangentReferenceId}
                            axialActuatorSteps={axialActuatorSteps}
                            axialEncoderPositions={axialEncoderPositions}
                            axialForceApplied={axialForceApplied}
                            axialForceMeasured={axialForceMeasured}
                            showActuatorsID={showActuatorsID}
                            showCommandedForce={showCommandedForce}
                            showMeasuredForce={showMeasuredForce}
                            actuatorSelect={this.actuatorSelect}
                            selectedActuator={selectedActuator}
                            actuatorTangentSelect={this.actuatorTangentSelect}
                            selectedActuatorTangent={selectedActuatorTangent}
                            {...this.props}
                        />
                    </div>
                    
                    <div className={styles.inclinometerForcegradiantAndInfoContainer}>
                        <div className={styles.item1}>
                            <Inclinometer
                                zenithAngleMeasured={zenithAngleMeasured}
                                inclinationTelemetrySource={inclinationTelemetrySource}
                            />
                        </div>
                        <div className={styles.item2}>
                            <ForceGradiant
                                selectedActuator={selectedActuator}
                                selectedActuatorTangent={selectedActuatorTangent}
                                axialForceApplied={axialForceApplied}
                                axialForceMeasured={axialForceMeasured}
                                tangentForceApplied={tangentForceApplied}
                                tangentForceMeasured={tangentForceMeasured}
                            />
                        </div>
                        <div className={styles.item3}>
                            <Info
                                actuatorReferenceId={actuatorReferenceId}
                                actuatorTangentReferenceId={actuatorTangentReferenceId}
                                actuatorIlcState={actuatorIlcState}
                                axialActuatorSteps={axialActuatorSteps}
                                axialEncoderPositions={axialEncoderPositions}
                                axialForceApplied={axialForceApplied}
                                axialForceMeasured={axialForceMeasured}
                                tangentActuatorSteps={tangentActuatorSteps}
                                tangentEncoderPositions={tangentEncoderPositions}
                                tangentForceApplied={tangentForceApplied}
                                tangentForceMeasured={tangentForceMeasured}
                                selectedActuator={selectedActuator}
                                selectedActuatorTangent={selectedActuatorTangent}
                            />
                        </div>
                        
                    </div>
                </div>

            </div>
        );
    }
}