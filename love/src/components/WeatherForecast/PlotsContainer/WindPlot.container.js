/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile and the Telescope and Site Software team.

Developed for the Vera C. Rubin Observatory Telescope and Site Systems.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

export const schema = {
  description: 'View of Wind Plot of Weather Forecast',
  defaultSize: [62, 18],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Wind Plot Weather Forecast',
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: true,
      default: true,
    },
    xAxisTitle: {
      type: 'string',
      description: 'Title of the horizontal axis of this plot',
      default: 'Time',
      isPrivate: false,
    },
    yAxisTitle: {
      type: 'string',
      description: 'Title of the vertical axis of this plot',
      default: 'Wind',
      isPrivate: false,
    },
    legendPosition: {
      type: 'string',
      description:
        "Whether to display the legend to the right of the plot or at the bottom. One of 'right' or 'bottom'",
      default: 'bottom',
      isPrivate: false,
    },
    temporalXAxisFormat: {
      type: 'string',
      description: "Format the time, for example the daily use '%Y-%m-%d' and hourly '%d, %H:%M'",
      default: '%Y-%m-%d',
      isPrivate: false,
    },
    scaleIndependent: {
      type: 'boolean',
      description: 'When plot contain multi-axis, can set the scale indenpend',
      default: false,
      isPrivate: false,
    },
    scaleDomain: {
      type: 'object',
      description: 'object for domain min and domain max of plot',
      default: {},
      isPrivate: false,
    },
    inputs: {
      type: 'object',
      description: 'list of inputs',
      isPrivate: false,
      default: {
        'Wind speed Min/Max': {
          type: 'area',
          color: '#4662b4',
          shape: 'circle',
          filled: false,
          dash: [8, 4],
          orient: 'right',
          offset: 45,
          values: [
            {
              variable: 'x',
              category: 'telemetry',
              csc: 'WeatherForecast',
              salindex: 0,
              topic: 'dailyTrend',
              item: 'timestamp',
              accessor: '(x) => x',
            },
            {
              variable: 'y',
              category: 'telemetry',
              csc: 'WeatherForecast',
              salindex: 0,
              topic: 'dailyTrend',
              item: 'windspeedMin',
              accessor: '(x) => x',
            },
            {
              variable: 'y2',
              category: 'telemetry',
              csc: 'WeatherForecast',
              salindex: 0,
              topic: 'dailyTrend',
              item: 'windspeedMax',
              accessor: '(x) => x',
            },
          ],
        },
        'Windspeed spread': {
          type: 'spread',
          color: '#4682b4',
          shape: 'circle',
          filled: false,
          dash: [4, 0],
          orient: 'left',
          values: [
            {
              variable: 'x',
              category: 'telemetry',
              csc: 'WeatherForecast',
              salindex: 0,
              topic: 'dailyTrend',
              item: 'timestamp',
              accessor: '(x) => x',
            },
            {
              variable: 'base',
              category: 'telemetry',
              csc: 'WeatherForecast',
              salindex: 0,
              topic: 'dailyTrend',
              item: 'windspeedMean',
              accessor: '(x) => x',
            },
            {
              variable: 'delta',
              category: 'telemetry',
              csc: 'WeatherForecast',
              salindex: 0,
              topic: 'dailyTrend',
              item: 'windspeedSpread',
              accessor: '(x) => x',
            },
          ],
        },
        'Wind direction': {
          type: 'arrow',
          color: '#4682b4',
          shape: 'circle',
          filled: false,
          dash: [4, 0],
          hideAxis: true,
          values: [
            {
              variable: 'x',
              category: 'telemetry',
              csc: 'WeatherForecast',
              salindex: 0,
              topic: 'dailyTrend',
              item: 'timestamp',
              accessor: '(x) => x',
            },
            {
              variable: 'y',
              category: 'telemetry',
              csc: 'WeatherForecast',
              salindex: 0,
              topic: 'dailyTrend',
              item: 'windspeedMean',
              accessor: '(x) => x',
            },
            {
              variable: 'angle',
              category: 'telemetry',
              csc: 'WeatherForecast',
              salindex: 0,
              topic: 'dailyTrend',
              item: 'windDirection',
              accessor: '(x) => x',
            },
          ],
        },
        'Gust Wind': {
          type: 'line',
          color: '#97e54f',
          shape: 'circle',
          filled: false,
          dash: [4, 0],
          orient: 'right',
          values: [
            {
              variable: 'x',
              category: 'telemetry',
              csc: 'WeatherForecast',
              salindex: 0,
              topic: 'dailyTrend',
              item: 'timestamp',
              accessor: '(x) => x',
            },
            {
              variable: 'y',
              category: 'telemetry',
              csc: 'WeatherForecast',
              salindex: 0,
              topic: 'dailyTrend',
              item: 'gustMean',
              accessor: '(x) => x',
            },
          ],
        },
      },
    },
  },
};
