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
        "generic": "/gencam",
        "allSky": "/gencam"
    },
    "efd": {
        "defaultEfdInstance": "summit_efd",
        "urlStatus": "https://summit-lsp.lsst.codes/influxdb/health"
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
  - **generic**: cam feed used on the GenericCamera component. This feed will be used if the “generic” value is set on the FEEDKEY configuration parameter of the Generic Camera component. Available values: `["/gencam"]`.
  - **allSky**: cam feed used on the GenericCamera component. This feed will be used if the “allSky” value is set on the FEEDKEY configuration parameter of the Generic Camera component. Available values: `["/gencam"]`.
- **efd**:
  - **defaultEfdInstance**: default efd instance to be queried on the VegaTimeSeriesPlot component. Available values: `["summit_efd", "ncsa_teststand_efd", "ldf_stable_efd", "ldf_int_efd", "base_efd", "tucson_teststand_efd", "test_efd"]`.
  - **urlStatus**: this is the URL where the EFD health status will be queried. For example `"https://summit-lsp.lsst.codes/influxdb/health"`.
- **survey**:
  - **startTime**: this is day/time from official start of the surve. Value must be a timestamp in miliseconds (13-digits number) UTC.