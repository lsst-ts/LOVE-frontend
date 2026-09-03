/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile and the Telescope and Site Software team.

Developed for the Vera C. Rubin Observatory Telescope and Site Systems.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React from 'react';
import { connect } from 'react-redux';
import { getTaiToUtc } from 'redux/selectors';
import CreateOLE from './CreateOLE';

export const schema = {
  description:
    'Logging creation component. Includes options for creation of narrative logs, exposure logs, and Jira tickets.',
  defaultSize: [60, 23],
  props: {
    title: {
      type: 'string',
      description: 'Name displayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Logging creation',
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: true,
      default: false,
    },
  },
};

const CreateOLEContainer = (props) => {
  return <CreateOLE taiToUtc={props.taiToUtc} />;
};

const mapStateToProps = (state) => {
  const taiToUtc = getTaiToUtc(state);
  return {
    taiToUtc,
  };
};

export default connect(mapStateToProps)(CreateOLEContainer);
