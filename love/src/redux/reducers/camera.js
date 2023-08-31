/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import { RECEIVE_IMAGE_SEQUENCE_DATA, RECEIVE_CAMERA_STATE_DATA, RECEIVE_READOUT_DATA } from '../actions/actionTypes';
import { cameraStates } from 'Config';

const initialState = {
  raftsDetailedState: 'UNKNOWN',
  imageReadinessDetailedState: 'UNKNOWN',
  calibrationDetailedState: 'UNKNOWN',
  shutterDetailedState: 'UNKNOWN',
  imageSequence: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case RECEIVE_IMAGE_SEQUENCE_DATA: {
      const eventArray = action.data;
      return eventArray.reduce((state, data) => {
        const imageSequence = { ...state.imageSequence };
        if (imageSequence?.name !== data?.imageSequenceName?.value || imageSequence.images === undefined) {
          imageSequence.images = {};
        }
        imageSequence.name = data?.imageSequenceName?.value;
        imageSequence.imagesInSequence = data?.imagesInSequence?.value;
        imageSequence.images[data?.imageName?.value] = {
          timeStamp: data.timestampAcquisitionStart?.value,
          imageIndex: data.imageIndex?.value,
          exposureTime: data.exposureTime?.value ?? 0,
          state: action.imageState,
        };
        return { ...state, imageSequence };
      }, state);
    }
    case RECEIVE_CAMERA_STATE_DATA: {
      const data = action.data[action.data.length - 1];
      return { ...state, [action.cameraStateKey]: cameraStates[action.cameraStateKey][data.substate?.value] };
    }
    case RECEIVE_READOUT_DATA: {
      const imageSequence = { ...state.imageSequence };
      const images = { ...imageSequence.images };
      action.data.forEach((datum) => {
        const readoutParams = {};
        Object.keys(datum).forEach((key) => {
          readoutParams[key] = datum[key]?.value;
        });
        if (images[datum.imageName?.value]) images[datum.imageName?.value].imageReadoutParameters = readoutParams;
      });
      imageSequence.images = images;
      return { ...state, imageSequence };
    }
    default:
      return state;
  }
}
