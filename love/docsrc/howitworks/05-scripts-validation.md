### ScriptQueue scripts config validation

Validation is performed in the LOVE-manager (instead of the frontend) asynchronously and should respond to config changes by the user.

The behavior can be represented by this (pseudo) state machine diagram:

![redux script validation](./redux-script-validation.svg 'Script validation state machine')

- `EMPTY`
  - Is the initial state, assuming there is no schema yet and no text has been written
  - Writing will keep the machine in this state
  - Can sends scripts with any config regardless of config
  - Once the schema arrives it transitions to `WITH_SCHEMA`
- `WITH_SCHEMA`
  - Writing (`keypress` event) witll transition to `VALIDATING` and send a request to the server to validate the current text.
- `VALIDATING`
  - Can't send scripts
  - On `keypress` moves to `NEED_REVALIDATION` (notice that no server response has been received yet).
  - If there is a server response:
    - If response is not 200, goes to `SERVER_ERROR`
    - If `response.json().error` exists it goes to `ERROR`
    - if `response.json().output` exists it goes to `VALID`
- `NEEDS_REVALIDATION`

  - This states catches `keypress` events so only one request is sent at a time and, once received, new changes are validated too.
  - Can't send scripts here neither
  - On `keypress` it stays on `NEEDS_REVALIDATION`

- `SERVER_ERROR`

  - An error message is shown
  - Can send scripts because the script can be valid or invalid, now is the user's responsibility.
  - On `keypress` goes back to validating

- `ERROR`

  - Can't send scripts
  - Error message is shown
  - On `keypress` goes back to validating

- `VALID`
  - Can send scripts
  - On `keypress` goes back to validating

