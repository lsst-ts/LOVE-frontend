import { RECEIVE_IMAGE_DATA } from '../actions/actionTypes';
import { imageStatus } from '../../Config';

const initialState = {
  raftsDetailedState: 'UNKNOWN',
  imageReadinessDetailedState: 'UNKNOWN',
  calibrationDetailedState: 'UNKNOWN',
  shutterDetailedState: 'UNKNOWN',
  imageSequence: {},
};

export default function(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_IMAGE_DATA: {
      if (action.data.startIntegration) {
        const eventArray = action.data.startIntegration;
        return eventArray.reduce((state, data) => {
          const imageSequence = { ...state.imageSequence };
          if (imageSequence.name !== data.imageSequenceName.value) {
            imageSequence.images = {};
          }
          imageSequence.name = data.imageSequenceName.value;
          imageSequence.imagesInSequence = data.imagesInSequence.value;
          imageSequence.images[data.imageName.value] = {
            timeStamp: data.timeStamp.value,
            imageIndex: data.imageIndex.value,
            exposureTime: data.exposureTime.value,
            state: imageStatus.INTEGRATING,
          };
          imageSequence.name = data.imageSequenceName.value;
          return { ...state, imageSequence };
        }, state);
      }
    }
    default:
      return state;
  }
}
