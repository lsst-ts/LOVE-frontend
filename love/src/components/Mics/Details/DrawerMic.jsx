import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Slider from 'components/GeneralPurpose/Slider/Slider';
import Record from './Record';
import HeatMap from './HeatMap/HeatMap';
import Button from 'components/GeneralPurpose/Button/Button';
import Input from 'components/GeneralPurpose/Input/Input';
import RecIcon from 'components/icons/MicsIcon/Rec/RecIcon';
import PauseIcon from 'components/icons/MicsIcon/Pause/PauseIcon';
import PlayIcon from 'components/icons/MicsIcon/Play/PlayIcon';
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
    maxHeight: PropTypes.number,
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
    maxHeight: 215,
  }

  constructor(props) {
    super(props);
    this.state = {
      showHeatMap: false,
    };
    this.containerRef = React.createRef();
  }

  /**
   * This function allows to show up the Heat Map, after press the show up button,
   * changing the correspondient state.
   */
  appearHeatMap = () => {
    if (this.state.showHeatMap) {
      this.setState({ showHeatMap: false });
    } else {
      this.setState({ showHeatMap: true });
    }
  };

  render() {
    const {
      id,
      name,
      drawerDetailCss,
      play,
      setVolume,
      volume,
      isPlaying,
      isRecording,
      record,
      records,
      containerNode,
    } = this.props;

    if (!this.props.infoPlot) {
      return <></>;
    }

    const { actualFreq, actualDb, showInput, appearInputdBLimit, setDbLimitState, dbLimit } = this.props.infoPlot;

    let textPlay = isPlaying ? 'PAUSE' : 'PLAY';
    let textRec = isRecording ? 'STOP' : 'START';

    return (
      <div className={drawerDetailCss}>
        <div className={styles.divDetails}>
          <div className={styles.divTitleSection}>
            <span className={styles.spanIdDetails}> {name ?? ''}</span>
          </div>

          <div className={styles.audioStream}>
            <span className={[styles.detailsTitle, styles.headers].join(' ')}>AUDIO STREAMING</span>
            <div className={styles.aStreamContent}>
              <span onClick={() => play()} className={styles.recSpan}>
                { isPlaying ? (
                    <PauseIcon className={styles.playSVG}/>
                  ) : (
                    <PlayIcon className={[styles.playSVG, styles.opacity].join(' ')}/>
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
                ></Slider>
                <span className={styles.oneLine}>VOLUME</span>
              </div>
              <span
                className={styles.recSpan}
                onClick={() => record()}
              >
                {
                  <RecIcon isRecording={isRecording} className={[styles.recSVG, styles.verticalSpace].join(' ')}/>
                }
                <span className={styles.oneLine}>{textRec}</span>
              </span>
            </div>
          </div>

          <div className={styles.containerAlarmLimit}>
            <div>
              <div> Live values </div>
              <div className={styles.dBLiveValue}>
                {' '}
                {actualDb.toString().substring(0, 5)}dB in {actualFreq} Hz
              </div>
            </div>

            <div className={styles.width20}>
              <div className={styles.buttondBLimit}>
                Alarm Limit
              </div>
              <div>
                <Input
                  type="number"
                  step="0.1"
                  value={dbLimit}
                  onChange={(e) => setDbLimitState(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Fragment>
            <button className={styles.buttonShowSpectrogram} onClick={this.appearHeatMap}>
              <div className={styles.spectrogramTitle}>
                <span className={[styles.detailsTitle, styles.headers].join(' ')}>ALARM STORY SPECTROGRAM</span>
                <span><RowExpansionIcon expanded={this.state.showHeatMap}/></span>
              </div>
            </button>
            <Collapse isOpen={this.state.showHeatMap} childrenHeight={this.props.maxHeight}>
                <div style={this.props.maxHeight ? {"maxHeight": this.props.maxHeight} : {}}>
                  <div ref={this.containerRef} className={styles.containerHeatMap}>
                    <HeatMap
                      infoPlot={this.props.infoPlot}
                      containerNode={this.containerRef.current?.parentNode}
                      showHeatMap={this.state.showHeatMap}
                    />
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
