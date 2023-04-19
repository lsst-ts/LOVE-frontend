import React, { Component } from 'react';
import lodash from 'lodash';
import PropTypes from 'prop-types';
import styles from './Level6.module.css';
import Device from '../Device.jsx';
import * as d3 from 'd3';

export default class Level6 extends Component {
  constructor(props) {
    super(props);
    this.mapId = lodash.uniqueId('Map-');
    this.overlayId = lodash.uniqueId('Overlay-');
    this.deviceId = lodash.uniqueId('Devices-');
  }

  static propTypes = {};

  static defaultProps = {
    params: {},
  };

  componentDidMount() {
    const deviceId = '#' + this.deviceId;
    const mapId = '#' + this.mapId;
    const overlayId = '#' + this.overlayId;
    const transformData = this.props.transformData;

    const zoom = d3.zoom().scaleExtent([1, 8]).on('zoom', this.zoomMap);

    d3.select(overlayId)
      .call(zoom.transform, d3.zoomIdentity.translate(transformData.x, transformData.y).scale(transformData.k))
      .call(zoom);
  }

  zoomMap = () => {
    const deviceId = '#' + this.deviceId;
    const mapId = '#' + this.mapId;
    const transformData = d3.event.transform;

    d3.select(mapId).attr('transform', transformData);
    d3.select(deviceId).attr('transform', transformData);
    this.props.savePos(transformData);
    console.log(transformData);
  };

  getDevices() {
    return <React.Fragment></React.Fragment>;
  }

  render() {
    return (
      <React.Fragment>
        <g id={this.mapId}>
          <g id="InsideStairs">
            <polygon className={styles.cls10} points="134.25 248.46 137.45 241.49 138.17 246.04 134.25 248.46" />
            <path
              className={styles.cls18}
              d="m139.82,251.31c-.41-.15-.81-.31-1.22-.46l1.1-2.88v-1.98l-1.77,4.61c-.79-.31-1.58-.63-2.35-.97l3.57-8.03c.14.06.27.12.41.18.05.02.09.03.14.03.14,0,.27-.08.33-.22.08-.18,0-.39-.19-.47-12.62-5.4-22.33-15.33-27.59-27.41h-.77c.05.12.1.25.15.37l-8,3.56c-.34-.78-.66-1.56-.97-2.35l4.12-1.58h-1.98l-2.4.92c-.12-.3-.22-.61-.33-.92h-.77c6.24,17.52,20.08,31.82,38.27,38.25.04.01.08.02.12.02.15,0,.28-.09.33-.24.07-.18-.03-.39-.22-.45Zm-35.9-33l8.01-3.57c.29.63.58,1.26.9,1.88l-7.81,3.98c-.38-.76-.75-1.52-1.1-2.29Zm1.43,2.92l7.8-3.97c.32.62.65,1.23,1,1.83l-7.58,4.38c-.42-.74-.83-1.48-1.22-2.23Zm1.57,2.85l7.58-4.38c.35.6.71,1.19,1.09,1.78l-7.34,4.77c-.46-.71-.9-1.44-1.33-2.17Zm1.71,2.76l7.34-4.77c.38.58.78,1.15,1.18,1.72l-7.08,5.14c-.49-.69-.98-1.39-1.44-2.09Zm1.86,2.67l7.08-5.15c.41.56.83,1.11,1.27,1.65l-6.8,5.51c-.53-.66-1.04-1.33-1.55-2.02Zm1.99,2.57l6.8-5.51c.44.54.89,1.07,1.35,1.59l-6.51,5.86c-.56-.63-1.11-1.28-1.65-1.94Zm2.13,2.46l6.51-5.86c.47.51.95,1.02,1.44,1.51l-6.19,6.19c-.6-.6-1.18-1.22-1.75-1.84Zm2.25,2.35l6.19-6.19c.49.49,1,.97,1.51,1.44l-5.86,6.51c-.63-.57-1.24-1.16-1.84-1.75Zm2.36,2.24l5.87-6.52c.52.46,1.05.91,1.59,1.35l-5.52,6.82c-.66-.54-1.3-1.09-1.93-1.65Zm2.49,2.09l5.52-6.81c.54.43,1.09.86,1.65,1.27l-5.15,7.09c-.68-.5-1.36-1.02-2.02-1.55Zm2.59,1.97l5.15-7.09c.56.4,1.14.8,1.72,1.18l-4.78,7.36c-.71-.47-1.41-.95-2.09-1.44Zm2.69,1.83l4.78-7.37c.58.37,1.18.74,1.78,1.09l-4.39,7.61c-.73-.43-1.46-.87-2.17-1.33Zm2.79,1.68l4.39-7.6c.6.34,1.21.67,1.83.99l-3.98,7.82c-.75-.39-1.5-.79-2.23-1.21Zm2.86,1.54l3.99-7.83c.62.31,1.25.61,1.88.9l-3.57,8.03c-.77-.35-1.54-.72-2.29-1.1Z"
            />
            <path
              className={styles.cls17}
              d="m101.56,212.25l8.34-2.71c.22.66.45,1.32.69,1.96l-5.78,2.22h1.98l4.05-1.56c.2.52.42,1.04.65,1.56h.77c-2.83-6.5-4.37-13.63-4.37-21.01,0-1.67.08-3.39.25-5.13.02-.2-.12-.37-.32-.39-.19-.01-.37.12-.39.32-.07.69-.11,1.37-.15,2.05l-8.78-.46c.03-.53.07-1.07.12-1.63.02-.2-.13-.37-.32-.38-.21,0-.37.13-.38.32-.16,1.92-.24,3.65-.24,5.29,0,7.3,1.28,14.38,3.63,21.01h.77c-.18-.49-.36-.98-.52-1.47Zm-3.09-22.43l8.77.46c-.03.7-.05,1.4-.05,2.08h-8.79c0-.82.03-1.66.08-2.54Zm-.07,3.25h8.79c0,.7.02,1.39.05,2.08l-8.78.46c-.04-.84-.06-1.69-.07-2.54Zm.11,3.25l8.77-.46c.04.7.09,1.39.16,2.08l-8.74.92c-.08-.84-.15-1.69-.2-2.53Zm.27,3.24l8.73-.92c.08.69.17,1.38.27,2.07l-8.67,1.37c-.13-.84-.24-1.68-.33-2.52Zm.44,3.22l8.68-1.37c.11.69.24,1.37.38,2.05l-8.59,1.83c-.17-.83-.33-1.66-.47-2.5Zm.62,3.19l8.58-1.82c.15.68.31,1.36.48,2.03l-8.47,2.27c-.22-.82-.41-1.64-.6-2.47Zm.77,3.16l8.48-2.27c.18.67.38,1.34.59,2l-8.35,2.71c-.26-.81-.5-1.62-.72-2.44Z"
            />
            <polygon className={styles.cls10} points="134.25 248.46 137.45 241.49 138.17 246.04 134.25 248.46" />
            <path
              className={styles.cls21}
              d="m106.47,214.08c-.14,0-.28-.09-.33-.23-2.63-6.75-3.96-13.87-3.96-21.14,0-.26,0-.52.02-.79v-.47c.02-.2.18-.35.38-.35.2,0,.35.17.35.36v.48c-.02.25-.03.51-.03.76,0,7.19,1.32,14.21,3.92,20.88.07.18-.02.39-.2.46-.04.02-.09.02-.13.02Z"
            />
            <path
              className={styles.cls8}
              d="m106.47,213.72c1.83,4.71,4.26,9.12,7.19,13.14l3.98,4.89c5.32,5.85,11.84,10.59,19.14,13.87"
            />
          </g>
          <g id="Floor">
            <polygon
              id="Floor2"
              className={styles.cls5}
              points="134.98 86.3 134.98 62.37 190.31 62.37 204.96 69.21 194.08 93.7 178.66 86.72 134.98 86.3"
            />
            <path
              id="Floor-2"
              data-name="Floor"
              className={styles.cls5}
              d="m160.53,117.71c-41.42,0-75,33.58-75,75,0,7.06,1,14.54,2.82,21.01h26.31l25.04,25.04v26.13c6.47,1.82,13.78,2.82,20.83,2.82,41.42,0,75-33.58,75-75s-33.58-75-75-75Zm0,93c-9.94,0-18-8.06-18-18s8.06-18,18-18,18,8.06,18,18-8.06,18-18,18Z"
            />
            <polygon
              className={styles.cls5}
              points="296.15 116.93 296.15 78.98 334.38 90.7 334.38 117.07 296.15 116.93"
            />
          </g>
          <rect className={styles.cls13} x="212.61" y="179.42" width="12.14" height="26.3" />
          <g>
            <polyline
              className={styles.cls7}
              points="524.77 20.3 524.77 13.4 752.22 13.4 851.63 20.44 877.8 36.28 877.8 269.44 851.63 285.21 829.03 285.21"
            />
            <polyline
              className={styles.cls7}
              points="193.94 50.09 224.29 20.51 828.33 20.51 872.22 45.28 872.22 260.3 828.33 285.28 274.31 285.28 278.5 279.7 803.15 279.7 848.49 256.82 848.49 48.63 803.15 26.02 218.98 26.02"
            />
            <polyline
              className={styles.cls7}
              points="206.57 37.89 780.82 37.89 696.68 152.3 780.82 268.12 470.08 268.12 467.43 265.47 288.19 265.47 289.45 262.68 447.61 262.68 447.61 117.21 285.89 117.21 287.43 119.16 445.59 119.16 445.59 260.72 290.5 260.72"
            />
            <polyline className={styles.cls7} points="803.15 279.7 780.82 268.12 848.49 256.82" />
            <polyline className={styles.cls7} points="848.49 48.63 780.82 37.89 803.15 26.02" />
            <line className={styles.cls7} x1="828.33" y1="20.51" x2="807.73" y2="28.05" />
            <line className={styles.cls7} x1="851.63" y1="20.44" x2="838.19" y2="26" />
            <line className={styles.cls7} x1="877.49" y1="36.33" x2="859.22" y2="37.82" />
            <line className={styles.cls7} x1="872.22" y1="260.3" x2="840.26" y2="260.93" />
            <line className={styles.cls7} x1="828.33" y1="285.28" x2="808.1" y2="277.4" />
            <line className={styles.cls7} x1="851.63" y1="285.21" x2="838.17" y2="279.77" />
            <line className={styles.cls7} x1="877.8" y1="269.44" x2="858.75" y2="268.05" />
            <line className={styles.cls7} x1="872.22" y1="45.28" x2="841.24" y2="44.93" />
            <polyline className={styles.cls7} points="207.45 53.91 216.94 44.56 775.87 44.56" />
            <line className={styles.cls7} x1="209.77" y1="51.72" x2="420.43" y2="117.21" />
            <polyline
              className={styles.cls7}
              points="210.84 50.65 420.7 115.16 463.4 115.16 461.22 152.09 468.01 259.86 470.08 268.12"
            />
            <line className={styles.cls7} x1="467.43" y1="265.47" x2="447.61" y2="262.68" />
            <line className={styles.cls7} x1="447.61" y1="117.21" x2="463.4" y2="115.16" />
            <line className={styles.cls7} x1="696.68" y1="152.3" x2="461.26" y2="152.3" />
            <polyline
              className={styles.cls7}
              points="293.03 130.28 428.47 130.28 428.47 260.72 425.4 260.72 425.4 133.35 294.43 133.35"
            />
            <rect className={styles.cls7} x="428.47" y="256.68" width="17.12" height="1.57" />
            <rect className={styles.cls7} x="428.47" y="238.68" width="17.12" height="1.57" />
            <rect className={styles.cls7} x="428.47" y="195.04" width="17.12" height="1.57" />
            <rect className={styles.cls7} x="428.47" y="152.08" width="17.12" height="1.57" />
            <rect className={styles.cls7} x="428.47" y="130.31" width="17.12" height="1.57" />
            <rect className={styles.cls7} x="423.23" y="119.16" width="1.57" height="11.12" />
            <rect className={styles.cls7} x="373.27" y="119.16" width="1.57" height="11.12" />
            <rect className={styles.cls7} x="334.13" y="119.16" width="1.57" height="11.12" />
            <rect className={styles.cls7} x="294.86" y="119.16" width="1.57" height="11.12" />
          </g>
          <path
            className={styles.cls18}
            d="m331.72,98.15c.19.06.38-.05.44-.23l2.84-9.2c.06-.19-.05-.38-.23-.44l-.1-.03c-.19-.06-.38.05-.44.23l-2.73,8.85c-4.59-1.73-7.05-6.71-5.6-11.42.06-.19-.05-.38-.23-.44s-.38.05-.44.23c-1.59,5.13,1.14,10.57,6.19,12.37.04.01.08.02.12.02.03,0,.05.04.08.05l.1.03h0Z"
          />
          <rect className={styles.cls13} x="300.8" y="103.95" width="12.14" height="12.05" />
          <g id="Machines">
            <rect
              className={styles.cls9}
              x="201.64"
              y="74.42"
              width="21.05"
              height="19.23"
              transform="translate(371.8 247.09) rotate(-156)"
            />
          </g>
          <g id="Dome">
            <g>
              <line className={styles.cls7} x1="170.53" y1="192.71" x2="150.53" y2="192.71" />
              <line className={styles.cls7} x1="160.53" y1="202.71" x2="160.53" y2="182.71" />
            </g>
            <g id="Solid_Walls" data-name="Solid Walls">
              <circle className={styles.cls16} cx="160.53" cy="192.71" r="8.35" />
              <circle className={styles.cls11} cx="160.53" cy="192.71" r="75.6" />
              <circle className={styles.cls4} cx="160.53" cy="192.71" r="144.15" />
              <circle className={styles.cls7} cx="160.53" cy="192.71" r="146.5" />
              <circle className={styles.cls7} cx="160.53" cy="192.71" r="141.9" />
            </g>
            <g id="Walls">
              <polygon
                className={styles.cls7}
                points="178.61 88.14 133.77 88.14 133.77 61.07 190.52 61.07 190.52 62.37 135.08 62.37 135.08 86.51 178.56 86.51 178.61 88.14"
              />
              <polygon
                className={styles.cls7}
                points="177.79 88.19 222.61 108.23 234.69 80.94 190.52 61.07 189.99 62.26 232.97 81.6 222.08 106.22 178.56 86.51 177.79 88.19"
              />
              <rect
                className={styles.cls7}
                x="199.55"
                y="67.73"
                width="1.3"
                height="28.25"
                transform="translate(349.79 238.05) rotate(-156)"
              />
              <rect className={styles.cls7} x="145.76" y="73.36" width="32.72" height="2.06" />
            </g>
            <g id="Stairs">
              <polygon
                className={styles.cls13}
                points="144.96 76.14 144.96 72.81 175.57 72.81 175.57 63.13 135.84 63.13 135.84 68.47 135.84 72.81 135.84 76.14 135.84 85.83 144.96 85.83 178.52 85.83 178.52 76.14 144.96 76.14"
              />
              <line className={styles.cls13} x1="175.48" y1="76.26" x2="175.48" y2="85.78" />
              <line className={styles.cls13} x1="172.48" y1="76.26" x2="172.48" y2="85.78" />
              <line className={styles.cls13} x1="169.48" y1="76.26" x2="169.48" y2="85.78" />
              <line className={styles.cls13} x1="166.48" y1="76.26" x2="166.48" y2="85.78" />
              <line className={styles.cls13} x1="163.48" y1="76.26" x2="163.48" y2="85.78" />
              <line className={styles.cls13} x1="160.48" y1="76.26" x2="160.48" y2="85.78" />
              <line className={styles.cls13} x1="157.48" y1="76.26" x2="157.48" y2="85.78" />
              <line className={styles.cls13} x1="154.48" y1="76.26" x2="154.48" y2="85.78" />
              <line className={styles.cls13} x1="151.48" y1="76.26" x2="151.48" y2="85.78" />
              <line className={styles.cls13} x1="148.48" y1="76.26" x2="148.48" y2="85.78" />
              <line className={styles.cls13} x1="145.48" y1="76.26" x2="145.48" y2="85.78" />
              <line className={styles.cls13} x1="148.48" y1="63.26" x2="148.48" y2="72.78" />
              <line className={styles.cls13} x1="151.48" y1="63.26" x2="151.48" y2="72.78" />
              <line className={styles.cls13} x1="154.48" y1="63.26" x2="154.48" y2="72.78" />
              <line className={styles.cls13} x1="157.48" y1="63.26" x2="157.48" y2="72.78" />
              <line className={styles.cls13} x1="160.48" y1="63.26" x2="160.48" y2="72.78" />
              <line className={styles.cls13} x1="163.48" y1="63.26" x2="163.48" y2="72.78" />
              <line className={styles.cls13} x1="166.48" y1="63.26" x2="166.48" y2="72.78" />
              <line className={styles.cls13} x1="169.48" y1="63.26" x2="169.48" y2="72.78" />
              <line className={styles.cls13} x1="172.48" y1="63.26" x2="172.48" y2="72.78" />
              <g id="Arrow">
                <polygon className={styles.cls10} points="173.12 72.02 173.12 64.35 175.68 68.19 173.12 72.02" />
                <polyline className={styles.cls6} points="173.96 68.19 140.57 68.19 140.57 80.98 178.75 80.98" />
              </g>
            </g>
          </g>
          <g id="TopStairs">
            <path
              className={styles.cls18}
              d="m237.72,333.23l-.35-.64c-.55.3-1.09.62-1.64.92l-4.35-8.19c.51-.28,1.01-.57,1.52-.85l-.33-.61c-21.38,11.79-45.94,18.51-72.03,18.51-23.08,0-44.96-5.26-64.51-14.63l-.3.62c.4.19.79.39,1.19.58l-3.92,8.4c-.44-.21-.88-.43-1.32-.65l-.32.66c20.96,10.06,44.42,15.71,69.18,15.71,27.97,0,54.28-7.2,77.19-19.84Zm-6.98-7.58l4.35,8.19c-.61.32-1.22.65-1.83.97l-4.21-8.26c.57-.29,1.12-.59,1.69-.89Zm-2.32,1.21l4.21,8.26c-.61.31-1.23.62-1.85.92l-4.07-8.33c.57-.28,1.14-.56,1.71-.85Zm-2.34,1.17l4.07,8.33c-.62.3-1.24.59-1.87.89l-3.92-8.4c.58-.27,1.15-.54,1.72-.82Zm-2.37,1.12l3.92,8.4c-.63.29-1.25.58-1.88.87l-3.77-8.47c.58-.26,1.16-.53,1.73-.8Zm-2.38,1.08l3.77,8.47c-.63.28-1.26.56-1.9.83l-3.62-8.54c.58-.25,1.17-.51,1.75-.77Zm-2.4,1.05l3.62,8.54c-.63.27-1.28.52-1.92.78l-3.47-8.6c.59-.24,1.18-.48,1.77-.72Zm-2.42.99l3.47,8.6c-.64.26-1.28.51-1.92.76l-3.32-8.66c.59-.23,1.18-.46,1.77-.7Zm-2.44.95l3.32,8.66c-.64.25-1.29.5-1.93.74l-3.17-8.72c.6-.22,1.19-.45,1.78-.68Zm-2.45.92l3.17,8.72c-.65.24-1.3.46-1.95.69l-3.02-8.77c.6-.21,1.2-.42,1.8-.64Zm-2.47.87l3.02,8.77c-.65.22-1.31.44-1.96.65l-2.87-8.82c.6-.2,1.21-.4,1.81-.6Zm-2.49.82l2.87,8.82c-.66.21-1.31.43-1.97.63l-2.71-8.87c.61-.19,1.21-.39,1.82-.58Zm-2.5.78l2.71,8.87c-.66.2-1.32.4-1.98.59l-2.56-8.92c.61-.18,1.22-.36,1.83-.55Zm-2.51.75l2.56,8.92c-.66.19-1.33.36-2,.54l-2.4-8.96c.61-.17,1.23-.33,1.84-.5Zm-2.53.69l2.4,8.96c-.67.18-1.33.35-2,.52l-2.24-9c.62-.16,1.23-.32,1.85-.48Zm-2.54.65l2.24,9c-.67.17-1.34.33-2.01.49l-2.09-9.04c.62-.15,1.24-.3,1.85-.45Zm-2.55.61l2.09,9.04c-.67.15-1.35.3-2.02.44l-1.93-9.07c.62-.13,1.24-.27,1.86-.41Zm-2.56.56l1.93,9.07c-.67.14-1.35.28-2.03.41l-1.77-9.1c.62-.12,1.25-.25,1.87-.38Zm-2.57.51l1.77,9.1c-.68.13-1.35.27-2.03.39l-1.61-9.13c.63-.11,1.25-.24,1.87-.36Zm-2.57.47l1.61,9.13c-.68.12-1.36.23-2.04.34l-1.45-9.16c.63-.1,1.26-.2,1.88-.31Zm-2.58.43l1.45,9.16c-.68.11-1.36.2-2.05.3l-1.29-9.18c.63-.09,1.26-.18,1.89-.27Zm-2.59.37l1.29,9.18c-.68.09-1.37.19-2.05.28l-1.13-9.21c.63-.08,1.26-.17,1.89-.26Zm-2.6.34l1.13,9.21c-.68.08-1.37.16-2.06.24l-.97-9.22c.63-.07,1.26-.14,1.9-.22Zm-84.95-4.35l3.92-8.4c.58.27,1.15.53,1.74.79l-3.77,8.47c-.63-.28-1.26-.57-1.88-.86Zm2.53,1.15l3.77-8.47c.58.26,1.16.52,1.75.77l-3.62,8.54c-.64-.27-1.27-.55-1.9-.83Zm2.55,1.11l3.62-8.54c.59.25,1.18.48,1.77.72l-3.47,8.6c-.64-.26-1.28-.52-1.92-.78Zm2.57,1.05l3.47-8.6c.59.24,1.18.47,1.78.7l-3.32,8.66c-.64-.25-1.29-.5-1.93-.76Zm2.59,1.01l3.32-8.66c.59.23,1.19.46,1.79.68l-3.17,8.72c-.65-.24-1.29-.49-1.94-.73Zm2.61.97l3.17-8.72c.6.22,1.2.43,1.8.64l-3.02,8.77c-.65-.23-1.3-.46-1.95-.69Zm2.62.93l3.02-8.77c.6.21,1.21.4,1.81.6l-2.87,8.82c-.66-.21-1.31-.42-1.97-.65Zm2.64.87l2.87-8.82c.61.19,1.21.39,1.82.58l-2.71,8.87c-.66-.2-1.32-.41-1.97-.63Zm2.66.83l2.71-8.87c.61.18,1.22.37,1.83.55l-2.56,8.92c-.66-.19-1.32-.39-1.98-.59Zm2.67.79l2.56-8.92c.61.17,1.23.33,1.84.5l-2.4,8.96c-.67-.18-1.34-.35-2-.54Zm2.68.73l2.4-8.96c.61.16,1.23.32,1.85.47l-2.24,9c-.67-.17-1.34-.34-2.01-.52Zm2.7.68l2.24-9c.62.15,1.23.31,1.85.45l-2.09,9.04c-.67-.16-1.34-.33-2.01-.49Zm2.71.64l2.09-9.04c.62.14,1.24.27,1.87.41l-1.93,9.07c-.68-.14-1.35-.29-2.02-.44Zm2.72.59l1.93-9.07c.62.13,1.25.25,1.87.37l-1.77,9.1c-.68-.13-1.36-.26-2.03-.4Zm2.73.54l1.77-9.1c.62.12,1.25.24,1.88.35l-1.61,9.13c-.68-.12-1.36-.25-2.03-.38Zm2.74.5l1.61-9.13c.63.11,1.25.21,1.88.31l-1.45,9.16c-.68-.11-1.36-.22-2.04-.34Zm2.74.46l1.45-9.16c.63.1,1.26.18,1.89.27l-1.29,9.18c-.68-.1-1.37-.19-2.05-.29Zm2.75.39l1.29-9.18c.63.09,1.26.17,1.89.25l-1.13,9.21c-.69-.08-1.37-.18-2.05-.27Zm2.76.35l1.13-9.21c.63.07,1.26.15,1.9.22l-.97,9.22c-.69-.07-1.37-.15-2.06-.24Zm3.73-8.91c5,.5,10.07.76,15.2.76s10.37-.27,15.45-.79l.97,9.22c-5.4.55-10.88.84-16.42.84s-10.85-.28-16.17-.81l.97-9.22Z"
            />
            <polygon className={styles.cls10} points="100.12 331.18 96.87 338.14 96.17 333.58 100.12 331.18" />
            <path
              className={styles.cls6}
              d="m97.75,334.46c19.19,8.51,40.43,13.25,62.78,13.25,24.82,0,48.27-5.84,69.06-16.21"
            />
            <g>
              <path
                className={styles.cls12}
                d="m100.27,187.45c-.15,1.73-.24,3.49-.24,5.26,0,26.14,16.58,48.4,39.79,56.86"
              />
              <path
                className={styles.cls12}
                d="m90.77,187.16c-.14,1.83-.24,3.68-.24,5.55,0,31.45,20.74,58.05,49.29,66.88"
              />
            </g>
            <g>
              <path
                className={styles.cls18}
                d="m109.98,225.96c-.13-.2-.25-.4-.38-.6l-7.97,5.18c.13.2.26.39.39.59l7.96-5.17Z"
              />
              <path
                className={styles.cls18}
                d="m103.09,211.75c-.07-.22-.15-.45-.22-.68l-9.03,2.93c.07.23.14.45.21.68l9.03-2.94Z"
              />
              <path
                className={styles.cls18}
                d="m108.32,223.27c-.12-.2-.24-.41-.36-.61l-8.23,4.75c.12.21.23.41.35.62l8.23-4.75Z"
              />
              <path
                className={styles.cls18}
                d="m102.18,208.71c-.06-.23-.12-.46-.18-.69l-9.18,2.46c.06.23.12.46.19.68l9.17-2.46Z"
              />
              <path
                className={styles.cls18}
                d="m106.79,220.5c-.11-.21-.22-.42-.33-.63l-8.46,4.31c.11.21.21.42.32.63l8.47-4.31Z"
              />
              <path
                className={styles.cls18}
                d="m100.03,192.71c0-.12,0-.24,0-.35h-9.5c0,.12,0,.24,0,.35s0,.24,0,.36h9.5c0-.12,0-.24,0-.36Z"
              />
              <path
                className={styles.cls18}
                d="m90.63,189.4l9.49.5c.01-.24.03-.47.04-.71l-9.49-.5c-.01.24-.02.47-.04.71Z"
              />
              <path
                className={styles.cls18}
                d="m101.43,205.64c-.05-.23-.11-.46-.15-.69l-9.3,1.98c.05.23.1.46.15.69l9.3-1.98Z"
              />
              <path
                className={styles.cls18}
                d="m100.1,195.52l-9.49.5c.01.24.03.47.04.71l9.49-.5c-.01-.24-.03-.47-.04-.71Z"
              />
              <path
                className={styles.cls18}
                d="m100.41,199.39c-.03-.23-.05-.47-.07-.71l-9.45.99c.02.24.05.47.07.71l9.44-.99Z"
              />
              <path
                className={styles.cls18}
                d="m100.83,202.53c-.04-.23-.07-.47-.11-.7l-9.38,1.49c.04.23.06.47.1.7l9.38-1.49Z"
              />
              <path
                className={styles.cls18}
                d="m111.8,228.55c-.14-.19-.28-.38-.42-.57l-7.68,5.58c.14.19.27.39.41.58l7.69-5.59Z"
              />
              <path
                className={styles.cls18}
                d="m113.74,231.06c-.15-.18-.3-.37-.44-.55l-7.39,5.98c.15.18.3.37.45.55l7.38-5.98Z"
              />
              <path
                className={styles.cls18}
                d="m136.25,248.13c-.22-.09-.44-.18-.65-.28l-3.86,8.68c.22.1.43.19.65.29l3.87-8.68Z"
              />
              <path
                className={styles.cls18}
                d="m130.59,245.28c-.21-.12-.41-.23-.62-.35l-4.75,8.23c.2.12.41.23.62.35l4.75-8.23Z"
              />
              <path
                className={styles.cls18}
                d="m127.88,243.64c-.2-.13-.4-.26-.6-.39l-5.17,7.97c.2.13.4.26.6.39l5.17-7.97Z"
              />
              <path className={styles.cls18} d="m139.82,257.6v-2.3l-1.26,3.87c.22.07.45.15.67.22l.58-1.8Z" />
              <path
                className={styles.cls18}
                d="m139.18,249.32c-.22-.08-.44-.17-.66-.26l-3.41,8.87c.22.09.44.17.66.25l3.4-8.87Z"
              />
              <path
                className={styles.cls18}
                d="m133.38,246.79c-.21-.11-.42-.22-.63-.33l-4.31,8.46c.21.11.42.22.63.33l4.31-8.46Z"
              />
              <path
                className={styles.cls18}
                d="m115.82,233.45c-.16-.17-.32-.35-.48-.52l-7.06,6.35c.16.18.32.35.48.52l7.06-6.35Z"
              />
              <path
                className={styles.cls18}
                d="m118.01,235.73c-.17-.17-.34-.33-.5-.5l-6.71,6.71c.17.17.33.34.5.51l6.72-6.72Z"
              />
              <path
                className={styles.cls18}
                d="m125.26,241.86c-.19-.14-.38-.28-.57-.42l-5.58,7.68c.19.14.38.28.57.42l5.58-7.69Z"
              />
              <path
                className={styles.cls18}
                d="m120.32,237.91c-.18-.16-.35-.32-.52-.48l-6.36,7.06c.17.16.35.32.53.47l6.35-7.06Z"
              />
              <path
                className={styles.cls18}
                d="m122.74,239.94c-.18-.15-.37-.29-.56-.44l-5.98,7.38c.18.15.37.3.55.44l5.98-7.38Z"
              />
            </g>
            <polygon className={styles.cls10} points="134.22 256.84 137.42 249.86 138.14 254.42 134.22 256.84" />
            <path className={styles.cls6} d="m94.97,194.39c.68,27.06,17.73,50.04,41.63,59.41" />
          </g>
          <g id="text">
            <g id="t1">
              <g class="cls-27">
                <text className={styles.cls19} transform="translate(155.37 149.4)">
                  <tspan className={styles.cls14} x="0" y="0">
                    P
                  </tspan>
                  <tspan x="4.17" y="0">
                    ier
                  </tspan>
                  <tspan x="-22.22" y="7.2">
                    In
                  </tspan>
                  <tspan className={styles.cls28} x="-16.35" y="7.2">
                    t
                  </tspan>
                  <tspan x="-14.03" y="7.2">
                    e
                  </tspan>
                  <tspan className={styles.cls24} x="-10.4" y="7.2">
                    r
                  </tspan>
                  <tspan className={styles.cls23} x="-8.05" y="7.2">
                    m
                  </tspan>
                  <tspan x="-1.67" y="7.2">
                    edia
                  </tspan>
                  <tspan className={styles.cls3} x="11.18" y="7.2">
                    t
                  </tspan>
                  <tspan className={styles.cls22} x="13.5" y="7.2">
                    e Floor
                  </tspan>
                </text>
                <text className={styles.cls19} transform="translate(155.37 149.4)">
                  <tspan className={styles.cls14} x="0" y="0">
                    P
                  </tspan>
                  <tspan x="4.17" y="0">
                    ier
                  </tspan>
                  <tspan x="-22.22" y="7.2">
                    In
                  </tspan>
                  <tspan className={styles.cls28} x="-16.35" y="7.2">
                    t
                  </tspan>
                  <tspan x="-14.03" y="7.2">
                    e
                  </tspan>
                  <tspan className={styles.cls24} x="-10.4" y="7.2">
                    r
                  </tspan>
                  <tspan className={styles.cls23} x="-8.05" y="7.2">
                    m
                  </tspan>
                  <tspan x="-1.67" y="7.2">
                    edia
                  </tspan>
                  <tspan className={styles.cls3} x="11.18" y="7.2">
                    t
                  </tspan>
                  <tspan className={styles.cls22} x="13.5" y="7.2">
                    e Floor
                  </tspan>
                </text>
              </g>
            </g>
            <g id="t2" className={styles.cls25}>
              <g class="cls-27">
                <text className={styles.cls20} transform="translate(340.05 76.62)">
                  <tspan x="0" y="0">
                    Roof
                  </tspan>
                </text>
                <text className={styles.cls20} transform="translate(340.05 76.62)">
                  <tspan x="0" y="0">
                    Roof
                  </tspan>
                </text>
              </g>
              <g class="cls-27">
                <text className={styles.cls20} transform="translate(212.71 193.75)">
                  <tspan x="0" y="0">
                    Ha
                  </tspan>
                  <tspan className={styles.cls2} x="5.61" y="0">
                    t
                  </tspan>
                  <tspan className={styles.cls26} x="7.16" y="0">
                    c
                  </tspan>
                  <tspan x="9.38" y="0">
                    h
                  </tspan>
                </text>
                <text className={styles.cls20} transform="translate(212.71 193.75)">
                  <tspan x="0" y="0">
                    Ha
                  </tspan>
                  <tspan className={styles.cls2} x="5.61" y="0">
                    t
                  </tspan>
                  <tspan className={styles.cls26} x="7.16" y="0">
                    c
                  </tspan>
                  <tspan x="9.38" y="0">
                    h
                  </tspan>
                </text>
              </g>
              <g class="cls-27">
                <text className={styles.cls20} transform="translate(206.67 84.73)">
                  <tspan x="0" y="0">
                    El
                  </tspan>
                  <tspan className={styles.cls1} x="3.75" y="0">
                    e
                  </tspan>
                  <tspan className={styles.cls15} x="6.13" y="0">
                    v
                  </tspan>
                  <tspan x="8.16" y="0">
                    . 3
                  </tspan>
                </text>
                <text className={styles.cls20} transform="translate(206.67 84.73)">
                  <tspan x="0" y="0">
                    El
                  </tspan>
                  <tspan className={styles.cls1} x="3.75" y="0">
                    e
                  </tspan>
                  <tspan className={styles.cls15} x="6.13" y="0">
                    v
                  </tspan>
                  <tspan x="8.16" y="0">
                    . 3
                  </tspan>
                </text>
              </g>
              <g class="cls-27">
                <text className={styles.cls20} transform="translate(300.74 111.41)">
                  <tspan x="0" y="0">
                    Ha
                  </tspan>
                  <tspan className={styles.cls2} x="5.61" y="0">
                    t
                  </tspan>
                  <tspan className={styles.cls26} x="7.16" y="0">
                    c
                  </tspan>
                  <tspan x="9.38" y="0">
                    h
                  </tspan>
                </text>
                <text className={styles.cls20} transform="translate(300.74 111.41)">
                  <tspan x="0" y="0">
                    Ha
                  </tspan>
                  <tspan className={styles.cls2} x="5.61" y="0">
                    t
                  </tspan>
                  <tspan className={styles.cls26} x="7.16" y="0">
                    c
                  </tspan>
                  <tspan x="9.38" y="0">
                    h
                  </tspan>
                </text>
              </g>
            </g>
          </g>
        </g>

        <rect id={this.overlayId} pointerEvents="all" fill="none" width="882.42" height="461.23" />

        <g id={this.deviceId}>{this.props.hideHVAC ? '' : this.getDevices()}</g>
      </React.Fragment>
    );
  }
}
