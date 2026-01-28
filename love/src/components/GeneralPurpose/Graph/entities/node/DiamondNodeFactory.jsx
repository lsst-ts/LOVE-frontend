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

import { DiamondNodeWidget } from './DiamondNodeWidget';
import { DiamondNodeModel } from './DiamondNodeModel';
import * as React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';

export class DiamondNodeFactory extends AbstractReactFactory {
  constructor() {
    super('diamond');
  }

  generateReactWidget(event) {
    return <DiamondNodeWidget engine={this.engine} size={80} node={event.model} />;
  }

  generateModel() {
    return new DiamondNodeModel();
  }
}
