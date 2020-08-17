import React, { Component } from 'react';
import StatusText from '../GeneralPurpose/StatusText/StatusText';
import styles from './HealthStatusSummary.module.css';
import { formatTimestamp } from '../../Utils';

/**
 * Configurable summary displaying the health status of an arbitrary subset
 * of telemetries provided in the component props. The user first faces the
 * [**TelemetrySelectionTable**](#TelemetrySelectionTable) component for filtering,
 * selecting telemetries and configuring the definition of health
 * status. Then the user launches another YET TO BE IMPLEMENTED "printed" table.
 *
 */

const healthStatusCodes = {
  0: 'Undefined',
  1: 'OK',
  2: 'Warning',
  3: 'Alert',
  4: 'Invalid',
};

const WIDTH_THRESHOLD = 480;
export default class HealthStatusSummary extends Component {
  static defaultProps = {
    topicConfiguration: {},
    streams: undefined,
  };

  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
    this.resizeObserver = undefined;
    this.state = {
      containerWidth: Infinity,
    };
  }

  componentDidMount = () => {
    this.props.subscribeToStreams();

    this.resizeObserver = new ResizeObserver((entries) => {
      const container = entries[0];
      this.setState({
        containerWidth: container.contentRect.width,
      });
    });

    this.resizeObserver.observe(this.containerRef.current.parentNode.parentNode);
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStreams();
    this.resizeObserver.disconnect();
  };
  render() {
    const { topicConfiguration, streams } = this.props;
    return (
      <div ref={this.containerRef} className={styles.container}>
        {Object.keys(topicConfiguration).map((indexedComponentName) => {
          const [component, salindex] = indexedComponentName.split('-');
          const componentName = `${component}${parseInt(salindex) === 0 ? '' : `.${salindex}`}`;

          return (
            <div key={indexedComponentName} className={styles.componentContainer}>
              <div className={styles.componentName} title={`CSC: ${componentName}`}>
                {componentName}
              </div>
              {Object.keys(topicConfiguration[indexedComponentName]).map((topic) => {
                let timestamp = streams[`${indexedComponentName}-${topic}`]?.private_rcvStamp;
                timestamp = timestamp?.value !== undefined ? formatTimestamp(timestamp.value * 1000) : '-';

                return (
                  <React.Fragment key={`${indexedComponentName}${topic}`}>
                    <div className={styles.topic} title={`Topic: ${componentName}.${topic}`}>
                      <div className={styles.topicName}>{topic}</div>
                      <div className={styles.topicTimestamp}>{timestamp}</div>
                    </div>
                    <div className={styles.divider}></div>
                    {Object.keys(topicConfiguration[indexedComponentName][topic]).map((parameterName) => {
                      const parameterValue = streams[`${indexedComponentName}-${topic}`]?.[parameterName];
                      let renderedValue = '';
                      if (parameterValue?.value !== undefined) {
                        if (Array.isArray(parameterValue.value)) {
                          renderedValue = '[Array]';
                        } else {
                          renderedValue = parameterValue.value.toFixed(4);
                        }
                      }
                      const healthStatusCode = topicConfiguration[indexedComponentName][topic][parameterName](
                        parameterValue?.value,
                      );
                      return (
                        <div
                          key={`${indexedComponentName}${topic}${parameterName}`}
                          className={styles.parameterContainer}
                          title={`Item: ${indexedComponentName}.${topic}.${parameterName}`}
                        >
                          <div
                            className={[
                              styles.parameterName,
                              this.state.containerWidth < WIDTH_THRESHOLD ? styles.trimmedLabel : '',
                            ].join(' ')}
                          >
                            {' '}
                            {parameterName}{' '}
                          </div>
                          <div className={styles.healthStatus}>
                            <div
                              className={[
                                styles.parameterValue,
                                this.state.containerWidth < WIDTH_THRESHOLD ? styles.hidden : '',
                              ].join(' ')}
                            >
                              {' '}
                              {renderedValue}
                            </div>
                            <div
                              className={[
                                styles.parameterUnits,
                                this.state.containerWidth < WIDTH_THRESHOLD ? styles.hidden : '',
                              ].join(' ')}
                            >
                              {' '}
                              {parameterValue?.units ?? ''}
                            </div>
                            <div className={styles.statusText}>
                              <StatusText status={healthStatusCodes[healthStatusCode].toLowerCase()}>
                                {healthStatusCodes[healthStatusCode]}
                              </StatusText>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </div>
          );
        })}
        {/* <div className={styles.topButtons}>
          <div className={styles.buttonWrapper}>
            <UploadButton onLoadFile={this.onLoadFile} />
          </div>
          <div className={styles.buttonWrapper} onClick={() => this.download(this.getOutputConfig(), 'data.json')}>
            <Button>
              <ExportIcon />
              Export
            </Button>
          </div>
        </div> */}
        {/* <div className={styles.telemetryTableWrapper}>
          <TelemetrySelectionTableContainer
            {...this.state}
            // eslint-disable-next-line
            onClick={() => console.log('RawTel Click')}
            showSelection={false}
          />
        </div> */}
      </div>
    );
  }
}
