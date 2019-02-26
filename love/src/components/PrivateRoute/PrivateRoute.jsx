import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import ManagerInterface from '../../Utils';

export default class PrivateRoute extends Component {

  constructor(props) {
    super(props);
  }

  renderSubComponent(props) {
    if (this.props.token) {
      const SubComponent = this.props.component;
      if (SubComponent !== undefined) {
        return <SubComponent {...this.props}/>
      } else {
        return this.props.render();
      }
    }
    return (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
        }}
      />
    )
  }

  render() {
    const {render, component, rest} = this.props;
    return (
      <Route {...rest} render={ props =>
        this.renderSubComponent(props)
      } />
    )
  }
}
