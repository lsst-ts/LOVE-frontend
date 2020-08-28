import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Camera.module.css';
import StatusText from '../../GeneralPurpose/StatusText/StatusText';
import GearIcon from '../../icons/GearIcon/GearIcon';
import { getCameraStatusStyle } from '../../../Config';
import LoadingBar from '../../GeneralPurpose/LoadingBar/LoadingBar';
import { stateToStyleCamera } from '../../../Config';
import { formatTimestamp } from '../../../Utils';


export default class Camera extends Component {
  static propTypes = {
    raftsDetailedState: PropTypes.string,
    imageReadinessDetailedState: PropTypes.string,
    calibrationDetailedState: PropTypes.string,
    shutterDetailedState: PropTypes.string,
    imageSequence: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      timers: {},
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

  render() {
    return (
      <div className={styles.cameraContainer}>
        <div className={styles.statesContainer}>
          <div className={styles.stateContainer}>
            <span className={styles.statusTextLabel}>Rafts state:</span>
            <StatusText status={stateToStyleCamera[this.props.raftsDetailedState]}>
              {this.props.raftsDetailedState}
            </StatusText>
          </div>
          <div className={styles.stateContainer}>
            <span className={styles.statusTextLabel}>Image readiness state:</span>
            <StatusText status={stateToStyleCamera[this.props.imageReadinessDetailedState]}>
              {this.props.imageReadinessDetailedState}
            </StatusText>
          </div>
          <div className={styles.stateContainer}>
            <span className={styles.statusTextLabel}>Calibration state:</span>
            <StatusText status={stateToStyleCamera[this.props.calibrationDetailedState]}>
              {this.props.calibrationDetailedState}
            </StatusText>
          </div>
          <div className={styles.stateContainer}>
            <span className={styles.statusTextLabel}>Shutter state:</span>
            <StatusText status={stateToStyleCamera[this.props.shutterDetailedState]}>
              {this.props.shutterDetailedState}
            </StatusText>
          </div>
        </div>
        <div>
          <div className={styles.imageSequenceName}>{this.props.imageSequence.name}</div>
          <div className={styles.imageTableWrapper}>
            <table className={styles.imageTable}>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Image name</th>
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
                    const roundedExposureTime = Math.round(image.exposureTime*100)/100;
                    const roundedCurrentExposureTime = Math.round(currentExposureTime*100)/100;
                    return (
                      <React.Fragment key={imageKey}>
                        <tr>
                          <td className={styles.string}>{formatTimestamp(image.timeStamp * 1000)}</td>
                          <td className={styles.string}>{imageName}</td>
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
