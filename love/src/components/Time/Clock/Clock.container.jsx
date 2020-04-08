import React from 'react';
import { connect } from 'react-redux';
import { getTaiToUtc } from '../../../redux/selectors';
import Clock from './Clock';
import { DateTime } from 'luxon';

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
        Null or empty if current should be used. 'UTC' for UTC. Null by default.
        The format for this string must be: <Continent>/<City> (use camelcase and underscores (_) instead of spaces).
        For example:
        - For UTC use UTC
        - For TAI use TAI
        - For La Serena use America/Santiago (yes America, not Chile)
        - For Arizona use America/Phoenix
        - For Illinois use America/Chicago
        Note that not every city is available, check the IANA DB documentation for more info: https://www.iana.org/time-zones`,
      isPrivate: false,
      default: null,
    },
  },
};

class ClockContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timestamp: DateTime.local(),
    };
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      timestamp: DateTime.local(),
    });
  }

  render() {
    return <Clock {...this.props} timestamp={this.state.timestamp} />;
  }
}

const mapStateToProps = (state) => {
  const taiToUtc = getTaiToUtc(state);
  return { taiToUtc };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ClockContainer);
