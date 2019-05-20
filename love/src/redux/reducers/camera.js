import { RECEIVE_IMAGE_SEQUENCE_DATA } from '../actions/actionTypes';

const initialState = {
  raftsDetailedState: 'UNKNOWN',
  imageReadinessDetailedState: 'UNKNOWN',
  calibrationDetailedState: 'UNKNOWN',
  shutterDetailedState: 'UNKNOWN',
  imageSequence: {},
};

export default function(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_IMAGE_SEQUENCE_DATA: {
        const eventArray = action.data;
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
            state: action.imageState,
          };
          imageSequence.name = data.imageSequenceName.value;
          return { ...state, imageSequence };
        }, state);
    }
    default:
      return state;
  }
}
