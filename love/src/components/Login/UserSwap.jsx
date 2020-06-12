import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../GeneralPurpose/Button/Button';
import Input from '../GeneralPurpose/Input/Input';
import styles from './Login.module.css';
import { tokenSwapStates } from '../../redux/reducers/auth';

export default class UserSwap extends Component {
  static propTypes = {
    /** Current router location */
    location: PropTypes.string,

    /** Token state of the App component */
    token: PropTypes.string,

    /** The state of the token */
    tokenStatus: PropTypes.string,

    /** Function to request token to Manager */
    fetchToken: PropTypes.func,

    /** Function to mark the tokenState as EMPTY */
    emptyToken: PropTypes.func,
  };

  static defaultProps = {
    location: '',
    token: '',
    tokenStatus: tokenSwapStates.REQUIRED,
    fetchToken: undefined,
    emptyToken: undefined,
  };

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.swapUser(this.state.username, this.state.password);
  };

  render() {
    return (
      <div className={styles.userSwap}>
        <div className={styles.panel}>
          <div className={styles.panelHeading}>
            <h3 className={styles.panelTitle}>Enter new credentials</h3>
          </div>
          <div className={styles.panelBody}>
            <form onSubmit={this.handleSubmit}>
              {this.props.tokenStatus === tokenSwapStates.REQUESTED ? (
                <div className={styles.incorrectCredentialsDiv}>
                  <p className={styles.requesting}>Logging in, please wait</p>
                </div>
              ) : null}
              {this.props.tokenStatus === tokenSwapStates.REJECTED ? (
                <div className={styles.incorrectCredentialsDiv}>
                  <p className={styles.incorrectCredentials}>
                    Your username and password did not match, please try again
                  </p>
                </div>
              ) : null}
              {this.props.tokenStatus === tokenSwapStates.ERROR ? (
                <div className={styles.incorrectCredentialsDiv}>
                  <p className={styles.incorrectCredentials}>
                    There was an error communicating with the Server, you have been logged out
                  </p>
                </div>
              ) : null}
              <p className={styles.formEntry}>
                <label htmlFor="id_username" className={styles.label}>
                  Username:
                </label>

                <Input
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
                  Password:
                </label>
                <Input
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
            </form>
          </div>
        </div>
      </div>
    );
  }
}
