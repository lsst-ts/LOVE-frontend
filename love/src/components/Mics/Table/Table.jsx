import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Table.module.css';
import Microphone from './Microphone';

export default class Table extends Component {
  static propTypes = {
    /**
     * Array of dictonary with the mics info
     */
    mics: PropTypes.arrayOf(PropTypes.objectOf({
      id: PropTypes.number,
      name: PropTypes.string,
      location: PropTypes.string,
      src: PropTypes.string,
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
  };

  render() {
    const { mics, selectMic, recordPush, setInfoPlot, containerNode } = this.props;
    return (
      <table>
        <colgroup span="2" />
        <col />
        <col />
        <col />
        <tr>
          <th colSpan="2" scope="colgroup" className={styles.thLocMic}>
            <span className={styles.locationMic}>MAIN TELESCOPE</span>
          </th>

          <th scope="col">
            <span className={styles.headers}> MIC STATUS </span>
          </th>
          <th scope="col">
            <span className={styles.headers}>NOTIFICATIONS</span>
          </th>
          <th scope="col">
            <span className={styles.headers}>ALARM</span>
          </th>
        </tr>
        {mics.map((m) => {
          if (m.loc === 'mainTelescope') {
            return (
              <>
                <Microphone
                  source={m.src}
                  id={m.id}
                  selectMic={(mic) => selectMic(mic)}
                  recordPush={(id, currentTime, url, blob) => recordPush(id, currentTime, url, blob)}
                  setInfoPlot={(data) => setInfoPlot(data)}
                ></Microphone>
              </>
            );
          }
        })}

        <br />

        <colgroup span="2" />
        <col />
        <col />
        <col />
        <tr>
          <th colSpan="2" scope="colgroup" className={styles.thLocMic}>
            <span className={styles.locationMic}>AUXILIARY TELESCOPE</span>
          </th>

          <th scope="col">
            <span className={styles.headers}> MIC STATUS </span>
          </th>
          <th scope="col">
            <span className={styles.headers}>NOTIFICATIONS</span>
          </th>
          <th scope="col">
            <span className={styles.headers}>ALARM</span>
          </th>
        </tr>
        {mics.map((m) => {
          if (m.loc === 'auxilaryTelescope') {
            return (
              <Microphone
                source={m.src}
                id={m.id}
                selectMic={(mic) => selectMic(mic)}
                recordPush={(id, currentTime, url, blob) => recordPush(id, currentTime, url, blob)}
                setInfoPlot={(data) => setInfoPlot(data)}
              ></Microphone>
            );
          }
        })}

        <br />

        <colgroup span="2" />
        <col />
        <col />
        <col />
        <tr>
          <th colSpan="2" scope="colgroup" className={styles.thLocMic}>
            <span className={styles.locationMic}>SUMMIT FACILITY</span>
          </th>

          <th scope="col">
            <span className={styles.headers}> MIC STATUS </span>
          </th>
          <th scope="col">
            <span className={styles.headers}>NOTIFICATIONS</span>
          </th>
          <th scope="col">
            <span className={styles.headers}>ALARM</span>
          </th>
        </tr>
        {mics.map((m) => {
          if (m.loc === 'summitFacility') {
            return (
              <Microphone
                source={m.src}
                id={m.id}
                selectMic={(mic) => selectMic(mic)}
                recordPush={(id, currentTime, url, blob) => recordPush(id, currentTime, url, blob)}
                setInfoPlot={(data) => setInfoPlot(data)}
              ></Microphone>
            );
          }
        })}
      </table>
    );
  }
}
