The LOVE-frontend interacts with the rest of the LOVE system through the [LOVE-manager](https://lsst-ts.github.io/LOVE-manager/html/index.html). The LOVE-frontend is a client-side web-application, that is, it is built as static content (javascript, html and css) that is interpreted and executed in the client's web browser. The LOVE-manager instead is a server-side application, that is executed in the LSST Servers, along with the rest of the system.

![frontend details](./Frontend_overview.svg "Overview")

When a user navigates to the LOVE-frontend for the first time, the only available view is the Login. After the user inserts its credentials (username and password), the LOVE-frontend sends the credentials to the LOVE-manager through an HTTP request. The LOVE-manager responds to the request with an access token (if the credentials are valid) or with an error if not.

After the user logs in successfully, the LOVE-frontend validates the token in each new navigation, sending it to the LOVE-manager and waiting for a confirmation before allowing navigation. This way, if the token is expired, the response will state so and the LOVE-frontend will logout the user automatically. After logging-in the LOVE-frontend also establishes a websocket connection with the LOVE-manager

Once the LOVE-frontend renders a component that requires data from the LSST, it sends a subscription message to the LOVE-manager stating to which data (telemetries, events, etc) it needs to subscribe. The LOVE-manager then sends that information to the LOVE-frontend through the same websockets connection.

To see more details of how these messages are structured see the section ["How to use it"](https://lsst-ts.github.io/LOVE-manager/html/modules/how_to_use_it.html) of the documentation of the LOVE-manager



### Redux: Global state management
![frontend details](./details.svg 'Logo Title Text 1')

[Redux](https://redux.js.org/) is a state container library that facilitates building more predictable apps by centralizing both the state and its changes. In LOVE, a Redux `store` is used to save all the data that comes from the LOVE-manager, enabling having a unique websockets connection per client, avoiding unnecessary data redundancy, while also giving a robust characterization to the authentication process.

The state is described by a dictionary (Javascript object). Changes to this state are performed by `reducers` in response to `actions` `dispatched` by React `Components` . What does it mean? Simply put, `reducers` are functions that take the current state of the `app` (e.g., `ATDome` is in FAULT state) and return the new `sate` given the information contained in an `action` (e.g. update `ATDome` to FAULT state); a `dispatch` is a function call that enables a React component to connect to the state and send `actions`. This is thoroughly described in the [official documentation](https://redux.js.org/basics/basic-tutorial).

The structure of LOVE-frontend state is as follows:

```md
{
auth: ...,
ws: ...,
camera: ...,
heartbeats: ...,
summaryData: ...
}
```

Each of its branches (topmost keys) are handled by a separate reducer through the `combineReducers` utility of Redux.

---

### Container and presentational components

Apart from the global state stored in Redux, each component handles its own state with specific information for its own elements. This leads to the distinction of `Container` components and `Presentational` components. Container components are meant to wrap Presentational components to abstract them from all the logic of reading the global state. Containers can read the Redux state through the usage of `selectors`, which are functions (located at `src/redux/selectors`) that receive a copy of the state object and return some data for which they are designed. Selectors are meant to be reused across components so if the state tree were to change, changing the selector should be sufficient to recover the functionality of all related components. Changes to the state are made by `dispatching` `actions`. This is wrapped in the Container component with callbacks tha are passed to Presentational components. The Presentational components use this and other input `props`, and possibly internal state variables to render the component to the users on their screens.

---

### State tree

##### `auth` - Authentication

```md
{
username: '',
token: null,
status: tokenStates.EMPTY,
permissions: {
cmd_exec: false,
}
}
```

- `username`: Input at login screen.
- `token`: Authentication token that is validated by the LOVE-manager. It can come from a LOVE-manager HTTP response or browser's `localstorage`, if the user was logged in succesfuly before.
- `status`: State of the currently stored token. The `token` state can go from `EMPTY` to `RECEIVED` and fail for several reasons such as expiration (after some time), rejection (if password changed for example), etc.
- `permissions`: Dictionary with flags about the permissions of the logged in user. Right now it is useful to decide if command-related interfaces should be rendered or not, or if should be rendered differently.

##### `ws` - Websockets

```md
{
connectionState: connectionStates.CLOSED,
subscriptions: [],
lastSALCommand: {
status: SALCommandStatus.EMPTY,
cmd: '',
params: {},
component: '',
salindex: 0
},
}
```

- `connectionState`: Describes the status of the websocket connection, which can be `OPENING`, `OPEN`, `CLOSED` and `ERROR`.
- `subscriptions`: List with the data of the last received telemetries and events. Each element has this structure:

```md
{
groupName,
confirmationMessage,
data // optional
}
```

where `groupName` is name of the group of the subscription (e.g., `event-ScriptQueue-1-summaryState`); `confirmationMessage` is a string returned by the LOVE-manager confirming the subscription to the group; and `data` is a dictionary containing all the parameters of the group message.

##### `camera`- Camera state

```md
{
raftsDetailedState: 'UNKNOWN',
imageReadinessDetailedState: 'UNKNOWN',
calibrationDetailedState: 'UNKNOWN',
shutterDetailedState: 'UNKNOWN',
imageSequence: {},
}
```

- `raftsDetailedState`: Read directly from the `event-ATCamera-1-raftsDetailedState` group.
- `imageReadinessDetailedState`: Read directly from the `event-ATCamera-1-imageReadinessDetailedState` group.
- `calibrationDetailedState`: Read directly from the `event-ATCamera-1-calibrationDetailedState` group.
- `shutterDetailedState`: Read directly from the `event-ATCamera-1-shutterDetailedState` group.
- `imageSequence`: This is a placeholder for the images being processed, indexed in a dictionary by their name and contain information of the following groups, which refer to the different stages of the image acquisition:

```md
event-ATCamera-1-startIntegration
event-ATCamera-1-startReadout
event-ATCamera-1-endReadout
event-ATCamera-1-endOfImageTelemetry
event-ATCamera-1-imageReadoutParameters
```

This data is colected after being added to the `ws.subscriptions` state because the information comes in separate groups and otherwise only the latest CSC info would be available.

##### `heartbeats`- CSC heartbeats

```md
{
scripts: [],
cscs: [],
};
```

- `scripts`: A list with heartbeat info of each script in the ScriptQueue. Read from the `event-ScriptHeartbeats-{salindex}-stream`, with `salindex` refers to the ScriptQueue component where those scripts were loaded.
- `cscs`: A list with heartbeat info of every CSC. Read from the `event-Heartbeats-0-stream` group.

This data is colected after being added to the `ws.subscriptions` state because the information comes in separate groups and otherwise only the latest CSC info would be available.

##### `summaryData` - CSC Summary data

```md
logMessageData: [],
errorCodeData: [],
}
```

- `logMessageData`: A list with all messages received from the `logMessage` event of each CSC since the frontend started.
- `errorCodeData`: A list with all messages received from the `errorCode` event of each CSC since the frontend started.

This data is colected after being added to the `ws.subscriptions` state so the history of the `logMessage` and `errorCode` events is available to components such as the `CSCSummary`.

---

### Token, websocket connection and groups subscriptions

The token, websocket and subscriptions handling is summarized in the following graphs:

![redux state machine graph](./redux-auth.svg 'Redux token authentication state machine graph')

##### Token handling

- Token starts with status EMPTY
- When the application initiates, it tries to read the token from the local storage (status is READ_FROM_LOCAL_STORAGE)
- If there is a token it is validated (status REQUESTED)
- If there is no token it remains in EMPTY
- Once the user logs in, the status is REQUESTED
- Once the response is ok (200), the status changes to RECEIVED and the websockets connection is opened
- If the response fails, it goes to either ERROR, REJECTED or EXPIRED, depending on response codes. In any case the websocket connection is closed
- When a user logs out, then the status is REMOVE_REQUESTED
- When the response arrives and it was deleted (204) the status is REMOVED_REMOTELY, otherwise REMOVE_ERROR

##### Token swap

- Token swap starts with (swap) status SWAP_RECEIVED
- Once the user opens the swap login panel, the swap status changes to SWAP_REQUIRED
- If the user cancels the swap login panel, the swap status changes back to SWAP_RECEIVED
- Once the user attempts a user swap, the swap status is SWAP_REQUESTED
- Once the response is ok (200), the status changes to SWAP_RECEIVED and the websockets connection is closed and then reopened
- If the response fails, it goes to either SWAP_ERROR or SWAP_REJECTED, depending on response codes. The websocket connection is not closed since the previous token is still in use

![redux state machine graph](./redux-ws-connection.svg 'Redux ws connection and subscriptions state machine graph')

##### Websocket connection handling

- Connection status starts as CLOSED
- When token is received/validated we dispatch an `openWebsocketConnection` action
- When connection is opened, then the connection status is OPENING, and when ready it is OPEN
- On most errors or close, the connection status is RETRYING
- When status is RETRYING an interval function runs every 3 seconds, attempting to reconnect
- When connection is gracefully closed, then the status is CLOSED

##### Subscriptions are decoupled from connection

- Each subscription has a status: PENDING, REQUESTING, SUBSCRIBED or UNSUBSCRIBING
- Components add subscriptions dispatching `addGroupSubnscription` action (status PENDING)
- If connection is opened, then the subscriptions are requested automatically (status REQUESTING)
- Also when the connection is opened, then all PENDING subscriptions are requested
- When confirmation is received, then they change to status SUBSCRIBED
- When unsubscribing, then they change to UNSUBSCRIBING
- When confirmation of unsubscription arrive, then the subscription changes to PENDING
- When connection is closed, then all subscriptions are PENDING. This way, when we open the connection again, we will be able to re-subscribe
- Also, subscription are reset (changed to PENDING and re-requested) every 5 minutes

---

### ScriptQueue scripts schema validation

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

### ViewEditor responsive layout simulator

The `ViewEditor` located at `love/src/components/UIF/ViewEditor/ViewEditor.jsx` enables a user to edit the size and position of a `View`. On top of these features, in order to support the user to be aware of how other users will see its currently created view on different devices, a responsive layout simulator was implemented. This simulator enables the user to select a device size (such as `Laptop`, `4K`, `Mobile S`, among others) and see how the components are re-organized accordingly on screen.

The behavior of this responsive layout with respect to other features is described with the following finite state machine. Such features as editing components (resizing and moving them), undoing changes and changing the selected device size are included as events and some but not all of the states involve particular side-effects. This state machine is represented by the `ViewEditor.state.responsiveLayoutState` variable and many are described in terms of the number of columns in the layout. The number of columns by device is defined [here](https://github.com/lsst-ts/LOVE-frontend/blob/47626fc8ac5ef5d71e7e49a32991d59fdd3746a5/love/src/components/UIF/CustomView.jsx#L25-L34).

The most important issue that motivates the complexity of this representation is that smaller devices may handle the content with a smaller number of columns, and thus, changes to the layout may be irreversible if the user is not properly aware. In summary, moving to a smaller device will reorganize content on the configured columns, possibly moving some of then to different rows; moving to a bigger device will attempt to re-scale the content to fit the same pixel-area in the new layout.

![State machine of the responsive layout simulator](./responsive-grid-state-machine.svg 'State machine of the responsive layout simulator')

- `COLS_NOT_CHANGED`

  - Initial state. All kinds of editions are allowed normally.
  - Any change to a smaller device will move it to the `COLS_DECREASED` state.
  - Any change to a BIGGER device will move it to the `COLS_INCREASED` state.
  - Any edition will keep the state unchaged.

- `COLS_DECREASED`

  - Represents a state where the user just moved to a smaller device with a smaller number of columns.
  - Any change to a smaller device will keep it in the `COLS_DECREASED` state.
  - Any change to a BIGGER device will move it to the `COLS_INCREASED` state.
  - Any edition will move it to the `EDIT_NEEDS_CONFIRMATION` and will immediately apply changes, saving them in the `uif` `undo/redo` history to be used later.

- `EDIT_NEEDS_CONFIRMATION`

  - This state prompts a confirmation dialog (modal) to ensure the user is aware of the consequences of the current changes.
  - If the user confirms the changes then it goes back to the `COLS_NOT_CHANGED` state.
  - If the user cancels the changes then it moves to the `EDIT_CANCELED` and triggers an `undo` action of the `uif` redux branch, undoing the changes.
  - Since it is displayed in a Modal changing device size and editing is disabled.

- `EDIT_CANCELED`

  - This is state disables the `redo` button of the UIF toolbar to prevent applying canceled changes that may generate inconsistencies.
  - Changing to a smaller device keeps it in the current state.
  - Changing to a bigger device moves the state to `COLS_INCREASED`.
  - Undoing moves the state to `UNDO_NEEDS_CONFIRMATION`.
  - Editing the view changes the state to `EDIT_NEEDS_CONFIRMATION`.

- `UNDO_NEEDS_CONFIRMATION`

  - Similar to `EDIT_NEEDS_CONFIRMATION`, this state prompts a confirmation dialog modal to prevent unwanted changes from clicking the `undo` button.
  - If the user confirms the changes then the `undo` action is triggered and sends the state back to the `COLS_NOT_CHANGED` state.
  - If the user cancels the changes then it moves to the `EDIT_CANCELED` and triggers an `undo` action of the `uif` redux branch, undoing the changes.

- `COLS_INCREASED`
  - Represents the state when the content is rendered in a bigger device than the one used on the last edition.
  - Components rendered on this state will be rescaled in width and horizontal position if two conditions are met: 1) the number of columns of the original device is smaller than a given threshold; 2) the number of the current device is greater than a given threshold. This threshold is defined [here](https://github.com/lsst-ts/LOVE-frontend/blob/47626fc8ac5ef5d71e7e49a32991d59fdd3746a5/love/src/components/UIF/CustomView.jsx#L36) and this behavior handled in the same `CustomView`.
  - This behavior is also dependant on the `container` to have the proper number of `.cols`.
  - Editing moves the state to `COLS_NOT_CHANGED`.

### Server Time sync and calculation

The LOVE-frontend `Clock` and `TimeDisplay` components show server time rather than client time. This is in order to ensure no particular time settings on the client side will change the displayed time.

#### Server time saved in Redux

In order to do this, server time is obtained everytime the authentication token is requested or validated (e.g. in each browser navigation or refresh) in the LOVE-manager. The information is then stored in the Redux store as follows:

```js static
timeData: {
  request_time: <local UTC time in seconds when the request was made>,
  receive_time: <local UTC time in seconds when the response arrived>,
  server_time: {
    utc: <utc time in seconds>,
    tai: <tai time in seconds>,
    mjd: <modified julian date in days>,
    sidereal_summit: <Local (summit) Apparent Sidereal Time in hourangles>,
    sidereal_greenwich: <Greenwich Apparent Sidereal Time (GAST)  in hourangles>,
    tai_to_utc: <difference in seconds between TAI and UTC>
  }
}
```

##### Syncing calculations

The `Clock` and `TimeDisplay` components obtain the server time data from Redux update the clock every second. The calculation is as follows.

First the definitions:
| Time | Name |
|-------------------|-----------------------------------------|
| `t_server` | current UTC server time in seconds |
| `t_local` | current UTC local time in seconds |
| `t_server_0` | last UTC server time saved in seconds |
| `t_local_0` | last UTC local time saved in seconds |
| `t_mjd` | current Modified Julian Date in days |
| `t_mjd_0` | last Modified Julian Date saved in days |
| `t_sidereal` | current Sidereal Time in hourangles |
| `t_sidereal_0` | last Sidereal Time saved in hourangles |

```py
# Server values
t_local_0  = (timeData.receive_time + timeData.request_time) / 2
t_server_0 = timeData.server_time.utc

# Calculated current values
t_server   = t_server_0   + (t_local - t_local_0)
t_mjd      = t_mjd_0      + (t_local - t_local_0) / (3600 * 24)
t_sidereal = t_sidereal_0 + (t_local - t_local_0) * 1.00273788 / 3600
```

##### Calculation rationale

We assume there will always be a lag between request and response, and the server time is calculated between request and response time. Hence, assuming server and local time are in sync we have:

```static
timeData.receive_time < timeData.server_time.utc < timeData.request_time
```

We assume the server_time was calculated at the midpoint between request and receive times, so we assume:

```static
t_local_0  = (timeData.receive_time + timeData.request_time) / 2
```

Now, if we consider that server and local times could be shifted by a constant offset `C`, we have that for every server time `t_server` its corresponding local time `t_local` should be:

```static
t_server = t_local + C
```

Hence, if we consider any 2 points in time (`t_local`, `t_server`) and (`t_local_0`, `t_server_0`):

```static
t_server - t_server_0 = (t_local + C) - (t_local_0 + C) = t_local - t_local_0
t_server = t_server_0 + t_local - t_local_0
```

Similarly, if the server time is in a different scale (.e.g sidereal time), and we know we can transform local time scale (e.g. UTC) time to server time scale with a function `f` (plus the constant offset `C`), we have:

```static
t_server - t_server_0 = (f(t_local) + C) - (f(t_local_0) + C) = f(t_local) - f(t_local_0)
t_server = t_server_0 + f(t_local) - f(t_local_0)
```

Now if `f` is a linear function, like in Sidereal Time and MJD cases:

```static
t_server = t_server_0 + f(t_local) - f(t_local_0) = t_server_0 + f(t_local - t_local_0)
t_server = t_server_0 + f(t_local - t_local_0)
```
