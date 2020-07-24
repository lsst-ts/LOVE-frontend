import { LinkModel, PortModel, DefaultLinkModel } from '@projectstorm/react-diagrams';

export const PortModelAlignment  = {
  TOP1: "top1",
  TOP2: "top2",
  TOP3: "top3",
  LEFT: "left",
  BOTTOM: "bottom",
  RIGHT: "right"
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
    return new DefaultLinkModel();
  }
}
