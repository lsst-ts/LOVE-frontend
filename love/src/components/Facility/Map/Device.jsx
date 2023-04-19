import React, { Component } from 'react';
import { fixedFloat } from 'Utils';
import lodash from 'lodash';
import PropTypes from 'prop-types';
import styles from './Device.module.css';
import * as d3 from 'd3';

export default class Device extends Component {
  constructor(props) {
    super(props);
    this.id = lodash.uniqueId('Mask-');
    this.state = {
      hidden: 1,
    };

    this.show = this.show.bind(this);
  }

  static propTypes = {};

  static defaultProps = {
    title: 'Device Name',
    temp: null,

    height: 200,
    width: 200,
    scale: 0.4,

    posX: 0,
    posY: 0,

    collapsible: 0,

    alarms: {},
    parameters: {},

    states: {
      command: null,
      working: null,
      unit: null,
      switch: null,
    },
  };

  show() {
    this.state.hidden ? (this.state.hidden = 0) : (this.state.hidden = 1);
  }

  componentDidUpdate() {}

  renderStates(ctx) {
    switch (this.props.states[ctx]) {
      case true:
        return `${styles.statusOk}`;
      case false:
        return `${styles.statusAlert}`;
      default:
        return `${styles.statusNull}`;
    }
  }

  statusToStyle(ctx) {
    switch (ctx) {
      case 'true':
        return `${styles.bgStatusOk}`;
      case 'false':
        return `${styles.bgStatusAlert}`;
      default:
        return `${styles.bgStatusNull}`;
    }
  }

  statusTextToStyle(ctx) {
    switch (ctx) {
      case 'true':
        return `${styles.statusOk}`;
      case 'false':
        return `${styles.statusAlert}`;
      default:
        return `${styles.statusDisabled}`;
    }
  }

  renderArrow() {
    return (
      <g
        id={this.id}
        transform={'translate(' + (this.props.width - 14) + ' 4)'}
        pointerEvents="all"
        onMouseUp={(e) => this.show()}
      >
        <rect className={styles.arrowBg} width={10} height={10} />
        <polyline
          className={styles.arrow}
          points=".35 .35 4.35 4.35 8.35 .35"
          transform={'translate(0.5 3) rotate(' + (this.state.hidden ? -90 : 0) + ')'}
          transform-origin="4 2"
        />
      </g>
    );
  }

  // This function renders the badge style alarm norifications on devices.
  renderAlarms() {
    const height = this.props.height;
    const width = this.props.width;
    const hidden = this.state.hidden;
    const alarms = this.props.alarms;
    const alarmsKeys = Object.keys(alarms);
    const rowLength = Math.round(width / 42 - 1);

    let transX;
    let transY;
    let currentRow;
    let currentCol;

    return alarmsKeys.map((x, k) => {
      if (alarms[x].state) {
        transX = 0;
        transY = 0;
        currentRow = Math.ceil((k + 1) / rowLength);
        currentCol = (k + 1) % currentRow;

        console.log(
          alarms[x].name +
            ' row length:' +
            rowLength +
            ' current row:' +
            currentRow +
            ' current col:' +
            currentCol +
            ' k:' +
            k,
        );

        transX = 42 * (k + 1 - rowLength * (currentRow - 1)) - 42;

        if (hidden) {
          transY = 12 * (currentRow - 1);
        } else {
          transY = 12 * (currentRow - 1) + height;
        }

        return (
          <g className={styles.alarm} transform={'translate(' + transX + ' ' + transY + ')'}>
            <rect className={styles.bgStatusAlert} width={40} height={10} rx={5} ry={5} transform={'translate(0 33)'} />
            <text className={styles.statusAlert} transform={'translate(20 39)'} textAnchor="middle">
              <tspan>{alarms[x].name}</tspan>
            </text>
          </g>
        );
      }
    });
  }

  //This function renders the Decive parameters. This is the detailed information that is collapsible

  renderParams() {
    const width = this.props.width;
    const parameters = this.props.parameters;
    const parametersKeys = Object.keys(parameters);

    const gutter = 4;
    const rowHeight = 10;

    let returnContent;
    let groupBox;
    let groupData;
    let length;
    let transX;

    //Vars i and j are used to translate parameters down each time a new parameter is rendered.

    let i = 0;
    let j = 38;

    return parametersKeys.map((x) => {
      //Status Parameters are styled as Summary States.
      if (parameters[x].type === 'status') {
        i = j;
        j = j + rowHeight;
        return (
          <g transform={'translate(0 ' + i + ')'}>
            <text className={styles.param} transform={'translate(' + gutter + ' 0)'} textAnchor="start">
              <tspan>{parameters[x].name}</tspan>
            </text>
            <rect
              className={this.statusToStyle(String(parameters[x].value))}
              width={30}
              height={8}
              rx={5}
              ry={5}
              transform={'translate(' + (width - (30 + gutter)) + ' ' + -5 + ')'}
            />
            >
            <text
              className={this.statusTextToStyle(String(parameters[x].value))}
              transform={'translate(' + (width - 19) + ' 0)'}
              textAnchor="middle"
            >
              <tspan>{parameters[x].value + (parameters[x].unit ? parameters[x].unit : '')}</tspan>
            </text>
          </g>
        );
      }

      //Single Parameters are those displayed as a single row. They have a name and a value which may have a unit.
      else if (parameters[x].type === 'single') {
        i = j;
        j = j + rowHeight;
        return (
          <g transform={'translate(0 ' + i + ')'}>
            <text className={styles.param} transform={'translate(4 0)'} textAnchor="start">
              <tspan>{parameters[x].name}</tspan>
            </text>
            <text className={styles.paramVal} transform={'translate(' + (width - 19) + ' 0)'} textAnchor="middle">
              <tspan>{fixedFloat(parameters[x].value, 2) + (parameters[x].unit ? parameters[x].unit : '')}</tspan>
            </text>
          </g>
        );
      }

      //Group Parameters are those that are grouped under a specific Title. This title might have a value and units as well.
      else {
        i = j;
        j = j + rowHeight * 3;

        //This will go through every parameter inside the parameter group
        groupBox = Object.keys(parameters[x].params).map((ctx, k) => {
          //length calculates the distance from the edge to the first element
          length = (width - 8) / (Object.keys(parameters[x].params).length * 2);

          //trans x calulates the distance between elements
          transX = 2 * length * k + length;

          //Badge type group parameter
          if (parameters[x].params[ctx].type === 'badge') {
            return (
              <React.Fragment>
                <rect
                  className={styles.statusDisabled}
                  width={40}
                  height={10}
                  rx={5}
                  ry={5}
                  transform={'translate(' + (transX - 20) + ' 3)'}
                />
                <text className={styles.paramVal} transform={'translate(' + transX + ' 9)'} textAnchor="middle">
                  <tspan>{fixedFloat(parameters[x].params[ctx].value, 2) + parameters[x].params[ctx].unit}</tspan>
                </text>
              </React.Fragment>
            );
          }

          //Box type group parameter
          else if (parameters[x].params[ctx].type === 'box') {
            return (
              <React.Fragment>
                <rect
                  className={this.statusTextToStyle(String(parameters[x].params[ctx].state))}
                  width={10}
                  height={10}
                  transform={'translate(' + (transX - 5) + ' 0)'}
                />
                <text className={styles.paramVal} transform={'translate(' + transX + ' 6)'} textAnchor="middle">
                  <tspan>{parameters[x].params[ctx].name}</tspan>
                </text>
                <text className={styles.paramVal} transform={'translate(' + transX + ' 15)'} textAnchor="middle">
                  <tspan>
                    {parameters[x].params[ctx].value
                      ? fixedFloat(parameters[x].params[ctx].value, 2) + ' ' + parameters[x].params[ctx].unit
                      : ''}
                  </tspan>
                </text>
              </React.Fragment>
            );
          }

          //noBox type group parameter
          else {
            return (
              <React.Fragment>
                <text className={styles.paramVal} transform={'translate(' + transX + ' 7)'} textAnchor="middle">
                  <tspan>{parameters[x].params[ctx].name}</tspan>
                </text>
                <text className={styles.paramVal} transform={'translate(' + transX + ' 13)'} textAnchor="middle">
                  <tspan>{fixedFloat(parameters[x].params[ctx].value, 2) + parameters[x].params[ctx].unit}</tspan>
                </text>
              </React.Fragment>
            );
          }
        });

        return (
          <g transform={'translate(0 ' + i + ')'}>
            <text className={styles.paramGroup} transform={'translate(4 0)'} textAnchor="start">
              <tspan>{parameters[x].name}</tspan>
            </text>
            <text className={styles.paramVal} transform={'translate(' + (width - 4) + ' 0)'} textAnchor="end">
              <tspan>
                {(parameters[x].value ? fixedFloat(parameters[x].value, 2) : '') +
                  (parameters[x].unit ? parameters[x].unit : '')}
              </tspan>
            </text>
            <g transform={'translate(4 4)'}>{groupBox}</g>
            <g transform={'translate(4 10)'}>{groupData}</g>
          </g>
        );
      }
    });
  }

  render() {
    const { title, height, temp, width, scale, posX, posY, collapsible } = this.props;
    const hidden = this.state.hidden;
    const isAlarmed = Object.keys(this.props.alarms).some((a) => {
      return this.props.alarms[a].state;
    });
    var mask = this.id;

    return (
      <g
        pointerEvents="all"
        className={styles.device}
        transform-origin={width / 2 + ' ' + (height / 2 + 20)}
        transform={'translate(' + posX + ' ' + posY + ') scale(' + scale + ')'}
      >
        <clipPath id={mask + 'Mask'}>
          <rect width={width} height={height} transform={'translate(0 30)'} />
        </clipPath>

        <g clipPath={'url(#' + mask + 'Mask)'}>
          <g className={styles.insideContent} transform={hidden ? 'translate(0 -' + height + ')' : 'translate(0 0)'}>
            <rect className={styles.container} width={width} height={height} transform={'translate(0 30)'} />

            {this.renderParams()}
          </g>
        </g>

        <g>
          <g>
            <rect className={isAlarmed ? styles.alarmBg : styles.titleBg} width={width} height={12} />
            <text className={styles.title} transform={'translate(6 8)'}>
              <tspan>{title}</tspan>
            </text>
            <text className={styles.title} transform={'translate(' + (width - 6) + ' 8)'} textAnchor="end">
              <tspan>{temp ? fixedFloat(temp, 2) + 'ºC' : ''}</tspan>
            </text>
          </g>
          <g transform={'translate(0 12)'}>
            <rect className={isAlarmed ? styles.alarmRow2 : styles.titleRow2} width={width} height={18} />
            <g transform={'translate(4 4)'}>
              <rect className={this.renderStates('command')} width={10} height={10} />
              <rect className={this.renderStates('working')} width={10} height={10} transform={'translate(12 0)'} />
              <rect className={this.renderStates('unit')} width={10} height={10} transform={'translate(24 0)'} />
              <rect className={this.renderStates('switch')} width={10} height={10} transform={'translate(36 0)'} />
            </g>

            {collapsible ? this.renderArrow() : ''}
          </g>
        </g>
        {this.renderAlarms()}
      </g>
    );
  }
}
