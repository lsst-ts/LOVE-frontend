import { LinkModel, PortModel, DefaultLinkModel } from '@projectstorm/react-diagrams';

export const PortModelAlignment = {
  TOP1: "TOP1",
  TOP2: "TOP2",
  TOP3: "TOP3",
  LEFT1: "LEFT1",
  LEFT2: "LEFT2",
  LEFT3: "LEFT3",
  BOTTOM1: "BOTTOM1",
  BOTTOM2: "BOTTOM2",
  BOTTOM3: "BOTTOM3",
  RIGHT1: "RIGHT1",
  RIGHT2: "RIGHT2",
  RIGHT3: "RIGHT3",
}

export class DiamondPortModel extends PortModel {
  constructor(alignment) {
    super({
      type: 'diamond',
      name: alignment,
      alignment: alignment,
    });
  }

  link = (port) => {
    let link = this.createLinkModel();
    link.setSourcePort(this);
    link.setTargetPort(port);
    return link;
  }

  createLinkModel() {
    return new DefaultLinkModel({curvyness: 0});
  }
}
