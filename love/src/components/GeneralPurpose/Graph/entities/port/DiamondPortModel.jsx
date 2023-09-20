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

import { PortModel } from '@projectstorm/react-diagrams';
import { AdvancedLinkModel } from '../link';
export const PortModelAlignment = {
  TOP1: 'TOP1',
  TOP2: 'TOP2',
  TOP3: 'TOP3',
  LEFT1: 'LEFT1',
  LEFT2: 'LEFT2',
  LEFT3: 'LEFT3',
  BOTTOM1: 'BOTTOM1',
  BOTTOM2: 'BOTTOM2',
  BOTTOM3: 'BOTTOM3',
  RIGHT1: 'RIGHT1',
  RIGHT2: 'RIGHT2',
  RIGHT3: 'RIGHT3',
};

export class DiamondPortModel extends PortModel {
  constructor(alignment) {
    super({
      type: 'diamond',
      name: alignment,
      alignment: alignment,
    });
  }

  link = (port, color, width) => {
    const link = new AdvancedLinkModel({
      curvyness: 0,
      ...(color !== undefined ? { color } : {}),
      ...(width !== undefined ? { width } : {}),
    });

    link.setSourcePort(this);
    link.setTargetPort(port);
    return link;
  };
}
