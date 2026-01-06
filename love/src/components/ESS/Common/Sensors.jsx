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

import React from 'react';
import PropTypes from 'prop-types';
import Vector from './Vector';
import Sensor from './Sensor';

export function Sensors(props) {
  const { selectedSensor, setSensor, positions, values, speeds, directions, getGradiantColorX } = props;

  const RGBToHex = (rgb) => {
    // Choose correct separator
    let sep = rgb?.indexOf(',') > -1 ? ',' : ' ';
    // Turn "rgb(r,g,b)" into [r,g,b]
    rgb = rgb?.substr(4).split(')')[0].split(sep) ?? [0, 0, 0];

    let r = (+rgb[0]).toString(16),
      g = (+rgb[1]).toString(16),
      b = (+rgb[2]).toString(16);

    if (r.length == 1) r = '0' + r;
    if (g.length == 1) g = '0' + g;
    if (b.length == 1) b = '0' + b;

    const num = parseInt('0x' + r + g + b, 16);
    return num;
  };

  const sensors = positions.map((position, index) => {
    const value = values[index] ?? 0;
    const speed = speeds[index] ?? undefined;
    const direction = directions[index] ?? undefined;
    const rgb = getGradiantColorX && value ? getGradiantColorX(value) ?? 'rgb(255, 255, 255)' : 'rgb(255, 255, 255)';
    const hex = RGBToHex(rgb);
    return {
      position: position,
      id: index + 1,
      color: hex,
      speed: speed,
      direction: direction,
    };
  });

  return (
    <>
      {sensors.map((sensor) => {
        if (sensor.speed === undefined && sensor.direction === undefined) {
          return (
            <Sensor
              key={`sensor-${sensor.id}`}
              sensorId={sensor.id}
              position={sensor.position}
              color={sensor.color}
              setSensor={(id) => {
                setSensor(id);
              }}
              selectedSensor={selectedSensor}
            />
          );
        } else {
          return (
            <Vector
              key={`sensor-${sensor.id}`}
              sensorId={sensor.id}
              start={sensor.position}
              end={{
                x: sensor.position.x + sensor.speed?.x ?? 0,
                y: sensor.position.y + sensor.speed?.y ?? 0,
                z: sensor.position.z + sensor.speed?.z ?? 0,
              }}
              angle={sensor.direction}
              color={sensor.color}
              setSensor={(id) => {
                setSensor(id);
              }}
              selectedSensor={selectedSensor}
            />
          );
        }
      })}
    </>
  );
}

Sensors.propTypes = {
  positions: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
      z: PropTypes.number,
    }),
  ),
  setSensor: PropTypes.func,
  selectedSensor: PropTypes.number,
  values: PropTypes.arrayOf(PropTypes.number),
  speeds: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
      z: PropTypes.number,
    }),
  ),
  directions: PropTypes.arrayOf(PropTypes.number),
  getGradiantColorX: PropTypes.func,
};

Sensors.defaultProps = {
  positions: [],
  setSensor: () => {
    console.log('Sensors default setSensor');
  },
  selectedSensor: undefined,
  values: [],
  speeds: [],
  directions: [],
  getGradiantColorX: () => 0xffff00,
};
