import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
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
    /** The substate or extra states of the CSC */
    subState: PropTypes.number,
    /** Current observing mode as a human-readable string */
    mode: PropTypes.string,
    /** Type of observation as a human-readable string */
    type: PropTypes.string,
    /** Track if the scheduler conditions determine if it is night time or not */
    isNigth: PropTypes.bool,
    /** How many nights since the start of the survey */
    night: PropTypes.number,
    /** Sunset UTC timestamp (seconds) */
    sunset: PropTypes.number,
    /** Sunrise UTC timestamp (seconds) */
    sunrise: PropTypes.number,
    /** Does the scheduler need a new filter mounted on the camera? */
    needSwap: PropTypes.bool,
    /**  Which filter to add */
    filterToMount: PropTypes.string,
    /** Which filter to remove */
    filterToUnmount: PropTypes.string,
    /** Current pointing RA */
    pointingRa: PropTypes.number,
    /** Current pointing Declination */
    pointingDecl: PropTypes.number,
    /** Current pointing sky position angle */
    pointingPosAngle: PropTypes.number,
    /** Current parallactic angle */
    pointingParallAngle: PropTypes.number,
    /** Is the telescope tracking? */
    simonyiTracking: PropTypes.bool,
    /** Telescope altitude */
    simonyiAl: PropTypes.number,
    /** Telescope azimuth */
    simonyiAz: PropTypes.number,
    /** Telescope rotator position */
    simonyiRot: PropTypes.number,
    /** Dome altitude position */
    domeAlt: PropTypes.number,
    /** Dome azimuth position */
    domeAz: PropTypes.number,
    /** Expected RA of the moon */
    moonRa: PropTypes.number,
    /** Expected Dec of the moon */
    moonDec: PropTypes.number,
    /** Expected altitude of the moon */
    moonAlt: PropTypes.number,
    /** Expected azimuth of the moon */
    moonAz: PropTypes.number,
    /**  Expected distance to the moon */
    moonDistance: PropTypes.number,
    /** Expected moon phase/illumination (0-1) */
    moonPhase: PropTypes.number,
    /** Expected sun RA */
    sunRa: PropTypes.number,
    /** Expected sun declination */
    sunDec: PropTypes.number,
    /** Expected sun altitude */
    sunAlt: PropTypes.number,
    /** Expected sun Azimuth */
    sunAz: PropTypes.number,
    /** Expected solar elongation */
    solarElong: PropTypes.number,
    /** Unique target id */
    currentTargetId: PropTypes.number,
    /** Time on target */
    currentRequestTime: PropTypes.number,
    /** MJD of the start of the observation */
    currentRequestMjd: PropTypes.number,
    /** Right Ascention of the target */
    currentRa: PropTypes.number,
    /** Declination of the target */
    currentDecl: PropTypes.number,
    /** Sky position angle */
    currentSkyAngle: PropTypes.number,
    /** Filter name */
    currentFilter: PropTypes.string,
    /** Number of exposures */
    currentNumExposures: PropTypes.number,
    /** Exposure time */
    currentExposureTimes: PropTypes.number,
    /** Expected slew time */
    currentSlewTime: PropTypes.number,
    /** Offset in X direction (sensor) */
    currentOffsetX: PropTypes.number,
    /** Offset in Y direction (sensor) */
    currentOffsetY: PropTypes.number,
    /** Number of science proposals this target is part of */
    currentNumProposals: PropTypes.number,
    /** Id of the proposals this target is part of */
    currentProposalId: PropTypes.array,
    /** Is this target part of a sequence of observations for the same target? */
    currentSequenceDuration: PropTypes.bool,
    /** The rotation angle of the camera relative to the sky E of N (degrees) */
    rotSkyPos: PropTypes.number,
    /** List of Right Ascension for the targets */
    predictedTargetsRa: PropTypes.array,
    /** List of Declination for the targets */
    predictedTargetsDecl: PropTypes.array,
    /** List of rotation angle of the camera relative to the sky E of N (degrees) */
    predictedTargetsRotSkyPos: PropTypes.number,
    /** Unique target id */
    lastTargetId: PropTypes.number,
    /** Right Ascension of the target */
    lastTargetRa: PropTypes.number,
    /** Declination of the target */
    lastTargetDecl: PropTypes.number,
    /** The rotation angle of the camera relative to the sky E of N (degrees) */
    lastTargetRotSkyPos: PropTypes.number,
    /** Modified Julian Date at the start of the observation */
    lastTargetMjd: PropTypes.number,
    /** Total exposure time of the visit */
    lastTargetExpTime: PropTypes.number,
    /** The filter used. Should be one of u, g, r, i, z, y */
    lastTargetFilter: PropTypes.string,
    /** Number of exposures */
    lastTargetNexp: PropTypes.number,
    /** Any additional information produced by the Scheduler or scheduling algorithm in a yaml format */
    lastTargetMoreInfo: PropTypes.string,
    /** UTC timestamp when the estimation was done (seconds) */
    nextTargetCurrentTime: PropTypes.number,
    /** How long until the next target */
    nextTimeWaitTime: PropTypes.number,
    /** Estimated Right Ascension of the target */
    nextTargetRa: PropTypes.number,
    /** Estimated Declination of the target */
    nextTargetDecl: PropTypes.number,
    /** Estimated rotation angle of the camera relative to the sky E of N (degrees) */
    nextTargetRotSkyPos: PropTypes.number,
    /** Number of targets in the predicted scheduler. Maximum is 1000 */
    predTargetsNumTargets: PropTypes.number,
    /** List of Right Ascension for the targets */
    predTargetsRa: PropTypes.array,
    /** List of Declination for the targets */
    predTargetsDecl: PropTypes.array,
    /** List of rotation angle of the camera relative to the sky E of N (degrees) */
    predTargetsRotSkyPos: PropTypes.array,
    /** List of Modified Julian Date at the start of the observations */
    predTargetsMjd: PropTypes.array,
    /** List of total exposure time for each visit */
    predTargetsExpTime: PropTypes.array,
    /** Comma-separated List of filters/instrument configuration used for each observation */
    predTargetsInstrConfig: PropTypes.string,
    /** List of number of exposures for each visit */
    predTargetsNexp: PropTypes.array,
    /** Number of general proposals */
    surveysNumGenProps: PropTypes.number,
    /** Comma-separated string with the ids of the general proposals */
    surveysGenProps: PropTypes.string,
    /** Number of time-series proposals */
    surveysNumSeqProps: PropTypes. number,
    /** Comma-separated string with the ids of the sequence proposals */
    surveysSeqProps: PropTypes.string,
    /** Comma-separated list of block ids */
    blockInvId: PropTypes.string,
    /** Comma-separated list of status for each individual block */
    blockInvStatus: PropTypes.string,
    /** Id of the block (e.g. OBS-123) */
    blockId: PropTypes.string,
    /** Id of the status as an enumeration */
    blockStatusId: PropTypes.number,
    /** Status of the block, as a human readable string */
    blockStatus: PropTypes.string,
    /** Number of successful executions */
    blockExecCompl: PropTypes.number,
    /** Total number of executions to be completed */
    blockExecTotal: PropTypes.number,
    /** A unique identifier for this block */
    blockHash: PropTypes.string,
    /** The full block definition */
    blockDef: PropTypes.string
  };
  static defaultProps = {};

  constructor(props) {
    super(props);
    // dict with predicted targets
    const targets = [];
    for (let i = 0; i < this.props?.predTargetsDecl?.length; i++){
      const obj = {
        id: i+1,
        lat:  this.props.predTargetsDecl[i],
        long: this.props.predTargetsRa[i], 
      };
      targets.push(obj);
    };

    this.state = {
      predTargets: targets,
    };

    // console.log(this.state.predTargets);
  }

  componentDidMount = () => {
    this.props.subscribeToStream();

    this.skyMap = <SkyMap
      targets={this.state.predTargets}
      // targets={[{
      //   "id": 1,
      //   "lat": 0,
      //   "long": 0
      // },
      //   {
      //     "id": 2,
      //     "lat": 50,
      //     "long": 50
      // },
      // {
      //   "id": 3,
      //   "lat": 80,
      //   "long": 80
      // }
      // ]}
      pointingRa={this.props?.pointingRa}
      pointingDecl={this.props?.pointingDecl}
    />;
  };

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(prevProps.predTargetsDecl, this.props.predTargetsDecl) || !isEqual(prevProps.predTargetsRa, this.props.predTargetsRa)){
      const targets = [];
      for (let i = 0; i < this.props?.predTargetsDecl?.length; i++){
        const obj = {
          id: i+1,
          lat:  this.props.predTargetsDecl[i],
          long: this.props.predTargetsRa[i], 
        };
        targets.push(obj);
      };

      this.setState({
        predTargets: targets,
      });
    }

    if (!isEqual(prevState.predTargets, this.state.predTargets)){
      this.skyMap = <SkyMap
        targets={this.state.predTargets}
        pointingRa={this.props?.pointingRa}
        pointingDecl={this.props?.pointingDecl}
      />;
    };

    // console.log(this.state.predTargets);
  }

  componentWillUnmount = () => {
    this.props.unsubscribeToStream();
  };

  render() {
    const {  
      subState,
      mode,
      type,
      isNigth,
      night,
      sunset,
      sunrise,
      needSwap,
      filterToMount,
      filterToUnmount,
      pointingRa,
      pointingDecl,
      pointingPosAngle,
      pointingParallAngle,
      simonyiTracking,
      simonyiAl,
      simonyiAz,
      simonyiRot,
      domeAlt,
      domeAz,
      moonRa,
      moonDec,
      moonAlt,
      moonAz,
      moonDistance,
      moonPhase,
      sunRa,
      sunDec,
      sunAlt,
      sunAz,
      solarElong,
      currentTargetId,
      currentRequestTime,
      currentRequestMjd,
      currentRa,
      currentDecl,
      currentSkyAngle,
      currentFilter,
      currentNumExposures,
      currentExposureTimes,
      currentSlewTime,
      currentOffsetX,
      currentOffsetY,
      currentNumProposals,
      currentProposalId,
      currentSequenceDuration,
      currentSequenceNVisits,
      currentSequenceVisits,
      rotSkyPos,
      predictedTargetsRa,
      predictedTargetsDecl,
      predictedTargetsRotSkyPos,
      lastTargetId,
      lastTargetRa,
      lastTargetDecl,
      lastTargetRotSkyPos,
      lastTargetMjd,
      lastTargetExpTime,
      lastTargetFilter,
      lastTargetNexp,
      lastTargetMoreInfo,
      nextTargetCurrentTime,
      nextTimeWaitTime,
      nextTargetRa,
      nextTargetDecl,
      nextTargetRotSkyPos,
      predTargetsNumTargets,
      predTargetsRa,
      predTargetsDecl,
      predTargetsRotSkyPos,
      predTargetsMjd,
      predTargetsExpTime,
      predTargetsInstrConfig,
      predTargetsNexp,
      surveysNumGenProps,
      surveysGenProps,
      surveysNumSeqProps,
      surveysSeqProps,
      blockInvId,
      blockInvStatus,
      blockId,
      blockStatusId,
      blockStatus,
      blockExecCompl,
      blockExecTotal,
      blockHash,
      blockDef } = this.props;

    // console.log('predTargetsDecl', predTargetsDecl); // with data
    // console.log(predictedTargetsDecl, predictedTargetsDecl); // empty

    return (
      <div className={styles.container}>
        <Headers subState={subState} mode={mode} type={type} moonPhase={moonPhase} isNigth={isNigth} night={night} sunset={sunset} sunrise={sunrise} />
        <div className={styles.allComponentes}>
          {/* column 1 */}
          <div className={styles.leftDiv}>
            <Filters needSwap={needSwap} filterToMount={filterToMount} filterToUnmount={filterToUnmount} />
            <Pointing pointingRa={pointingRa} pointingDecl={pointingDecl} pointingPosAngle={pointingPosAngle} pointingParallAngle={pointingParallAngle} />
            <Simonyi simonyiTracking={simonyiTracking} simonyiAl={simonyiAl} simonyiAz={simonyiAz} simonyiRot={simonyiRot} domeAlt={domeAlt} domeAz={domeAz}/>
            <Moon moonRa={moonRa} moonDec={moonDec} moonAlt={moonAlt} moonAz={moonAz} moonDistance={moonDistance} moonPhase={moonPhase} />
            <Sun sunRa={sunRa} sunDec={sunDec} sunset={sunset} sunrise={sunrise} sunAlt={sunAlt} sunAz={sunAz} solarElong={solarElong} isNigth={isNigth} />
          </div>
          {/* column 2 */}
          <div className={styles.middleDiv}>
            <CurrentTarget 
              currentTargetId={currentTargetId}
              currentRequestTime={currentRequestTime}
              currentRequestMjd={currentRequestMjd}
              currentRa={currentRa}
              currentDecl={currentDecl}
              currentSkyAngle={currentSkyAngle}
              currentFilter={currentFilter}
              currentNumExposures={currentNumExposures}
              currentExposureTimes={currentExposureTimes}
              currentSlewTime={currentSlewTime}
              currentOffsetX={currentOffsetX}
              currentOffsetY={currentOffsetY}
              currentNumProposals={currentNumProposals}
              currentProposalId={currentProposalId}
              currentSequenceDuration={currentSequenceDuration}
              currentSequenceNVisits={currentSequenceNVisits}
              currentSequenceVisits={currentSequenceVisits}
              rotSkyPos={rotSkyPos}
              filterToMount={filterToMount}
            />
            {this.skyMap ?? ''}
            {/* <SkyMap
              targets={this.state.predTargets}
              rotSkyPos={this.props?.rotSkyPos}
              pointingRa={this.props?.pointingRa}
              pointingDecl={this.props?.pointingDecl}
              moonRa={this.props?.moonRa}
              moonDec={this.props?.moonDec}
              sunRa={this.props?.sunRa}
              sunDec={this.props?.sunDec}
            /> */}
            <Plots />
          </div>
          {/* column 3 */}
          <div className={styles.rigthDiv}>
            <AccordionSummary 
              predictedTargetsRa={predTargetsRa}
              predictedTargetsDecl={predTargetsDecl}
              predictedTargetsRotSkyPos={predTargetsRotSkyPos}
              currentRequestTime={currentRequestTime}
              lastTargetId={lastTargetId}
              lastTargetRa={lastTargetRa}
              lastTargetDecl={lastTargetDecl}
              lastTargetRotSkyPos={lastTargetRotSkyPos}
              lastTargetMjd={lastTargetMjd}
              lastTargetExpTime={lastTargetExpTime}
              lastTargetFilter={lastTargetFilter}
              lastTargetNexp={lastTargetNexp}
              lastTargetMoreInfo={lastTargetMoreInfo}
              nextTargetCurrentTime={nextTargetCurrentTime}
              nextTimeWaitTime={nextTimeWaitTime}
              nextTargetRa={nextTargetRa}
              nextTargetDecl={nextTargetDecl}
              nextTargetRotSkyPos={nextTargetRotSkyPos}
              predTargetsNumTargets={predTargetsNumTargets}
              predTargetsRa={predTargetsRa}
              predTargetsDecl={predTargetsDecl}
              predTargetsRotSkyPos={predTargetsRotSkyPos}
              predTargetsMjd={predTargetsMjd}
              predTargetsExpTime={predTargetsExpTime}
              predTargetsInstrConfig={predTargetsInstrConfig}
              predTargetsNexp={predTargetsNexp}
              surveysNumGenProps={surveysNumGenProps}
              surveysGenProps={surveysGenProps}
              surveysNumSeqProps={surveysNumSeqProps}
              surveysSeqProps={surveysSeqProps}
              blockInvId={blockInvId}
              blockInvStatus={blockInvStatus}
              blockId={blockId}
              blockStatusId={blockStatusId}
              blockStatus={blockStatus}
              blockExecCompl={blockExecCompl}
              blockExecTotal={blockExecTotal}
              blockHash={blockHash}
              blockDef={blockDef}
            />
          </div>
        </div>
      </div>
    );
  }
}
