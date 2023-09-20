/** This file is part of LOVE-frontend.

Developed for Inria Chile Tech Team.

See the COPYRIGHT file at the top-level directory of this distribution
for details of code ownership.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.*/

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
