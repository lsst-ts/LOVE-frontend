import React from 'react';
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
    dbLimit = 20,
    setVolume = () => {},
    setDbLimit = () => {},
    play = () => {},
    record = () => {},
  } = props;

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
              - <Input
                className={styles.width60}
                type="number"
                min="0"
                value={dbLimit}
                onChange={(e) => {
                  if (e.target.value !== dbLimit) setDbLimit(e.target.value)
                }}
              />
                {" dB"}
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
    nextProps.actualMaxDb === prevProps.actualMaxDb &&
    nextProps.dbLimit === prevProps.dbLimit
  );
};

export default React.memo(Player, comparator);