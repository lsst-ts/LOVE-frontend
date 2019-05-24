import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import styles from './Dome.module.css';
import JSONPretty from 'react-json-pretty';
import PropTypes from 'prop-types';
import SkymapGrid from '../Skymap/SkymapGrid';
import DomePointing from './DomePointing';

export default class Camera extends Component {
  static propTypes = {
    // raftsDetailedState: PropTypes.string,
    // imageReadinessDetailedState: PropTypes.string,
    // calibrationDetailedState: PropTypes.string,
    // shutterDetailedState: PropTypes.string,
    // imageSequence: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      az: 0,
      el: 0,
    };
  }

  componentDidMount = () => {
    this.props.subscribeToStream();
    setInterval(() => {
      this.setState({
        az: Math.random()*360,
        el: Math.random()*90,
      })
    }, 1000);
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStream();
  };

  render() {
    const width = 500;
    const height = 500;
    const currentPointing = {
      az: this.state.az,
      el: this.state.el,
    };
    const targetPointing = {
      az: 0,
      el: 90,
    };
    const isProjected = true;
    return (
      <div className={styles.domeContainer}>
        <h2>TOP VIEW</h2>
        <div className={styles.skymapGridContainer}>
          <DomePointing
            width={width}
            height={height}
            azelToPixel={this.azelToPixel}
            currentPointing={currentPointing}
            targetPointing={targetPointing}
            isProjected={isProjected}
          />
          <SkymapGrid width={width} height={height} isProjected={isProjected} />
        </div>
      </div>
    );
  }
}
