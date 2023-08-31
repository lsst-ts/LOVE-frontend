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

import { NodeModel } from '@projectstorm/react-diagrams';
import { DiamondPortModel, PortModelAlignment } from '../port/DiamondPortModel';
export class DiamondNodeModel extends NodeModel {
  constructor(label, nodeId) {
    super({
      type: 'diamond',
    });
    this.label = label;
    this.nodeId = nodeId;
    this.addPort(new DiamondPortModel(PortModelAlignment.TOP1));
    this.addPort(new DiamondPortModel(PortModelAlignment.TOP2));
    this.addPort(new DiamondPortModel(PortModelAlignment.TOP3));
    this.addPort(new DiamondPortModel(PortModelAlignment.LEFT1));
    this.addPort(new DiamondPortModel(PortModelAlignment.LEFT2));
    this.addPort(new DiamondPortModel(PortModelAlignment.LEFT3));
    this.addPort(new DiamondPortModel(PortModelAlignment.BOTTOM1));
    this.addPort(new DiamondPortModel(PortModelAlignment.BOTTOM2));
    this.addPort(new DiamondPortModel(PortModelAlignment.BOTTOM3));
    this.addPort(new DiamondPortModel(PortModelAlignment.RIGHT1));
    this.addPort(new DiamondPortModel(PortModelAlignment.RIGHT2));
    this.addPort(new DiamondPortModel(PortModelAlignment.RIGHT3));
  }

  serialize() {
    return {
      ...super.serialize(),
      nodeId: this.nodeId,
      label: this.label,
    };
  }
}
