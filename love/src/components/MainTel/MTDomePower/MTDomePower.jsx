import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlotContainer from 'components/GeneralPurpose/Plot/Plot.container';
import { VegaLite } from 'react-vega';
import PowerPlot from './PowerPlot/PowerPlot';
import styles from './MTDomePower.module.css';
import isEqual from 'lodash';
import { parseTimestamp } from 'Utils';

export default class MTDomePower extends Component {
  static propTypes = {
    /** Louvers power draw (W) */
    powerDrawLouvers: PropTypes.number,
    /** LWS power draw (W) */
    powerDrawLWS: PropTypes.number,
    /** Shutters power draw (W) */
    powerDrawShutter: PropTypes.number,

    /** Node to be used to track width and height.
    *  Use this instead of props.width and props.height for responsive plots.
    *  Will be ignored if both props.width and props.height are provided */
    containerNode: PropTypes.node,
  };

  static defaultProps = {
    powerLimit: 75,

    powerDrawLouvers: 0,
    powerDrawLWS: 0,
    powerDrawShutter: 0,
  };

  constructor(props) {
    super(props);
    this.resizeObserver = undefined;
    this.state = {
      containerWidth: 400,
      containerHeight: 200,
      spec: {},
      data: [],

      dataLouvers:[],
      dataLWS:[],
      dataShutters:[],
    };
  }

  updateSchema = () => {
    this.setState((state) => ({
      spec: {
        autosize: {
          type: 'fit',
          contains: 'padding',
        },
        width: this.props.width ?? state.containerWidth,
        height: this.props.height ?? state.containerHeight,
      },
      data: { ...this.props.schema.data },
    }));
  };

  setResizeObserver = () => {
    this.resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      this.setState({ containerWidth: width, containerHeight: height }, () => this.updateSchema());
    });

    if (this.props.containerNode.current) {
      this.resizeObserver.observe(this.props.containerNode.current);
    }
  };

  componentDidMount = () => {
    this.props.subscribeToStream();
  };

  componentDidUpdate = (prevProps,  prevState) => {

    //Louvers
    if (prevProps.powerDrawLouvers?.private_rcvStamp?.value !== this.props.powerDrawLouvers?.private_rcvStamp?.value){
      const prevValues = this.state.data;
      
      const newValue = {
        system: "eLouvers",
        date: parseTimestamp(this.props.powerDrawLouvers.private_rcvStamp?.value * 1000),
        count: this.props.powerDrawLouvers.powerDraw.value,
      };

      prevValues.push(newValue);
      this.setState((prevState) => ({ data: [...prevState.data, newValue] }));
      this.setState((prevState) => ({ dataLouvers: [...prevState.data, newValue] }));
      this.state.powerDrawLouvers

    };

    //LWS
    if (prevProps.powerDrawLWS?.private_rcvStamp?.value !== this.props.powerDrawLWS?.private_rcvStamp?.value){
      const prevValues = this.state.data;
      
      const newValue = {
        system: "eLouvers",
        date: parseTimestamp(this.props.powerDrawLWS.private_rcvStamp?.value * 1000),
        count: this.props.powerDrawLWS.powerDraw.value,
      };

      prevValues.push(newValue);
      this.setState((prevState) => ({ data: [...prevState.data, newValue] }));
      this.setState((prevState) => ({ dataLWS: [...prevState.data, newValue] }));
      this.state.powerDrawLWS

    };

    //Louvers
    if (prevProps.powerDrawLouvers?.private_rcvStamp?.value !== this.props.powerDrawLouvers?.private_rcvStamp?.value){
      const prevValues = this.state.data;
      
      const newValue = {
        system: "eLouvers",
        date: parseTimestamp(this.props.powerDrawLouvers.private_rcvStamp?.value * 1000),
        count: this.props.powerDrawLouvers.powerDraw.value,
      };

      prevValues.push(newValue);
      this.setState((prevState) => ({ data: [...prevState.data, newValue] }));
      this.setState((prevState) => ({ dataLouvers: [...prevState.data, newValue] }));
      this.state.powerDrawLouvers

    };


  };
  componentWillUnmount = () => {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  };

  render() {

    //Consume telemetries and convert to kW//
    const powerDrawLouvers = this.props.powerDrawLouvers.powerDraw?this.props.powerDrawLouvers.powerDraw.value/1000:0;
    const powerDrawLWS = this.props.powerDrawLWS.powerDraw?this.props.powerDrawLWS.powerDraw.value/1000:0;
    const powerDrawShutter = this.props.powerDrawShutter.powerDraw?this.props?.powerDrawShutter.powerDraw.value/1000:0;

    //Sum of all systems power draw//
    const powerTotal =(powerDrawLouvers+powerDrawLWS+powerDrawShutter);

    //Plot height and width. Should make this responsive(!)//
    const height=600;
    const width=600;

    //Power draw limit. Should make this configurabele(!)//
    //Need to add a Warning and Danger limit too//
    const limit=75;

    //The font height. Used to calculate the distance between each y axis system label.
    const fontHeight=20;

    //Plot height without its axis info. Used to measure the relative plot height for the y axis system labels.
    const height2=height-34;
    
    //Calculating the position for lateral labels, from tiop to bottom.
    //First add all values and find the corresponding position
    const powerLouvers2 = height2-((powerDrawLouvers+powerDrawLWS+powerDrawShutter)*height2/limit);
    const powerLWS2 = (powerDrawLouvers*height2/limit)-fontHeight+powerLouvers2;
    const powerShutter2 = (powerDrawLWS*height2/limit)-fontHeight+powerLWS2;


    //The Plot Info
    const spec = {

      //////////////////////////
      // 1.0.0 Basic Encoding //
      //////////////////////////
      "encoding":{

        // 1.1.0 axis //
        "x":{
          "field":"date",
          "type":"temporal",
          "title":"Time",
          "color":"#788e9b",
          "axis":{
            "zindex":1,
            "labelColor":"#788e9b",
            "title":0
          }
        },
        "y":{
          "field":"count",
          "type":"quantitative",
          "title":"kW",
          "color":"#788e9b",
          "axis":{
            "zindex":1,
            "labelColor":"#788e9b",
            "title":0
          }
        },

        // 1.2.0 - Color //
        "color":{
          "field":"system",
          "type":"nominal",
          "legend":null
        },

        // 1.3.0 - Conditional Opacity //
        "opacity":{
          "condition":{
            "param":"hover",
            "value":1
          },
          "value":0.2
        }
      },
      
      ////////////////////////
      // 2.0.0 Datum layers //
      ////////////////////////
        "layer":[

        // 2.1.0 Invisible Stroke for easier Selection //
          {
            "params":[
              {
                "name":"hover",
                "select":{
                  "type":"point",
                  "fields":["system"]
                }
              }
            ],
            "mark":{
              "type":"area",
              "stroke":"transparent"
            },
            "encoding":{
              "y":{
                "aggregate":"sum",
                "field":"count",
                "scale":{
                  "domain":[0,limit]
                },
                "stack":"zero"
              }
            }
          },

        // 2.2.0 Area Mark //
          {
            "mark":{
              "type":"area",
              "strokeWidth":2,
              "color":"#27434f"
            },
            "encoding":{
              "y":{
                
                "field":"count",
                "scale":{
                  "domain":[0,limit]
                },
                "stack":"zero"
              },
              "color":{
                "field":"system",
                "type":"nominal",
                "legend":null,
                "scale": {"range": ["#27434f","#27434f"]}
              },
            },
          },

        // 2.3.0 Line Mark //
          {
            "mark":{
              "type":"line",
              "strokeWidth":2,
              "stroke":"#59717c"
            },
            "encoding":{
              "y":{
                
                "field":"count",
                "scale":{
                  "domain":[0,limit]
                },
                "stack":"zero"
              },
              "color":{
                "field":"system",
                "type":"nominal",
                "legend":null,
                "scale": {"range": ["#27434f","#27434f"]}
              },
            },
          },
        ],

      //////////////////
      // 3.0.0 Config //
      //////////////////
        "config": {
          //Grid config
          "axis": {
            "gridOpacity" : 0.2,
            "gridColor": "#c1ced2",
            "gridWidth": 0.5
          },
          //No border for plot
          "view": {"stroke": null}
        },

        //Size 
        "width": width, "height": height,

        //Responsiveness
        autosize: {
          type: 'fit',
          contains: 'padding',
        },
        

      ////////////////
      // 4.0.0 DATA //
      ////////////////
        "data": {
          "values":this.state.data
          }
      };

    return (
      <div className={styles.container}>
        <div className={styles.leftPanel}>
          <VegaLite
          style={{ display: 'flex' }}
          renderer="svg"
          spec={spec}
          className={[styles.plotContainer, this.props.className].join(' ')}
          actions={false}
          />
          <div className={styles.systemList}>
            <div style={{top: `${powerLouvers2}px`}}><span className={styles.kwBold}>{`${powerDrawLouvers} kW`}</span>{` Louvers`}</div>
            <div style={{top: `${powerLWS2}px`}}><span className={styles.kwBold}>{`${powerDrawLWS} kW`}</span>{` LWS`}</div>
            <div style={{top: `${powerShutter2}px`}}><span className={styles.kwBold}>{`${powerDrawShutter} kW`}</span>{` powerShutter`}</div>
          </div>
          <div style={{width:0}}>
            <div style={{top: `${height2*0.5}px`,left: `${width*-0.5-280}px`,width:140}} className={styles.powerTotal}>
              {`${powerTotal} kW`}
            </div>
          </div>
        </div>
        <div className={styles.rightPanel}>
          <PowerPlot
            powerDraw={0}
            data={this.state.dataCS}
            title={"Calibration Screen"}
            className={styles.powerPlot}
            height={200}
            width={150}
            limit={0.75}
          />
          <PowerPlot
            powerDraw={0}
            data={this.state.dataRAD}
            title={"Rear Access Door"}
            className={styles.powerPlot}
            height={200}
            width={150}
            limit={3}
          />
          <PowerPlot
            powerDraw={0}
            data={this.state.dataOBS}
            title={"Overhead Bridge Crane"}
            className={styles.powerPlot}
            height={200}
            width={150}
            limit={6}
          />
          <PowerPlot
            powerDraw={0}
            data={this.state.dataFans}
            title={"Fans"}
            className={styles.powerPlot}
            height={200}
            width={150}
            limit={25}
          />
          <PowerPlot
            powerDraw={powerDrawLouvers}
            data={this.state.dataLouvers}
            title={"Louvers"}
            className={styles.powerPlot}
            height={200}
            width={150}
            limit={69}
          />
          <PowerPlot
            powerDraw={powerDrawLWS}
            data={this.state.dataLWS}
            title={"Light Wind Screen"}
            className={styles.powerPlot}
            height={200}
            width={150}
            limit={68}
          />
          <PowerPlot
            powerDraw={powerDrawShutter}
            data={this.state.dataShutter}
            title={"Shutters"}
            className={styles.powerPlot}
            height={200}
            width={150}
            limit={6}
          />
          <PowerPlot
            powerDraw={0}
            data={this.state.dataED}
            title={"Electronic Devices"}
            className={styles.powerPlot}
            height={200}
            width={150}
            limit={1}
          />
        </div>
      </div>
    );
  }
}
