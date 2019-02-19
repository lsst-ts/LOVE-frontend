import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import ManagerInterface from '../../Utils';

export default class PrivateRoute extends Component {

  constructor(props) {
    super(props);
    this.state = {
      routingState: 'loading'
    };
  }

  componentDidMount() {
    this.updateState();
  }

  componentDidUpdate() {
    this.updateState();
  }

  updateState() {
    ManagerInterface.validateToken().then(response => {
      if (response === true && this.state.routingState !== 'render') {
        this.setState({ routingState: 'render' });
      } else if (response === false && this.state.routingState !== 'redirect') {
        this.setState({ routingState: 'redirect' });
      }
    });
  }

  renderSubComponent(props) {
    if (this.state.routingState === 'loading') {
      return (
        <h1>Loading...</h1>
      )
    }
    if (this.state.routingState === 'render') {
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
