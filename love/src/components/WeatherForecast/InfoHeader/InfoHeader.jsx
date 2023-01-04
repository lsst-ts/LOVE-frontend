import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import {Table, Th, Tr, Td} from 'components/GeneralPurpose/SimpleTable/TableBorder';
import CloudlessSkyIcon from 'components/icons/Weather/CloudlessSkyIcon/CloudlessSkyIcon';
import styles from './InfoHeader.module.css';

export default class InfoHeader extends Component {
  static propTypes = {
    frecuency: PropTypes.oneOf(['daily', 'hourly']),
  };

  static defaultProps = {
    frecuency: 'daily'
  };

  constructor(props) {
    super(props);
  }


  render() {
    const data = [
      {
        dayHour: 'Nov 19',
        pictocode: <CloudlessSkyIcon/>,
        temperatureMax: 28,
        temperatureMin: 16,
        predictability: 80,
        predictabilityClass: styles.high,
      },
      {
        dayHour: 'Nov 20',
        pictocode: <CloudlessSkyIcon/>,
        temperatureMax: 28,
        temperatureMin: 16,
        predictability: 80,
        predictabilityClass: styles.veryHigh,
      },
      {
        dayHour: 'Nov 21',
        pictocode: <CloudlessSkyIcon/>,
        temperatureMax: 28,
        temperatureMin: 16,
        predictability: 20,
        predictabilityClass: styles.veryLow,
      },
      {
        dayHour: 'Nov 22',
        pictocode: <CloudlessSkyIcon/>,
        temperatureMax: 28,
        temperatureMin: 16,
        predictability: 50,
        predictabilityClass: styles.low,
      },
      {
        dayHour: 'Nov 23',
        pictocode: <CloudlessSkyIcon/>,
        temperatureMax: 28,
        temperatureMin: 16,
        predictability: 80,
        predictabilityClass: styles.medium,
      },
      {
        dayHour: 'Nov 24',
        pictocode: <CloudlessSkyIcon/>,
        temperatureMax: 28,
        temperatureMin: 16,
        predictability: 60,
        predictabilityClass: styles.medium,
      },
      {
        dayHour: 'Nov 25',
        pictocode: <CloudlessSkyIcon/>,
        temperatureMax: 28,
        temperatureMin: 16,
        predictability: 40,
        predictabilityClass: styles.low,
      },
      {
        dayHour: 'Nov 26',
        pictocode: <CloudlessSkyIcon/>,
        temperatureMax: 28,
        temperatureMin: 16,
        predictability: 80,
        predictabilityClass: styles.low,
      },
      {
        dayHour: 'Nov 27',
        pictocode: <CloudlessSkyIcon/>,
        temperatureMax: 28,
        temperatureMin: 16,
        predictability: 80,
        predictabilityClass: styles.high,
      },
      {
        dayHour: 'Nov 28',
        pictocode: <CloudlessSkyIcon/>,
        temperatureMax: 28,
        temperatureMin: 16,
        predictability: 80,
        predictabilityClass: styles.high,
      },
      {
        dayHour: 'Nov 29',
        pictocode: <CloudlessSkyIcon/>,
        temperatureMax: 28,
        temperatureMin: 16,
        predictability: 100,
        predictabilityClass: styles.veryHigh,
      },
      {
        dayHour: 'Nov 30',
        pictocode: <CloudlessSkyIcon/>,
        temperatureMax: 28,
        temperatureMin: 16,
        predictability: 90,
        predictabilityClass: styles.veryHigh,
      },
      {
        dayHour: 'Dic 01',
        pictocode: <CloudlessSkyIcon/>,
        temperatureMax: 28,
        temperatureMin: 16,
        predictability: 70,
        predictabilityClass: styles.medium,
      },
      {
        dayHour: 'Dic 02',
        pictocode: <CloudlessSkyIcon/>,
        temperatureMax: 28,
        temperatureMin: 16,
        predictability: 40,
        predictabilityClass: styles.low,
      }
    ];

    return (
      <div className={styles.scrollX}>
        <Table>
          <Tr>
            <Td>Day</Td>
            {data.map((row) => {
              return (<Td>{row.dayHour}</Td>);
            })}
            <Td>Day</Td>
          </Tr>
          <Tr>
            <Td>Pictocode</Td>
            {data.map((row) => {
              return (<Td>{row.pictocode}</Td>);
            })}
            <Td>Pictocode</Td>
          </Tr>
          <Tr>
            <Td>High °C</Td>
            {data.map((row) => {
              return (<Td className={styles.temperatureMax}>{row.temperatureMax}</Td>);
            })}
            <Td>High °C</Td>
          </Tr>
          <Tr>
            <Td>Low °C</Td>
            {data.map((row) => {
              return (<Td>{row.temperatureMin}</Td>);
            })}
            <Td>Low °C</Td>
          </Tr>
          <Tr>
            <Td>Predictability</Td>
            {data.map((row) => {
              return (
                <Td className={styles.padding0}>
                  <span className={styles.backgroundPredictability} style={{'width': ((100 - row.predictability) / 2) + '%'}}></span>
                  <span className={[row.predictabilityClass, styles.predictability].join(' ')} style={{'width': row.predictability + '%'}}></span>
                  <span className={styles.backgroundPredictability} style={{'width': ((100 - row.predictability) / 2) + '%'}}></span>
                </Td>
              );
            })}
            <Td>Predictability</Td>
          </Tr>
        </Table>
      </div>
    );
  }

}