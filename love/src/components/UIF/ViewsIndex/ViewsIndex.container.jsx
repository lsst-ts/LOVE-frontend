/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile Tech Team.

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
import ViewsIndex from './ViewsIndex';
import { getViews } from '../../../redux/selectors/uif';
import { deleteView } from '../../../redux/actions/uif';

const ViewsIndexContainer = ({ ...props }) => {
  return <ViewsIndex {...props} />;
};

const mapStateToProps = (state) => ({
  views: getViews(state),
});

const mapDispatchToProps = (dispatch) => ({
  deleteView: (view) => dispatch(deleteView(view)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewsIndexContainer);
