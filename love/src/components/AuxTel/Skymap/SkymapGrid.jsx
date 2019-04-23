import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './SkymapGrid.module.css';

export default class SkymapGrid extends Component {
  static propTypes = {
    /** Skyview width */
    width: PropTypes.number,
    /** Skyview height */
    height: PropTypes.number,
  };

  static defaultProps = {
    width: 596,
    height: 596,
  };

  render() {
    return (
      <svg
        className={styles.grid}
        xmlns="http://www.w3.org/2000/svg"
        width={this.props.width}
        height={this.props.width}
        viewBox={`0 0 596 596`}
      >
        <rect id="backgroundrect" width="100%" height="100%" fill="none" />
        <g className={styles.currentLayer}>
          <circle className={styles['cls-23']} cx="298" cy="298" r="294" id="svg_45" />
          <g id="polar_plot" data-name="polar plot">
            <circle className={styles['cls-27']} cx="297.5" cy="297.5" r="293" id="svg_70" />
            <path className={styles['cls-6']} d="M298,592" id="svg_71" />
            <path className={styles['cls-28']} d="M297.53999999999996,4.5 h0.5" id="svg_72" />
            <path
              className={styles['cls-29']}
              d="M322.1100000000001,5.530000000000001 q6.51,0.56 13,1.3800000000000001 q12.46,1.62 24.74,4.28"
              id="svg_73"
            />
            <path className={styles['cls-28']} d="M371.57000000000016,14 l0.48000000000000026,0.13" id="svg_74" />
            <path className={styles['cls-28']} d="M298.04999999999995,4.5 h-0.5" id="svg_75" />
            <path
              className={styles['cls-30']}
              d="M272.1399999999999,5.650000000000006 q-5.83,0.51 -11.66,1.26 c-8.42,1.09 -18.62,3 -28.09,5.1"
              id="svg_76"
            />
            <path className={styles['cls-28']} d="M220,15 l-0.47000000000000025,0.13" id="svg_77" />
            <path className={styles['cls-28']} d="M442.84000000000015,43 l0.43000000000000027,0.25" id="svg_78" />
            <path
              className={styles['cls-31']}
              d="M464.57000000000016,56.839999999999975 q4.88,3.41 9.61,7 c6.75,5.14 14.63,11.47 21.79,17.76"
              id="svg_79"
            />
            <path className={styles['cls-28']} d="M505.25,90.18 l0.36000000000000026,0.35000000000000026" id="svg_80" />
            <path className={styles['cls-28']} d="M443.28,43.26999999999998 l-0.43000000000000027,-0.25" id="svg_81" />
            <path
              className={styles['cls-32']}
              d="M420.90999999999985,31.629999999999995 q-5.6400000000000015,-2.62 -11.39,-5 c-7.78,-3.24 -16.59,-6.2 -25.2,-8.8"
              id="svg_82"
            />
            <path
              className={styles['cls-28']}
              d="M372.42999999999984,14.400000000000006 l-0.48000000000000026,-0.13"
              id="svg_83"
            />
            <path className={styles['cls-28']} d="M149.72000000000003,44 l-0.43000000000000027,0.25" id="svg_84" />
            <path
              className={styles['cls-33']}
              d="M128.76,57.29000000000002 c-3.51,2.45 -7,5 -10.38,7.5600000000000005 A234.72,234.72 0 0 0 99,81.69"
              id="svg_85"
            />
            <path
              className={styles['cls-28']}
              d="M90.30999999999995,90.18 l-0.36000000000000026,0.35000000000000026"
              id="svg_86"
            />
            <path
              className={styles['cls-28']}
              d="M149.27999999999997,44.26999999999998 l0.43000000000000027,-0.25"
              id="svg_87"
            />
            <path
              className={styles['cls-32']}
              d="M171.64999999999998,32.629999999999995 q5.6400000000000015,-2.62 11.39,-5 c7.78,-3.24 16.59,-6.2 25.2,-8.8"
              id="svg_88"
            />
            <path className={styles['cls-28']} d="M220.13,15.400000000000006 l0.48000000000000026,-0.13" id="svg_89" />
            <path className={styles['cls-28']} d="M298.26,591.53 h-0.5" id="svg_90" />
            <path
              className={styles['cls-29']}
              d="M273.6700000000001,590.63 q-6.51,-0.51 -13,-1.31 q-12.46,-1.55 -24.76,-4.14"
              id="svg_91"
            />
            <path
              className={styles['cls-28']}
              d="M224.18000000000006,582.45 l-0.49000000000000027,-0.12000000000000002"
              id="svg_92"
            />
            <path className={styles['cls-28']} d="M297.74,591.53 h0.5" id="svg_93" />
            <path
              className={styles['cls-30']}
              d="M323.6500000000001,590.24 q5.84,-0.56 11.64,-1.33 c8.42,-1.13 18.61,-3.1 28.07,-5.25"
              id="svg_94"
            />
            <path className={styles['cls-28']} d="M375.72,580.62 l0.48000000000000026,-0.13" id="svg_95" />
            <path
              className={styles['cls-28']}
              d="M152.75,553.81 l-0.4400000000000003,-0.24000000000000013"
              id="svg_96"
            />
            <path
              className={styles['cls-31']}
              d="M130.94000000000005,540.11 q-4.9,-3.39 -9.65,-7 c-6.77,-5.09 -14.69,-11.38 -21.88,-17.63"
              id="svg_97"
            />
            <path
              className={styles['cls-28']}
              d="M90.06999999999994,507 l-0.35000000000000026,-0.35000000000000026"
              id="svg_98"
            />
            <path className={styles['cls-28']} d="M152.29999999999995,553.56 l0.4400000000000003,0.25" id="svg_99" />
            <path
              className={styles['cls-32']}
              d="M174.74,565.07 q5.65,2.59 11.41,5 c7.8,3.2 16.62,6.11 25.25,8.66"
              id="svg_100"
            />
            <path className={styles['cls-28']} d="M223.30999999999995,582 l0.48000000000000026,0.13" id="svg_101" />
            <path className={styles['cls-28']} d="M445.8499999999999,551.21 l0.43000000000000027,-0.26" id="svg_102" />
            <path
              className={styles['cls-33']}
              d="M466.74,537.81 q5.25,-3.6900000000000004 10.34,-7.62 a233.08,233.08 0 0 0 19.27,-16.94"
              id="svg_103"
            />
            <path className={styles['cls-28']} d="M505,504.72 l0.36000000000000026,-0.36000000000000026" id="svg_104" />
            <path className={styles['cls-28']} d="M446.28999999999996,551 l-0.43000000000000027,0.25" id="svg_105" />
            <path
              className={styles['cls-32']}
              d="M424,562.71 q-5.61,2.6500000000000004 -11.35,5.08 c-7.77,3.2800000000000002 -16.56,6.29 -25.16,8.94"
              id="svg_106"
            />
            <path className={styles['cls-28']} d="M375.5999999999999,580.2 l-0.48000000000000026,0.13" id="svg_107" />
            <path className={styles['cls-28']} d="M590.79,298.27 v0.5" id="svg_108" />
            <path
              className={styles['cls-29']}
              d="M589.76,322.85 q-0.54,6.51 -1.3800000000000001,13 q-1.61,12.46 -4.27,24.74"
              id="svg_109"
            />
            <path
              className={styles['cls-28']}
              d="M581.31,372.29999999999995 c0,0.16000000000000017 -0.08000000000000007,0.32000000000000034 -0.13,0.48000000000000026"
              id="svg_110"
            />
            <path className={styles['cls-28']} d="M590.79,298.78 v-0.5" id="svg_111" />
            <path
              className={styles['cls-30']}
              d="M589.6500000000001,272.87 q-0.52,-5.83 -1.27,-11.65 c-1.09,-8.42 -3,-18.62 -5.1,-28.1"
              id="svg_112"
            />
            <path
              className={styles['cls-28']}
              d="M580.31,220.75 c0,-0.16000000000000017 -0.08000000000000007,-0.32000000000000034 -0.13,-0.48000000000000026"
              id="svg_113"
            />
            <path
              className={styles['cls-28']}
              d="M552.28,443.57000000000005 c-0.08000000000000007,0.14 -0.16000000000000017,0.29000000000000026 -0.25,0.43000000000000027"
              id="svg_114"
            />
            <path
              className={styles['cls-31']}
              d="M538.46,465.29999999999995 q-3.4,4.88 -7,9.620000000000001 c-5.13,6.74 -11.47,14.620000000000001 -17.75,21.78"
              id="svg_115"
            />
            <path
              className={styles['cls-28']}
              d="M505.1100000000001,506 l-0.3400000000000004,0.35000000000000026"
              id="svg_116"
            />
            <path className={styles['cls-28']} d="M552,444 l0.25,-0.43000000000000027" id="svg_117" />
            <path
              className={styles['cls-32']}
              d="M563.6599999999999,421.64 q2.64,-5.6400000000000015 5,-11.38 c3.24,-7.79 6.21,-16.59 8.8,-25.21"
              id="svg_118"
            />
            <path
              className={styles['cls-28']}
              d="M580.8899999999999,373.16999999999996 l0.13,-0.49000000000000027"
              id="svg_119"
            />
            <path className={styles['cls-28']} d="M551.28,150.45999999999998 L551,150" id="svg_120" />
            <path
              className={styles['cls-33']}
              d="M538,129.5 q-3.66,-5.28 -7.5600000000000005,-10.39 a232.84,232.84 0 0 0 -16.84,-19.36"
              id="svg_121"
            />
            <path
              className={styles['cls-28']}
              d="M505.1199999999999,91 l-0.35000000000000026,-0.36000000000000026"
              id="svg_122"
            />
            <path className={styles['cls-28']} d="M551,150 l0.25,0.4400000000000003" id="svg_123" />
            <path
              className={styles['cls-32']}
              d="M562.6599999999999,172.39 q2.64,5.63 5,11.38 c3.24,7.79 6.21,16.59 8.8,25.21"
              id="svg_124"
            />
            <path
              className={styles['cls-28']}
              d="M579.8899999999999,220.86 c0,0.16000000000000017 0.09000000000000012,0.32000000000000034 0.13,0.48000000000000026"
              id="svg_125"
            />
            <path className={styles['cls-28']} d="M3.769999999999982,298.27 v0.5" id="svg_126" />
            <path
              className={styles['cls-34']}
              d="M4.889999999999986,323.86 q0.53,6 1.29,12 c1.08,8.4 3,18.11 5.08,27.27"
              id="svg_127"
            />
            <path
              className={styles['cls-28']}
              d="M14.25,375.29999999999995 c0,0.16000000000000017 0.08000000000000007,0.32000000000000034 0.13,0.48000000000000026"
              id="svg_128"
            />
            <path className={styles['cls-28']} d="M3.769999999999982,298.78 v-0.5" id="svg_129" />
            <path
              className={styles['cls-29']}
              d="M4.7999999999999545,274.2 q0.54,-6.49 1.3800000000000001,-13 q1.6,-12.47 4.27,-24.74"
              id="svg_130"
            />
            <path
              className={styles['cls-28']}
              d="M13.25,224.75 c0,-0.16000000000000017 0.08000000000000007,-0.32000000000000034 0.13,-0.48000000000000026"
              id="svg_131"
            />
            <path
              className={styles['cls-28']}
              d="M44.27999999999997,446.57000000000005 c0.08000000000000007,0.14 0.16000000000000017,0.29000000000000026 0.25,0.43000000000000027"
              id="svg_132"
            />
            <path
              className={styles['cls-35']}
              d="M57.49000000000001,467.30999999999995 c1.7400000000000002,2.43 3.59,4.93 5.63,7.61 c5.24,6.88 11.73,14.94 18.14,22.22"
              id="svg_133"
            />
            <path
              className={styles['cls-28']}
              d="M89.45000000000005,506 l0.3400000000000004,0.35000000000000026"
              id="svg_134"
            />
            <path
              className={styles['cls-28']}
              d="M44.52999999999997,447 l-0.24000000000000013,-0.43000000000000027"
              id="svg_135"
            />
            <path
              className={styles['cls-36']}
              d="M32.52999999999997,424.67999999999995 c-2.48,-5 -4.77,-9.9 -6.65,-14.42 a226,226 0 0 1 -7.8100000000000005,-22.13"
              id="svg_136"
            />
            <path
              className={styles['cls-28']}
              d="M14.669999999999959,376.16999999999996 c0,-0.16000000000000017 -0.09000000000000012,-0.32000000000000034 -0.13,-0.49000000000000027"
              id="svg_137"
            />
            <path
              className={styles['cls-28']}
              d="M42.27999999999997,152.45999999999998 c0.08000000000000007,-0.15000000000000013 0.16000000000000017,-0.29000000000000026 0.25,-0.43000000000000027"
              id="svg_138"
            />
            <path
              className={styles['cls-37']}
              d="M55.77999999999997,130.79000000000002 c2.7600000000000002,-4.09 5.57,-8.05 8.34,-11.68 A228,228 0 0 1 80.71000000000004,100"
              id="svg_139"
            />
            <path
              className={styles['cls-28']}
              d="M89.44000000000005,91 l0.35000000000000026,-0.36000000000000026"
              id="svg_140"
            />
            <path className={styles['cls-28']} d="M42.52999999999997,152 l-0.25,0.4400000000000003" id="svg_141" />
            <path
              className={styles['cls-38']}
              d="M30.819999999999936,174.68 c-1.32,2.91 -2.62,5.91 -3.94,9.09 c-3.3200000000000003,8 -6.8100000000000005,18.39 -9.74,28.07"
              id="svg_142"
            />
            <path
              className={styles['cls-28']}
              d="M13.669999999999959,223.86 c0,0.16000000000000017 -0.09000000000000012,0.32000000000000034 -0.13,0.48000000000000026"
              id="svg_143"
            />
            <g className={styles['cls-39']} id="svg_144">
              <line className={styles['cls-27']} x1="297.49" x2="297.49" y2="596" id="svg_145" />
              <line className={styles['cls-27']} x1="89.61" y1="90.11" x2="505.39" y2="505.89" id="svg_146" />
              <line className={styles['cls-27']} x1="86.78" y1="508.72" x2="508.21" y2="87.28" id="svg_147" />
              <line className={styles['cls-27']} x1="149.8" y1="556.83" x2="445.18" y2="39.17" id="svg_148" />
              <line className={styles['cls-27']} x1="222.27" y1="586.35" x2="372.72" y2="9.65" id="svg_149" />
              <line className={styles['cls-27']} x1="10.06" y1="376.65" x2="584.93" y2="219.35" id="svg_150" />
              <line className={styles['cls-27']} x1="40.44" y1="448.76" x2="554.55" y2="147.24" id="svg_151" />
              <line className={styles['cls-27']} x1="508.21" y1="508.72" x2="86.78" y2="87.28" id="svg_152" />
              <line className={styles['cls-27']} x1="556.32" y1="445.69" x2="38.67" y2="150.31" id="svg_153" />
              <line className={styles['cls-27']} x1="585.84" y1="373.22" x2="9.14" y2="222.78" id="svg_154" />
              <line className={styles['cls-27']} x1="376.14" y1="585.44" x2="218.85" y2="10.57" id="svg_155" />
              <line className={styles['cls-27']} x1="448.25" y1="555.05" x2="146.74" y2="40.95" id="svg_156" />
              <line className={styles['cls-27']} y1="298.51" x2="596" y2="298.51" id="svg_157" />
              <circle className={styles['cls-27']} cx="297.5" cy="298.5" r="239.21" id="svg_158" />
              <circle className={styles['cls-27']} cx="297.5" cy="298.5" r="177.07" id="svg_159" />
              <circle className={styles['cls-27']} cx="297.5" cy="298.5" r="117.26" id="svg_160" />
              <circle className={styles['cls-27']} cx="297.5" cy="298.5" r="60.98" id="svg_161" />
              <circle className={styles['cls-27']} cx="297.5" cy="298.5" r="9.38" id="svg_162" />
            </g>
          </g>
        </g>
      </svg>
    );
  }
}
