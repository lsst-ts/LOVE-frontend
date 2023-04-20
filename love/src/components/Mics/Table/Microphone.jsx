import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ManagerInterface, { parseCommanderData } from 'Utils';
import styles from './Table.module.css';
import { DateTime } from 'luxon';
import moment from 'moment';
import StatusText from 'components/GeneralPurpose/StatusText/StatusText';
import ViewIcon from 'components/icons/ViewIcon/ViewIcon';
import AlarmOnIcon from 'components/icons/MicsIcon/AlarmOn/AlarmOnIcon';
import AlarmOffIcon from 'components/icons/MicsIcon/AlarmOff/AlarmOffIcon';
import NotificationSoundOffIcon from 'components/icons/NotificationSoundIcon/NotificationSoundOffIcon';
import NotificationSoundOnIcon from 'components/icons/NotificationSoundIcon/NotificationSoundOnIcon';


export default class Microphone extends Component {
  static propTypes = {
    /**
     * Function to change the mic's component state of the currentMic and select this to show on the mic details
     */
    selectMic: PropTypes.func,
    /**
     * URL of the source sound
     */
    source: PropTypes.string,
    /**
     * ID assigned to this mic
     */
    id: PropTypes.string,
    /**
     * Name assigned to this mic
     */
    name: PropTypes.string,
    /**
     * Function to add a new record on the mic's record state
     */
    recordPush: PropTypes.func,
    /**
     * Function to set the infoPlot state of the mic component to render.
     */
    setInfoPlot: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      isSelected: false,

      notifications: true,

      alarm: false,

      play: false,

      isRecording: false,

      actualDb: 0,

      actualFreq: 0,

      initialTime: '',

      timeDomain: [],

      dbLimit: 0.1,

      ampArray: [],

      timeArray: [],

      data3D: { table: [] },

      showInput: false,
    };
  }

  componentDidMount = () => {
    //Init audio variables
    this.initAudio();

    if (this.countPollingIterval) clearInterval(this.countPollingIterval);
    this.countPollingIterval = setInterval(() => {
      this.setState((prevState) => this.getdbFrequencyData(prevState, this.getTimeUTCformat()));
      let infoPlot = {
        actualFreq: this.state.actualFreq,
        actualDb: this.state.actualDb,
        showInput: this.state.showInput,
        appearInputdBLimit: this.appearInputdBLimit,
        setDbLimitState: this.setDbLimitState,
        dbLimit: this.state.dbLimit,
        windowTimePlot: this.windowTimePlot,
        bufferLength: this.bufferLength,
        timeDomain: this.state.timeDomain,
        data3D: this.state.data3D,
      };
      if (this.state.isSelected) this.props.setInfoPlot(infoPlot);
    }, 1000);
  };

  componentWillUnmount = () => {
    this.countPollingIterval = null;
    this.audioContext?.close();
  };

  /* Method to set up the audio variables*/
  initAudio() {
    //Source is the url of stream
    const { source } = this.props;
    this.source = source;

    //Init the AudioContext, masterGain to controlate the volume and AudioNode

    //AudioContext to controlate the sound
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    //Master Gain to controlate the volume
    this.masterGain = this.audioContext.createGain();
    //HTML media element of sound with the soucre
    this.song = new Audio(source);
    //Create a Node associated with song to work
    this.songSource = this.audioContext.createMediaElementSource(this.song);
    //Create analyser Node to get the decibels by frecuency
    this.analyser = this.audioContext.createAnalyser();

    //Variables to analize the sound
    this.analyser.smoothingTimeConstant = 0.9;
    this.analyser.fftSize = 2048; // sampling rate.
    this.bufferLength = this.analyser.frequencyBinCount; // frequency band.
    this.dataArray = new Float32Array(this.bufferLength);
    this.windowTimePlot = 7;
    this.frequencyData = Array.from({ length: this.bufferLength }, (_, index) => index);

    //To can connect to the source
    this.song.crossOrigin = 'anonymous';
    this.masterGain.gain.value = 0.4;

    //Connect the nodes
    this.songSource.connect(this.analyser);
    this.analyser.connect(this.masterGain);
    this.masterGain.connect(this.audioContext.destination);

    //load module to worklet and record
    this.loadModule(this.audioContext, this.songSource);
  }

  /**
   * Method to encode the audio when is record
   * @param {Array} vol: volume to set.
   */
  encodeAudio(buffers) {
    const sampleCount = buffers.reduce((memo, buffer) => {
      return memo + buffer.length;
    }, 0);

    const bytesPerSample = 16 / 8;
    const bitsPerByte = 8;
    const dataLength = sampleCount * bytesPerSample;
    const sampleRate = this.audioContext.sampleRate;

    const arrayBuffer = new ArrayBuffer(44 + dataLength);
    const dataView = new DataView(arrayBuffer);

    dataView.setUint8(0, 'R'.charCodeAt(0)); // <10>
    dataView.setUint8(1, 'I'.charCodeAt(0));
    dataView.setUint8(2, 'F'.charCodeAt(0));
    dataView.setUint8(3, 'F'.charCodeAt(0));
    dataView.setUint32(4, 36 + dataLength, true);
    dataView.setUint8(8, 'W'.charCodeAt(0));
    dataView.setUint8(9, 'A'.charCodeAt(0));
    dataView.setUint8(10, 'V'.charCodeAt(0));
    dataView.setUint8(11, 'E'.charCodeAt(0));
    dataView.setUint8(12, 'f'.charCodeAt(0));
    dataView.setUint8(13, 'm'.charCodeAt(0));
    dataView.setUint8(14, 't'.charCodeAt(0));
    dataView.setUint8(15, ' '.charCodeAt(0));
    dataView.setUint32(16, 16, true);
    dataView.setUint16(20, 1, true);
    dataView.setUint16(22, 1, true);
    dataView.setUint32(24, sampleRate, true);
    dataView.setUint32(28, sampleRate * 2, true);
    dataView.setUint16(32, bytesPerSample, true);
    dataView.setUint16(34, bitsPerByte * bytesPerSample, true);
    dataView.setUint8(36, 'd'.charCodeAt(0));
    dataView.setUint8(37, 'a'.charCodeAt(0));
    dataView.setUint8(38, 't'.charCodeAt(0));
    dataView.setUint8(39, 'a'.charCodeAt(0));
    dataView.setUint32(40, dataLength, true);

    let index = 44;

    for (const buffer of buffers) {
      for (const value of buffer) {
        dataView.setInt16(index, value * 0x7fff, true);
        index += 2;
      }
    }

    return new Blob([dataView], { type: 'audio/wav' });
  }

  /**
   * Load Audio Worklet to Record
   * @param {Object} ctx, the AudioContext Object.
   * @param {Object} source of the audio streaming, for testing now is a public url.
   */
  async loadModule(ctx, source) {
    try {
      await ctx.audioWorklet.addModule(process.env.PUBLIC_URL + '/worklets/recordProcessor.js');
    } catch (e) {
      console.log(`Failed to load module: record-processor.js: `, e);
    }
    //Create the worklet node with the recordProcessor charge previously
    this.audioRecorder = new AudioWorkletNode(ctx, 'recordProcessor');
    this.buffers = [];

    //Get the message send by worklet processor with the buffer and push on buffers
    this.audioRecorder.port.addEventListener('message', (event) => {
      this.buffers.push(event.data.buffer);
    });
    this.audioRecorder.port.start();

    //connect the source with the AudioWorklet Node
    source.connect(this.audioRecorder);
    //connect the record with the audioContext to can be played
    this.audioRecorder.connect(ctx.destination);
  }

  /* Method to play o pause the microphone stream. this function is used by the mics component*/
  play = () => {
    const { audioContext, song, masterGain } = this;
    if (!this.state.play) {
      //It's necessary to the first time
      audioContext.resume();
      masterGain.gain.value = 0.5;
      song.play();
      this.setState({ play: true });
    } else {
      masterGain.gain.value = 0;
      this.setState({ play: false });
    }
  };

  /* Method to start record o stop record the microphone stream. this function is used by the mics component*/
  record = () => {
    const { audioContext, audioRecorder, buffers } = this;
    const { id, recordPush } = this.props;

    //Get the parameter of AudioWorklet
    const parameter = audioRecorder.parameters.get('isRecording');
    if (!this.state.isRecording) {
      //Set the value at 1, so the processor start to push the buffer
      parameter.setValueAtTime(1, audioContext.currentTime);
      //Reomves the elements of the buffers to start to record again
      buffers.splice(0, buffers.length);
      this.setState({ isRecording: true });
    } else {
      //Set the value at 0, so the processor end to push the buffer
      parameter.setValueAtTime(0, audioContext.currentTime);
      this.setState({ isRecording: false });
      //Encode the buffers's audio to save in a blob object
      const blob = this.encodeAudio(buffers);
      //Create a url associated to blob
      const url = URL.createObjectURL(blob);
      const timeNow = this.getTimeUTCformat();
      recordPush(id, timeNow, url, blob);
    }
  };

  /**
   * Method to change the volume of the microphone stream. this function is used by the mics component
   * @param {number} vol: volume to set.
   */
  changeVolume = (vol) => {
    this.masterGain.gain.value = vol;
  };

  /* Method to change the isSelected state, by the mics component*/
  selectMe = () => {
    let { isSelected } = this.state;
    if (!isSelected) {
      this.setState({ isSelected: true, alarm: false });
    }
    this.setState({ isSelected: !isSelected });
    let infoPlot = {
      actualFreq: this.state.actualFreq,
      actualDb: this.state.actualDb,
      appearInputdBLimit: this.appearInputdBLimit,
      showInput: this.state.showInput,
      setDbLimitState: this.setDbLimitState,
      dbLimit: this.state.dbLimit,
      windowTimePlot: this.windowTimePlot,
      bufferLength: this.bufferLength,
      timeDomain: this.state.timeDomain,
      // spec3D: this.state.spec3D,
      data3D: this.state.data3D,
    };
    this.props.setInfoPlot(infoPlot);
  };

  /**
   * Chnage the notification's state
   */
  turnNotifications = () => {
    const { notifications } = this.state;
    if (notifications) this.setState({ notifications: false, alarm: false });
    else this.setState({ notifications: true });
  };

  /**
   * Set the Decibel Limit to activate alarms
   * @param {number} dbLimit
   */
  setDbLimitState = (dbLimit) => {
    this.setState({ dbLimit: dbLimit });
  };

  /**
   * Function that update the data that will be receiving by Vega Lite Heat Map.
   * @param {Object} prevState ,the previous state, we have interest in spec and data states.
   * @param {Object} actTimeUTC ,is the actual time where the data is need to be considered in the plot.
   * @returns data state updated to send to the plot.
   */
  getdbFrequencyData = (prevState, actTimeUTC) => {
    let actTime = actTimeUTC.toISOString().substring(0, 19);
    let nextTime = this.obtainNextTimeInSeconds(actTimeUTC);

    this.analyser.getFloatFrequencyData(this.dataArray);

    let ampArray = this.dataArray;

    if (!prevState.data3D.table || ampArray[0] === -Infinity) {
      return {};
    }

    const halfSR = this.audioContext.sampleRate / 2;

    // data.
    let dataCopy = { table: [] };
    dataCopy.table = prevState.data3D.table;

    let mindB = -Infinity;
    let freqMaxdB = 0;

    let freqAmpArray = this.frequencyData.map(function (freq, i) {
      let index = Math.round((freq / halfSR) * ampArray.length);
      if (ampArray[index] > mindB) {
        mindB = ampArray[index];
        freqMaxdB = freq;
      }
      return { t_min: actTime, t_max: nextTime, f_min: freq, f_max: freq + 1, amp: ampArray[index] };
    });

    dataCopy.table = [...dataCopy.table, ...freqAmpArray];

    // timing.
    let timeDomain;
    let newInitialTime;
    let newTimeArray;

    newTimeArray = this.state.timeArray;
    newTimeArray.push(actTime);

    // set window time.
    if (newTimeArray.length === this.windowTimePlot) {
      dataCopy.table.splice(0, this.bufferLength);
      newTimeArray.shift();
    }

    // we return vega lite parameter with changes.
    if (newTimeArray.length === 1) {
      timeDomain = [actTime, nextTime];
      return {
        data3D: dataCopy,
        timeArray: newTimeArray,
        initialTime: actTime,
        timeDomain: timeDomain,
        actualDb: mindB,
        actualFreq: freqMaxdB,
      };
    } else {
      newInitialTime = newTimeArray[0];
      timeDomain = [newInitialTime, nextTime];
      return {
        data3D: dataCopy,
        timeArray: newTimeArray,
        initialTime: newTimeArray[0],
        timeDomain: timeDomain,
        actualDb: mindB,
        actualFreq: freqMaxdB,
      };
    }
  };

  /**
   * This function allows to show up the input to change the Decibel limit input, after press
   * respective the button to do it, changing the showInput state.
   */
  appearInputdBLimit = () => {
    if (this.state.showInput) {
      this.setState({ showInput: false });
    } else {
      this.setState({ showInput: true });
    }
  };

  /**
   * Function with which we can obtain the actual time string in UTC
   * cut in the way that need the getValueData Function.
   * @returns actual time in UTC.
   */
  getTime() {
    const date = new Date();
    var now_utc = Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      DateTime.local().c.hour,
      DateTime.local().c.minute,
      DateTime.local().c.second,
    );

    return new Date(now_utc).toISOString().substring(0, 19);
  }

  /**
   * Function with which we can obtain the actual time in UTC wrapper in a Date object.
   * @returns actual time in UTC.
   */
  getTimeUTCformat() {
    const date = new Date();
    var now_utc = Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      DateTime.local().c.hour,
      DateTime.local().c.minute,
      DateTime.local().c.second,
    );

    return new Date(now_utc);
  }

  /**
   *Function that allows to add one second to the actual time.
   * @param {Object} actTime actual time in UTC format.
   * @returns the next time in UTC format.
   */
  obtainNextTimeInSeconds(actTime) {
    const date = moment(actTime).add(1, 'seconds');
    return new Date(date.utc()._d).toISOString().substring(0, 19);
  }
  // ========================================================

  render() {
    let classSelectedMic = this.state.isSelected ? styles.selectedMic : '';

    const { isSelected } = this.state;
    const { id, name } = this.props;
    let mic = {
      id: id,
      name: name,
      recordFunc: this.record,
      playFunc: this.play,
      volumeFunc: this.changeVolume,
      selectMe: this.selectMe,
      volume: this.masterGain?.gain,
    };

    return (
      <tr className={classSelectedMic}>
        <td onClick={() => this.props.selectMic(mic)} className={styles.tdView}>
          <ViewIcon selected={this.state.isSelected}></ViewIcon>
        </td>
        <td onClick={() => this.props.selectMic(mic)} className={styles.tdIdMic}>
          <span className={styles.idMic}>{name}</span>
        </td>
        <td>
          <StatusText status="ok" title="MicStatus" small>
            Enabled
          </StatusText>
        </td>
        <td onClick={() => this.turnNotifications()}>
          {this.state.notifications ? (
            <NotificationSoundOnIcon selected={isSelected} className={[styles.svgTable, styles.pointer].join(' ')}/>
          ) : (
            <NotificationSoundOffIcon selected={isSelected} className={[styles.svgTable, styles.pointer].join(' ')}/>
          )}
        </td>
        <td>
          {this.state.alarm ? (
            <AlarmOnIcon className={styles.svgTable}></AlarmOnIcon>
          ) : (
            <AlarmOffIcon className={styles.svgTable}></AlarmOffIcon>
          )}
        </td>
      </tr>
    );
  }
}
