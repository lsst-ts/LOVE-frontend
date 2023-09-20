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

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Record from './Record';
import HeatMap from './HeatMap/HeatMap';
import Player from './Player';
import Collapse from 'components/GeneralPurpose/Collapse/Collapse';
import RowExpansionIcon from 'components/icons/RowExpansionIcon/RowExpansionIcon';

import styles from './DrawerMic.module.css';

export default class DrawerMic extends Component {
  static propTypes = {
    /**
     * ID of the current mic selected
     */
    id: PropTypes.string,
    /**
     * Name of the current mic selected
     */
    name: PropTypes.string,
    /**
     * Plot's info of the current mic to render
     */
    infoPlot: PropTypes.object,
    /**
     * Function that allows to set the heat map container node of the current mic to render
     */
    setContainerNode: PropTypes.func,
    /**
     * Function to play or pause the selected mic
     */
    play: PropTypes.func,
    /**
     * Function to set the volume of the current mic playing
     */
    setVolume: PropTypes.func,
    /**
     * The initial volume of the mic
     */
    volume: PropTypes.object,
    /**
     * State that say if there is some mic playing
     */
    isPlaying: PropTypes.bool,
    /**
     * State that say if there is some mic recording
     */
    isRecording: PropTypes.bool,
    /**
     * Function to start or stop record
     */
    record: PropTypes.func,
    /**
     * Array of records made previously
     */
    records: PropTypes.array,
  };

  static defaultProps = {
    id: 0,
    name: '',
    infoPlot: {},
    setContainerNode: () => {},
    play: () => {},
    setVolume: () => {},
    volume: {},
    isPlaying: false,
    isRecording: false,
    record: () => {},
    records: [],
  };

  static MAXHEIGHTPLOT = 215;

  constructor(props) {
    super(props);
    this.state = {
      showHeatMap: false,
    };
    this.containerRef = React.createRef();
  }

  render() {
    const { id, name, drawerDetailCss, play, setVolume, volume, isPlaying, isRecording, record, records } = this.props;

    if (!this.props.infoPlot) {
      return <></>;
    }

    const { actualMaxFreq, actualMaxDb, actualMinFreq, actualMinDb, setDbLimitState, dbLimit } = this.props.infoPlot;

    return (
      <div className={drawerDetailCss}>
        <div className={styles.divDetails}>
          <div className={styles.divTitleSection}>
            <span className={styles.spanIdDetails}> {name ?? ''}</span>
          </div>

          <div className={styles.audioStream}>
            <span className={[styles.detailsTitle, styles.headers].join(' ')}>AUDIO STREAMING</span>
            <Player
              isPlaying={isPlaying}
              isRecording={isRecording}
              volume={volume}
              actualMaxFreq={actualMaxFreq}
              actualMaxDb={actualMaxDb}
              actualMinFreq={actualMinFreq}
              actualMinDb={actualMinDb}
              dbLimit={dbLimit}
              setVolume={setVolume}
              setDbLimit={setDbLimitState}
              play={play}
              record={record}
            />
          </div>

          <Fragment>
            <button
              className={styles.buttonShowSpectrogram}
              onClick={() => this.setState((prevState) => ({ showHeatMap: !prevState.showHeatMap }))}
            >
              <div className={styles.spectrogramTitle}>
                <span className={[styles.detailsTitle, styles.headers].join(' ')}>SPECTROGRAM</span>
                <span>
                  <RowExpansionIcon expanded={this.state.showHeatMap} />
                </span>
              </div>
            </button>
            <Collapse isOpen={this.state.showHeatMap} childrenMaxHeight={DrawerMic.MAXHEIGHTPLOT}>
              <div style={{ maxHeight: DrawerMic.MAXHEIGHTPLOT }}>
                <div ref={this.containerRef} className={styles.containerHeatMap}>
                  <HeatMap infoPlot={this.props.infoPlot} containerNode={this.containerRef.current?.parentNode} />
                </div>
              </div>
            </Collapse>
          </Fragment>

          <div className={styles.containerRecorded}>
            <span className={[styles.detailsTitle, styles.headers].join(' ')}>RECORDED AUDIOS</span>
            <div id="downloads" className={styles.recordsDiv}>
              {records.map((rec) => {
                return <Record url={rec.url} nameFile={rec.nameFile} blob={rec.blob}></Record>;
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
