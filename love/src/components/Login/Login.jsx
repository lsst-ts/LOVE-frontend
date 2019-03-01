import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import Button from '../Button/Button';
import styles from './Login.module.css';
import ManagerInterface from '../../Utils';

export default class Login extends Component {
  static propTypes = {
    showSessionExpired: PropTypes.bool,
    hideSessionExpired: PropTypes.func,
    setTokenState: PropTypes.func,
    location: PropTypes.string,
    token: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      showFailedLogin: false,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
    if (this.state.showFailedLogin) {
      this.setState({ showFailedLogin: false });
    }
    if (this.props.showSessionExpired) {
      this.props.hideSessionExpired();
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    ManagerInterface.requestToken(this.state.username, this.state.password).then((token) => {
      if (token) {
        this.props.setTokenState(token);
      } else {
        this.setState({ showFailedLogin: true });
        this.props.setTokenState(null);
      }
    });
  }

  redirect() {
    return (
      <Redirect
        to={{
          pathname: '/',
          state: { from: this.props.location },
        }}
      />
    );
  }

  render() {
    return (
      <div className={styles.login}>
        <div className={styles.panel}>
          <div className={styles.panelHeading}>
            <h3 className={styles.panelTitle}>Login</h3>
          </div>
          <div className={styles.panelBody}>
            <form onSubmit={this.handleSubmit}>
              {this.state.showFailedLogin ? (
                <div className={styles.incorrectCredentialsDiv}>
                  <p className={styles.incorrectCredentials}>
                    {"Your username and password didn't match. Please try again."}
                  </p>
                </div>
              ) : null}
              {this.props.showSessionExpired ? (
                <div className={styles.incorrectCredentialsDiv}>
                  <p className={styles.incorrectCredentials}>Your session has expired, you have been logged out.</p>
                </div>
              ) : null}
              <p className={styles.formEntry}>
                <label htmlFor="id_username" className={styles.label}>
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  autoFocus=""
                  required=""
                  id="id_username"
                  onChange={this.handleInputChange}
                  value={this.state.username}
                />
              </p>
              <p className={styles.formEntry}>
                <label htmlFor="id_password" className={styles.label}>
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required=""
                  id="id_password"
                  onChange={this.handleInputChange}
                  value={this.state.password}
                />
              </p>
              <Button type="submit" status="primary">
                Login
              </Button>
              {this.props.token !== null ? this.redirect() : ''}
            </form>
          </div>
        </div>
      </div>
    );
  }
}
