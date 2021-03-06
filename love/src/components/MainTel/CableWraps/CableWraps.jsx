import React, { Component } from 'react';
import styles from './CableWraps.module.css';
import AZCableWrap from './AZCableWrap/AZCableWrap';
import CameraCableWrap from './CameraCableWrap/CameraCableWrap';
import * as d3 from 'd3';

class CableWraps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cable_wraps: {
        az: {
          cable: 10,
          rotator: 20,
        },
        camera: {
          cable: 10,
          rotator: 200,
        },
      },
    };
  }

  componentDidMount() {
    this.props.subscribeToStreams();
    // Replace the following code with data from redux selectors
    setInterval(
      () =>
        this.receiveMsg({
          az: {
            cable: Math.random() * Math.sign(Math.random() - 0.5),
            rotator: Math.random() * Math.sign(Math.random() - 0.5),
          },
          camera: {
            cable: Math.random() * Math.sign(Math.random() - 0.5),
            rotator: Math.random() * Math.sign(Math.random() - 0.5),
          },
        }),
      2000,
    );
  }

  componentWillUnmount() {
    this.props.unsubscribeToStreams();
  }

  receiveMsg(msg) {
    this.setState({
      cable_wraps: msg,
    });
  }

  drawBackground(g, radio, tau, arc) {
    g.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', radio - 5)
      .style('fill', '#102632');

    g.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', radio - 70)
      .style('fill', '#33687f')
      .style('stroke', '#233a42')
      .style('stroke-width', '0');

    g.append('path').datum({ endAngle: tau }).style('fill', '#33687f').attr('d', arc);
  }

  drawLimits(g, radio, start, end) {
    g.append('rect')
      .attr('x', 0)
      .attr('y', -radio - 10)
      .attr('width', 5)
      .attr('height', 30)
      .style('fill', '#ffffff');

    g.append('rect')
      .attr('x', -radio - 10)
      .attr('y', 0)
      .attr('width', 30)
      .attr('height', 2)
      .style('fill', '#ffffff');

    g.append('text')
      .attr('x', -radio - 50)
      .attr('y', 5)
      .text(start + '°')
      .style('fill', '#ffffff');

    g.append('rect')
      .attr('x', radio - 20)
      .attr('y', 0)
      .attr('width', 30)
      .attr('height', 2)
      .style('fill', '#ffffff');

    g.append('text')
      .attr('x', radio + 15)
      .attr('y', 5)
      .text(end + '°')
      .style('fill', '#ffffff');
  }

  arcTween(newAngle, arc) {
    return function (d) {
      var interpolate = d3.interpolate(d.endAngle, newAngle);
      return function (t) {
        d.endAngle = interpolate(t);
        return arc(d);
      };
    };
  }

  render() {
    return (
      <div className={styles.cableWrapsContainer}>
        <h2> Cable Wraps </h2>
        <div className={styles.cableWrapsContent}>
          <div className={styles.camCable}>
            <h4>Camera Cable Wrap</h4>
            {this.state.cable_wraps ? (
              <p className={styles.rotatorDiff}>
                Rotator angle difference:
                <span className={styles.rotatorDiffValue}>
                  {(this.state.cable_wraps.camera.cable - this.state.cable_wraps.camera.rotator).toFixed(2) + 'º'}
                </span>
              </p>
            ) : (
              <p className={styles.rotatorDiff}>
                <span className={styles.rotatorDiffValue}> </span>
              </p>
            )}
            <CameraCableWrap
              height={315}
              width={400}
              drawBackground={this.drawBackground}
              drawLimits={this.drawLimits}
              arcTween={this.arcTween}
              cable_wrap={this.state.cable_wraps ? this.state.cable_wraps.camera : null}
            />
          </div>
          <div className={styles.cableWrapSeparator}></div>
          <div className={styles.azCable}>
            <h4>Azimuth Cable Wrap</h4>
            {this.state.cable_wraps ? (
              <p className={styles.rotatorDiff}>
                Rotator angle difference:
                <span className={styles.rotatorDiffValue}>
                  {(this.state.cable_wraps.az.cable - this.state.cable_wraps.az.rotator).toFixed(2) + 'º'}
                </span>
              </p>
            ) : (
              // <p></p>
              <p className={styles.rotatorDiff}>
                <span className={styles.rotatorDiffValue}></span>
              </p>
            )}
            <AZCableWrap
              height={300}
              width={400}
              drawBackground={this.drawBackground}
              drawLimits={this.drawLimits}
              arcTween={this.arcTween}
              cable_wrap={this.state.cable_wraps ? this.state.cable_wraps.az : null}
            />
          </div>
        </div>
      </div>
    );
  }
}
export default CableWraps;
