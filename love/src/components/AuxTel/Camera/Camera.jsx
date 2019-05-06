import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import styles from './Camera.module.css';
import StatusText from '../../StatusText/StatusText';
import GearIcon from '../../icons/GearIcon/GearIcon';
import { getCameraStatusStyle } from '../../../Config';

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
      imageSequence: {
        name: 'Sequence 1',
        imagesInSequence: 3,
        images: [
          {
            timestamp: new Date()
              .toISOString()
              .slice(0, 19)
              .replace(/-/g, '/')
              .replace('T', ' '),
            imageName: 'Image A',
            imageIndex: 0,
            exposureTime: 3,
            state: 'INTEGRATING',
            readoutParameters: {},
          },
          {
            timestamp: new Date()
              .toISOString()
              .slice(0, 19)
              .replace(/-/g, '/')
              .replace('T', ' '),
            imageName: 'Image B',
            imageIndex: 1,
            exposureTime: 3,
            state: 'READING_OUT',
            readoutParameters: {
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
          {
            timestamp: new Date()
              .toISOString()
              .slice(0, 19)
              .replace(/-/g, '/')
              .replace('T', ' '),
            imageName: 'Image C',
            imageIndex: 2,
            exposureTime: 3,
            state: 'READY',
            readoutParameters: {
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
          {
            timestamp: new Date()
              .toISOString()
              .slice(0, 19)
              .replace(/-/g, '/')
              .replace('T', ' '),
            imageName: 'Image D',
            imageIndex: 3,
            exposureTime: 3,
            state: 'READY',
            readoutParameters: {
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
        ],
      },
      expandedRows: {},
    };
  }

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
                {this.state.imageSequence.images.map((image) => {
                  return (
                    <React.Fragment key={image.imageIndex}>
                      <tr>
                        <td className={styles.string}>{image.timestamp}</td>
                        <td className={styles.string}>{image.imageName}</td>
                        <td className={[styles.narrowCol, styles.number].join(' ')}>{image.exposureTime} s</td>
                        <td
                          className={[
                            styles.statusColumn,
                            styles.mediumCol,
                            this.state.expandedRows[image.imageName] ? styles.selectedRow : '',
                          ].join(' ')}
                        >
                          <div className={styles.imageStatusWrapper}>
                            <div className={styles.statusTextWrapper}>
                              <StatusText status={getCameraStatusStyle(image.state)}>{image.state}</StatusText>
                            </div>
                            <div onClick={() => this.clickGearIcon(image.imageName)} className={styles.gearIconWrapper}>
                              <GearIcon active={true} />
                            </div>
                          </div>
                        </td>
                      </tr>
                      {this.state.expandedRows[image.imageName] ? (
                        <tr className={styles.selectedRow} key={`expanded-${image.imageName}`}>
                          <td className={styles.imageDetailsCell}>
                            <div className={styles.readoutParametersTitle}>Readout parameters</div>
                            <div className={styles.readoutParameters}>
                              {Object.keys(image.readoutParameters).length > 0 ? (
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
