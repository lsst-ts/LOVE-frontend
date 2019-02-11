import React, { Component } from 'react'
import Button from '../Button/Button';
import styles from './Login.module.css'

export default class Login extends Component {

  handleSubmit() {
    console.log('Going to submit');
  }

  render() {
    return (
      <div className={styles.login}>
        <div className={styles.panel}>
          <div className={styles.panelHeading}>
            <h3 className={styles.panelTitle}>Login</h3>
          </div>
          <div className={styles.panelBody}>
            {/* <form method="post"> */}
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
                  <input type="text" name="username" autofocus="" required="" id="id_username"></input>
                </p>
                <p className={styles.formEntry}>
                  <label htmlFor="id_password"  className={styles.label}>Password</label>
                  <input type="password" name="password" required="" id="id_password"></input>
                </p>
                <Button type="submit" status="primary">Login</Button>
              </form>
            {/* </form> */}
          </div>
        </div>
      </div>
    )
  }
}
