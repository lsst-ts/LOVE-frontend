import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import styles from './Skymap.module.css';
import SkymapGrid from './SkymapGrid';
import Pointing from './Pointing';

export default class Skymap extends Component {
  // static propTypes = {
  //   prop: PropTypes
  // };

  constructor(props) {
    super(props);
    this.state = {
      height: 0,
      width: 0,
    };
  }

  componentDidUpdate() {
    // const { containerNode } = this.props;
    // console.log(containerNode);
    // if (containerNode) {
    //   const resizeObserver = new ResizeObserver((entries) => {
    //     const container = entries[0];
    //     // const containerHeight = container.contentRect.height;
    //     const containerWidth = container.contentRect.width;
    //     this.setState({
    //       height: containerWidth*0.5,
    //       width: containerWidth*0.5,
    //     });
    //   });
    //   if (!(containerNode instanceof Element)) return;
    //   resizeObserver.observe(containerNode);
    //   return () => {
    //     resizeObserver.disconnect();
    //   };
    // }
  }

  render() {
    const { className, containerNode } = this.props;
    console.log(this.state.height);
    const width = this.props.width ?? 350;
    const height = this.props.height ?? 350;
    const currentPointing = {
      az: 0,
      el: 20,
    };
    const currentPointing2 = {
      az: 160,
      el: 80,
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
            // targetPointing={targetPointing}
            targetPointing={currentPointing}
            isProjected={isProjected}
          />
          <Pointing
            width={width}
            height={height}
            currentPointing={currentPointing2}
            // targetPointing={targetPointing}
            targetPointing={currentPointing2}
            isProjected={isProjected}
          />
          <SkymapGrid width={width} height={height} isProjected={isProjected} />
        </div>
      </div>
    );
  }
}
