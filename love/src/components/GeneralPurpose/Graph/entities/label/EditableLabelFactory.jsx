import React from 'react';
import { AbstractReactFactory, GenerateWidgetEvent } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams';

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
		console.log('editablefactory')
		return <EditableLabelWidget model={event.model} />;
	}
}
