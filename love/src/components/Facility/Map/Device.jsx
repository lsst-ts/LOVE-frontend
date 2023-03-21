import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Device.module.css';
import * as d3 from 'd3';

export default class Device extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hidden:1,
    };

    this.show = this.show.bind(this);


  }

  static propTypes = {
  };

  
  static defaultProps = {
    title: 'Device Name',
    temp:null,

    height: 200,
    width: 200,
    scale: 0.4,

    posX:0,
    posY:0,

    collapsible:0,

    parameters:{},
    states:{
        'command':null,
        'working':null,
        'unit':null,
        'switch':null,
      },
  };

show() {
  this.state.hidden?this.state.hidden=0:this.state.hidden=1;
};

  componentDidMount(){
    var mask = this.props.title;
    mask = mask.replace(/\s+/g, '');

    console.log(mask);

    d3.select("#"+(mask))
    .on("click", () => this.show());
  };

  

  componentDidUpdate() {
    /*const params = this.props.params;
    console.log(params);
    params.forEach((e,l) => {
        console.log(e);
    });*/
  };

  renderStates(ctx){
    switch(this.props.states[ctx]) {
    case '1':
      return `${styles.statusOk}`;
    case '2':
      return `${styles.statusWarning}`;
    case '3':
      return `${styles.statusAlert}`;
    case '4':
      return `${styles.statusDisabled}`;
    default:
      return `${styles.statusNull}`;
    }
  };

  renderArrow(){
    var mask = this.props.title;
    mask = mask.replace(/\s+/g, '');

    return(
      <g id={mask} transform={'translate('+(this.props.width-14)+' 4)'}>
        <rect className={styles.arrowBg} width={10} height={10} onMouseDown={(e) => this.show()}/>
        <polyline className={styles.arrow}  points=".35 .35 4.35 4.35 8.35 .35" transform={'translate(0.5 3) rotate('+(this.state.hidden?-90:0)+')'} transform-origin='4 2' />
      </g>
    );
  };


  renderParams(){

    const width = this.props.width;
    const parameters = this.props.parameters;
    const parametersKeys = Object.keys(parameters);

    let returnContent;
    let groupBox;
    let groupData;

    let i = 0;
    let j = 38;

    return parametersKeys.map((x) => {

      if(parameters[x].type === 'status'){
        i=j;
        j=j+10;
        return (
          <g transform={'translate(0 '+i+')'}>
            <text className={styles.param} transform={'translate(4 0)'} textAnchor='start'>
              <tspan>{parameters[x].name}</tspan>
            </text>
            <rect className={styles.statusOk} width={30} height={8} rx={5} ry={5} transform={'translate('+(width-34)+' '+(-5)+')'}/>>
            <text className={styles.paramVal} transform={'translate('+(width-19)+' 0)'} textAnchor='middle'>
              <tspan>{parameters[x].value+(parameters[x].unit?parameters[x].unit:'')}</tspan>
            </text>
          </g>
          );

      }else if(parameters[x].type === 'single'){
        i=j;
        j=j+10;
        return (
          <g transform={'translate(0 '+i+')'}>
            <text className={styles.param} transform={'translate(4 0)'} textAnchor='start'>
              <tspan>{parameters[x].name}</tspan>
            </text>
            <text className={styles.paramVal} transform={'translate('+(width-4)+' 0)'} textAnchor='end'>
              <tspan>{parameters[x].value+(parameters[x].unit?parameters[x].unit:'')}</tspan>
            </text>
          </g>
          );

      }else{
        i=j;
        j=j+30;
        
        groupBox = (Object.keys(parameters[x].params)).map((ctx, k) => {

          //Check if it's badge or box
          if(parameters[x].params[ctx].type==='badge'){
            return(
              <React.Fragment>
                <rect className={styles.statusDisabled} width={40} height={10} rx={5} ry={5} transform={'translate('+(44*k)+' 3)'}/>
                <text className={styles.paramVal} transform={'translate('+(20+(44*k))+' 9)'} textAnchor="middle">
                  <tspan>{parameters[x].params[ctx].value+parameters[x].params[ctx].unit}</tspan>
                </text>
              </React.Fragment>
            );
          }else if(parameters[x].params[ctx].type==='box'){
            return(
              <React.Fragment>
                <rect className={styles.statusOk} width={10} height={10} transform={'translate('+((width/8-8)+(26*k))+' 0)'}/>
                <text className={styles.boxParamOk} transform={'translate('+((width/8-3)+(26*k))+' 6)'} textAnchor="middle">
                  <tspan>{parameters[x].params[ctx].name}</tspan>
                </text> 
                <text className={styles.paramVal} transform={'translate('+((width/8-3)+(26*k))+' 15)'} textAnchor="middle">
                  <tspan>{parameters[x].params[ctx].value?parameters[x].params[ctx].value+parameters[x].params[ctx].unit:''}</tspan>
                </text>
              </React.Fragment>
            );
          }else{
            return(
              <React.Fragment>
                <text className={styles.paramVal} transform={'translate('+((width/8-3)+(26*k))+' 7)'} textAnchor="middle">
                  <tspan>{parameters[x].params[ctx].name}</tspan>
                </text> 
                <text className={styles.paramVal} transform={'translate('+((width/8-3)+(26*k))+' 13)'} textAnchor="middle">
                  <tspan>{parameters[x].params[ctx].value+parameters[x].params[ctx].unit}</tspan>
                </text>
              </React.Fragment>
            );
          }
        });

        return (
          <g transform={'translate(0 '+i+')'}>
            <text className={styles.paramGroup} transform={'translate(4 0)'} textAnchor='start'>
              <tspan>{parameters[x].name}</tspan>
            </text>
            <text className={styles.paramVal} transform={'translate('+(width-4)+' 0)'} textAnchor='end'>
              <tspan>{(parameters[x].value?parameters[x].value:'')+(parameters[x].unit?parameters[x].unit:'')}</tspan>
            </text>
        
            <g transform={'translate(4 4)'}>{groupBox}</g>
            <g transform={'translate(4 10)'}>{groupData}</g>
          
          </g>
          );

      }
    });

  };

  render() {
    const { title, height, temp, width, scale, posX, posY, collapsible } = this.props;
    const hidden = this.state.hidden
    var mask = this.props.title;
    mask = mask.replace(/\s+/g, '');

return (
  <g id="device" className={styles.device} transform-origin={width/2+' '+((height/2)+20)} transform={'translate('+posX+' '+posY+') scale('+scale+')'}>
    
    <clipPath id={(mask+'Mask')}>
      <rect width={width} height={height} transform={'translate(0 30)'}/>
    </clipPath>

    <g id="Bottom" clipPath={"url(#"+mask+"Mask)"}>
      <g id="InsideContent" className={styles.insideContent} transform={hidden?'translate(0 -'+height+')':'translate(0 0)'} >

        <rect className={styles.container} width={width} height={height} transform={'translate(0 30)'}/>

        {this.renderParams()}

      </g>
    </g>

    <g id="TopBar">
      <g id="TitleBar">
        <rect className={styles.titleBg} width={width} height={12} />
        <text className={styles.title} transform={'translate(6 8)'}>
          <tspan>{title}</tspan>
        </text>
        <text className={styles.title} transform={'translate('+(width-6)+' 8)'} textAnchor='end'>
          <tspan>{temp?temp:''}</tspan>
        </text>
      </g>
      <g transform={'translate(0 12)'}>
        <rect className={styles.titleRow2} width={width} height={18}/>
          <g transform={'translate(4 4)'}>
            <rect className={this.renderStates('command')} width={10} height={10} />
            <rect className={this.renderStates('working')} width={10} height={10} transform={'translate(12 0)'}/>
            <rect className={this.renderStates('unit')} width={10} height={10} transform={'translate(24 0)'}/>
            <rect className={this.renderStates('switch')} width={10} height={10} transform={'translate(36 0)'}/>  
          </g>

        {collapsible?this.renderArrow():''}

      </g>
    </g>

  </g>
    );
  }
}