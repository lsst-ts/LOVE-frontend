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

import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import Input from 'components/GeneralPurpose/Input/Input';
import RecIcon from 'components/icons/MicsIcon/Rec/RecIcon';
import PauseIcon from 'components/icons/MicsIcon/Pause/PauseIcon';
import PlayIcon from 'components/icons/MicsIcon/Play/PlayIcon';
import Slider from 'components/GeneralPurpose/Slider/Slider';
import styles from './Player.module.css';

function Player(props) {
  const {
    isPlaying = false,
    isRecording = false,
    volume = 0,
    actualMaxFreq = 0,
    actualMaxDb = 0,
    setVolume = () => {},
    setDbLimit = () => {},
    play = () => {},
    record = () => {},
  } = props;

  const textPlay = isPlaying ? 'PAUSE' : 'PLAY';
  const textRec = isRecording ? 'STOP' : 'START';

  const dbLimitOnChangeCallback = useCallback(debounce(setDbLimit, 300), []);
  return (
    <>
      <div className={styles.containerPlayer}>
        <span onClick={() => play()} className={styles.spanButton}>
          {isPlaying ? (
            <PauseIcon className={[styles.playSVG, styles.verticalSpace].join(' ')} />
          ) : (
            <PlayIcon className={[styles.playSVG, styles.opacity, styles.verticalSpace].join(' ')} />
          )}
          <span className={styles.oneLine}>{textPlay}</span>
        </span>

        <div>
          <Slider
            onChange={(value) => setVolume(value)}
            max={2}
            value={volume?.value}
            disabled={!isPlaying}
            step={0.2}
          />
          <span className={styles.oneLine}>VOLUME</span>
        </div>

        <span className={styles.spanButton} onClick={() => record()}>
          {<RecIcon isRecording={isRecording} className={[styles.recSVG, styles.verticalSpace].join(' ')} />}
          <span className={styles.oneLine}>{textRec}</span>
        </span>
      </div>

      <div className={styles.containerAlarmLimit}>
        <div>
          <div> Max Decibel value </div>
          <div className={styles.dBLiveValue}>
            {actualMaxDb.toString().substring(0, 5)}dB in {actualMaxFreq} Hz
          </div>
        </div>

        <div className={styles.width30}>
          <div className={styles.buttondBLimit}>Threshold</div>
          <div className={[styles.oneLine, styles.fontSmall].join(' ')}>
            <span>
              -{' '}
              <Input
                className={styles.width60}
                defaultValue={20}
                type="number"
                min="0"
                onChange={dbLimitOnChangeCallback}
              />
              {' dB'}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

const comparator = (prevProps, nextProps) => {
  return (
    nextProps.isPlaying === prevProps.isPlaying &&
    nextProps.isRecording === prevProps.isRecording &&
    nextProps.volume === prevProps.volume &&
    nextProps.actualMaxFreq === prevProps.actualMaxFreq &&
    nextProps.actualMaxDb === prevProps.actualMaxDb
  );
};

Player.propTypes = {
  /** status of reproduction */
  isPlaying: PropTypes.bool,
  /** status of recording */
  isRecording: PropTypes.bool,
  /** level of the volume of the microphone reproduced for the speaker */
  volume: PropTypes.number,
  /** value of the maximum frequency listened from the microphone, in this moment  */
  actualMaxFreq: PropTypes.number,
  /** value of the maximum decibel listened from the microphone, in this moment  */
  actualMaxDb: PropTypes.number,
  /** dB limit for the alarm */
  dbLimit: PropTypes.number,
  /** function for the change of the volume */
  setVolume: PropTypes.func,
  /** function for the change of the db limit for the alarm */
  setDbLimit: PropTypes.func,
  /** function for the playing of the microphone and analyze for the alarm */
  play: PropTypes.func,
  /** function for the recording of the microphone */
  record: PropTypes.func,
};

export default React.memo(Player, comparator);
