import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import isEqual from 'lodash/isEqual';
import { fixedFloat } from 'Utils';
import {Table, Th, Tr, Td} from 'components/GeneralPurpose/SimpleTable/TableBorder';
import WeatherForecastIcon from 'components/icons/WeatherForecastIcon/WeatherForecastIcon';
import styles from './InfoHeader.module.css';
import PlusMinusIcon from 'components/icons/PlusMinus/PlusMinusIcon';

export default class InfoHeader extends Component {
  static propTypes = {
    subscribeToStreams: PropTypes.func,
    unsubscribeToStreams: PropTypes.func,
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
        temperature: PropTypes.arrayOf(PropTypes.number),
        temperatureSpread: PropTypes.arrayOf(PropTypes.number),
      }),
    ),
  };

  static defaultProps = {
    subscribeToStreams: () => undefined,
    unsubscribeToStreams: () => undefined,
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
      temperature: [],
      temperatureSpread: [],
    },
  };

  constructor(props) {
    super(props);

    this.frecuencyOptions = ['daily', 'hourly'];
    this.sliceSizeOptions = {'daily': 15, 'hourly': 29};
    this.temporalFormatOptions = {'daily': 'MMM DD', 'hourly': 'DD HH:mm'};

    this.state = {
      data: [],
    };
  }

  getPredictabilityClass(value) {
    return {
      1: {
        name: 'very low',
        class: styles.veryLow,
      },
      2: {
        name: 'low',
        class: styles.low,
      },
      3: {
        name: 'medium',
        class: styles.medium,
      },
      4: {
        name: 'high',
        class: styles.high,
      },
      5: {
        name: 'very high',
        class: styles.veryHigh,
      }
    }[value] ?? {
      name: 'undefined',
      class: styles.default,
    };
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
        dayHour: Moment.unix(_d.timestamp).format(this.temporalFormatOptions[frecuency]),
        pictocode: <WeatherForecastIcon pictogramNumber={_d.pictocode ?? 0}/>,
        temperatureMax: _d.temperatureMax ? fixedFloat(_d.temperatureMax, 1) : '',
        temperatureMin: _d.temperatureMin ? fixedFloat(_d.temperatureMin, 1) : '',
        predictability: _d.predictability ? fixedFloat(_d.predictability, 0) : '',
        predictabilityClass: _d.predictabilityClass ?? '',
        temperature: _d.temperature ? fixedFloat(_d.temperature, 1) : '',
        temperatureSpread: _d.temperatureSpread ? fixedFloat(_d.temperatureSpread, 1) : '',
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

  componentDidMount = () => {
    this.props.subscribeToStreams();
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStreams();
  };

  render() {
    const {data} = this.state;

    return (
      <div className={styles.infoHeaderTable }>
        <Table>
          <Tr>
            <Td className={styles.paddingInfoHeader}>{this.props.frecuency === this.frecuencyOptions[0] ? 'Day' : 'Hour' }</Td>
            {data.map((row) => {
              return (<Td className={styles.paddingInfoHeader}>{row.dayHour}</Td>);
            })}
            <Td className={styles.paddingInfoHeader}>{this.props.frecuency === this.frecuencyOptions[0] ? 'Day' : 'Hour' }</Td>
          </Tr>
          <Tr>
            <Td className={styles.paddingInfoHeader}>Pictocode</Td>
            {data.map((row) => {
              return (<Td className={styles.paddingInfoHeader}>{row.pictocode}</Td>);
            })}
            <Td className={styles.paddingInfoHeader}>Pictocode</Td>
          </Tr>
          {this.props.frecuency === this.frecuencyOptions[0] ? (
            <>
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
            </>
          ) : (
            <Tr>
              <Td className={styles.paddingInfoHeader}>Temp. °C</Td>
              {data.map((row) => {
                return (
                <Td className={styles.paddingInfoHeader}>
                  <span className={styles.temperatureMax}>
                    {row.temperature}
                  </span>
                  <span className={styles.spread}>
                    <PlusMinusIcon className={styles.littleIcon}/>
                    <span>{row.temperatureSpread}</span>
                  </span>
                </Td>);
              })}
              <Td className={styles.paddingInfoHeader}>Temp. °C</Td>
            </Tr>
          )}
          {this.props.frecuency === this.frecuencyOptions[0] && (
            <Tr>
              <Td className={styles.paddingInfoHeader}>Predictability</Td>
              {data.map((row) => {
                return (
                  <Td className={styles.padding0}>
                    <span
                      className={styles.backgroundPredictability}
                      style={{'width': ((100 - row.predictability) / 2) + '%'}}
                      title={this.getPredictabilityClass(row.predictabilityClass).name + ' -- ' + row.predictability + '%'}
                    ></span>
                    <span
                      className={[this.getPredictabilityClass(row.predictabilityClass).class, styles.predictability].join(' ')}
                      style={{'width': row.predictability + '%'}}
                      title={this.getPredictabilityClass(row.predictabilityClass).name + ' -- ' + row.predictability + '%'}
                    ></span>
                    <span
                      className={styles.backgroundPredictability}
                      style={{'width': ((100 - row.predictability) / 2) + '%'}}
                      title={this.getPredictabilityClass(row.predictabilityClass).name + ' -- ' + row.predictability + '%'}
                    ></span>
                  </Td>
                );
              })}
              <Td className={styles.paddingInfoHeader}>Predictability</Td>
            </Tr>
          )}
        </Table>
      </div>
    );
  }

}