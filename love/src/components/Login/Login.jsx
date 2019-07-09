import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import Button from '../GeneralPurpose/Button/Button';
import styles from './Login.module.css';
import { tokenStates } from '../../redux/reducers/auth';

export default class Login extends Component {
  static propTypes = {
    /** Current router location */
    location: PropTypes.string,

    /** Token state of the App component */
    token: PropTypes.string,

    /** The state of the token */
    tokenStatus: PropTypes.string,

    /** Function to request token to Manager */
    fetchToken: PropTypes.func,
  };

  static defaultProps = {
    location: '',
    token: '',
    tokenStatus: tokenStates.EMPTY,
    fetchToken: undefined,
  };

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      userIsEditing: false,
      userJustSubmitted: false,
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value, userIsEditing: true });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.fetchToken(this.state.username, this.state.password);
    this.setState({ userIsEditing: false, userJustSubmitted: true });
  };

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
              {this.props.tokenStatus === tokenStates.REQUESTED ? (
                <div className={styles.incorrectCredentialsDiv}>
                  <p className={styles.requesting}>
                    Logging in, please wait
                  </p>
                </div>
              ) : null}
              {this.props.tokenStatus === tokenStates.REJECTED ? (
                <div className={styles.incorrectCredentialsDiv}>
                  <p className={styles.incorrectCredentials}>
                    Your username and password did not match, please try again
                  </p>
                </div>
              ) : null}
              {this.props.tokenStatus === tokenStates.ERROR ? (
                <div className={styles.incorrectCredentialsDiv}>
                  <p className={styles.incorrectCredentials}>
                    There was an error communicating with the Server, you have been logged out
                  </p>
                </div>
              ) : null}
              {this.props.tokenStatus === tokenStates.EXPIRED ? (
                <div className={styles.incorrectCredentialsDiv}>
                  <p className={styles.incorrectCredentials}>Your session has expired, you have been logged out</p>
                </div>
              ) : null}
              {this.props.tokenStatus === tokenStates.REMOVED_LOCALLY ? (
                <div className={styles.incorrectCredentialsDiv}>
                  <p className={styles.incorrectCredentials}>
                    There was a problem logging out of the server, please login and logout again to ensure your token is
                    deleted
                  </p>
                </div>
              ) : null}
              {this.props.tokenStatus === tokenStates.REMOVED_REMOTELY ? (
                <div className={styles.incorrectCredentialsDiv}>
                  <p className={styles.requesting}>
                    Logout successful
                  </p>
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
