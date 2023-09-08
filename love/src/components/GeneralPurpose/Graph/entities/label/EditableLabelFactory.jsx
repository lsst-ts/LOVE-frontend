/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile.

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
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { EditableLabelModel } from './EditableLabelModel';
import { EditableLabelWidget } from './EditableLabelWidget';

export class EditableLabelFactory extends AbstractReactFactory {
  constructor() {
    super('editable-label');
  }

  generateModel() {
    return new EditableLabelModel();
  }

  generateReactWidget(event) {
    return <EditableLabelWidget model={event.model} engine={this.engine} />;
  }
}
