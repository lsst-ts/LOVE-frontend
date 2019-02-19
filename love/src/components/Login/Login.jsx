import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Button from '../Button/Button';
import styles from './Login.module.css'
import ManagerInterface from '../../Utils';

export default class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      loginStatus: 'pending'
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (ManagerInterface.getToken() !== null) {
      this.setState({ loginStatus: 'ok' });
    }
  }

  handleInputChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    const url = 'http://' + process.env.REACT_APP_WEBSOCKET_HOST + '/manager/api/get-token/';
    const data = {
      username: this.state.username,
      password: this.state.password
    }
    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(response => response.json())
      .then(response => {
        const token = response['token'];
        if (token !== undefined && token !== null) {
          ManagerInterface.saveToken(token);
          this.setState({ loginStatus: 'ok' });
        } else {
          this.setState({ loginStatus: 'failed' });
        }
      }
    );
    event.preventDefault();
  }

  redirect() {
    return (
      <Redirect to={{
        pathname: '/',
        state: { from: this.props.location }
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
              { this.state.loginStatus === 'failed' ?
                <div className={styles.incorrectCredentialsDiv}>
                  <p className={styles.incorrectCredentials}>
                    Your username and password didn't match.
                    Please try again.
                  </p>
                </div>
              : null }
              <p className={styles.formEntry}>
                <label htmlFor="id_username" className={styles.label}>Username</label>
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
                <label htmlFor="id_password"  className={styles.label}>Password</label>
                <input
                  type="password"
                  name="password"
                  required=""
                  id="id_password"
                  onChange={this.handleInputChange}
                  value={this.state.password}
                />
              </p>
              <Button type="submit" status="primary">Login</Button>
              { this.state.loginStatus === 'ok' ? this.redirect() : ''}
            </form>
          </div>
        </div>
      </div>
    )
  }
}
