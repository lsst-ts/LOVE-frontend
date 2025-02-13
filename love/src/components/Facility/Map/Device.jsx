/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React, { Component } from 'react';
import { defaultNumberFormatter } from 'Utils';
import lodash from 'lodash';
import PropTypes from 'prop-types';
import styles from './Device.module.css';

export default class Device extends Component {
  constructor(props) {
    super(props);
    this.id = lodash.uniqueId('Mask-');
    this.state = {
      hidden: true,
    };
  }

  static propTypes = {
    /** Device Title */
    title: PropTypes.string,
    /** Device Header Temperature if any */
    temp: PropTypes.node,

    /** Device Height, Width and Scale */
    height: PropTypes.number,
    width: PropTypes.number,
    scale: PropTypes.number,

    /** Device position in X and Y */
    posX: PropTypes.number,
    posY: PropTypes.number,

    /** Is device collapsible, does it have detailed information */
    collapsible: PropTypes.bool,

    /** Device alarms and collapsible parameters */
    alarms: PropTypes.object,
    parameters: PropTypes.object,

    /** Device Header states: Command, Working, Unit and Switch */
    states: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.node, PropTypes.bool])),
  };

  static defaultProps = {
    title: 'Device Name',
    temp: null,

    height: 200,
    width: 200,
    scale: 0.4,

    posX: 0,
    posY: 0,

    collapsible: false,

    alarms: {},
    parameters: {},

    states: {
      command: null,
      working: null,
      unit: null,
      switch: null,
    },
  };

  toggle() {
    this.setState((prevSate) => ({
      hidden: !prevSate.hidden,
    }));
  }

  stateToStyle(state) {
    const { states } = this.props;
    switch (states[state]) {
      case true:
        return `${styles.statusOk}`;
      case false:
        return `${styles.statusAlert}`;
      default:
        return `${styles.statusNull}`;
    }
  }

  statusToBackgroundStyle(status) {
    switch (status) {
      case 'true':
      case 'Initialized':
      case 'Powered On':
      case 'Nominal':
        return `${styles.bgStatusOk}`;
      case 'false':
      case 'Alarm':
      case 'Powered Off':
        return `${styles.bgStatusAlert}`;
      case 'Shutting Down':
      case 'Powering On':
      case 'Powering Off':
      case 'Warning':
      case 'Max Speed':
      case 'Min Speed':
        return `${styles.bgStatusWarning}`;
      case 'Shut Off':
        return `${styles.bgStatusDisabled}`;
      default:
        return `${styles.bgStatusNull}`;
    }
  }

  statusToTextStyle(status) {
    switch (status) {
      case 'true':
      case 'Initialized':
      case 'Powered On':
      case 'Nominal':
        return `${styles.statusOk}`;
      case 'false':
      case 'Alarm':
      case 'Powered Off':
        return `${styles.statusAlert}`;
      case 'Shutting Down':
      case 'Powering On':
      case 'Powering Off':
      case 'Warning':
      case 'Max Speed':
      case 'Min Speed':
        return `${styles.statusWarning}`;
      case 'Shut Off':
        return `${styles.statusDisabled}`;
      default:
        return `${styles.statusNull}`;
    }
  }

  renderArrow() {
    const { width } = this.props;
    const { hidden } = this.state;
    return (
      <g
        // id={this.id}
        transform={'translate(' + (width - 14) + ' 4)'}
        pointerEvents="all"
        onClick={(e) => this.toggle()}
      >
        <rect className={styles.arrowBg} width={10} height={10} />
        <polyline
          className={styles.arrow}
          points=".35 .35 4.35 4.35 8.35 .35"
          transform={'translate(0.5 3) rotate(' + (hidden ? -90 : 0) + ')'}
          transform-origin="4 2"
        />
      </g>
    );
  }

  renderAlarms() {
    const { height, width, alarms } = this.props;
    const { hidden } = this.state;

    const alarmsKeys = Object.keys(alarms);
    const rowLength = Math.round(width / 42 - 1);

    let transX, transY, currentRow, currentCol, currentAlarm;
    transX = 0;
    transY = 0;
    currentAlarm = 0;

    return alarmsKeys.map((x, k) => {
      if (alarms[x].state) {
        currentAlarm++;
        currentRow = Math.ceil(currentAlarm / rowLength);
        currentCol = currentAlarm % currentRow;
        transX = 42 * (currentAlarm - rowLength * (currentRow - 1)) - 42;

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

  renderParams() {
    const { width, parameters } = this.props;
    const parametersKeys = Object.keys(parameters);

    const gutter = 4;
    const rowHeight = 10;

    let groupBox, groupData, length, transX;

    //Vars i and j are used to translate parameters down each time a new parameter is rendered.
    let i = 0;
    let j = 38;

    //////////////////////////////////////////////////////////////////////////////
    //
    //  *** Devices Parameter Types ***
    //
    //  title  = Displays a row text with no data
    //  status = Styles as Summary States
    //  single = Displayed as a single row.
    //           They have a name and a value which may have a unit.
    //           Value must be a number!
    //  test   = Like single but its text and has no unit.
    //  group  = if it's none of the above, and has parameters it's a group.
    //           Parameters inside a group are listed horizontally, not vertically
    //  badge  = styled inside a badge
    //  box    = styled inside a box that might have a status color
    //  noBox  = styles like box, but without the box
    //
    //////////////////////////////////////////////////////////////////////////////

    return parametersKeys.map((x) => {
      //Title Parameters just serve as a title for following single or status parameters
      if (parameters[x].type === 'title') {
        i = j;
        j = j + rowHeight;
        return (
          <g transform={'translate(0 ' + i + ')'}>
            <text className={styles.paramGroup} transform={'translate(' + gutter + ' 0)'} textAnchor="start">
              <tspan>{parameters[x].name}</tspan>
            </text>
          </g>
        );
      }

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
              className={this.statusToBackgroundStyle(String(parameters[x].value))}
              width={30}
              height={8}
              rx={5}
              ry={5}
              transform={'translate(' + (width - (30 + gutter)) + ' ' + -5 + ')'}
            />

            <text
              className={this.statusToTextStyle(String(parameters[x].value))}
              transform={'translate(' + (width - 19) + ' 0)'}
              textAnchor="middle"
            >
              <tspan>{parameters[x].value + (parameters[x].unit ? parameters[x].unit : '')}</tspan>
            </text>
          </g>
        );
      }

      //Single Parameters are those displayed as a single row. They have a name and a value which may have a unit.
      if (parameters[x].type === 'single') {
        i = j;
        j = j + rowHeight;
        return (
          <g transform={'translate(0 ' + i + ')'}>
            <text className={styles.param} transform={'translate(4 0)'} textAnchor="start">
              <tspan>{parameters[x].name}</tspan>
            </text>
            <text className={styles.paramVal} transform={'translate(' + (width - 19) + ' 0)'} textAnchor="middle">
              <tspan>
                {defaultNumberFormatter(parameters[x].value, 2) + (parameters[x].unit ? parameters[x].unit : '')}
              </tspan>
            </text>
          </g>
        );
      }

      if (parameters[x].type === 'text') {
        i = j;
        j = j + rowHeight;
        return (
          <g transform={'translate(0 ' + i + ')'}>
            <text className={styles.param} transform={'translate(4 0)'} textAnchor="start">
              <tspan>{parameters[x].name}</tspan>
            </text>
            <text className={styles.paramVal} transform={'translate(' + (width - 19) + ' 0)'} textAnchor="middle">
              <tspan>{parameters[x].value}</tspan>
            </text>
          </g>
        );
      }

      //Group Parameters are those that are grouped under a specific Title.
      //This title might have a value and units as well.
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
            <>
              <rect
                className={styles.badge}
                width={40}
                height={10}
                rx={5}
                ry={5}
                transform={'translate(' + (transX - 20) + ' 3)'}
              />
              <text className={styles.paramVal} transform={'translate(' + transX + ' 9)'} textAnchor="middle">
                <tspan>
                  {defaultNumberFormatter(parameters[x].params[ctx].value, 2) + parameters[x].params[ctx].unit}
                </tspan>
              </text>
            </>
          );
        }

        //Box type group parameter
        else if (parameters[x].params[ctx].type === 'box') {
          return (
            <>
              <rect
                className={this.statusToTextStyle(String(parameters[x].params[ctx].state))}
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
                    ? defaultNumberFormatter(parameters[x].params[ctx].value, 2) + ' ' + parameters[x].params[ctx].unit
                    : ''}
                </tspan>
              </text>
            </>
          );
        }

        //noBox type group parameter
        else {
          return (
            <>
              <text className={styles.paramVal} transform={'translate(' + transX + ' 7)'} textAnchor="middle">
                <tspan>{parameters[x].params[ctx].name}</tspan>
              </text>
              <text className={styles.paramVal} transform={'translate(' + transX + ' 13)'} textAnchor="middle">
                <tspan>
                  {defaultNumberFormatter(parameters[x].params[ctx].value, 2) + parameters[x].params[ctx].unit}
                </tspan>
              </text>
            </>
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
              {(parameters[x].value ? defaultNumberFormatter(parameters[x].value, 2) : '') +
                (parameters[x].unit ? parameters[x].unit : '')}
            </tspan>
          </text>
          <g transform={'translate(4 4)'}>{groupBox}</g>
          <g transform={'translate(4 10)'}>{groupData}</g>
        </g>
      );
    });
  }

  render() {
    const { title, height, temp, width, scale, posX, posY, collapsible, alarms } = this.props;
    const { hidden } = this.state;

    const isAlarmed = Object.keys(alarms).some((alarm) => {
      return alarms[alarm].state;
    });

    return (
      <g
        pointerEvents="all"
        className={styles.device}
        transform-origin={width / 2 + ' ' + (height / 2 + 20)}
        transform={'translate(' + posX + ' ' + posY + ') scale(' + scale + ')'}
      >
        <clipPath id={this.id}>
          <rect width={width} height={height} transform={'translate(0 30)'} />
        </clipPath>

        <g clipPath={'url(#' + this.id + ')'}>
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
              <tspan>{temp ? defaultNumberFormatter(temp, 2) + '°C' : ''}</tspan>
            </text>
          </g>
          <g transform={'translate(0 12)'}>
            <rect className={isAlarmed ? styles.alarmRow2 : styles.titleRow2} width={width} height={18} />
            <g transform={'translate(4 4)'}>
              <rect className={this.stateToStyle('command')} width={10} height={10} />
              <rect className={this.stateToStyle('working')} width={10} height={10} transform={'translate(12 0)'} />
              <rect className={this.stateToStyle('unit')} width={10} height={10} transform={'translate(24 0)'} />
              <rect className={this.stateToStyle('switch')} width={10} height={10} transform={'translate(36 0)'} />
            </g>

            {collapsible ? this.renderArrow() : ''}
          </g>
        </g>
        {this.renderAlarms()}
      </g>
    );
  }
}
