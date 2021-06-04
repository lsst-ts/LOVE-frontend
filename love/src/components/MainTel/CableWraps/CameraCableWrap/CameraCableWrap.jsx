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
    this.bar = null;
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

    // let innerArc = d3
    //   .arc()
    //   .innerRadius(radio - 70)
    //   .outerRadius(radio - 10)
    //   .startAngle(0);
    // this.innerArc = innerArc;

    // arc with length of 2 degrees (35° - 37°) in radians
    let barArc = d3
      .arc()
      .innerRadius(radio - 20)
      .outerRadius(radio + 10)
      .startAngle(0.610865)
      .endAngle(0.645772);
    this.barArc = barArc;

    // arc with length of 2 degrees (45° - 47°) in radians
    let barArc2 = d3
      .arc()
      .innerRadius(radio - 20)
      .outerRadius(radio + 10)
      .startAngle(0.785398)
      .endAngle(0.820305);
    this.barArc2 = barArc2;

    // this.path = this.g
    //   .append('path')
    //   .datum({ endAngle: 0 })
    //   .style('fill', '#43e0f9')
    //   .attr('d', this.arc)
    //   .attr('id', 'cable_wrap');

    // this.innerPath = this.g
    //   .append('path')
    //   .datum({ endAngle: 0 })
    //   .style('fill', '#43e0f9')
    //   .attr('d', this.innerArc)
    //   .attr('id', 'rot_wrap');

    this.bar = this.g
      .append('path')
      .datum({ endAngle: 0 })
      .style('fill', 'red')
      .attr('d', this.barArc)
      .attr('id', 'cable_wrap');
    
    this.bar2 = this.g
      .append('path')
      .datum({ endAngle: 0 })
      .style('fill', 'red')
      .attr('d', this.barArc2)
      .attr('id', 'cable_wrap');
    
    let theta = degrees(Math.PI / 2);
    this.props.drawLimits(g, radio, -theta, theta);
  }

  updateCameraCableWrap(dom) {
    let width = this.props.width;
    let height = this.props.height;
    let svg = d3.select(dom).append('svg').attr('class', 'd3').attr('width', width).attr('height', height);
    let g = svg.append('g').attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
    this.g = g;
    
    let tau = Math.PI / 2;
    let newAngle = this.props.cable_wrap.cable * tau;
    let delta = radians(this.props.cable_wrap.rotator);
    let newRotAngle = newAngle + delta;
   
    // this.path.transition().duration(1500).attrTween('d', this.props.arcTween(newAngle, this.arc));
    // this.innerPath.transition().duration(1500).attrTween('d', this.props.arcTween(newRotAngle, this.innerArc));

    this.bar.transition().duration(1500).attrTween('d', (d) => {
      return (t) => {
        const angle = d3.interpolate(d.endAngle, newAngle)(t);
        const angle1 = 0.610865 + angle;
        const angle2 = 0.640865 + angle;
        if ((angle1 >= -1.578) && (angle2 <= 1.578)){
          this.barArc.startAngle(angle1);
          this.barArc.endAngle(angle2);
        }
        return this.barArc(d);
      };
    });

    this.bar2.transition().duration(1500).attrTween('d', (d) => {
      return (t) => {
        const angle = d3.interpolate(d.endAngle, newAngle)(t);
        const angle1 = 0.785398 + angle;
        const angle2 = 0.820305 + angle;
        if ((0.785398 + angle >= -1.578) && (0.820305 + angle <= 1.578)){
          this.barArc2.startAngle(angle1);
          this.barArc2.endAngle(angle2);
        }
        return this.barArc2(d);
      };
    });

   
  }

  componentDidMount() {
    var dom = ReactDOM.findDOMNode(this);
    this.createCameraCableWrap(dom);
    // console.log("holi");
  }

  componentDidUpdate() {
    this.updateCameraCableWrap();
    // console.log("chau");
  }

  render() {
    return <div ref="az-cable-wrap-container"></div>;
  }
}

export default CameraCableWrap;
