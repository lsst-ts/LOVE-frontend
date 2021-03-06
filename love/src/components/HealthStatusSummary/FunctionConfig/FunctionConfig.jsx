import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './FunctionConfig.module.css';

/**
 * Configurable table displaying an arbitrary subset
 * of telemetries provided in the component props. It has an optional selection column
 * to be used as a telemetry selection feature. along with the filtering and sorting methods.
 * By pressing the Set button, the list of telemetries is passed to a callback function in the component props.
 *
 */
export default class FunctionConfig extends PureComponent {
  static propTypes = {
    /** Dictionary of telemetries and events to be configured */
    topics: PropTypes.object,
    /** Function called when changes in a configuration are applied */
    onChange: PropTypes.func,
  };

  static defaultProps = {
    onChange: () => {},
    topics: {},
  };

  render() {
    return (
      <div className={styles.container}>
        {Object.entries(this.props.topics).map(([topic, data], _) => (
          <div className={styles.topic}>
            <div className={styles.topicName}>{topic}</div>
          </div>
        ))}
      </div>
    );
  }
}
