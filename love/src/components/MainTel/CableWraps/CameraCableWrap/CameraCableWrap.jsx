import React, { Component } from 'react';
import * as d3 from 'd3';
import ReactDOM from 'react-dom';
import { radians, degrees } from 'Utils';

class CameraCableWrap extends Component {
  constructor(props) {
    super(props);
    this.g = null;
    this.path = null;
    this.arc = null;
    this.innerPath = null;
    this.innerArc = null;
  }

  removeCameraCableWrap(dom) {
    this.g.remove();
  }

  createCameraCableWrap(dom) {
    let radio = 140;
    let width = this.props.width;
    let height = this.props.height;

    let svg = d3.select(dom).append('svg').attr('class', 'd3').attr('width', width).attr('height', height);
    let g = svg.append('g').attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
    this.g = g;
    let tau = (1 / 2) * Math.PI;

    let bckgarc = d3
      .arc()
      .innerRadius(radio - 10)
      .outerRadius(radio)
      .startAngle(-tau);
    // this.arc=arc;
    this.props.drawBackground(g, radio, tau, bckgarc);

    let arc = d3
      .arc()
      .innerRadius(radio - 10)
      .outerRadius(radio)
      .startAngle(0);
    this.arc = arc;

    let innerArc = d3
      .arc()
      .innerRadius(radio - 70)
      .outerRadius(radio - 10)
      .startAngle(0);
    this.innerArc = innerArc;

    this.path = this.g
      .append('path')
      .datum({ endAngle: 0 })
      .style('fill', '#43e0f9')
      .attr('d', this.arc)
      .attr('id', 'cable_wrap');

    this.innerPath = this.g
      .append('path')
      .datum({ endAngle: 0 })
      .style('fill', '#43e0f921')
      .attr('d', this.innerArc)
      .attr('id', 'rot_wrap');

    let theta = degrees(Math.PI / 2);
    this.props.drawLimits(g, radio, -theta, theta);
  }

  updateCameraCableWrap() {
    let tau = Math.PI / 2;
    let newAngle = this.props.cable_wrap.cable * tau;
    let delta = radians(this.props.cable_wrap.rotator);
    let newRotAngle = newAngle + delta;
    this.path.transition().duration(1500).attrTween('d', this.props.arcTween(newAngle, this.arc));
    this.innerPath.transition().duration(1500).attrTween('d', this.props.arcTween(newRotAngle, this.innerArc));
  }

  componentDidMount() {
    var dom = ReactDOM.findDOMNode(this);
    this.createCameraCableWrap(dom);
  }

  componentDidUpdate() {
    this.updateCameraCableWrap();
  }

  render() {
    return <div ref="az-cable-wrap-container"></div>;
  }
}

export default CameraCableWrap;
