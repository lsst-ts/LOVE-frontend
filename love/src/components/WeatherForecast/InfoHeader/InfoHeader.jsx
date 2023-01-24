import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import isEqual from 'lodash/isEqual';
import {Table, Th, Tr, Td} from 'components/GeneralPurpose/SimpleTable/TableBorder';
import WeatherForecastIcon from 'components/icons/WeatherForecastIcon/WeatherForecastIcon';
import styles from './InfoHeader.module.css';

export default class InfoHeader extends Component {
  static propTypes = {
    frecuency: PropTypes.oneOf(['daily', 'hourly']),
    daily: PropTypes.objectOf(
        PropTypes.shape({
          timestamp: PropTypes.arrayOf(PropTypes.number),
          pictocode: PropTypes.arrayOf(PropTypes.number),
          temperatureMax: PropTypes.arrayOf(PropTypes.number),
          temperatureMin: PropTypes.arrayOf(PropTypes.number),
          predictability: PropTypes.arrayOf(PropTypes.number),
          predictabilityClass: PropTypes.arrayOf(PropTypes.oneOf(
            ['very low', 'low', 'medium', 'high', 'very high'])),
        }),
    ),
    hourly: PropTypes.objectOf(
      PropTypes.shape({
        timestamp: PropTypes.arrayOf(PropTypes.number),
        pictocode: PropTypes.arrayOf(PropTypes.number),
        temperatureMax: PropTypes.arrayOf(PropTypes.number),
        temperatureMin: PropTypes.arrayOf(PropTypes.number),
        predictability: PropTypes.arrayOf(PropTypes.number),
        predictabilityClass: PropTypes.arrayOf(PropTypes.oneOf(
          ['very low', 'low', 'medium', 'high', 'very high'])),
      }),
    ),
  };

  static defaultProps = {
    frecuency: 'daily',
    daily: {
      timestamp: [],
      pictocode: [],
      temperatureMax: [],
      temperatureMin: [],
      predictability: [],
      predictabilityClass: [],
    },
    hourly: {
      timestamp: [],
      pictocode: [],
      temperatureMax: [],
      temperatureMin: [],
      predictability: [],
      predictabilityClass: [],
    },
  };

  constructor(props) {
    super(props);

    this.frecuencyOptions = ['daily', 'hourly'];
    this.sliceSizeOptions = {'daily': 15, 'hourly': 28};
    this.temporalFormatOptions = {'daily': 'MMM DD', 'hourly': 'HH:mm:ss'};

    this.state = {
      data: [],
    };
  }

  getStyle(className) {
    switch (className) {
      case 'very low':
        return styles.veryLow;
      case 'low':
        return styles.low;
      case 'medium':
        return styles.medium;
      case 'high':
        return styles.high;
      case 'very high':
        return styles.veryHigh;
      default:
        return styles.default;
    }
  }

  getStructures(frecuency) {
    let result = new Array(this.sliceSizeOptions[frecuency]);
    const object = frecuency === 'daily' ? this.props.daily :  this.props.hourly;
    for (let i = 0; i < this.sliceSizeOptions[frecuency]; i++) {
      result[i] = {};
      for (const [key, values] of Object.entries(object)) {
        result[i][key] = values[i];
      }
    }
    return result.map((_d) => {
      return ({
        dayHour:  Moment(_d.timestamp).format(this.temporalFormatOptions[frecuency]),
        pictocode: <WeatherForecastIcon pictogramNumber={_d.pictocode}/>,
        temperatureMax: _d.temperatureMax,
        temperatureMin: _d.temperatureMin,
        predictability: _d.predictability,
        predictabilityClass: _d.predictabilityClass,
      })
    });
  }

  componentDidMount = () => {
    this.setState({
      data: this.getStructures(this.props.frecuency),
    });
  };

  componentDidUpdate = (prevProps) => {
    if (!isEqual(prevProps.daily, this.props.daily) ||
        !isEqual(prevProps.hourly, this.props.hourly) ||
        prevProps.frecuency !== this.props.frecuency
    ) {
      this.setState({
        data: this.getStructures(this.props.frecuency)
      });
    }
  };

  render() {
    const {data} = this.state;

    return (
      <div className={styles.infoHeaderTable }>
        <Table>
          <Tr>
            <Td className={styles.paddingInfoHeader}>Day</Td>
            {data.map((row) => {
              return (<Td className={styles.paddingInfoHeader}>{row.dayHour}</Td>);
            })}
            <Td className={styles.paddingInfoHeader}>Day</Td>
          </Tr>
          <Tr>
            <Td className={styles.paddingInfoHeader}>Pictocode</Td>
            {data.map((row) => {
              return (<Td className={styles.paddingInfoHeader}>{row.pictocode}</Td>);
            })}
            <Td className={styles.paddingInfoHeader}>Pictocode</Td>
          </Tr>
          <Tr>
            <Td className={styles.paddingInfoHeader}>High °C</Td>
            {data.map((row) => {
              return (<Td className={[styles.temperatureMax,styles.paddingInfoHeader].join(' ')}>{row.temperatureMax}</Td>);
            })}
            <Td className={styles.paddingInfoHeader}>High °C</Td>
          </Tr>
          <Tr>
            <Td className={styles.paddingInfoHeader}>Low °C</Td>
            {data.map((row) => {
              return (<Td className={styles.paddingInfoHeader}>{row.temperatureMin}</Td>);
            })}
            <Td className={styles.paddingInfoHeader}>Low °C</Td>
          </Tr>
          <Tr>
            <Td className={styles.paddingInfoHeader}>Predictability</Td>
            {data.map((row) => {
              return (
                <Td className={styles.padding0}>
                  <span className={styles.backgroundPredictability} style={{'width': ((100 - row.predictability) / 2) + '%'}}></span>
                  <span
                    className={[this.getStyle(row.predictabilityClass), styles.predictability].join(' ')}
                    style={{'width': row.predictability + '%'}}
                    title={row. predictabilityClass + ' -- ' + row.predictability + '%'}
                  ></span>
                  <span className={styles.backgroundPredictability} style={{'width': ((100 - row.predictability) / 2) + '%'}}></span>
                </Td>
              );
            })}
            <Td className={styles.paddingInfoHeader}>Predictability</Td>
          </Tr>
        </Table>
      </div>
    );
  }

}