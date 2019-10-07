import React from 'react';
import {
  m3RotatorStateMap,
  m3PortSelectedStateMap,
  m3InPositionStateMap,
  m1CoverStateStateMap,
  nasmythRotatorInPositionStateMap,
  hexpodInPositionStateMap,
  stateToStyleMount,
  m1CoverLimitSwitchesStateMap,
} from '../../../Config';

import styles from './LightPath.module.css';
import Hoverable from '../../GeneralPurpose/Hoverable/Hoverable';
import InfoPanel from '../../GeneralPurpose/InfoPanel/InfoPanel';
import SummaryPanel from '../../GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from '../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../GeneralPurpose/SummaryPanel/Title';
import StatusText from '../../GeneralPurpose/StatusText/StatusText';

const drawBackground = () => {
  return (
    <>
      {/* baffles */}
      <path className={styles.st1} d="M141.7 80.4h-42l1.6-42.9h38.8z M104.5 11.4h33.9v26.1h-33.9z" />
      <path
        className={styles.st1}
        d="M138.7 269.4h-34l2.4 -59.9 1.7 -5.3 -.2 -27.2 1.1 -1.3 .3 -12.5 1.8-.6.2-6.2h19.4l.3 6.1 1.8 1 .2 12.1 1.2 1.6-.2 26.8 1.7 5.2z"
      />
      <path className={styles.st1} d="M37.7 268.4h168v34h-168zM43.7 390.4h156v12h-156z" />
      {/* frame back */}
      <path
        className={styles.st1}
        d="M172.7 390.4h-102l18 15h66zM193.7 279.4h12v19h-12zM37.7 279.4h12v19h-12zM43.7 330.4s75.4 9.1 78 9.1c3.9-.1 78-9.1 78-9.1v-28H193v21H49.7v-21h-6v28z"
      />
      {/* frame front */}
      <path className={styles.st1} d="M216.7 390.4h14l-3-137h-18l2 91-16 24h-145l-18-24 1-91h-19l-1 137h13z" />
      {/* outer rods */}
      <path className={styles.st2} d="M63.4 25.5H51.7l-12 244.4 164-.1-11.2-243.7h-11.3" />
      {/* inner rods */}
      <path className={styles.st2} d="M191.3 26.5l-63.2 242.9h-12.6L51.1 25.9" />
      {/* top rod */}
      <path className={styles.st1} strokeWidth={3} strokeMiterlimit={10} d="M59.5 25.9h126.4" />
    </>
  );
};

const drawM1 = (props) => {
  return (
    <Hoverable>
      <svg viewBox="0 0 100 10" x={121.5 - 140 / 2} y={307} width={140} height={15}>
        <path
          className={styles.highlighted}
          d="M 0 0 
               L 0 10
               L 100 10
               L 100 0
               Q 50,6 0,0"
        ></path>
      </svg>
      <foreignObject
        x={10 + 121.5 + 140 / 2}
        y={270}
        width="1600"
        height="1600"
        transform-origin={`${10 + 121.5 + 140 / 2} ${270}`}
        transform="scale(0.5,0.5)"
      >
        <InfoPanel title="M1">
          <SummaryPanel className={[styles.summaryPanel, styles.m1Panel].join(' ')}>
            <Label>Cell load</Label>
            <Value>{props.loadCell}</Value>
            <Label>M1 Air pressure</Label>
            <Value>{props.m1AirPressure}</Value>
          </SummaryPanel>
        </InfoPanel>
      </foreignObject>
    </Hoverable>
  );
};

const drawM1Cover = (props) => {
  const m1CoverState = props.m1CoverState;
  //ATPneumatics
  const m1CoverStateText = m1CoverStateStateMap[props.m1CoverState];
  const m1CoverLimitSwitches = props.m1CoverLimitSwitches;
  const getLimitSwitchStatus = (number) => {
    if (!m1CoverLimitSwitches[`cover${number}ClosedActive`] && m1CoverLimitSwitches[`cover${number}OpenActive`])
      return m1CoverLimitSwitchesStateMap[1];
    if (m1CoverLimitSwitches[`cover${number}ClosedActive`] && !m1CoverLimitSwitches[`cover${number}OpenActive`])
      return m1CoverLimitSwitchesStateMap[2];
    return m1CoverLimitSwitchesStateMap[0];
  };
  let m1CoverLimitSwitchesText = {
    cover1Status: getLimitSwitchStatus(1),
    cover2Status: getLimitSwitchStatus(2),
    cover3Status: getLimitSwitchStatus(3),
    cover4Status: getLimitSwitchStatus(4),
  };
  let m1CoverClass = styles.ok;
  if (m1CoverState === 3) m1CoverClass = styles.moving;
  if (m1CoverState === 4) m1CoverClass = styles.warning;
  if (m1CoverState === 0) m1CoverClass = styles.warning;

  let mirrorCoversAngle = 0;
  if (m1CoverState === 1) mirrorCoversAngle = 0;
  if (m1CoverState === 2) mirrorCoversAngle = 90;
  if (m1CoverState === 3) mirrorCoversAngle = 45;

  return (
    <Hoverable>
      <g>
        <rect
          className={[styles.highlighted, m1CoverClass].join(' ')}
          x={42}
          y={263}
          width={60}
          height={5}
          style={{
            transform: `rotateZ(${-mirrorCoversAngle}deg)`,
            transformOrigin: `42px ${263 + 3}px`,
          }}
        ></rect>
        <rect
          className={[styles.highlighted, m1CoverClass].join(' ')}
          x={141}
          y={263}
          width={60}
          height={5}
          style={{
            transform: `rotateZ(${mirrorCoversAngle}deg)`,
            transformOrigin: `${141 + 60}px ${263 + 3}px`,
          }}
        ></rect>
      </g>
      <foreignObject
        x={121.5 - 65}
        y={140 - Math.sin((mirrorCoversAngle * Math.PI) / 180) * 50}
        width="1600"
        height="230"
        transform-origin={`${121.5 - 65} ${140 - Math.sin((mirrorCoversAngle * Math.PI) / 180) * 50}`}
        transform="scale(0.5,0.5)"
      >
        <InfoPanel title="M1 Cover">
          <SummaryPanel className={[styles.summaryPanel, styles.m1Panel].join(' ')}>
            <Label>State</Label>
            <Value>
              <StatusText status={stateToStyleMount[m1CoverStateText]}>{m1CoverStateText}</StatusText>
            </Value>
            <Label>Cover 1</Label>
            <Value>
              <StatusText status={stateToStyleMount[m1CoverLimitSwitchesText['cover1Status']]}>
                {m1CoverLimitSwitchesText['cover1Status']}
              </StatusText>
            </Value>
            <Label>Cover 2</Label>
            <Value>
              <StatusText status={stateToStyleMount[m1CoverLimitSwitchesText['cover2Status']]}>
                {m1CoverLimitSwitchesText['cover2Status']}
              </StatusText>
            </Value>
            <Label>Cover 3</Label>
            <Value>
              <StatusText status={stateToStyleMount[m1CoverLimitSwitchesText['cover3Status']]}>
                {m1CoverLimitSwitchesText['cover3Status']}
              </StatusText>
            </Value>
            <Label>Cover 4</Label>
            <Value>
              <StatusText status={stateToStyleMount[m1CoverLimitSwitchesText['cover4Status']]}>
                {m1CoverLimitSwitchesText['cover4Status']}
              </StatusText>
            </Value>
          </SummaryPanel>
        </InfoPanel>
      </foreignObject>
    </Hoverable>
  );
};

const drawM3 = (props) => {
  const m3State = 3;
  const m3InPosition = props.m3InPosition;

  const m3StateText = m3RotatorStateMap[props.m3State];
  const m3PortSelectedText = m3PortSelectedStateMap[props.m3PortSelected];
  const m3InPositionText = m3InPositionStateMap[props.m3InPosition];

  const m3Class = m3InPosition === 1 ? styles.ok : styles.warning;
  const m3Angle = m3State === 1 ? -45 : 45;
  return (
    <Hoverable>
      <g>
        {m3State < 3 ? (
          <rect
            className={[styles.highlighted, m3Class].join(' ')}
            x={121.5 - 30 / 2}
            y={290}
            width={30}
            height={5}
            style={{
              transform: `rotateZ(${m3Angle}deg)`,
              transformOrigin: `121.5px ${290 + 5 / 2}px`,
            }}
          ></rect>
        ) : null}
        {m3State === 3 ? <circle cx={121.5} cy={292} r={15} className={styles.highlighted}></circle> : null}
      </g>
      <foreignObject
        x={121.5 + 30}
        y={240}
        width="1600"
        height="1600"
        transform-origin={`${121.5 + 30} ${240}`}
        transform="scale(0.5,0.5)"
      >
        <InfoPanel title="M3">
          <SummaryPanel className={styles.summaryPanel}>
            <Label>M3 state</Label>
            <Value>
              <StatusText status={stateToStyleMount[m3StateText]}>{m3StateText}</StatusText>
            </Value>
            <Label>Port selected</Label>
            <Value>
              <StatusText status={stateToStyleMount[m3PortSelectedText]}>{m3PortSelectedText}</StatusText>
            </Value>
            <Label>M3 position</Label>
            <Value>
              <StatusText status={stateToStyleMount[m3InPositionText]}>{m3InPositionText}</StatusText>
            </Value>
          </SummaryPanel>
        </InfoPanel>
      </foreignObject>
    </Hoverable>
  );
};

const drawM2 = (props) => {
  const hexapodInPosition = props.hexapodInPosition;
  const hexapodInPositionText = hexpodInPositionStateMap[props.hexapodInPosition];
  const hexapodClass = hexapodInPosition === 1 ? styles.ok : styles.warning;
  return (
    <Hoverable>
      <rect
        className={[styles.highlighted, hexapodClass].join(' ')}
        x={121.5 - 30 / 2}
        y={30}
        width={30}
        height={5}
      ></rect>
      <foreignObject
        x={121.5 - 65}
        y={40}
        width="1600"
        height="1600"
        transform-origin={`${121.5 - 65} ${40}`}
        transform="scale(0.5,0.5)"
      >
        <InfoPanel title="M2">
          <SummaryPanel className={[styles.summaryPanel].join(' ')}>
            <Label>Position state</Label>
            <Value>
              <StatusText status={stateToStyleMount[hexapodInPositionText]}>{hexapodInPositionText}</StatusText>
            </Value>
            <Label>Position value</Label>
            <Value>{props.hexapodReportedPosition}</Value>
          </SummaryPanel>
        </InfoPanel>
      </foreignObject>
    </Hoverable>
  );
};

const drawPort1 = (props) => {
  const m3PortSelected = props.m3PortSelected;
  const nasmyth1RotatorInPosition = props.nasmyth1RotatorInPosition;
  const nasmyth1RotatorInPositionText = nasmythRotatorInPositionStateMap[props.nasmyth1RotatorInPosition];
  let nasmyth1Class = nasmyth1RotatorInPosition ? styles.ok : styles.warning;
  if (m3PortSelected != 1) nasmyth1Class = styles.disabled;
  return (
    <Hoverable>
      <g>
        <rect
          className={[styles.highlighted, nasmyth1Class].join(' ')}
          x={32 - 30 / 2}
          y={281}
          width={20}
          height={16}
        ></rect>
        <rect
          className={[styles.highlighted, nasmyth1Class].join(' ')}
          x={32 - 5 - 30 / 2}
          y={279}
          width={5}
          height={20}
        ></rect>
      </g>
      <foreignObject
        x={45}
        y={270}
        width="1600"
        height="1600"
        transform-origin={`${45} ${270}`}
        transform="scale(0.5,0.5)"
      >
        <InfoPanel title="Nasmyth rotator 1">
          <SummaryPanel className={[styles.summaryPanel, styles.rotatorPanel].join(' ')}>
            <Label>Position state</Label>
            <Value>
              <StatusText status={stateToStyleMount[nasmyth1RotatorInPositionText]}>
                {nasmyth1RotatorInPositionText}
              </StatusText>
            </Value>
            {/* <Title wide>Limit switches</Title> */}
            <Label>CW limit switch</Label>
            <Value>{props.nasmyth1LimitSwitchCW}</Value>
            <Label>CCW limit switch</Label>
            <Value>{props.nasmyth1LimitSwitchCCW}</Value>
          </SummaryPanel>
        </InfoPanel>
      </foreignObject>
    </Hoverable>
  );
};

const drawPort2 = (props) => {
  const m3PortSelected = props.m3PortSelected;
  const nasmyth2RotatorInPosition = props.nasmyth2RotatorInPosition;
  const nasmyth2RotatorInPositionText = nasmythRotatorInPositionStateMap[props.nasmyth2RotatorInPosition];
  let nasmyth2Class = nasmyth2RotatorInPosition ? styles.ok : styles.warning;
  if (m3PortSelected != 2) nasmyth2Class = styles.disabled;
  return (
    <Hoverable>
      <g>
        <rect
          className={[styles.highlighted, nasmyth2Class].join(' ')}
          x={221 - 30 / 2}
          y={281}
          width={20}
          height={16}
        ></rect>
        <rect
          className={[styles.highlighted, nasmyth2Class].join(' ')}
          x={221 + 20 - 30 / 2}
          y={279}
          width={5}
          height={20}
        ></rect>
      </g>
      <foreignObject
        x={240}
        y={270}
        width="1600"
        height="1600"
        transform-origin={`${240} ${270}`}
        transform="scale(0.5,0.5)"
      >
        <InfoPanel title="Nasmyth rotator 2">
          <SummaryPanel className={[styles.summaryPanel, styles.rotatorPanel].join(' ')}>
            <Label>Position state</Label>
            <Value>
              <StatusText status={stateToStyleMount[nasmyth2RotatorInPositionText]}>
                {nasmyth2RotatorInPositionText}
              </StatusText>
            </Value>
            {/* <Title wide>Limit switches</Title> */}
            <Label>CW limit switch</Label>
            <Value>{props.nasmyth2LimitSwitchCW}</Value>
            <Label>CCW limit switch</Label>
            <Value>{props.nasmyth2LimitSwitchCCW}</Value>
          </SummaryPanel>
        </InfoPanel>
      </foreignObject>
    </Hoverable>
  );
};

const LightPath = (props) => {
  return (
    <div className={styles.container}>
      <svg x={0} y={0} viewBox="0 0 244 416" xmlSpace="preserve">
        {/* Background */}
        {drawBackground()}
        {/* Port 2 */}
        {drawPort2(props)}
        {/* M1 cover */}
        {drawM1Cover(props)}
        {/* M1 */}
        {drawM1(props)}
        {/* M3 container */}
        <path
          className={styles.st1}
          d="M100.7 275.4h4.3v-9h32.7v72l1 2h-18l-17-.1 1.3-1.9V301h-4.3zM133.5 390.4v-21.9l3.2-.1-1.3-6H108l-1.3 5.8h3.3v22.2z"
        />
        {/* M3 */}
        {drawM3(props)}
        {/* M2 */}
        {drawM2(props)}
        {/* Port 1 */}
        {drawPort1(props)}
      </svg>
    </div>
  );
};

export default LightPath;
