import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlotContainer from 'components/GeneralPurpose/Plot/Plot.container';
import { VegaLite } from 'react-vega';
import styles from './PowerPlot.module.css';

export default class PowerPlot extends Component {
  static propTypes = {
    /** Function to subscribe to streams to receive */
    subscribeToStreams: PropTypes.func,
    /** Function to unsubscribe to streams to stop receiving */
    unsubscribeToStreams: PropTypes.func,
    /** Louvers power draw (W) */
    powerDrawLouvers: PropTypes.number,
    /** LWS power draw (W) */
    powerDrawLightWindScreen: PropTypes.number,
    /** Shutters power draw (W) */
    powerDrawShutter: PropTypes.number,
  };

  static defaultProps = {
    powerDraw: 50,
    height:600,
    width:600,
    limit:75,
    title:"Title",
    data:[],
  };

  render() {

    const powerDraw = this.props?.powerDraw;

    const height=this.props?.height;
    const width=this.props?.width;
    const title=this.props?.title;

    const limit=this.props?.limit;

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
          "axis":{
            "zindex":1,
            "labels":0,
            "ticks":0,
            "title":0,
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
            "ticks":0,
            "title":0,
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
          "value":1
        }
      },
      
      ////////////////////////
      // 2.0.0 Datum layers //
      ////////////////////////
        "layer":[

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
          "values":this.props.data
            // [
            //   {
            //     "system":"aCalibration Screen",
            //     "count":powerDraw*0.35,
            //     "date":"2020-01-01 10:10:00",
            //   },{
            //     "system":"aCalibration Screen",
            //     "count":powerDraw*0.1,
            //     "date":"2020-01-01 10:12:00",
            //   },{
            //     "system":"aCalibration Screen",
            //     "count":powerDraw*0.05,
            //     "date":"2020-01-01 10:14:00",
            //   },{
            //     "system":"aCalibration Screen",
            //     "count":powerDraw*0.75,
            //     "date":"2020-01-01 10:16:00",
            //   },{
            //     "system":"aCalibration Screen",
            //     "count":powerDraw,
            //     "date":"2020-01-01 10:18:00",
            //   }
            // ]
          }
      };

    return (
      <div className={styles.container}>
        <div className={styles.plot}>
          <VegaLite
          style={{ display: 'flex' }}
          renderer="svg"
          spec={spec}
          className={[styles.plotContainer, this.props.className].join(' ')}
          actions={false}
          />
          <div style={{width:0}}>
            <div style={{top: `${height*0.5-25}px`,left: `${width*-0.5-25}px`,}} className={styles.powerDraw}>
              {`${powerDraw} kW`}
            </div>
          </div>
        </div>
        <div className={styles.titleContainer}>
          <div style={{width: `${width}px`}} className={styles.title}>
            {title}
          </div>
        </div>
      </div>
    );
  }
}
