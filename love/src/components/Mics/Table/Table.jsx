import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Row from './Row';
import styles from './Table.module.css';

export default class Table extends Component {
  static propTypes = {
    /**
     * Array of dictonary with the mics info
     */
    mics: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      location: PropTypes.string,
      src: PropTypes.string,
      dbLimit: PropTypes.number,
    })),
    /**
     * Function to change the mic's component state of the currentMic and show on mic details
     */
    selectMic: PropTypes.func,
    /**
     * Function to add a new record on the mic's record state
     */
    recordPush: PropTypes.func,
    /**
     * Function to set the infoPlot state of the mic component to render
     */
    setInfoPlot: PropTypes.func,
    initialPlaying: PropTypes.bool,
  };

  static defaultProps = {
    mics: [],
    selectMic: () => {},
    recordPush: () => {},
    setInfoPlot: () => {},
    initialPlaying: false,
  };

  renderHeader(name, id) {
    return (
      <tr key={`mics-header-${id}`}>
        <th colSpan="2" scope="colgroup" className={styles.thLocMic}>
          <span className={styles.locationMic}>{name.toUpperCase()}</span>
        </th>
        <th scope="col">
          <span className={styles.headers}>MIC STATUS</span>
        </th>
        <th></th>
        <th scope="col">
          <span className={styles.headers}>NOTIFICATIONS</span>
        </th>
        <th scope="col">
          <span className={styles.headers}>ALARM</span>
        </th>
      </tr>
    );
  }

  renderMicrophones(items) {
    const { selectMic, recordPush, setInfoPlot, initialPlaying } = this.props;
    return items.map((item) => {
      return (
        <Row
          source={item.src}
          id={item.id}
          name={item.name}
          selectMic={(mic) => selectMic(mic)}
          recordPush={(id, currentTime, url, blob) => recordPush(id, currentTime, url, blob)}
          setInfoPlot={(data) => setInfoPlot(data)}
          initialPlaying={initialPlaying}
          dbLimit={item.dbLimit}
        />
      )
    })
  }

  render() {
    const { mics } = this.props;
    let microphones = {};
    mics.forEach((mic) => {
      if (!microphones[mic.location]) {
        microphones[mic.location] = {};
      }
      microphones[mic.location][mic.id] = {
        id: mic.id,
        name: mic.name,
        location: mic.location,
        src: mic.src,
        dbLimit: mic.dbLimit,
      };
    });

    return (
      <table>
        { Object.entries(microphones).map((item, i) => {
            return (
              <>
                { this.renderHeader(item[0], i) }
                { this.renderMicrophones(Object.values(item[1])) }
              </>
            );
          })
        }
      </table>
    );
  }
}
