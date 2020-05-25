import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
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

/**
 * Configurable table displaying an arbitrary subset
 * of telemetries provided in the component props. It has an optional selection column
 * to be used as a telemetry selection feature, along with the filtering and sorting methods.
 * By pressing the Set button, the list of telemetries is passed to a callback function in the component props.
 *
 */
export default class HealthStatusConfig extends PureComponent {
  static propTypes = {
    /** Display the selection column or not */
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
    /** Column to use to restrict values when selecting a row, such as limiting only selection of rows with the same units */
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
    /** Dictionary containing the definition of healthStatus functions. Keys are a concatenation of component, stream, param_name
        separated by a dash. Values are javascript code as text */
    // healthFunctions: PropTypes.object,
    /** Function called to set healthStatus functions. It receives a dictionary containing the healthStatus functions to be set */
    // setHealthFunctions: PropTypes.func,
    /** Dictionary of telemetries that are displayed. See examples below */
    telemetries: PropTypes.object,
    /** Function called when the "Set" button is clicked. It receives the list of keys of the selected rows and the onClick event object of the associated `<button>` */
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
    this.state = {};
  }

  render() {
    return (
      <TelemetrySelectionTable
        onSave={this.props.onSave}
        columnsToDisplay={this.props.columnsToDisplay}
        telemetries={this.props.telemetries}
        showSelection={this.props.showSelection}
        initialData={this.props.initialData}
      />
    );
  }
}
