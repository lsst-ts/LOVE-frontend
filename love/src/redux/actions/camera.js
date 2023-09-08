/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import { RECEIVE_IMAGE_SEQUENCE_DATA, RECEIVE_CAMERA_STATE_DATA, RECEIVE_READOUT_DATA } from './actionTypes';
import { IMAGE_STATES } from 'Constants';

export const receiveImageSequenceData = (data) => {
  let imageState;
  let imageData;
  if (data.startIntegration) {
    imageData = data.startIntegration;
    imageState = IMAGE_STATES.INTEGRATING;
  } else if (data.startReadout) {
    imageData = data.startReadout;
    imageState = IMAGE_STATES.READING_OUT;
  } else if (data.endReadout) {
    imageData = data.endReadout;
    imageState = IMAGE_STATES.END_READOUT;
  } else if (data.endOfImageTelemetry) {
    imageData = data.endOfImageTelemetry;
    imageState = IMAGE_STATES.END_TELEMETRY;
  }
  return {
    type: RECEIVE_IMAGE_SEQUENCE_DATA,
    data: imageData,
    imageState,
  };
};

export const receiveCameraStateData = (data) => {
  let cameraStateData;
  let cameraStateKey;
  if (data.raftsDetailedState) {
    cameraStateData = data.raftsDetailedState;
    cameraStateKey = 'raftsDetailedState';
  } else if (data.shutterDetailedState) {
    cameraStateData = data.shutterDetailedState;
    cameraStateKey = 'shutterDetailedState';
  } else if (data.imageReadinessDetailedState) {
    cameraStateData = data.imageReadinessDetailedState;
    cameraStateKey = 'imageReadinessDetailedState';
  } else if (data.calibrationDetailedState) {
    cameraStateData = data.calibrationDetailedState;
    cameraStateKey = 'calibrationDetailedState';
  }
  return {
    type: RECEIVE_CAMERA_STATE_DATA,
    data: cameraStateData,
    cameraStateKey,
  };
};

export const receiveReadoutData = (data) => {
  return {
    type: RECEIVE_READOUT_DATA,
    data: data.imageReadoutParameters,
  };
};
