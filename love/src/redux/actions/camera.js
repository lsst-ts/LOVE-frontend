import { RECEIVE_IMAGE_DATA } from './actionTypes';

export const receiveCameraData = (data) => {
  return {
    type: RECEIVE_IMAGE_DATA,
    data: data.ATCamera,
  };
};
