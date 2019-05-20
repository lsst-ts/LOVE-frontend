import { RECEIVE_IMAGE_SEQUENCE_DATA } from './actionTypes';
import { imageStatus } from '../../Config';

export const receiveImageSequenceData = (data) => {
  let imageState, imageData;
  if (data.ATCamera.startIntegration) {
    imageData = data.ATCamera.startIntegration;
    imageState = imageStatus.INTEGRATING;
  }
  if (data.ATCamera.startReadout) {
    imageData = data.ATCamera.startReadout;
    imageState = imageStatus.READING_OUT;
  }
  if (data.ATCamera.endReadout) {
    imageData = data.ATCamera.endReadout;
    imageState = imageStatus.END_READOUT;
  }
  if (data.ATCamera.endOfImageTelemetry) {
    imageData = data.ATCamera.endOfImageTelemetry;
    imageState = imageStatus.END_TELEMETRY;
  }
  return {
    type: RECEIVE_IMAGE_SEQUENCE_DATA,
    data: imageData,
    imageState,
  };
};
