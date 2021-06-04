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

    let innerArc = d3
      .arc()
      .innerRadius(radio - 70)
      .outerRadius(radio - 10)
      .startAngle(0);
    this.innerArc = innerArc;

    let bar = d3
      .arc()
      .innerRadius(radio - 20)
      .outerRadius(radio + 10)
      .startAngle(0.610865)
      .endAngle(0.645772);
    this.bar = bar;

    this.path = this.g
      .append('path')
      .datum({ endAngle: 0 })
      .style('fill', '#43e0f9')
      .attr('d', this.arc)
      .attr('id', 'cable_wrap');

    this.innerPath = this.g
      .append('path')
      .datum({ endAngle: 0 })
      .style('fill', '#43e0f9')
      .attr('d', this.innerArc)
      .attr('id', 'rot_wrap');

    this.bar = this.g
      .append('path')
      .datum({ endAngle: 0 })
      .style('fill', 'red')
      .attr('d', this.bar)
      .attr('id', 'cable_wrap');
    
    // g.append('line')
    //   .attr("x1", -105)
    //   .attr("y1", -85)
    //   .attr("x2", -125)
    //   .attr("y2", -105)
    //   // .attr('transform', 'rotate('+ tau + 15 +')')
    //   .style("stroke", "blue")
    //   .style("stroke-width", 5)
    //   .attr('id', 'rotLine1');

    // g.append('line')
    //   .attr("x1", -85)
    //   .attr("y1", -85)
    //   .attr("x2", -105)
    //   .attr("y2", -105)
    //   // .attr('transform', 'rotate('+ tau + 45 +')')
    //   .style("stroke", "lightgreen")
    //   .style("stroke-width", 5)
    //   .attr('id', 'rotLine2');

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
    console.log(newRotAngle);
   
    

    this.path.transition().duration(1500).attrTween('d', this.props.arcTween(newAngle, this.arc));
    // this.innerPath.transition().duration(1500).attrTween('d', this.props.arcTween(newRotAngle, this.innerArc));

    // this.path.transition().duration(1500).attrTween('d', this.props.arcTween(newAngle, this.bar));

   
  }

  componentDidMount() {
    var dom = ReactDOM.findDOMNode(this);
    this.createCameraCableWrap(dom);
    console.log("holi");
  }

  componentDidUpdate() {
    this.updateCameraCableWrap();
    console.log("chau");
  }

  render() {
    return <div ref="az-cable-wrap-container"></div>;
  }
}

export default CameraCableWrap;
