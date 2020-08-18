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
		return <EditableLabelWidget model={event.model} engine={this.engine}/>;
	}
}
