import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import styles from './Skymap.module.css';
import SkymapGrid from './SkymapGrid';
import Pointing from './Pointing';
import AuxTelPointing from '../Pointings/AuxTelPointing';
import SimonyiPointing from '../Pointings/SimonyiPointing';
import SunPointing from '../Pointings/SunPointing';
import MoonPointing from '../Pointings/MoonPointing';
import SunSummary from '../SummaryInformation/SunSummary';
import MoonSummary from '../SummaryInformation/MoonSummary';

export default class Skymap extends Component {
  // static propTypes = {
  //   prop: PropTypes
  // };

  constructor(props) {
    super(props);
    this.state = {
      height: 350,
      width: 350,
    };
  }

  setResizeObserver = () => {
    const { containerNode } = this.props;
    if (containerNode) {
      const resizeObserver = new ResizeObserver((entries) => {
        const container = entries[0];
        const containerWidth = container.contentRect.width;
        this.setState({
          height: containerWidth * 0.3,
          width: containerWidth * 0.3,
        });
      });
      if (!(containerNode instanceof Element)) return;
      resizeObserver.observe(containerNode);
      return () => {
        resizeObserver.disconnect();
      };
    }
  };

  componentDidUpdate(prevProps) {
    const { containerNode } = this.props;
    if (prevProps.containerNode !== containerNode) {
      this.setResizeObserver();
    }
  }

  componentDidMount() {
    const { containerNode } = this.props;
    if (containerNode) {
      this.setResizeObserver();
    }
  }

  render() {
    const { className, simonyiMoonRa, simonyiMoonDec, simonyiSunRa, simonyiSunDec } = this.props;
    const width = this.state.width ?? 350;
    const height = this.state.height ?? 350;
    const currentPointing = {
      az: 0,
      el: 20,
    };
    const currentPointing2 = {
      az: 160,
      el: 80,
    };
    const currentPointing3 = {
      az: 270,
      el: 70,
    };
    const currentPointing4 = {
      az: 120,
      el: 50,
    };
    const isProjected = false;
    return (
      <div className={[styles.skymapContainer, className].join(' ')}>
        <div className={styles.skymapGridContainer}>
          <Pointing
            width={width}
            height={height}
            currentPointing={currentPointing}
            targetPointing={currentPointing}
            isProjected={isProjected}
            cartoon={<SimonyiPointing />}
          />
          <Pointing
            width={width}
            height={height}
            currentPointing={currentPointing2}
            targetPointing={currentPointing2}
            isProjected={isProjected}
            cartoon={<AuxTelPointing />}
          />
          <Pointing
            width={width}
            height={height}
            currentPointing={currentPointing3}
            targetPointing={currentPointing3}
            isProjected={isProjected}
            cartoon={<SunPointing />}
          >
            <SunSummary simonyiSunRa={simonyiSunRa} simonyiSunDec={simonyiSunDec} />
          </Pointing>
          <Pointing
            width={width}
            height={height}
            currentPointing={currentPointing4}
            targetPointing={currentPointing4}
            isProjected={isProjected}
            cartoon={<MoonPointing />}
            // cartoon={<div>333</div>}
          >
            <MoonSummary simonyiMoonRa={simonyiMoonRa} simonyiMoonDec={simonyiMoonDec} />
          </Pointing>
          <SkymapGrid width={width} height={height} isProjected={isProjected} />
        </div>
      </div>
    );
  }
}
