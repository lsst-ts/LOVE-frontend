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
