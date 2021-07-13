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
    let tau = (1 / 2) * Math.PI; //to transform angles to radians

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

    // arc with length 2 (-3.5° - -1.5°) in radians
    let rotArc = d3
      .arc()
      .innerRadius(radio - 20)
      .outerRadius(radio + 10)
      .startAngle(-0.0610865)
      .endAngle(-0.0261799);
    this.rotArc = rotArc;

    // arc with length 2 (1.5° - 3.5°) in radians
    let rotArc2 = d3
      .arc()
      .innerRadius(radio - 20)
      .outerRadius(radio + 10)
      .startAngle(0.0261799)
      .endAngle(0.0610865);
    this.rotArc2 = rotArc2;

    //arc with length 2 (0° - 2°) in radians
    let ccwArc = d3
      .arc()
      .innerRadius(radio - 30)
      .outerRadius(radio + 20)
      .startAngle(0)
      .endAngle(0.0349066);
    this.ccwArc = ccwArc;

    this.rot = this.g
      .append('path')
      .datum({ endAngle: 0 })
      .style('fill', '#43e0f9')
      .attr('d', this.rotArc)
      .attr('id', 'rotator');

    this.rot2 = this.g
      .append('path')
      .datum({ endAngle: 0 })
      .style('fill', '#43e0f9')
      .attr('d', this.rotArc2)
      .attr('id', 'rotator');

    this.ccw = this.g
      .append('path')
      .datum({ endAngle: 0 })
      .style('fill', this.props.colorCable ? this.props.colorCable : '#35667E')
      .attr('d', this.ccwArc)
      .attr('id', 'cable_wrap');

    let theta = degrees(Math.PI / 2);
    this.props.drawLimits(g, radio, theta, -theta);
  }

  updateCameraCableWrap(dom) {
    let width = this.props.width;
    let height = this.props.height;
    let svg = d3.select(dom).append('svg').attr('class', 'd3').attr('width', width).attr('height', height);
    let g = svg.append('g').attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
    this.g = g;

    let tau = Math.PI / 2;
    let cablePosition = this.props.cable_wrap * tau;
    let rotatorPosition = this.props.rotator * tau;

    this.rot
      .transition()
      .duration(2500)
      .attrTween('d', (d) => {
        return (t) => {
          const angle = d3.interpolate(d.endAngle, rotatorPosition)(t);
          this.rotArc.startAngle(-0.0610865 + angle);
          this.rotArc.endAngle(-0.02617996 + angle);
          this.rot.datum({ endAngle: rotatorPosition });
          return this.rotArc(d);
        };
      });

    this.rot2
      .transition()
      .duration(2500)
      .attrTween('d', (d) => {
        return (t) => {
          const angle = d3.interpolate(d.endAngle, rotatorPosition)(t);
          this.rotArc2.startAngle(0.0261799 + angle);
          this.rotArc2.endAngle(0.0610865 + angle);
          this.rot2.datum({ endAngle: rotatorPosition });
          return this.rotArc2(d);
        };
      });

    this.ccw
      .transition()
      .duration(2500)
      .attrTween('d', (d) => {
        return (t) => {
          const angle = d3.interpolate(d.endAngle, cablePosition)(t);
          this.ccwArc.startAngle(0 + angle);
          this.ccwArc.endAngle(0.0349066 + angle);
          this.ccw.datum({ endAngle: rotatorPosition });
          return this.ccwArc(d);
        };
      });
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
