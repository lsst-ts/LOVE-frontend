import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Input from 'components/GeneralPurpose/Input/Input';
import RecIcon from 'components/icons/MicsIcon/Rec/RecIcon';
import PauseIcon from 'components/icons/MicsIcon/Pause/PauseIcon';
import PlayIcon from 'components/icons/MicsIcon/Play/PlayIcon';
import Slider from 'components/GeneralPurpose/Slider/Slider';
import styles from './Player.module.css';

export default class Player extends Component {
  static propTypes = {
    isPlaying: PropTypes.bool,
    isRecording: PropTypes.bool,
    volume: PropTypes.number,
    actualMaxFreq: PropTypes.number,
    actualMaxDb: PropTypes.number,
    actualMinFreq: PropTypes.number,
    actualMinDb: PropTypes.number,
    dbLimit: PropTypes.number,
    setVolume: PropTypes.func,
    setDbLimit: PropTypes.func,
    play: PropTypes.func,
    record: PropTypes.func,
  };

  static defaultProps = {
    isPlaying: false,
    isRecording: false,
    volume: 0,
    actualMaxFreq: 0,
    actualMaxDb: 0,
    actualMinFreq: 0,
    actualMinDb: 0,
    dbLimit: -20,
    setVolume: () => {},
    setDbLimit: () => {},
    play: () => {},
    record: () => {},
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      isPlaying,
      isRecording,
      volume,
      actualMaxFreq,
      actualMaxDb,
      actualMinFreq,
      actualMinDb,
      dbLimit,
      setVolume,
      setDbLimit,
      play,
      record,
    } = this.props;

    const textPlay = isPlaying ? 'PAUSE' : 'PLAY';
    const textRec = isRecording ? 'STOP' : 'START';


    return (
      <>
        <div className={styles.containerPlayer}>
          <span onClick={() => play()} className={styles.spanButton}>
            { isPlaying ? (
                <PauseIcon className={[styles.playSVG, styles.verticalSpace].join(' ')}/>
              ) : (
                <PlayIcon className={[styles.playSVG, styles.opacity, styles.verticalSpace].join(' ')}/>
              )
            }
            <span className={styles.oneLine}>{textPlay}</span>
          </span>

          <div>
            <Slider
              onChange={(value) => setVolume(value)}
              max={2}
              value={volume?.value}
              disabled={!isPlaying}
            />
            <span className={styles.oneLine}>VOLUME</span>
          </div>

          <span
            className={styles.spanButton}
            onClick={() => record()}
          >
            {
              <RecIcon isRecording={isRecording} className={[styles.recSVG, styles.verticalSpace].join(' ')}/>
            }
            <span className={styles.oneLine}>{textRec}</span>
          </span>
        </div>

        <div className={styles.containerAlarmLimit}>
          <div>
            <div> Max Decibel value </div>
            <div className={styles.dBLiveValue}>
              {actualMaxDb.toString().substring(0, 5)}dB in {actualMaxFreq} Hz
            </div>
            {/* <div> Min Decibel value </div>
            <div className={styles.dBLiveValue}>
              {actualMinDb.toString().substring(0, 5)}dB in {actualMinFreq} Hz
            </div> */}
          </div>

          <div className={styles.width30}>
            <div className={styles.buttondBLimit}>
              Threshold
            </div>
            <div className={[styles.oneLine, styles.fontSmall].join(' ')}>
              <span>
                <Input
                  className={styles.width60}
                  type="number"
                  value={dbLimit}
                  onChange={(e) => setDbLimit(e.target.value)}
                />
                  {" dB"}
              </span>
            </div>
          </div>
        </div>
      </>
    );
  }

}