import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';

export default class PrivateRoute extends Component {
  renderSubComponent(props) {
    if (this.props.token) {
      const SubComponent = this.props.component;
      if (SubComponent !== undefined) {
        return <SubComponent {...this.props} />;
      }
      return this.props.render();
    }
    return (
      <Redirect
        to={{
          pathname: '/login',
          state: { from: props.location },
        }}
      />
    );
  }

  render() {
    const { rest } = this.props;
    return <Route {...rest} render={(props) => this.renderSubComponent(props)} />;
  }
}
