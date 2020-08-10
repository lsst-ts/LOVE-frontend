import { LabelModel } from '@projectstorm/react-diagrams';
import { BaseModelOptions, DeserializeEvent } from '@projectstorm/react-canvas-core';

// export interface EditableLabelOptions extends BaseModelOptions {
// 	value?: string;
// }

export class EditableLabelModel extends LabelModel {
    constructor(options) {
        super({
            ...options,
            type: 'editable-label'
        });
        this.value = options.value || undefined;
    }

    serialize() {
        return {
            ...super.serialize(),
            value: this.value
        };
    }

    deserialize(event) {
        super.deserialize(event);
        this.value = event.data.value;
    }
}
