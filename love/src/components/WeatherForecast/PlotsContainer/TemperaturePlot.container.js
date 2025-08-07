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
  description: 'View of Temperature Plot of Weather Forecast',
  defaultSize: [62, 18],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Temperature Plot Weather Forecast',
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: false,
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
      default: 'Temperature',
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
        Temperature: {
          type: 'line',
          color: '#ff7bb5',
          shape: 'circle',
          filled: false,
          dash: [4, 0],
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
              item: 'temperatureMean',
              accessor: '(x) => x',
            },
          ],
        },
        'Temperature Min/Max': {
          type: 'area',
          color: '#ff7bb5',
          shape: 'circle',
          filled: false,
          dash: [8, 4],
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
              item: 'temperatureMin',
              accessor: '(x) => x',
            },
            {
              variable: 'y2',
              category: 'telemetry',
              csc: 'WeatherForecast',
              salindex: 0,
              topic: 'dailyTrend',
              item: 'temperatureMax',
              accessor: '(x) => x',
            },
          ],
        },
        'Dew Point Temp': {
          type: 'line',
          color: '#e77bff',
          shape: 'circle',
          filled: false,
          dash: [4, 0],
          offset: 100,
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
              item: 'dewPointTemperatureMean',
              accessor: '(x) => x',
            },
          ],
        },
        'Dew Point Temp Min/Max': {
          type: 'area',
          color: '#e77bff',
          shape: 'circle',
          filled: false,
          dash: [4, 2],
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
              item: 'dewPointTemperatureMin',
              accessor: '(x) => x',
            },
            {
              variable: 'y2',
              category: 'telemetry',
              csc: 'WeatherForecast',
              salindex: 0,
              topic: 'dailyTrend',
              item: 'dewPointTemperatureMax',
              accessor: '(x) => x',
            },
          ],
        },
      },
    },
  },
};
