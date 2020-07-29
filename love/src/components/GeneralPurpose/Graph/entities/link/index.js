import createEngine, {
	DiagramModel,
	DefaultNodeModel,
	DefaultPortModel,
	DefaultLinkFactory,
	DefaultLinkModel
} from '@projectstorm/react-diagrams';
import * as React from 'react';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import { AdvancedLinkWidget } from './AdvancedLinkWidget';



export class AdvancedLinkModel extends DefaultLinkModel {
	constructor(options) {
		super({
			type: 'advanced',
			selected: false,
			...options
		});
	}


}

export class AdvancedLinkFactory extends DefaultLinkFactory {
	constructor() {
		super('advanced');
	}

	generateReactWidget(event) {
		console.log('event', event)
		// return super.generateReactWidget(event);
		return <AdvancedLinkWidget link={event.model} diagramEngine={this.engine} />;
	}
	generateModel(event) {
		return new AdvancedLinkModel();
	}
}