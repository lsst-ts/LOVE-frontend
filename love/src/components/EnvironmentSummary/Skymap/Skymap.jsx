import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import styles from './Skymap.module.css';
import SkymapGrid from './SkymapGrid';
import Pointing from './Pointing';
import AuxTelPointing from '../Pointings/AuxTelPointing';
import SimonyiPointing from '../Pointings/SimonyiPointing';
import SunPointing from '../Pointings/SunPointing';

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
        // const containerHeight = container.contentRect.height;
        const containerWidth = container.contentRect.width;
        console.log(container);
        console.log(containerWidth);
        // this.setState({
        //   height: containerWidth*0.5,
        //   width: containerWidth*0.5,
        // });
      });
      if (!(containerNode instanceof Element)) return;
      resizeObserver.observe(containerNode);
      return () => {
        resizeObserver.disconnect();
      };
    }
  };

  componentDidUpdate() {
    console.log('DidUpdate');
    const { containerNode } = this.props;
    this.setResizeObserver();
  }

  componentDidMount() {
    console.log('didMount');
  }

  render() {
    const { className } = this.props;
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
    const targetPointing = {
      az: 270,
      el: 20,
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
          />
          <SkymapGrid width={width} height={height} isProjected={isProjected} />
        </div>
      </div>
    );
  }
}
