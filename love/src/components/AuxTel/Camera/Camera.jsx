import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import styles from './Camera.module.css';
import StatusText from '../../GeneralPurpose/StatusText/StatusText';
import GearIcon from '../../icons/GearIcon/GearIcon';
import { getCameraStatusStyle } from '../../../Config';
import LoadingBar from '../../GeneralPurpose/LoadingBar/LoadingBar';
import ManagerInterface from '../../../Utils';

export default class Camera extends Component {
  // static propTypes = {
  // };

  // static defaultProps = {
  // };

  constructor(props) {
    super(props);
    this.state = {
      raftsDetailedState: 'NEEDS_CLEAR',
      imageReadinessDetailedState: 'READY',
      calibrationDetailedState: 'ENABLED',
      shutterDetailedState: 'CLOSED',
      timers: {},
      imageSequence: {
        name: 'Sequence 1',
        imagesInSequence: 3,
        images: {
          'Image A': {
            timeStamp: {
              value: new Date()
                .toISOString()
                .slice(0, 19)
                .replace(/-/g, '/')
                .replace('T', ' '),
            },
            imageIndex: { value: 0 },
            exposureTime: { value: 3 },
            state: { value: 'INTEGRATING' },
            readoutParameters: { value: {} },
          },
          'Image B': {
            timeStamp: {
              value: new Date()
                .toISOString()
                .slice(0, 19)
                .replace(/-/g, '/')
                .replace('T', ' '),
            },
            imageIndex: { value: 1 },
            exposureTime: { value: 3 },
            state: { value: 'READING_OUT' },
            readoutParameters: {
              value: {
                ccdNames: 'RnnSnn',
                ccdType: 'E2V',
                overRows: 1,
                overCols: 1,
                readRows: 1,
                readCols: 1,
                readCols2: 1,
                preCols: 1,
                preRows: 1,
                postCols: 1,
              },
            },
          },
          'Image C': {
            timeStamp: {
              value: new Date()
                .toISOString()
                .slice(0, 19)
                .replace(/-/g, '/')
                .replace('T', ' '),
            },
            imageIndex: { value: 2 },
            exposureTime: { value: 3 },
            state: { value: 'READY' },
            readoutParameters: {
              value: {
                ccdNames: 'RnnSnn',
                ccdType: 'E2V',
                overRows: 1,
                overCols: 1,
                readRows: 1,
                readCols: 1,
                readCols2: 1,
                preCols: 1,
                preRows: 1,
                postCols: 1,
              },
            },
          },
          'Image D': {
            timeStamp: {
              value: new Date()
                .toISOString()
                .slice(0, 19)
                .replace(/-/g, '/')
                .replace('T', ' '),
            },
            imageIndex: { value: 3 },
            exposureTime: { value: 3 },
            state: { value: 'READY' },
            readoutParameters: {
              value: {
                ccdNames: 'RnnSnn',
                ccdType: 'E2V',
                overRows: 1,
                overCols: 1,
                readRows: 1,
                readCols: 1,
                readCols2: 1,
                preCols: 1,
                preRows: 1,
                postCols: 1,
              },
            },
          },
        },
      },
      expandedRows: {},
    };
    this.managerInterface = new ManagerInterface();
  }

  processImageUpdate = (imageData, state) => {
    let { imageSequenceName, imagesInSequence, imageName, ...exposureData } = imageData;
    imageSequenceName = imageSequenceName.value;
    imagesInSequence = imagesInSequence.value;
    imageName = imageName.value;
    let { imageSequence } = this.state;
    exposureData.state = { value: state };

    //Hardcoded data:
    imageSequenceName = 'Image sequence one';
    exposureData.exposureTime = { value: 5 };
    if (imageSequence.name === imageSequenceName) {
      imageSequence.images[imageName] = { ...exposureData };
    } else {
      imageSequence = {
        name: imageSequenceName,
        imagesInSequence,
        images: {},
      };
      imageSequence.images[imageName] = { ...exposureData };
    }
    if(!imageSequence.images[imageName].readoutParameters)
      imageSequence.images[imageName].readoutParameters = {value: {}};
    this.setState({
      imageSequence: { ...imageSequence },
    });
  };

  onReceiveMessage = (msg) => {
    const data = JSON.parse(msg.data);
    if (!(data.data instanceof Object)) return;
    const cameraData = data.data.ATCamera;
    if (cameraData === undefined) return;
    if (cameraData.startIntegration) this.processImageUpdate(cameraData.startIntegration[0], 'state');
    if (cameraData.startReadout) this.processImageUpdate(cameraData.startReadout[0], 'state');
    if (cameraData.endReadout) this.processImageUpdate(cameraData.endReadout[0], 'state');
    if (cameraData.endOfImageTelemetry) this.processImageUpdate(cameraData.endOfImageTelemetry[0], 'state');
  };

  componentDidMount = () => {
    this.startTimer('Image A', 3);
    this.managerInterface.subscribeToEvents('ATCamera', 'all', this.onReceiveMessage);
  };

  componentWillUnmount = () => {
    this.managerInterface.unsubscribeToEvents('ATCamera', 'all', this.onReceiveMessage);
  };

  startTimer = (imageName, maxIterations) => {
    let timer;
    let iterations = 0;
    const { timers } = this.state;
    timers[imageName] = 0;
    this.setState({
      timers: { ...timers },
    });
    timer = setInterval(() => {
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
            <StatusText status="warning">{this.state.raftsDetailedState}</StatusText>
          </div>
          <div className={styles.stateContainer}>
            <span className={styles.statusTextLabel}>Image readiness state:</span>
            <StatusText status="ok">{this.state.imageReadinessDetailedState}</StatusText>
          </div>
          <div className={styles.stateContainer}>
            <span className={styles.statusTextLabel}>Calibration state:</span>
            <StatusText status="ok">{this.state.calibrationDetailedState}</StatusText>
          </div>
          <div className={styles.stateContainer}>
            <span className={styles.statusTextLabel}>Shutter state:</span>
            <StatusText status="ok">{this.state.shutterDetailedState}</StatusText>
          </div>
        </div>
        <div>
          <div className={styles.imageSequenceName}>{this.state.imageSequence.name}</div>
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
                {Object.keys(this.state.imageSequence.images).map((imageName) => {
                  const image = this.state.imageSequence.images[imageName];
                  const isIntegrating = image.state.value === 'INTEGRATING';
                  let currentExposureTime =
                    this.state.timers[imageName] !== undefined
                      ? Math.min(this.state.timers[imageName], image.exposureTime.value)
                      : 0;
                  if (!isIntegrating) currentExposureTime = image.exposureTime.value;
                  return (
                    <React.Fragment key={imageName}>
                      <tr>
                        <td className={styles.string}>{image.timeStamp.value}</td>
                        <td className={styles.string}>{imageName}</td>
                        <td className={[styles.narrowCol].join(' ')}>
                          <LoadingBar
                            percentage={(currentExposureTime / image.exposureTime.value) * 100}
                            displayPercentage={false}
                            isNarrow={true}
                            backgroundClass={styles.backgroundLoadingBarClass}
                            animationDuration={
                              this.state.timers[imageName] !== undefined ? image.exposureTime.value : 0
                            }
                            title={`Exposed ${currentExposureTime} out of ${image.exposureTime.value} seconds`}
                          />
                          <span
                            className={styles.exposureTime}
                            title={`Exposed ${currentExposureTime} out of ${image.exposureTime.value} seconds`}
                          >
                            {currentExposureTime} s / {image.exposureTime.value} s
                          </span>
                        </td>
                        <td
                          className={[
                            styles.statusColumn,
                            styles.mediumCol,
                            this.state.expandedRows[imageName] ? styles.selectedRow : '',
                          ].join(' ')}
                        >
                          <div className={styles.imageStatusWrapper}>
                            <div className={styles.statusTextWrapper}>
                              <StatusText status={getCameraStatusStyle(image.state.value)}>
                                {image.state.value}
                              </StatusText>
                            </div>
                            <div onClick={() => this.clickGearIcon(imageName)} className={styles.gearIconWrapper}>
                              <GearIcon active={true} />
                            </div>
                          </div>
                        </td>
                      </tr>
                      {this.state.expandedRows[imageName] ? (
                        <tr className={styles.selectedRow} key={`expanded-${imageName}`}>
                          <td className={styles.imageDetailsCell}>
                            <div className={styles.readoutParametersTitle}>Readout parameters</div>
                            <div className={styles.readoutParameters}>
                              {Object.keys(image.readoutParameters.value).length > 0 ? (
                                Object.keys(image.readoutParameters.value).map((key) => {
                                  return (
                                    <React.Fragment key={key}>
                                      <span className={styles.readoutParameterKey}>{key}</span>{' '}
                                      <span className={styles.readoutParameterValue}>
                                        {image.readoutParameters.value[key]}
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
