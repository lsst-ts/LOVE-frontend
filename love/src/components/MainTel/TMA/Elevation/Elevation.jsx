import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { closestEquivalentAngle } from 'Utils';
import styles from './Elevation.module.css';

export default class Elevation extends Component {
  static propTypes = {
    /** Elevation actual position */
    elevationActualPosition: PropTypes.number,
    /** Elevation demand position */
    elevationDemandPosition: PropTypes.number,
  };

  static defaultProps = {
    elevationActualPosition: 0,
    elevationDemandPosition: 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      prevElevationActual: 0,
      prevElevationDemand: 0,
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.elevationActualPosition !== this.props.elevationActualPosition) {
      this.setState((prevState) => ({
        prevElevationActual: closestEquivalentAngle(prevState.prevElevationActual, this.props.elevationActualPosition)
      }));
    }
    if (prevProps.elevationDemandPosition !== this.props.elevationDemandPosition) {
      this.setState((prevState) => ({
        prevElevationDemand: closestEquivalentAngle(prevState.prevElevationDemand, this.props.elevationDemandPosition)
      }));
    }
  }

  render() {
    return (
      <div className={styles.container}>    
        { this.getSvg()}
      </div>
    );
  }

  getSvg = () => {
    const equivalentElevationActual = closestEquivalentAngle(this.state.prevElevationActual, this.props.elevationActualPosition);
    const equivalentElevationDemand = closestEquivalentAngle(this.state.prevElevationDemand, this.props.elevationDemandPosition);
    return (
      <svg
          id="elevationSvg"
          data-name="elevationSvg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 502 502`}
      >
        
        <g
          style={{
            transform: `rotateZ(${equivalentElevationActual}deg)`, transformOrigin: `50% 50%`
          }}
        >
          { this.getMount() }
        </g>
        
        { this.getDemand(equivalentElevationDemand) }
        { this.getBaseMount() }

      </svg>
    );
  }

  getDemand = (equivalentElevationDemand) => {
    return (
      <path
          d="m417.15 218-34.72-74.46H408l-10-12h-21.16l-6-12.87-4.5-22.09V86.19l-.06-.23h38.37l-4-24h-71l-25-15.63h-3V44h-26.23V20.15h-49.54V44h-26.23v2.36h-3L171.63 62h-71l-4 24h39.76l-.06.23V96.6l-4.49 22.09-6 12.87h-21.77l-10 12h26.19L101.43 184H65.6v30.24h-1v10h26.31v50.16l20 6.84v48.12l20 59.27h240l20-59.27v-48.17l20-6.84v-43.1.05l1.68-.79a9.39 9.39 0 0 0 4.56-12.51ZM156.35 86h.23v.64h-.23V86Zm11.3 129.23-3.51-71.63h6.61l43 71.63ZM161.76 95h33.45v18.6l-10.56 18h-8l-14.26-23.8ZM199 74a9 9 0 0 1-17.95.9l13.67-8.56A9 9 0 0 1 199 74Zm8.22-15.47h1.21V62h-6.76Zm87 0 5.46 3.47h-6.76v-3.51Zm12.8 8 13.93 8.72a9 9 0 1 1-13.93-8.72Zm9.72 65.07-10.57-18V95h34.85l-.62 12.8-14.4 23.76Zm-23.82-65.15a9 9 0 0 1 0 15Zm-25.54 15.83A8.89 8.89 0 0 1 264 83a9 9 0 0 1 0-18 8.89 8.89 0 0 1 3.43.68ZM238 83a8.81 8.81 0 0 1-4-1V65.92a9 9 0 1 1 4 17Zm-29.62-16.1V81a9 9 0 0 1 0-14.12Zm18.53 148.29-43-71.63h42v43.78l1 15h47.54l1-15v-43.78h43.4l-43 71.63Zm105-71.63h6.6L335 215.19h-46.09Zm-64.53-85.07V62h-33.46v-3.51ZM118.58 184h-4.74l8.41-18Zm221.61 97.24a93.74 93.74 0 0 1-10.45 21.11H172.07a94.17 94.17 0 0 1-10.45-21.11Zm40.25-115.27 23 49.27h-13Zm.71-101c2.76 0 5 4 5 9s-2.24 9-5 9-5-4-5-9 2.24-8.97 5-8.97Zm-261 18c-2.76 0-5-4-5-9s2.24-9 5-9 5 4 5 9-2.24 9.03-5 9.03ZM372 281.19Z"
          style={{
              strokeMiterlimit: 10,
              stroke: "#e4e4e7",
              strokeWidth: ".5px",
              strokeDasharray: 6,
              fill: "none",
              transform: `rotateZ(${equivalentElevationDemand}deg)`, transformOrigin: `50% 50%`
          }}
        />
    );
  }

  getMount = () => {
    return (
      <>
        <path className={styles.cls2} d="M268.38 52.14h19.53v46.05h-19.53z" />
        <path className={styles.cls2} d="M282.19 52.14h11.73v46.05h-11.73z" />
        <path
          className={styles.cls2}
          transform="rotate(-180 225.15 75.165)"
          d="M215.38 52.14h19.53v46.05h-19.53z"
        />
        <path
          className={styles.cls2}
          transform="rotate(-180 215.245 75.165)"
          d="M209.38 52.14h11.73v46.05h-11.73z"
        />
        <path className={styles.cls3} d="M226.88 19.15h49.54v29.13h-49.54z" />
        <path className={styles.cls2} d="M200.65 42.97h102v14.51h-102z" />
        <path className={styles.cls4} d="M197.62 45.33h5.02v10h-5.02z" />
        <path className={styles.cls5} d="m197.62 55.33-31.97 20v-10l31.97-20v10z" />
        <path className={styles.cls4} d="M211.62 45.33h5.02v10h-5.02z" />
        <path className={styles.cls5} d="m211.62 55.33-31.97 20v-10l31.97-20v10z" />

        <path
          className={styles.cls4}
          transform="rotate(-180 303.165 50.325)"
          d="M300.65 45.33h5.02v10h-5.02z"
        />

        <path className={styles.cls5} d="m305.67 55.33 31.98 20v-10l-31.98-20v10z" />

        <path
          className={styles.cls4}
          transform="rotate(-180 289.165 50.325)"
          d="M286.65 45.33h5.02v10h-5.02z"
        />
        <path
          className={styles.cls5}
          d="m291.67 55.33 31.98 20v-10l-31.98-20v10zM196.21 91.97h110.87v20.63H196.21z"
        />
        <path
          className={styles.cls3}
          d="M226.88 121.15h49.54v65.19h-49.54zM275.42 201.37h-47.54l-1-15.03h49.54l-1 15.03z"
        />
        <path
          className={styles.cls5}
          d="M307.08 112.6H196.21l-14 23.8h138.87l-14-23.8z"
        />
        <path className={styles.cls2} d="M169.35 228.44h-20.7V85.61h13.7l7 142.83z" />
        <path className={styles.cls2} d="M150.65 95.6h6.7v127.84h-6.7z" />
        <path
          className={styles.cls3}
          transform="matrix(.52 .86 -.86 .52 234.67 -84.39)"
          d="M109.56 159.57h164.71v11.25H109.56z"
        />
        <path className={styles.cls2} d="M335.35 228.44h20.69V85.61h-13.69l-7 142.83z" />
        <path className={styles.cls2} d="M347.34 95.6h6.7v127.84h-6.7z" />
        <path
          className={styles.cls3}
          transform="rotate(121 312.779 165.193)"
          d="M230.42 159.57h164.71v11.25H230.42z"
        />
        <path className={styles.cls2} d="M399.02 130.56H105.07l-10 12h313.95l-10-12z" />

        <path
          className={styles.cls3}
          transform="rotate(-65 116.065 167.011)"
          d="M58.27 161.38h115.6v11.25H58.27z"
        />
        <path className={styles.cls4} d="M157.58 82.28h191.44V94H157.58z" />
        <path
          className={styles.cls2}
          d="M401.65 61h-300l-4 24h308Zm-280.5 21c-2.76 0-5-4-5-9s2.24-9 5-9 5 4 5 9-2.24 9-5 9ZM191 82a9 9 0 1 1 9-9 9 9 0 0 1-9 9Zm24 0a9 9 0 1 1 9-9 9 9 0 0 1-9 9Zm24 0a9 9 0 1 1 9-9 9 9 0 0 1-9 9Zm26 0a9 9 0 1 1 9-9 9 9 0 0 1-9 9Zm24 0a9 9 0 1 1 9-9 9 9 0 0 1-9 9Zm24 0a9 9 0 1 1 9-9 9 9 0 0 1-9 9Zm69.2 0c-2.76 0-5-4-5-9s2.24-9 5-9 5 4 5 9-2.29 9-5.05 9ZM111.35 223.44h39.3V95.61h-13.3l-26 127.83zM137.35 85.19h13.3v10.42h-13.3z"
        />
        <path className={styles.cls2} d="M150.65 85.19h-13.3l3-11.11h13.3l-3 11.11z" />
        <path
          className={styles.cls2}
          transform="rotate(-180 154 90.395)"
          d="M150.65 85.19h6.7v10.42h-6.7z"
        />
        <path className={styles.cls2} d="M150.65 85.19h6.7V74.08h-3.7l-3 11.11z" />
        <path
          className={styles.cls3}
          transform="rotate(-25 388.63 167.01)"
          d="M383 109.21h11.25v115.6H383z"
        />
        <path className={styles.cls2} d="M393.35 223.44h-39.31V95.61h13.31l26 127.83z" />
        <path
          className={styles.cls2}
          transform="rotate(-180 360.695 90.395)"
          d="M354.04 85.19h13.3v10.42h-13.3z"
        />
        <path
          className={styles.cls2}
          d="M354.04 85.19h13.31l-3-11.11h-13.31l3 11.11zM347.34 85.19h6.7v10.42h-6.7z"
        />
        <path className={styles.cls2} d="M354.04 85.19h-6.69V74.08h3.69l3 11.11z" />
        <path
          className={styles.cls3}
          d="m408 221.77 4 8.53 1.67-.79a9.39 9.39 0 0 0 4.48-12.51Z"
        />

        <path
          className={styles.cls2}
          d="M361.02 280.19v22.79H142.79v-22.79h-30.88v48.12l20 59.27h240l20-59.27v-48.12h-30.89z"
        />
        <path
          className={styles.cls2}
          d="M152.91 301.3h198v24h-198zM346.91 301.3v24M156.91 325.3v-24M336.91 301.3v24M166.91 325.3v-24M321.91 301.3v24M181.91 325.3v-24M306.91 301.3v24M196.91 325.3v-24M291.91 301.3v24M211.91 325.3v-24M272.91 301.3v24M230.91 325.3v-24M251.91 325.3v-24"
        />
        <path
          className={styles.cls2}
          d="M346.2 255.39a94.5 94.5 0 0 1-188.59 0h-30.55a125 125 0 0 0 249.69 0Z"
        />
        <path
          className={styles.cls2}
          d="M346.2 255.39a94.5 94.5 0 0 1-188.59 0h-25.55a120 120 0 0 0 239.69 0Z"
        />
        <path
          className={styles.cls2}
          d="M411.91 214.19v59.16l-20 6.84h-280l-20-6.84v-59.16h320zM128.78 280.19v-66M375.04 280.19v-66M340.91 280.19v-66M162.91 280.19v-66M207.91 280.19v-66M295.91 280.19v-66"
        />
        <path
          className={styles.cls6}
          d="M168.71 215.44v64.54M181.71 215.44v64.54M169.08 218.09h12.16M169.08 227.09h12.16M169.08 236.09h12.16M169.08 245.09h12.16M169.08 262.09h12.16M169.08 270.09h12.16M169.08 280.09h12.16M169.08 253.09h12.16"
        />
        <path
          className={styles.cls7}
          transform="rotate(-90 116.085 218.185)"
          d="M111.08 167.69h10v101h-10z"
        />

        <path
          className={styles.cls8}
          d="M66.61 215.93v-32.98h99.13v33.68l-99.13-.7zM165.74 182.95v33.68M137.74 182.95v33.68M111.74 182.95v33.68M88.74 182.95v33.68M66.6 205.95h99.14"
        />
      </>
    )
  }

  getBaseMount = () => {
    return (
      <>
        <path
          className={styles.cls4}
          d="M297 273.86V250a45 45 0 0 0-45-45 45 45 0 0 0-45 45v23.86L54.24 406.65h64.64l1.05-.22-4.77-22.43 87-75.61 24.93 53.07 10.23 45h29.42l10.23-45 24.93-53.07 87 75.61-4.77 22.45 1.05.22h64.64Z"
        />
        <circle className={styles.cls4} cx={252} cy={250} r={41} />
        <path
          className={styles.cls4}
          d="m453.33 408.3-1.61-2.79-4.82 2.78-179.27-.45v-.07h-31.12v.07l-179.27.45-4.82-2.78-1.61 2.79h-8.3l8.4 3.23 92.6 53.47v.16h60.09v-.12h96.94v.12h60.09V465l92.6-53.47 8.4-3.23Zm-307.94 50.89L87 425.49l87.38 33.7Zm213.36 0h-29l87.38-33.7Z"
        />
        <path
          className={styles.cls7}
          d="M166.83 298.72h140v6h-140zM98.52 329.72h70.31v6H98.52zM62.31 365.72h32.1v6h-32.1zM302.83 268.72h53v6h-53zM201.83 292.72h100v5h-100z"
        />
        <path
          className={styles.cls7}
          transform="rotate(-44 183.038 317.612)"
          d="M160.07 314.61H206v6h-45.93z"
        />
        <path
          className={styles.cls7}
          transform="rotate(-44 292.717 283.34)"
          d="M274.94 280.34h35.55v6h-35.55z"
        />
        <path
          className={styles.cls7}
          d="M310.83 263.22h42v5h-42zM310.83 257.22h42v5h-42z"
        />
        <path
          className={styles.cls7}
          transform="rotate(-57 88.728 350.308)"
          d="M66.13 347.3h45.19v6H66.13z"
        />
        <path
          className={styles.cls7}
          transform="rotate(-57 52.168 386.833)"
          d="M28.95 383.83H75.4v6H28.95z"
        />
        <path
          className={styles.cls7}
          transform="rotate(-57 104.484 350.672)"
          d="M81.45 347.7h46.07v5.93H81.45z"
        />
        <path
          className={styles.cls7}
          transform="rotate(-57 68.092 386.953)"
          d="M44.72 383.96h46.75v6H44.72z"
        />
        <path
          className={styles.cls7}
          d="M81.4 361.72h16v2h-16zM84.4 355.72h16v2h-16zM87.4 349.72h16v2h-16zM92.4 343.72h16v2h-16zM96.4 337.72h16v2h-16zM45.4 397.72h16v2h-16zM48.4 391.72h16v2h-16zM51.4 385.72h16v2h-16zM56.4 379.72h16v2h-16zM60.4 373.72h16v2h-16z"
        />
        <path
          className={styles.cls8}
          d="M39.4 405.49v-45.82l22.26-29.96h10.38l25.63-37.11h72.19l31.26-32.09h50.6l54.42-28.65h49.98v42.86"
        />
        <path
          style={{
            fill: "#27434f",
            stroke: "#27434f",
            strokeMiterlimit: 10,
          }}
          d="M61.66 373.49v-43.82"
        />
        <path
          className={styles.cls8}
          d="M72.04 329.6v38M97.67 292.6V338M120.3 292.7v39.07M144.3 292.7v39.07M169.86 292.69v39.1M251.3 260.7v39.07M201.3 260.7v39.07M185.3 276.7v39.07M197.3 303.77v-39.2h-30.28v40.15M306.14 231.86v71.44l-3.35-1.49"
        />
        <path
          className={styles.cls8}
          d="m39.4 378.67 22.26-29.96h10.38l25.63-37.11h72.19l31.26-32.09h50.6l54.42-28.65h49.98M225.86 260.79v39.07M277.49 246.93v48.28"
        />
        <path className={styles.cls7} d="M224.83 352.72h53v6h-53z" />
        <path
          className={styles.cls8}
          d="M273.67 354.88v-28.6h-48.41v28.6M258.67 354.88v-28.6M240.67 354.88v-28.6M278.28 326.42v78.97M280.28 326.42v78.97M278.44 328.65h1.68M278.44 338.65h1.68M278.44 348.65h1.68M278.44 358.65h1.68M278.44 368.65h1.68M278.44 378.65h1.68M278.44 388.65h1.68M278.44 398.65h1.68"
        />
        <path className={styles.cls4} d="M4 403.67h496v7H4z" />
      </>
    );
  }

}
