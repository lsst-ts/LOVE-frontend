import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import ManagerInterface from '../../Utils';

export default class PrivateRoute extends Component {
  render() {
    const {render, component, rest} = this.props;
    return (
      <Route {...rest} render={ props => {
        // debugger
        const SubComponent = this.props.component;
        return ManagerInterface.getToken() !== null ? (
          (
            SubComponent !== undefined ? (
              <SubComponent {...this.props} />
            ) : (
              this.props.render()
            )
          )
        ) : (
          <Redirect to={{
            pathname: '/login',
            state: { from: props.location }
            }}
          />
        )
      }} />
    )
  }
}
