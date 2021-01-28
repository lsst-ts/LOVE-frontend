import { AbstractModelFactory } from '@projectstorm/react-canvas-core';

export class SimplePortFactory extends AbstractModelFactory {
  constructor(type, cb) {
    super(type);
    this.cb = cb;
  }

  generateModel(event) {
    return this.cb(event.initialConfig);
  }
}
