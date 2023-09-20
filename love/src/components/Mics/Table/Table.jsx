/** This file is part of LOVE-frontend.

Developed for Inria Chile Tech Team.

See the COPYRIGHT file at the top-level directory of this distribution
for details of code ownership.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Row from './Row';
import styles from './Table.module.css';

export default class Table extends Component {
  static propTypes = {
    /**
     * Array of dictonary with the mics info
     */
    mics: PropTypes.arrayOf(
      PropTypes.shape({
        /** Id unique for the reference to the mic */
        id: PropTypes.number,
        /** Name for the text in table and the title in the player component */
        name: PropTypes.string,
        /** Name of location for the grouping the microphones */
        location: PropTypes.string,
        /** String of the source url of the microphone */
        src: PropTypes.string,
        /** number in positive about the limit decibels for the alarm alert */
        dbLimit: PropTypes.number,
        /** minimum number for the range of spectrogram plot */
        minDecibels: PropTypes.number,
        /** maximum number for the range of spectrogram plot */
        maxDecibels: PropTypes.number,
      }),
    ),
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
    /** boolean value for the initial reproduce to all microphones */
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
          minDecibels={item.minDecibels}
          maxDecibels={item.maxDecibels}
        />
      );
    });
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
        minDecibels: mic.minDecibels,
        maxDecibels: mic.maxDecibels,
      };
    });

    return (
      <table>
        {Object.entries(microphones).map((item, i) => {
          return (
            <>
              {this.renderHeader(item[0], i)}
              {this.renderMicrophones(Object.values(item[1]))}
            </>
          );
        })}
      </table>
    );
  }
}
