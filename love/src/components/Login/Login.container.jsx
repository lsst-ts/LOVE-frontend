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

import { connect } from 'react-redux';
import { getToken, getTokenStatus } from 'redux/selectors';
import { fetchToken, emptyToken } from 'redux/actions/auth';
import Login from './Login';

const LoginContainer = ({ token, tokenStatus, fetchToken, emptyToken }) => {
  return <Login token={token} tokenStatus={tokenStatus} fetchToken={fetchToken} emptyToken={emptyToken} />;
};

const mapStateToProps = (state) => {
  const tokenStatus = getTokenStatus(state);
  const token = getToken(state);
  return {
    token: token,
    tokenStatus: tokenStatus,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchToken: (username, password) => dispatch(fetchToken(username, password)),
  emptyToken: () => dispatch(emptyToken),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
