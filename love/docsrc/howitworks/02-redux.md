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
