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

import React from 'react';
import { connect } from 'react-redux';
import App from './App.jsx';
import { validateToken } from './redux/actions/auth';
import { requestWorkspaces, requestViews } from './redux/actions/uif';
import { getToken } from './redux/selectors';

const AppContainer = ({ requestWorkspaces, requestViews, validateToken, token }) => {
  return (
    <App
      requestWorkspaces={requestWorkspaces}
      requestViews={requestViews}
      validateToken={validateToken}
      token={token}
    />
  );
};

const mapDispatchToProps = (dispatch) => ({
  validateToken: () => dispatch(validateToken()),
  requestWorkspaces: () => dispatch(requestWorkspaces()),
  requestViews: () => dispatch(requestViews()),
});

const mapStateToProps = (state) => {
  return {
    token: getToken(state),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
