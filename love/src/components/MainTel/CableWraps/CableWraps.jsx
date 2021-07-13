import React, { Component } from 'react';
import styles from './CableWraps.module.css';
import AZCableWrap from './AZCableWrap/AZCableWrap';
import CameraCableWrap from './CameraCableWrap/CameraCableWrap';
import StatusText from '../../GeneralPurpose/StatusText/StatusText';
import SummaryPanel from '../../GeneralPurpose/SummaryPanel/SummaryPanel';
import CSCDetail from 'components/CSCSummary/CSCDetail/CSCDetail';
import { degrees } from 'Utils';
import Row from '../../GeneralPurpose/SummaryPanel/Row';
import Label from '../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../GeneralPurpose/SummaryPanel/Title';
import * as d3 from 'd3';
import { style } from 'd3';

const COLOR_ARC_INITIAL = '#35667E';
const COLOR_CABLE_INITIAL = '#29414B';
const COLOR_ARC_ERROR = '#202424';
const COLOR_CABLE_ERROR = '#DC5707';

class CableWraps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colorArc: COLOR_ARC_INITIAL,
      colorCable: COLOR_CABLE_INITIAL,
    };
  }

  componentWillUnmount() {
    this.props.unsubscribeToStreams();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.ccwFollowingError !== this.props.ccwFollowingError) {
      if (this.props.ccwFollowingError > 2) {
        this.setState({ colorArc: COLOR_ARC_ERROR, colorCable: COLOR_CABLE_ERROR });
      } else {
        this.setState({ colorArc: COLOR_ARC_INITIAL, colorCable: COLOR_CABLE_INITIAL });
      }
    }
  }

  drawBackground(g, radio, tau, arc) {
    const colorArc = this.state.colorArc;
    g.append('semi-circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', radio - 5)
      .style('fill', colorArc);

    g.append('path').datum({ endAngle: tau }).style('fill', colorArc).attr('d', arc);
  }

  drawLimits(g, radio, start, end) {
    g.append('rect')
      .attr('x', 0)
      .attr('y', -radio - 10)
      .attr('width', 5)
      .attr('height', 30)
      .style('fill', '#ffffff');

    g.append('text')
      .attr('x', 10)
      .attr('y', -145)
      .text(0 + '°')
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
    const summaryState = CSCDetail.states[this.props.summaryState];
    const ccwState = this.props.ccwState;
    const ccwPosition = this.props.ccwPosition;
    const rotatorState = this.props.rotatorState;
    const rotatorPosition = this.props.rotatorPosition;

    return (
      <div className={styles.cableWrapsContainer}>
        <div>
          <SummaryPanel className={styles.summaryPanelStates}>
            {/*Camera*/}
            <Title>Camera Cable Wrap</Title>
            <Value>
              <span className={[summaryState.class, styles.summaryState].join(' ')}>{summaryState.name}</span>
            </Value>

            <Label>Rotator Position</Label>
            <Value>{rotatorPosition + '°'}</Value>

            <Label>Cable Wrap Position</Label>
            <Value>{ccwPosition + '°'}</Value>
          </SummaryPanel>
        </div>
        <div className={styles.divCameraWrap}>
          <CameraCableWrap
            height={315}
            width={400}
            drawBackground={(g, r, t, a) => this.drawBackground(g, r, t, a)}
            drawLimits={this.drawLimits}
            arcTween={this.arcTween}
            cable_wrap={ccwPosition ? ccwPosition : null}
            rotator={rotatorPosition ? rotatorPosition : null}
            colorCable={this.state.colorCable}
          />
        </div>
      </div>
    );
  }
}
export default CableWraps;
