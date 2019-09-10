![frontend details](/details.svg 'Logo Title Text 1')

## Redux: Global state management
[Redux](https://redux.js.org/) is a state container library that facilitates building more predictable apps by centralizing both the state and its changes. In LOVE, a Redux `store` is used to save all the data that comes from the LOVE-manager, enabling having a single websockets connection for the whole app, avoiding unnecessary data redundancy, while also giving a robust characterization to the authentication process. 

The state is described by a dictionary (Javascript object). Changes to this state performed by `reducers` in response to `actions`. Simply put, `reducers` are functions that take the current state of the `app` (e.g., `ATDome` is in FAULT state) and return the new `sate` given the information contained in an `action` (e.g. update `ATDome` to FAULT state). This is thoroughly described in the [official documentation](https://redux.js.org/introduction/getting-started).


The state in the LOVE-frontend has this structure:


```md
{
    auth: ...,
    ws: ...,
    camera: ...,
    heartbeats: ...,
    summaryData: ...
}
```

Each of its branches (topmost keys) are handled by a separate reducer the `combineReducers` utility of Redux. The following sections describe the purpose of each one.

### `auth` - Authentication

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

### `ws` - Websockets
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

### `camera`- Camera state
```md
{
  raftsDetailedState: 'UNKNOWN',
  imageReadinessDetailedState: 'UNKNOWN',
  calibrationDetailedState: 'UNKNOWN',
  shutterDetailedState: 'UNKNOWN',
  imageSequence: {},
}
```

### `heartbeats`- CSC heartbeats
```md
{
  scripts: [],
  cscs: [],
};
```

### `summaryData` - CSC Summary data
```md
{
  logMessageData: [],
  errorCodeData: [],
}
```
## Container and Presentational components

Apart from the global state stored with Redux, each component handles its own state with specific information for its own elements.
