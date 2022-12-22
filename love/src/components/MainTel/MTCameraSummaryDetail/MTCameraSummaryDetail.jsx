import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './MTCameraSummaryDetail.module.css';
import StatusText from '../../GeneralPurpose/StatusText/StatusText';
import GearIcon from '../../icons/GearIcon/GearIcon';
import { getCameraStatusStyle } from '../../../Config';
import LoadingBar from '../../GeneralPurpose/LoadingBar/LoadingBar';
import { stateToStyleCamera } from '../../../Config';
import { formatTimestamp } from '../../../Utils';
import {
  mtcameraSummaryStateToStyle,
  mtcameraCcsCommandStateMap,
  mtcameaCcsCommandStateToStyle,
  mtcameraCalibrationDetailedStateMap,
  mtcameraCalibrationDetailedStateToStyle,
  mtcameraOffLineDetailedStateMap,
  mtcameraOffLineDetailedStateToStyle,
  mtcameraImageReadlinessDetailedStateMap,
  mtcameraImageReadlinessDetailedStateToStyle,
  mtcameraShutterDetailedStateMap,
  mtcameraShutterDetailedStateToStyle,
  mtcameraFilterChangerDetailedStateMap,
  mtcameraFilterChangerDetailedStateToStyle,
  mtCameraRaftsDetailedStateMap,
  mtCameraRaftsDetailedStateToSTyle,
} from 'Config';
import CSCDetail from 'components/CSCSummary/CSCDetail/CSCDetail';
export default class Camera extends Component {
  static propTypes = {
    subscribeToStreams: PropTypes.func,
    unsubscribeToStreams: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    this.startTimer('Image A', 3);
    this.props.subscribeToStreams();
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStreams();
  };

  startTimer = (imageName, maxIterations) => {
    let iterations = 0;
    const { timers } = this.state;
    timers[imageName] = 0;
    this.setState({
      timers: { ...timers },
    });
    const timer = setInterval(() => {
      timers[imageName] += 1;
      this.setState({
        timers: { ...timers },
      });
      iterations += 1;
      if (iterations > maxIterations) clearInterval(timer);
    }, 1000);
  };

  clickGearIcon = (rowId) => {
    let { expandedRows } = this.state;
    if (expandedRows[rowId]) expandedRows[rowId] = false;
    else {
      expandedRows = {};
      expandedRows[rowId] = true;
    }
    this.setState({
      expandedRows: { ...expandedRows },
    });
  };

  render() {
    const mtCameraStatus = CSCDetail.states[this.props.mtcameraSummaryState];
    const commandState = mtcameraCcsCommandStateMap[this.props?.mtcameraCcsCmdState];
    const calibrationState = mtcameraCalibrationDetailedStateMap[this.props.mtcameraCalibrationDetailedStatus];
    const offlineState = mtcameraOffLineDetailedStateMap[this.props.mtcameraOffLineDetailedState];
    const imageState = mtcameraImageReadlinessDetailedStateMap[this.props.mtcameraImageReadinessDetailedState];
    const shutterState = mtcameraShutterDetailedStateMap[this.props.mtCameraShutterDetailedState];
    const filterChangerStatus = mtcameraFilterChangerDetailedStateMap[this.props.mtCameraFilterChangerDetailedState];
    const raftsStatus = mtCameraRaftsDetailedStateMap[this.props.mtCameraRaftsDetailedState];
    const {
      imagesInSequenceInt,
      imageNameInt,
      imageIndexInt,
      imageSourceInt,
      imageControllerInt,
      imageDateInt,
      imageNumberInt,
      timestampAcquisitionStartInt,
      exposureTimeInt,
      modeInt,
      timeoutInt,
      imagesInSequenceSReadout,
      imageNameSReadout,
      imageIndexSReadout,
      imageSourceSReadout,
      imageControllerSReadout,
      imageDateSReadout,
      imageNumberSReadout,
      timestampAcquisitionStartSReadout,
      exposureTimeSReadout,
      timestampStartOfReadoutSReadout,
      imagesInSequenceEReadout,
      imageNameEReadout,
      imageIndexEReadout,
      imageSourceEReadout,
      imageControllerEReadout,
      imageDateEReadout,
      imageNumberEReadout,
      timestampAcquisitionStartEReadout,
      requestedExposureTimeEReadout,
      timestampEndOfReadoutEReadout,
      imagesInSequenceTelemetry,
      imageNameTelemetry,
      imageIndexTelemetry,
      imageSourceTelemetry,
      imageControllerTelemetry,
      imageDateTelemetry,
      imageNumberTelemetry,
      timestampAcquisitionStartTelemetry,
      exposureTimeTelemetry,
      imageTagTelemetry,
      timestampDateObsTelemetry,
      timestampDateEndTelemetry,
      measuredShutterOpenTimeTelemetry,
      darkTimeTelemetry,
      emulatedImageTelemetry,
    } = this.props;
    return (
      <div className={styles.cameraContainer}>
        <div className={styles.statesContainer}>
          <div className={styles.stateContainer}>
            <Title>MTCamera</Title>
            <Value>
              <span className={[mtCameraStatus.class, styles.summaryState].join(' ')}>{mtCameraStatus.name}</span>
            </Value>
          </div>
          <div className={styles.stateContainer}>
            <span className={styles.statusTextLabel}>Command</span>
            <StatusText status={mtcameaCcsCommandStateToStyle[commandState]}>{commandState}</StatusText>
          </div>
          <div className={styles.stateContainer}>
            <span className={styles.statusTextLabel}>Calibration</span>
            <StatusText status={mtcameraCalibrationDetailedStateToStyle[calibrationState]}>
              {calibrationState}
            </StatusText>
          </div>
          <div className={styles.stateContainer}>
            <span className={styles.statusTextLabel}>Offline</span>
            <StatusText status={mtcameraOffLineDetailedStateToStyle[offlineState]}>{offlineState}</StatusText>
          </div>
        </div>
        <div className={styles.statesContainer}>
          <div className={styles.stateContainer}>
            <span className={styles.statusTextLabel}>Take Image</span>
            <StatusText status={mtcameraImageReadlinessDetailedStateToStyle[imageState]}>{imageState}</StatusText>
          </div>
          <div className={styles.stateContainer}>
            <span className={styles.statusTextLabel}>Shutter</span>
            <StatusText status={mtcameraShutterDetailedStateToStyle[shutterState]}>{shutterState}</StatusText>
          </div>
          <div className={styles.stateContainer}>
            <span className={styles.statusTextLabel}>Filter Changer</span>
            <StatusText status={mtcameraFilterChangerDetailedStateToStyle[filterChangerStatus]}>
              {filterChangerStatus}
            </StatusText>
          </div>
          <div className={styles.stateContainer}>
            <span className={styles.statusTextLabel}>Rafts</span>
            <StatusText status={mtCameraRaftsDetailedStateToSTyle[raftsStatus]}>{raftsStatus}</StatusText>
          </div>
        </div>
        <div>
          <div className={styles.imageSequenceName}>{this.props.imageSequence.name}</div>
          <div className={styles.imageTableWrapper}>
            <table className={styles.imageTable}>
              <thead>
                <tr>
                  <th></th>
                  <th>Image</th>
                  <th>Timestamp</th>
                  <th>Image name</th>
                  <th>Secuence</th>
                  <th className={styles.narrowCol}>Exposure time</th>
                  <th className={styles.mediumCol}>State</th>
                </tr>
              </thead>
              <tbody>
                {this.props.imageSequence.images &&
                  Object.keys(this.props.imageSequence.images).map((imageName) => {
                    const image = this.props.imageSequence.images[imageName];
                    const imageKey = `${this.props.imageSequence.name}-${imageName}`;
                    const isIntegrating = image.state === 'INTEGRATING';
                    let currentExposureTime =
                      this.state.timers[imageKey] !== undefined
                        ? Math.min(this.state.timers[imageKey], image.exposureTime)
                        : 0;
                    if (!isIntegrating) currentExposureTime = image.exposureTime;
                    const roundedExposureTime = Math.round(image.exposureTime * 100) / 100;
                    const roundedCurrentExposureTime = Math.round(currentExposureTime * 100) / 100;
                    return (
                      <React.Fragment key={imageKey}>
                        <tr>
                          <td></td>
                          <td></td>
                          <td className={styles.string}>{formatTimestamp(image.timeStamp * 1000)}</td>
                          <td className={styles.string}>{imageName}</td>
                          <td></td>
                          <td className={[styles.narrowCol].join(' ')}>
                            <LoadingBar
                              percentage={(currentExposureTime / image.exposureTime) * 100}
                              displayPercentage={false}
                              isNarrow={true}
                              backgroundClass={styles.backgroundLoadingBarClass}
                              animationDuration={this.state.timers[imageKey] !== undefined ? image.exposureTime : 0}
                              title={`Exposed ${roundedCurrentExposureTime} out of ${roundedExposureTime} seconds`}
                            />
                            <span
                              className={styles.exposureTime}
                              title={`Exposed ${roundedCurrentExposureTime} out of ${roundedExposureTime} seconds`}
                            >
                              {roundedCurrentExposureTime} s / {roundedExposureTime} s
                            </span>
                          </td>
                          <td
                            className={[
                              styles.statusColumn,
                              styles.mediumCol,
                              this.state.expandedRows[imageKey] ? styles.selectedRow : '',
                            ].join(' ')}
                          >
                            <div className={styles.imageStatusWrapper}>
                              <div className={styles.statusTextWrapper}>
                                <StatusText status={getCameraStatusStyle(image.state)}>{image.state}</StatusText>
                              </div>
                              <div onClick={() => this.clickGearIcon(imageKey)} className={styles.gearIconWrapper}>
                                <GearIcon active={true} />
                              </div>
                            </div>
                          </td>
                        </tr>
                        {this.state.expandedRows[imageKey] ? (
                          <tr className={styles.selectedRow} key={`expanded-${imageKey}`}>
                            <td className={styles.imageDetailsCell}>
                              <div className={styles.readoutParametersTitle}>Readout parameters</div>
                              <div className={styles.readoutParameters}>
                                {image.readoutParameters && Object.keys(image.readoutParameters).length > 0 ? (
                                  Object.keys(image.readoutParameters).map((key) => {
                                    return (
                                      <React.Fragment key={key}>
                                        <span className={styles.readoutParameterKey}>{key}</span>{' '}
                                        <span className={styles.readoutParameterValue}>
                                          {image.readoutParameters[key]}
                                        </span>
                                      </React.Fragment>
                                    );
                                  })
                                ) : (
                                  <span>None</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ) : null}
                      </React.Fragment>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
