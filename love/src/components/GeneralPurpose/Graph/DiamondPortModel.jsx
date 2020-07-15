import { LinkModel, PortModel, DefaultLinkModel, PortModelAlignment } from '@projectstorm/react-diagrams';

export class DiamondPortModel extends PortModel {
	constructor(alignment) {
		super({
			type: 'diamond',
			name: alignment,
			alignment: alignment
		});
	}

	createLinkModel() {
		return new DefaultLinkModel();
	}
}