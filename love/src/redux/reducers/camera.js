import { RECEIVE_IMAGE_SEQUENCE_DATA, RECEIVE_CAMERA_STATE_DATA, RECEIVE_READOUT_DATA } from '../actions/actionTypes';
import {cameraStates} from '../../Constants'

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
    case RECEIVE_CAMERA_STATE_DATA: {
      const data = action.data[action.data.length - 1];
      return { ...state, [action.cameraStateKey]: cameraStates[action.cameraStateKey][data.substate.value] };
    }
    case RECEIVE_READOUT_DATA: {
      const imageSequence = {...state.imageSequence};
      const images = {...imageSequence.images};
      action.data.forEach((datum) => {
        const readoutParams = {};
        Object.keys(datum).forEach((key) => {
          readoutParams[key] = datum[key].value;
        })
        if(images[datum.imageName.value])
          images[datum.imageName.value].imageReadoutParameters = readoutParams;
    })
      imageSequence.images = images;
      return { ...state,  imageSequence};
    }
    default:
      return state;
  }
}
