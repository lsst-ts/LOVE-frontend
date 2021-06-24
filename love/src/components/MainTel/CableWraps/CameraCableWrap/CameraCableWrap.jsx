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

    // let innerArc = d3
    //   .arc()
    //   .innerRadius(radio - 70)
    //   .outerRadius(radio - 10)
    //   .startAngle(0);
    // this.innerArc = innerArc;

    // arc with length 2 (35° - 37°) in radians
    let rotArc = d3
      .arc()
      .innerRadius(radio - 20)
      .outerRadius(radio + 10)
      .startAngle(0.610865)
      .endAngle(0.645772);
    this.rotArc = rotArc;

    // arc with length 2 (45° - 47°) in radians
    let rotArc2 = d3
      .arc()
      .innerRadius(radio - 20)
      .outerRadius(radio + 10)
      .startAngle(0.785398)
      .endAngle(0.820305);
    this.rotArc2 = rotArc2;

    //arc with length 2 (40° - 42°) in radians
    let ccwArc = d3
      .arc()
      .innerRadius(radio - 30)
      .outerRadius(radio + 20)
      .startAngle(0.698132)
      .endAngle(0.733038);
    this.ccwArc = ccwArc;

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
      .datum({endAngle: 0})
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
    // replace that for rotator and cable values from backend
    let newAngle = this.props.cable_wrap.cable * tau;
    let delta = radians(this.props.cable_wrap.rotator);
    let newRotAngle = newAngle + delta;
   
    // this.path.transition().duration(1500).attrTween('d', this.props.arcTween(newAngle, this.arc));
    // this.innerPath.transition().duration(1500).attrTween('d', this.props.arcTween(newRotAngle, this.innerArc));

    this.rot.transition().duration(2500).attrTween('d', (d) => {
      return (t) => {
        const angle = d3.interpolate(d.endAngle, newAngle)(t);
        this.rotArc.startAngle(0.610865 + angle);
        this.rotArc.endAngle(0.640865 + angle);
        return this.rotArc(d);
      };
    });

    this.rot2.transition().duration(2500).attrTween('d', (d) => {
      return (t) => {
        const angle = d3.interpolate(d.endAngle, newAngle)(t);
        this.rotArc2.startAngle(0.785398 + angle);
        this.rotArc2.endAngle(0.820305 + angle);
        return this.rotArc2(d);
      };
    });

    this.ccw.transition().duration(2500).attrTween('d', (d) => {
      return (t) => {
        const angle = d3.interpolate(d.endAngle, newRotAngle)(t);
        this.ccwArc.startAngle(0.698132 + angle);
        this.ccwArc.endAngle(0.733038 + angle);
        return this.ccwArc(d);
      }
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
