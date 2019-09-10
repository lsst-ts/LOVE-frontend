import React from 'react';
import styles from './MountDetail.module.css';

const SvgComponent = (props) => {
  const m3Position = 3;
  const mirrorCoverState = 3;
  const m3Angle = m3Position === 1 ? -45 : 45;
  let mirrorCoversAngle;
  if(mirrorCoverState === 1)
    mirrorCoversAngle = 0;
  if(mirrorCoverState === 2)
    mirrorCoversAngle = 90;
  if(mirrorCoverState === 3)
    mirrorCoversAngle = 45;
  return (
    <div className={styles.container}>
      <svg x={0} y={0} viewBox="0 0 244 416" xmlSpace="preserve" {...props}>
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
        {/* M1 */}
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
        {/* M3 container */}
        <path
          className={styles.st1}
          d="M100.7 275.4h4.3v-9h32.7v72l1 2h-18l-17-.1 1.3-1.9V301h-4.3zM133.5 390.4v-21.9l3.2-.1-1.3-6H108l-1.3 5.8h3.3v22.2z"
        />
        {/* M3 */}
        {m3Position < 3 ? (
          <rect
            className={styles.highlighted}
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
        {m3Position === 3 ? <circle cx={121.5} cy={292} r={15} className={styles.highlighted}></circle> : null}
        {/* M2 */}
        <rect className={styles.highlighted} x={121.5 - 30 / 2} y={30} width={30} height={5}></rect>
        {/* Port 1 */}
        <g>
          <rect className={styles.highlighted} x={32 - 30 / 2} y={281} width={20} height={16}></rect>
          <rect className={styles.highlighted} x={32 - 5 - 30 / 2} y={279} width={5} height={20}></rect>
        </g>
        {/* Port 2 */}
        <g>
          <rect className={styles.highlighted} x={221 - 30 / 2} y={281} width={20} height={16}></rect>
          <rect className={styles.highlighted} x={221 + 20 - 30 / 2} y={279} width={5} height={20}></rect>
        </g>
        {/* M1 cover */}
        <rect
          className={styles.highlighted}
          x={42}
          y={263}
          width={60}
          height={3}
          style={{
            transform: `rotateZ(${-mirrorCoversAngle}deg)`,
            transformOrigin: `42px ${263 + 3}px`,
          }}
        ></rect>
        <rect
          className={styles.highlighted}
          x={141}
          y={263}
          width={60}
          height={3}
          style={{
            transform: `rotateZ(${mirrorCoversAngle}deg)`,
            transformOrigin: `${141 + 60}px ${263 + 3}px`,
          }}
        ></rect>
      </svg>
    </div>
  );
};

export default SvgComponent;
