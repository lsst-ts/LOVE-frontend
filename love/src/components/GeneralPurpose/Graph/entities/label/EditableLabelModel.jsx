import { LabelModel } from '@projectstorm/react-diagrams';
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
