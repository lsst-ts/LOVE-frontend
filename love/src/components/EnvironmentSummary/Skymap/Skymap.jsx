import React, { Component } from 'react';
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
    const {
      className,
      simonyiRa,
      simonyiDec,
      simonyiMoonRa,
      simonyiMoonDec,
      simonyiSunRa,
      simonyiSunDec,
      simonyiMoonPhase,
      auxtelRa,
      auxtelDec,
    } = this.props;
    const width = this.state.width ?? 350;
    const height = this.state.height ?? 350;
    const simonyiPointing = {
      az: 90 - simonyiRa,
      el: simonyiDec,
    };
    const auxtelPointing = {
      az: 90 - auxtelRa,
      el: auxtelDec,
    };
    const sunPointing = {
      az: 90 - simonyiSunRa,
      el: simonyiSunDec,
    };
    const moonPointing = {
      az: 90 - simonyiMoonRa,
      el: simonyiMoonDec,
    };
    const isProjected = false;
    return (
      <div className={[styles.skymapContainer, className].join(' ')}>
        <div className={styles.skymapGridContainer}>
          <Pointing
            width={width}
            height={height}
            currentPointing={simonyiPointing}
            targetPointing={simonyiPointing}
            isProjected={isProjected}
            cartoon={<SimonyiPointing />}
          />
          <Pointing
            width={width}
            height={height}
            currentPointing={auxtelPointing}
            targetPointing={auxtelPointing}
            isProjected={isProjected}
            cartoon={<AuxTelPointing />}
          />
          <Pointing
            width={width}
            height={height}
            currentPointing={sunPointing}
            targetPointing={sunPointing}
            isProjected={isProjected}
            cartoon={<SunPointing />}
          >
            <SunSummary simonyiSunRa={simonyiSunRa} simonyiSunDec={simonyiSunDec} />
          </Pointing>
          <Pointing
            width={width}
            height={height}
            currentPointing={moonPointing}
            targetPointing={moonPointing}
            isProjected={isProjected}
            cartoon={<MoonPointing ilumination={simonyiMoonPhase} />}
          >
            <MoonSummary simonyiMoonRa={simonyiMoonRa} simonyiMoonDec={simonyiMoonDec} />
          </Pointing>
          <SkymapGrid width={width} height={height} isProjected={isProjected} />
        </div>
      </div>
    );
  }
}
