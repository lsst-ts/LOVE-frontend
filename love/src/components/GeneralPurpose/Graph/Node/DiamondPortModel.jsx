import { LinkModel, PortModel, DefaultLinkModel, PortModelAlignment } from '@projectstorm/react-diagrams';

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
