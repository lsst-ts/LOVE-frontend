import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './TelemetrySelectionTable.module.css';
import Button from '../../GeneralPurpose/Button/Button';
import ColumnHeader from './ColumnHeader/ColumnHeader';
import TelemetrySelectionTag from './TelemetrySelectionTag/TelemetrySelectionTag';
import ManagerInterface, { formatTimestamp } from '../../../Utils';

/**
 * Configurable table displaying an arbitrary subset
 * of telemetries provided in the component props. It has an optional selection column
 * to be used as a telemetry selection feature. along with the filtering and sorting methods.
 * By pressing the Set button, the list of telemetries is passed to a callback function in the component props.
 *
 */
export default class TelemetrySelectionTable extends PureComponent {
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

    /** Dictionary with the intially selected telemetries and events and their health functions.
     * Must have this structure:
     *
     * {
     *   "<component.salindex.topic>": {
     *     <parameter_name>: healthfunction,
     *     ...
     *   }
     * }
     */
    topics: PropTypes.object,

    /** Function to call when adding or removing a row to the selection
     * Must receive these arguments:
     *
     * - selected: true if the row is selected (changin to be selected), false of not
     * - topic: string with the name of the topic
     * - item: string with the name of the item within the topic
     */
    onRowSelection: PropTypes.func,
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

    const expandedRows = {
      altitude_maxspeed0: true,
    };

    this.defaultCodeText =
      "// Function should return one of the following global variables:\n// ALERT, WARNING, OK. I.e. 'return OK'";

    const filters = {
      category: { type: 'regexp', value: new RegExp('(?:)') },
      component: { type: 'regexp', value: new RegExp('(?:)') },
      stream: { type: 'regexp', value: new RegExp('(?:)') },
      timestamp: {
        type: 'regexp',
        value: new RegExp('(?:)'),
        function: (value) => {
          return formatTimestamp(value);
        },
      },
      name: { type: 'regexp', value: new RegExp('(?:)') },
      param_name: { type: 'regexp', value: new RegExp('(?:)') },
      data_type: { type: 'regexp', value: new RegExp('(?:)') },
      value: { type: 'regexp', value: new RegExp('(?:)') },
      units: { type: 'regexp', value: new RegExp('(?:)') },
    };

    this.state = {
      expandedRows,
      activeFilterDialog: 'None',
      sortingColumn: 'stream',
      sortDirection: 'ascending',
      selectedRows: [],
      filters,
      setFilters: this.setFilters,
      healthFunctions: {},
      temporaryHealthFunctions: {},
      eventData: [],
      telemetryData: [],
      tableData: [],
    };
  }

  componentDidMount = () => {
    ManagerInterface.getTopicData('event-telemetry').then((data) => {
      let tableData = [];
      for (const [cscKey, cscValue] of Object.entries(data)) {
        for (const category of ['event', 'telemetry']) {
          const categoryKey = `${category}_data`;
          for (const [streamKey, streamValue] of Object.entries(cscValue[categoryKey])) {
            for (const [paramKey, paramValue] of Object.entries(streamValue)) {
              tableData.push({
                category,
                component: cscKey,
                stream: streamKey,
                param_name: paramKey,
                data_type: paramValue?.type_name,
                units: paramValue?.units,
              });
            }
          }
        }
      }
      this.setState({
        tableData,
      });
    });

    const initialData = JSON.parse(this.props.initialData);
    const selectedRows = Object.keys(initialData).flatMap((cscSalindexTopic) => {
      return Object.keys(initialData[cscSalindexTopic]).map((parameterName) => {
        return `${cscSalindexTopic}-${parameterName}`;
      });
    });

    const healthFunctions = Object.keys(initialData || {}).reduce((prevDict, cscSalindexTopic) => {
      Object.keys(initialData?.[cscSalindexTopic] || {}).forEach((parameterName) => {
        prevDict[[cscSalindexTopic, parameterName].join('-')] = initialData[cscSalindexTopic][parameterName];
      });
      return prevDict;
    }, {});
    this.setState({
      selectedRows,
      healthFunctions,
    });
  };

  setFilters = (filters) => {
    Object.keys(filters).map((key) => {
      if (filters[key].type === 'regexp' && typeof filters[key].value === 'string') {
        // eslint-disable-next-line
        filters[key].value = new RegExp(filters[key].value.replace(/^\/|\/$/g, ''));
      }
      return null;
    });
    this.setState({
      filters,
    });
  };

  clickRow = () => {
    this.closeFilterDialogs();
  };

  clickGearIcon = (rowID) => {
    this.toggleRow(rowID);
  };

  toggleRow = (rowId) => {
    this.closeFilterDialogs();
    if (this.state.expandedRows[rowId]) {
      this.setState((state) => ({
        expandedRows: {
          ...state.expandedRows,
          [rowId]: false,
        },
        temporaryHealthFunctions: {
          ...state.temporaryHealthFunctions,
          [rowId]: undefined,
        },
      }));
      return;
    }

    this.setState((state) => {
      return {
        expandedRows: {
          [rowId]: true,
        },
        temporaryHealthFunctions: {
          ...state.temporaryHealthFunctions,
          [rowId]: state.healthFunctions[rowId],
        },
      };
    });
  };

  testFilter = (row) => {
    const values = Object.keys(row).map((rowKey) => {
      if (this.state.filters[rowKey] !== undefined && this.state.filters[rowKey].type === 'regexp') {
        const func = this.state.filters[rowKey].function ? this.state.filters[rowKey].function : (value) => value;
        const regexpFilterResult = this.state.filters[rowKey].value.test(func(row[rowKey]));
        let checkedFilterResult = true;
        if (this.state.checkedFilter && this.state.checkedFilter[rowKey]) {
          checkedFilterResult = this.state.checkedFilter[rowKey].test(func(row[rowKey]));
        }
        return regexpFilterResult && checkedFilterResult;
      }
      return true;
    });
    const value = values.reduce((a, b) => a && b, true);
    return value;
  };

  changeFilter = (column) => (event) => {
    const filters = { ...this.state.filters };
    try {
      filters[column].value = new RegExp(event.target.value, 'i');
      this.state.setFilters(filters);
    } catch (e) {
      console.log('Invalid filter');
    }
  };

  setHealthFunction = (rowKey) => {
    this.setState((state) => {
      return {
        healthFunctions: {
          ...state.healthFunctions,
          [rowKey]: state.temporaryHealthFunctions[rowKey],
        },
      };
    });
    this.toggleRow(rowKey);
  };

  renderValueAsList = (values) => {
    const elements = values.map((elem, index) => (
      <li key={index} className={styles.valuesListItem}>
        <span className={styles.valuesListItemValue}>{JSON.stringify(elem)}</span>
      </li>
    ));
    return <ol className={styles.valuesList}>{elements}</ol>;
  };

  columnOnClick = (ev, filterName) => {
    if (this.state.activeFilterDialog === filterName) {
      this.closeFilterDialogs();
      return;
    }
    this.setState({ activeFilterDialog: filterName });
  };

  closeFilterDialogs = () => {
    this.setState({ activeFilterDialog: 'None' });
  };

  changeSortDirection = (direction, column) => {
    /*
            direction can be "ascending" or "descending", otherwise no
            sorting will be applied
            Sorting is applied before filtering
        */
    this.setState({ sortDirection: direction, sortingColumn: column });
  };

  sortData = (a, b) => {
    const direction = this.state.sortDirection === 'ascending' ? 1 : -1;
    const aKey = [a.component, a.stream, a.param_name].join('-');
    const bKey = [b.component, b.stream, b.param_name].join('-');
    const selectedKeys = this.state.selectedRows;
    const column = this.state.sortingColumn;
    if (selectedKeys.indexOf(aKey) > -1 && !(selectedKeys.indexOf(bKey) > -1)) {
      return -1;
    }
    if (selectedKeys.indexOf(bKey) > -1 && !(selectedKeys.indexOf(aKey) > -1)) return 1;
    return a[column] <= b[column] ? -direction : direction;
  };

  setCheckedFilterColumn = (column, value) => {
    if (column === undefined || value === undefined) {
      this.setState({
        checkedFilter: undefined,
      });
      return;
    }
    const checkedFilter = {};
    checkedFilter[column] = new RegExp(value, 'i');
    this.setState({
      checkedFilter,
    });
  };

  updateSelectedList = (checked, key) => {
    const { selectedRows } = this.state;
    if (checked && selectedRows.indexOf(key) < 0) selectedRows.push(key);
    if (!checked) selectedRows.splice(selectedRows.map((row) => row).indexOf(key), 1);
    if (selectedRows.length === 0) this.setCheckedFilterColumn();
    this.setState({
      selectedRows: [...selectedRows],
    });
  };

  selectAllRows = (checked) => {
    const data = this.getData();
    data.sort(this.sortData).map((row) => {
      if (this.testFilter(row) || !checked) {
        const key = [row.component, row.stream, row.param_name].join('-');
        this.onRowSelection(checked, key, row);
      }
      return true;
    });
  };

  onRowSelection = (checked, key, row) => {
    const { checkedFilterColumn } = this.props;
    if (row[checkedFilterColumn] !== undefined) {
      const value = row[checkedFilterColumn].replace(/[-[\]{}()*+!<=:?./\\^$|#\s,]/g, '\\$&');
      this.setCheckedFilterColumn(checkedFilterColumn, value);
    }
    this.updateSelectedList(checked, key);
  };

  setSelection = () => {
    const newSelectionData = this.state.selectedRows.reduce((prevDict, rowKey) => {
      const [component, salindex, topic, item] = rowKey.split('-');
      const cscSalindexTopic = [component, salindex, topic].join('-');
      if (!prevDict[cscSalindexTopic]) prevDict[cscSalindexTopic] = {};
      prevDict[cscSalindexTopic][item] = this.state.healthFunctions[rowKey] ?? 'return INVALID;';
      return prevDict;
    }, {});
    this.props.onSave(newSelectionData);
  };

  render() {
    const displayHeaderCheckbock = this.props.checkedFilterColumn === undefined;
    let data = this.state.tableData;
    return (
      <div className={styles.telemetrySelectionTableWrapper}>
        <table className={styles.telemetrySelectionTable}>
          <thead>
            <tr>
              {this.props.columnsToDisplay.includes('selection_column') ? (
                <th
                  className={[
                    styles.addedColumn,
                    styles.firstColumn,
                    styles.checkboxCell,
                    displayHeaderCheckbock ? '' : styles.hidden,
                  ].join(' ')}
                >
                  <input
                    type="checkbox"
                    alt={'select all telemetries'}
                    onChange={(event) => this.selectAllRows(event.target.checked)}
                  />
                </th>
              ) : null}
              {(() => {
                const defaultColumnProps = {
                  changeFilter: this.changeFilter,
                  activeFilterDialog: this.state.activeFilterDialog,
                  closeFilterDialogs: this.closeFilterDialogs,
                  columnOnClick: this.columnOnClick,
                  changeSortDirection: this.changeSortDirection,
                  sortDirection: this.state.sortDirection,
                  sortingColumn: this.state.sortingColumn,
                };

                return (
                  <>
                    {this.props.columnsToDisplay.includes('category') && (
                      <ColumnHeader
                        {...defaultColumnProps}
                        header={'Category'}
                        filterName={'category'}
                        filter={this.state.filters.category}
                      />
                    )}
                    {this.props.columnsToDisplay.includes('component') && (
                      <ColumnHeader
                        {...defaultColumnProps}
                        header={'Component'}
                        filterName={'component'}
                        filter={this.state.filters.component}
                      />
                    )}
                    {this.props.columnsToDisplay.includes('stream') && (
                      <ColumnHeader
                        {...defaultColumnProps}
                        header={'Stream'}
                        filterName={'stream'}
                        filter={this.state.filters.stream}
                      />
                    )}
                    {this.props.columnsToDisplay.includes('param_name') && (
                      <ColumnHeader
                        {...defaultColumnProps}
                        header={'Parameter'}
                        filterName={'param_name'}
                        filter={this.state.filters.param_name}
                      />
                    )}
                    {this.props.columnsToDisplay.includes('data_type') && (
                      <ColumnHeader
                        className={styles.mediumCol}
                        {...defaultColumnProps}
                        header={'Data type'}
                        filterName={'data_type'}
                        filter={this.state.filters.data_type}
                      />
                    )}
                    {this.props.columnsToDisplay.includes('units') && (
                      <ColumnHeader
                        className={styles.narrowCol}
                        {...defaultColumnProps}
                        header={'Units'}
                        filterName={'units'}
                        filter={this.state.filters.units}
                      />
                    )}
                  </>
                );
              })()}
            </tr>
          </thead>
          <tbody onClick={this.closeFilterDialogs}>
            {data.sort(this.sortData).map((row) => {
              if (this.testFilter(row)) {
                const key = [row.category, row.component, row.stream, row.param_name].join('-');
                const isChecked = this.state.selectedRows.indexOf(key) >= 0;

                return (
                  <React.Fragment key={key}>
                    <tr className={styles.dataRow} onClick={() => this.clickRow(key)}>
                      {this.props.columnsToDisplay.includes('selection_column') ? (
                        <td className={[styles.firstColumn, styles.checkboxCell].join(' ')}>
                          <input
                            onChange={(event) => this.onRowSelection(event.target.checked, key, row)}
                            type="checkbox"
                            alt={`select ${key}`}
                            checked={isChecked}
                          />
                        </td>
                      ) : null}
                      {this.props.columnsToDisplay.includes('category') && (
                        <td className={styles.string}>{row.category}</td>
                      )}
                      {this.props.columnsToDisplay.includes('component') && (
                        <td className={styles.string}>{row.component}</td>
                      )}
                      {this.props.columnsToDisplay.includes('stream') && (
                        <td className={styles.string}>{row.stream}</td>
                      )}
                      {this.props.columnsToDisplay.includes('param_name') && (
                        <td className={styles.string}>{row.param_name}</td>
                      )}
                      {this.props.columnsToDisplay.includes('data_type') && (
                        <td className={[styles.string, styles.mediumCol].join(' ')}>{row.data_type}</td>
                      )}
                      {this.props.columnsToDisplay.includes('units') && (
                        <td className={[styles.string, styles.narrowCol].join(' ')}>{row.units}</td>
                      )}
                    </tr>
                  </React.Fragment>
                );
              }
              return null;
            })}
          </tbody>
        </table>

        {this.props.showSelection && (
          <div className={styles.selectionContainer}>
            TELEMETRIES:
            <span className={styles.selectionList}>
              {this.state.selectedRows.map((telemetryKey) => {
                const telemetryName = telemetryKey.split('-')[2];
                return (
                  <TelemetrySelectionTag
                    key={telemetryKey}
                    telemetryKey={telemetryKey}
                    telemetryName={telemetryName}
                    remove={() => this.updateSelectedList(false, telemetryKey)}
                  />
                );
              })}
            </span>
            <Button
              title="Set selected telemetries"
              className={styles.selectionSetButton}
              onClick={(ev) => {
                this.setSelection();
              }}
            >
              Set
            </Button>
          </div>
        )}
      </div>
    );
  }
}
