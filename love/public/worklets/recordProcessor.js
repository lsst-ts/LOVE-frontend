/**
 * A simple bypass node demo.
 *
 * @class RecordProcessor
 * @extends AudioWorkletProcessor
 */

class RecordProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      {
        name: 'isRecording',
        defaultValue: 0,
        minValue: 0,
        maxValue: 1,
      },
    ];
  }

  process(inputs, outputs, parameters) {
    const buffer = [];
    const channel = 0;

    for (let t = 0; t < inputs[0][channel].length; t += 1) {
      if (parameters.isRecording[0] === 1) {
        buffer.push(inputs[0][channel][t]);
      }
    }

    if (buffer.length >= 1) {
      this.port.postMessage({ buffer });
    }

    return true;
  }
}

registerProcessor('recordProcessor', RecordProcessor);
