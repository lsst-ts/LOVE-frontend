### Config File configuration

The config files allows loading custom configurations to the LOVE system. These files are uploaded using the LOVE-manager admin platform but the configurations are used to configure components on the LOVE-frontend.

Here is an example file in `json` format:

```json static
{
    "alarms": {
        "minSeveritySound": "mute",
        "minSeverityNotification": "mute"
    },
    "camFeeds": {
        "startrackera": "/startrackera",
        "startrackerb": "/startrackerb"
    },
    "efd": {
        "urlStatus": "https://summit-lsp.lsst.codes/influxdb/health"
    },
    "sal": {
        "urlStatus": "https://summit-lsp.lsst.codes/sasquatch-rest-proxy/brokers",
        "expectedBrokerList": [1, 2, 3]
    },
    "survey": {
      "startTime": 1651609492989,
    }
}
```

### Available configurations
- **alarms**:
  - **minSeveritySound**: minimum level to reproduce sound alarm notifications. If set to “mute” or “muted” no sound is going to be reproduced. Available values: `["mute", "muted", "warning", "serious", "critical"]`.
  - **minSeverityNotification**: minimum level to report alarm notifications. If set to “mute” or “muted” no alarm will be reported. Available values: `["mute", "muted", "warning", "serious", "critical"]`.
- **camFeeds**:
  - **startrackera**: cam feed used on the GenericCamera component. This feed will be used if the “startrackera” value is set on the FEEDKEY configuration parameter of the GenericCamera or GenericCameraControls components. Available values: `["/startrackera"]`.
  - **startrackerb**: cam feed used on the GenericCamera component. This feed will be used if the “startrackerb” value is set on the FEEDKEY configuration parameter of the GenericCamera or GenericCameraControls components. Available values: `["/startrackerb"]`.
- **efd**:
  - **urlStatus**: this is the URL where the EFD health status will be queried. For example `"https://summit-lsp.lsst.codes/influxdb/health"`.
- **sal**:
  - **urlStatus**: this is the URL where the EFD health status will be queried. For example `"https://summit-lsp.lsst.codes/sasquatch-rest-proxy/brokers"`.
  - **expectedBrokerList**: this is the list of brokers that are expected to be connected to the LOVE system. If any of the brokers is not connected, the LOVE system will report an error. For example: `[1, 2, 3]`.
- **survey**:
  - **startTime**: this is day/time from official start of the surve. Value must be a timestamp in miliseconds (13-digits number) UTC.