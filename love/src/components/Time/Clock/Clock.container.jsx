import React from 'react';
import { connect } from 'react-redux';
import { getClock } from '../../../redux/selectors';
import Clock from './Clock';

export const schema = {
  description: `Component displaying the clocks with relevant times, such as UTC, TAI, summit time, etc`,
  defaultSize: [63, 17],
  props: {
    titleBar: {
      type: 'boolean',
      description: 'Whether to display the title bar',
      isPrivate: false,
      default: true,
    },
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Clock',
    },
    margin: {
      type: 'boolean',
      description: 'Whether to display component with a margin',
      isPrivate: false,
      default: true,
    },
    name: {
      type: 'string',
      description: 'Optional name to display above the clock',
      isPrivate: false,
      default: null,
    },
    hideAnalog: {
      type: 'boolean',
      description: 'Flag to hide the nalog clock',
      isPrivate: false,
      default: false,
    },
    hideDate: {
      type: 'boolean',
      description: 'Flag to hide the date',
      isPrivate: false,
      default: false,
    },
    hideOffset: {
      type: 'boolean',
      description: 'Flag to hide the UTC offset displayed beside the name',
      isPrivate: false,
      default: false,
    },
    locale: {
      type: 'string',
      description:
        `Locale string used to configure how to display the UTC Offset.
        'en-GB' by default (so it is displayed as GMT always). Null or empty to use the browser locale.
        The format for this string must be: <language (2 lowercase chars)>-<COUNTRY (2 uppercase chars)>`,
      isPrivate: false,
      default: 'en-GB',
    },
    timezone: {
      type: 'string',
      description:
        `Timezone string used to configure which UTC offset to use.
        'local' if current should be used. 'local' by default.

        The format for the timezone string can be a fixed string (for UTC or TAI); a fixed-offset string (e.g. UTC+5);
        or a location string in the format <Continent>/<City> (use camelcase with underscores instead of spaces, like America/New_York).
        For example:
        - For local time use local
        - For UTC use UTC
        - For TAI use TAI
        - For Greenwich Sidereal Time use sidereal-greenwich
        - For Summit Sidereal Time use sidereal-summit
        - For a fixed offset (e.g. GMT+5) use <UTC
        - For La Serena use America/Santiago (yes America, not Chile)
        - For Arizona use America/Phoenix
        - For Illinois use America/Chicago
        Note that not every city is available, check the IANA DB documentation for more info: https://www.iana.org/time-zones
        See the default value as an example`,
      isPrivate: false,
      default: 'local',
    },
  },
};

const ClockContainer = ({ ...props }) => {
  return (
    <Clock
      {...props}
    />
  );
};

const mapStateToProps = (state) => {
  const clock = getClock(state);
  return { clock };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ClockContainer);
