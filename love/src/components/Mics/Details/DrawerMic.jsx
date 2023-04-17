import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Slider from 'components/GeneralPurpose/Slider/Slider';
import Record from './Record';
import HeatMap from './HeatMap/HeatMap';
import Button from 'components/GeneralPurpose/Button/Button';
import Input from 'components/GeneralPurpose/Input/Input';
import styles from './DrawerMic.module.css';

export default class DrawerMic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showHeatMap: false,
    };

    this.containerRef = React.createRef();
  }

  static propTypes = {
    /**
     * ID of the current mic selected
     */
    id: PropTypes.string,
    /**
     * Plot's info of the current mic to render
     */
    infoPlot: PropTypes.object,
    /**
     * Function that allows to set the heat map container node of the current mic to render
     */
    setContainerNode: PropTypes.func,
    /**
     * Classname of the styles to decide if show or don't
     */
    peelableDetailCss: PropTypes.string,
    /**
     * Function to close this component peleable
     */
    closeMicDetails: PropTypes.func,
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
    isPlay: PropTypes.bool,
    /**
     * Function to start or stop record
     */
    record: PropTypes.func,
    /**
     * Array of records made previously
     */
    records: PropTypes.array,
    /**
     * Svg of play. This change if the mic is playing
     */
    svgPLay: PropTypes.object,
    /**
     * Svg of start record. This change if the mic is recording
     */
    svgRec: PropTypes.element,
    /**
     * Text down of svgPLay
     */
    textPlay: PropTypes.string,
    /**
     * Text down of svgRec
     */
    textRec: PropTypes.string,
  };

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
      drawerDetailCss,
      play,
      setVolume,
      volume,
      isPlay,
      record,
      records,
      svgPLay,
      svgRec,
      textPlay,
      textRec,
      containerNode,
    } = this.props;

    if (!this.props.infoPlot) {
      return <></>;
    }

    const { actualFreq, actualDb, showInput, appearInputdBLimit, setDbLimitState, dbLimit } = this.props.infoPlot;

    return (
      <div className={drawerDetailCss}>
        <div className={styles.divDetails}>
          <div className={styles.divTitleSection}>
            <span className={styles.spanIdDetails}> {id ?? ''}</span>
          </div>
          {/* HEAD HEAT MAP */}
          <div className={styles.infoMonserratFontContainer0}>
            <div className={styles.infoMonserratFontContainer1}>
              <div className={styles.infoMonserratFont1}>
                <div> Live values </div>
                <div className={styles.dBLiveValue}>
                  {' '}
                  {actualDb.toString().substring(0, 5)}dB in {actualFreq} Hz
                </div>
              </div>

              <div className={styles.infoMonserratFont2}>
                <div className={styles.buttondBLimit}>
                  Limit
                  <Button
                    className={styles.editButtondBLimit}
                    onClick={() => {
                      appearInputdBLimit();
                    }}
                  >
                    <div className={styles.svgButtonDiv}>
                      <svg width="20" height="20" viewBox="0 0 10 20" className={styles.svgButton}>
                        <line className={styles.svgEdit} x1="8.34" y1="2.09" x2="7.58" y2="1.38" />
                        <line className={styles.svgEdit} x1="8.72" y1="1.73" x2="7.96" y2="1.02" />
                        <polyline className={styles.svgEdit} points="4.16 1.66 .15 1.66 .15 9.48 7.97 9.48 7.97 5.49" />
                        <path
                          fill="white"
                          d="m8.69.3h0,0m0,0l.68.67-4.79,4.8-.68-.67,4-4,.79-.79m0-.3c-.07,0-.15.03-.21.09l-.8.8-4,4c-.11.11-.11.3,0,.41l.68.68c.06.06.13.09.21.09s.15-.03.21-.09L9.58,1.18c.11-.11.11-.3,0-.41l-.68-.68c-.06-.06-.13-.09-.21-.09h0Z"
                        />
                        <polyline className={styles.svgEdit} points="3.63 5.13 2.93 6.74 4.58 6" />
                      </svg>
                    </div>
                  </Button>
                </div>
                <div>{showInput ? <Input onChange={(e) => setDbLimitState(e.target.value)} /> : dbLimit}</div>
              </div>
            </div>

            <br></br>

            <div className={styles.fontTitle}>
              ALARM STORY
              <Button
                className={styles.editButtonShowHeatMap}
                onClick={() => {
                  this.appearHeatMap();
                }}
              >
                {this.state.showHeatMap ? 'Hide Spectrogram' : 'Show Spectrogram'}
              </Button>
            </div>
          </div>

          {/* HEAT MAP */}
          {!containerNode ? (
            <div ref={this.containerRef}>
              {/* It's important to pass the current to allows the dynamic works in HeatMap Did Update */}
              <HeatMap
                className={styles.heatMap}
                infoPlot={this.props.infoPlot}
                containerNode={this.containerRef.current}
                showHeatMap={this.state.showHeatMap}
              />
            </div>
          ) : (
            <></>
          )}

          <div className={styles.audioStream}>
            <span className={[styles.detailsTitle, styles.headers].join(' ')}>AUDIO STREAMING</span>
            <div className={styles.aStreamContent}>
              <span onClick={() => play()} className={styles.recSpan}>
                {svgPLay}
                <br />
                <span className={styles.oneLine}>{textPlay}</span>
              </span>
              <div>
                <Slider
                  onChange={(value) => setVolume(value)}
                  max={2}
                  value={volume?.value}
                  disabled={!isPlay}
                ></Slider>
                <span className={styles.oneLine}>VOLUME</span>
              </div>
              <span
                className={styles.recSpan}
                onClick={() => {
                  record();
                }}
              >
                {svgRec}
                <br />
                <span className={styles.oneLine}>{textRec}</span>
              </span>
            </div>
            {/* Aqui iba records */}
          </div>
          <span className={[styles.detailsTitle, styles.headers].join(' ')}>RECORDED AUDIOS</span>
          <div id="downloads" className={styles.recordsDiv}>
            {records.map((rec) => {
              return <Record url={rec.url} nameFile={rec.nameFile} blob={rec.blob}></Record>;
            })}
          </div>
        </div>
      </div>
    );
  }
}
