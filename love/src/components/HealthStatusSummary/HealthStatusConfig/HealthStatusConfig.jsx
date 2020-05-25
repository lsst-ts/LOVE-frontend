import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from '../../GeneralPurpose/Button/Button';
import MuteIcon from '../../icons/MuteIcon/MuteIcon';
import styles from './HealthStatusConfig.module.css';
import TelemetrySelectionTable from '../TelemetrySelectionTable/TelemetrySelectionTable';

const HEALTH_STATUS_CODES = {
  0: 'Undefined',
  1: 'OK',
  2: 'Warning',
  3: 'Alert',
  4: 'Invalid',
};

export const HEALTH_STATUS_VARIABLES_DECLARATION = Object.entries(HEALTH_STATUS_CODES)
  .map(([key, label]) => {
    return `const ${label.toUpperCase()}=${key};`;
  })
  .join('\n');

const TABS = {
  TABLE: 0,
  FUNCTIONS: 1,
};

/**
 * Component to configure the HealthStatusSummary
 * Contains the TelemetrySelectionTable used to define the telemetries (end events),
 * and a FunctionConfig component used to configure the rules for the Health Status
 */
export default class HealthStatusConfig extends PureComponent {
  static propTypes = {
    /** Columns to be displayed in the TelemetrySelectionTable */
    columnsToDisplay: PropTypes.arrayOf(
      PropTypes.oneOf([
        'selection_column',
        'category',
        'component',
        'stream',
        'timestamp',
        'name',
        'param_name',
        'data_type',
        'units',
        'health_status',
      ]),
    ),
    /** Column to use to restrict values when selecting a row in the TelemetrySelectionTable,
     * such as limiting only selection of rows with the same units */
    checkedFilterColumn: PropTypes.oneOf([
      'category',
      'component',
      'stream',
      'timestamp',
      'name',
      'param_name',
      'data_type',
      'units',
    ]),
    /** Dictionary of telemetries that are displayed in the TelemetrySelectionTable*/
    telemetries: PropTypes.object,
    /** Function called when the "Set" button is clicked in the TelemetrySelectionTable. It receives the list of keys of the selected rows and the onClick event object of the associated `<button>` */
    onSave: PropTypes.func,
    /** Indicates if component should display bottom selection bar*/
    showSelection: PropTypes.bool,

    /** JSON string that describes the initially selected telemetries and their health functions.
     * Must have his structure:
     *
     * {
     *   "<component.salindex.topic>": {
     *     <parameter_name>: healthfunction,
     *     ...
     *   }
     * }
     */
    initialData: PropTypes.string,
  };

  static defaultProps = {
    onSave: () => {},
    columnsToDisplay: [
      'selection_column',
      'category',
      'component',
      'stream',
      'timestamp',
      'name',
      'param_name',
      'data_type',
      'units',
    ],
    telemetries: {},
    showSelection: true,
    initialData: {},
  };

  constructor() {
    super();
    this.state = {
      selectedTopics: {},
      healthFunctions: {},
      tab: TABS.TABLE,
    };
  }

  changeTab(tab) {
    this.setState({ tab });
  }

  onTableSet = (selectedTopics, onClick) => {
    console.log('selectedTopics: ', selectedTopics);
    this.setState({ selectedTopics, tab: TABS.FUNCTIONS });
  };

  render() {
    return (
      <div className={styles.tabsWrapper}>
        <div className={styles.tabsRow}>
          <div
            className={[styles.tab, this.state.tab === TABS.TABLE ? styles.selected : ''].join(' ')}
            onClick={() => this.changeTab(TABS.TABLE)}
          >
            <div className={styles.tabLabel}>
              {/* <div className={styles.iconWrapper}>
                <MuteIcon unmuted style={this.state.tab === TABS.TABLE ? styles.selectedIcon : ''} />
              </div> */}
              Select Telemetries and Events
            </div>
          </div>

          <div
            className={[styles.tab, this.state.tab === TABS.FUNCTIONS ? styles.selected : ''].join(' ')}
            onClick={() => this.changeTab(TABS.FUNCTIONS)}
          >
            <div className={styles.tabLabel}>
              {/* <div className={styles.iconWrapper}>
                <MuteIcon style={this.state.tab === TABS.FUNCTIONS ? styles.selectedIcon : ''} />
              </div> */}
              Configure Functions
            </div>
          </div>
        </div>

        <div className={[styles.contentWrapper, this.props.embedded ? styles.embedded : ''].join(' ')}>
          <div className={this.state.tab === TABS.TABLE ? styles.content : styles.hidden}>
            <TelemetrySelectionTable
              onSave={this.onTableSet}
              columnsToDisplay={this.props.columnsToDisplay}
              telemetries={this.props.telemetries}
              showSelection={this.props.showSelection}
              initialData={this.props.initialData}
            />
          </div>
          <div className={this.state.tab === TABS.FUNCTIONS ? styles.content : styles.hidden}>'BLAAA'</div>
        </div>
      </div>
    );
  }
}
