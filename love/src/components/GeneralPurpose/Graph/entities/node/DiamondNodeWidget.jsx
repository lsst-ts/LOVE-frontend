/** This file is part of LOVE-frontend.

Developed for Inria Chile Tech Team.

See the COPYRIGHT file at the top-level directory of this distribution
for details of code ownership.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.*/

import * as React from 'react';
import { PortWidget } from '@projectstorm/react-diagrams';
import styles from './DiamondNodeWidget.module.css';
import { PortModelAlignment } from '../port/DiamondPortModel';

const Port = ({ children }) => {
  return <div className={styles.port}>{children}</div>;
};

const StyledPortWidget = ({ left, top, port, engine }) => {
  return (
    <PortWidget
      style={{
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        color: 'white',
        // visibility: 'hidden',
        left,
        top,
      }}
      port={port}
      engine={engine}
    >
      <Port />
    </PortWidget>
  );
};

/**
 * @author Dylan Vorster
 */
export class DiamondNodeWidget extends React.Component {
  render() {
    return (
      <div
        style={{
          position: 'relative',
          width: this.props.size,
          height: this.props.size,
          display: 'flex',
        }}
      >
        <span className={[styles.node, this.props.node.isSelected() ? styles.selected : ''].join(' ')}>
          {this.props.node.label}
        </span>

        {new Array(3).fill('LEFT').map((location, index) => {
          return (
            <StyledPortWidget
              key={index}
              left={0}
              top={this.props.size * (0.5 - (index - 1) * 0.2)}
              port={this.props.node.getPort(PortModelAlignment[`${location}${index + 1}`])}
              engine={this.props.engine}
            />
          );
        })}

        {new Array(3).fill('TOP').map((location, index) => {
          return (
            <StyledPortWidget
              key={index}
              left={this.props.size * (0.5 - (index - 1) * 0.2)}
              top={0}
              port={this.props.node.getPort(PortModelAlignment[`${location}${index + 1}`])}
              engine={this.props.engine}
            />
          );
        })}

        {new Array(3).fill('RIGHT').map((location, index) => {
          return (
            <StyledPortWidget
              key={index}
              left={this.props.size}
              top={this.props.size * (0.5 - (index - 1) * 0.2)}
              port={this.props.node.getPort(PortModelAlignment[`${location}${index + 1}`])}
              engine={this.props.engine}
            />
          );
        })}

        {new Array(3).fill('BOTTOM').map((location, index) => {
          return (
            <StyledPortWidget
              key={index}
              left={this.props.size * (0.5 - (index - 1) * 0.2)}
              top={this.props.size}
              port={this.props.node.getPort(PortModelAlignment[`${location}${index + 1}`])}
              engine={this.props.engine}
            />
          );
        })}
      </div>
    );
  }
}
