# Contributing

When contributing to this repository, please consider the following aspects

## Adding a new Container component

Container components implement the communication with Redux to obtain the available telemetry/event data. Container components:
1. Should be named `component.container.jsx`
2. Should include and export a `schema` variable with the UIF configuration
3. Should provide a `subscriptions` prop with the telemetry/event subscription list, to be displayed in the telemetry/event raw data component