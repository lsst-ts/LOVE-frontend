import { LinkModel, PortModel, DefaultLinkModel } from '@projectstorm/react-diagrams';
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
