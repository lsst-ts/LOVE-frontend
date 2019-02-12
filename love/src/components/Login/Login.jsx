import React, { Component } from 'react'
import Button from '../Button/Button';
import styles from './Login.module.css'

export default class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    console.log('Handling submit, state: ', this.state);
    event.preventDefault();
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
              {/* {% csrf_token %}
              {% if form.errors %} */}
              <div className={styles.incorrectCredentialsDiv}>
                <p className={styles.incorrectCredentials}>
                  Your username and password didn't match.
                  Please try again.
                </p>
              </div>
              {/* {% endif %} */}
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
            </form>
          </div>
        </div>
      </div>
    )
  }
}
