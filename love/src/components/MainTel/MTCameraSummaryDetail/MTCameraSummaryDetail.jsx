import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { getCameraStatusStyle } from 'Utils';
import { IMAGE_STATES } from 'Constants';
import styles from './MTCameraSummaryDetail.module.css';
import StatusText from '../../GeneralPurpose/StatusText/StatusText';
import GearIcon from '../../icons/GearIcon/GearIcon';
import LoadingBar from '../../GeneralPurpose/LoadingBar/LoadingBar';
import Title from '../../GeneralPurpose/SummaryPanel/Title';
import Value from '../../GeneralPurpose/SummaryPanel/Value';
import { formatTimestamp } from '../../../Utils';
import {
  summaryStateMap,
  summaryStateToStyle,
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

export default class Camera extends Component {
  static propTypes = {
    subscribeToStreams: PropTypes.func,
    unsubscribeToStreams: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      timers: {},
      imageSequence: {},
      expandedRows: {},
    };
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

  /**
   * Function to produce the imagesInSequence dict
   * The dict contains the images in sequence for the input stream
   * Possible streams:
   * - startIntegration
   * - startReadout
   * - endReadout
   * - endOfImageTelemetry
   * @param {Object} stream
   * @returns {Object} imagesInSequence
   *
   */
  reduceImagesInSequence = (cameraState, stream) => {
    const { imageSequence } = this.state;
    if (imageSequence.images === undefined) {
      imageSequence.images = {};
    }

    imageSequence.name = 'test';
    imageSequence.imagesInSequence = stream.imagesInSequence.value;
    imageSequence.images[stream.imageName.value] = {
      state: cameraState,
      imageIndex: stream.imageIndex.value,
      source: stream.imageSource.value,
      controller: stream.imageController.value,
      timeStamp: stream.timestampAcquisitionStart.value,
      exposureTime: stream.exposureTime?.value ?? 0,
      tag: stream.imageTag?.value ?? '-',
      obsDate: stream.timestampDateObs?.value ?? '-',
      endObsDate: stream.timestampDateEnd?.value ?? '-',
      darkTime: stream.darkTime?.value ?? '-',
      emulatedImage: stream.emulatedImage?.value ?? '-',
      shutterOpenTime: stream.measuredShutterOpenTime?.value ?? '-',
    };

    this.setState({ imageSequence });
  };

  componentDidUpdate = (prevProps) => {
    if (this.props.startIntegration && !isEqual(prevProps.startIntegration, this.props.startIntegration)) {
      this.reduceImagesInSequence(IMAGE_STATES.INTEGRATING, this.props.startIntegration);
    }
    if (this.props.startReadout && !isEqual(prevProps.startReadout, this.props.startReadout)) {
      this.reduceImagesInSequence(IMAGE_STATES.READING_OUT, this.props.startReadout);
    }
    if (this.props.endReadout && !isEqual(prevProps.endReadout, this.props.endReadout)) {
      this.reduceImagesInSequence(IMAGE_STATES.END_READOUT, this.props.endReadout);
    }
    if (this.props.endOfImageTelemetry && !isEqual(prevProps.endOfImageTelemetry, this.props.endOfImageTelemetry)) {
      this.reduceImagesInSequence(IMAGE_STATES.END_TELEMETRY, this.props.endOfImageTelemetry);
    }
  };

  render() {
    const mtCameraStatus = summaryStateMap[this.props.mtcameraSummaryState];
    const commandState = mtcameraCcsCommandStateMap[this.props?.mtcameraCcsCmdState];
    const calibrationState = mtcameraCalibrationDetailedStateMap[this.props.mtcameraCalibrationDetailedStatus];
    const offlineState = mtcameraOffLineDetailedStateMap[this.props.mtcameraOffLineDetailedState];
    const imageState = mtcameraImageReadlinessDetailedStateMap[this.props.mtcameraImageReadinessDetailedState];
    const shutterState = mtcameraShutterDetailedStateMap[this.props.mtCameraShutterDetailedState];
    const filterChangerStatus = mtcameraFilterChangerDetailedStateMap[this.props.mtCameraFilterChangerDetailedState];
    const raftsStatus = mtCameraRaftsDetailedStateMap[this.props.mtCameraRaftsDetailedState];

    return (
      <div className={styles.cameraContainer}>
        <div className={styles.statesContainer}>
          <div className={styles.stateContainer}>
            <Title>MTCamera</Title>
            <Value>
              <StatusText status={summaryStateToStyle[mtCameraStatus]}>{mtCameraStatus}</StatusText>
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
          {/* <div className={styles.imageSequenceName}>{this.props.imageSequence?.name}</div> */}
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
                {this.props.imageSequence?.images &&
                  Object.keys(this.props.imageSequence?.images).map((imageName) => {
                    const image = this.props.imageSequence?.images[imageName];
                    const imageKey = `${this.props.imageSequence?.name}-${imageName}`;
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
