import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './AlarmsTable.module.css';
import Alarm from '../Alarm/Alarm';
import Button from '../../GeneralPurpose/Button/Button';
import ColumnHeader from './ColumnHeader/ColumnHeader';
import GearIcon from '../../icons/GearIcon/GearIcon';
import { timeDifference } from '../../../Utils';

/**
 * Configurable table displaying an arbitrary subset
 * of telemetries provided in the component props. It has an optional selection column
 * to be used as a telemetry selection feature. along with the filtering and sorting methods.
 * By pressing the Set button, the list of telemetries is passed to a callback function in the component props.
 *
 */
export default class AlarmsTable extends PureComponent {
  static propTypes = {
    /** Dictionary of telemetries that are displayed. See examples below */
    alarms: PropTypes.array,
  };

  static defaultProps = {
    alarms: [],
  };

  constructor() {
    super();

    const expandedRows = {};

    const filters = {
      severity: { type: 'regexp', value: new RegExp('(?:)') },
      maxSeverity: { type: 'regexp', value: new RegExp('(?:)') },
      name: { type: 'regexp', value: new RegExp('(?:)') },
      timestampSeverityNewest: { type: 'regexp', value: new RegExp('(?:)') },
    };

    this.state = {
      expandedRows,
      activeFilterDialog: 'None',
      sortingColumn: 'severity',
      sortDirection: 'descending',
      filters,
      setFilters: this.setFilters,
    };
  }

  componentDidMount = () => {
    this.props.subscribeToStreams();
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStreams();
  };

  setFilters = (filters) => {
    Object.keys(filters).map((key) => {
      if (!(key in filters) || (filters[key].type === 'regexp' && typeof filters[key].value === 'string')) {
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
    let { expandedRows } = this.state;
    if (expandedRows[rowId]) expandedRows[rowId] = false;
    else {
      expandedRows = {};
      expandedRows[rowId] = true;
    }
    this.setState({
      expandedRows: { ...expandedRows },
    });
  };

  testFilter = (row) => {
    const values = Object.keys(row).map((rowKey) => {
      const key = [row.component, row.stream, row.param_name].join('-');
      if (this.state.filters[rowKey] !== undefined && this.state.filters[rowKey].type === 'regexp') {
        const regexpFilterResult = this.state.filters[rowKey].value.test(row[rowKey]);
        let checkedFilterResult = true;
        if (this.state.checkedFilter && this.state.checkedFilter[rowKey]) {
          checkedFilterResult = this.state.checkedFilter[rowKey].test(row[rowKey]);
        }
        return regexpFilterResult && checkedFilterResult;
      }
      if (this.state.filters[rowKey] !== undefined && this.state.filters[rowKey].type === 'health') {
        let healthStatus = 0;
        if (this.props.healthFunctions !== undefined) {
          healthStatus = this.getHealthText(this.getHealthStatusCode(key, row.value));
        }
        return this.state.filters[rowKey].value.test(healthStatus);
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
    const column = this.state.sortingColumn;
    return a[column] <= b[column] ? -direction : direction;
  };

  render() {
    let data = this.props.alarms;
    const currentTime = new Date().getTime();
    return (
      <div className={styles.telemetrySelectionTableWrapper}>
        <table className={styles.telemetrySelectionTable}>
          <thead>
            <tr>
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
                    <ColumnHeader
                      {...defaultColumnProps}
                      header={'Name'}
                      filterName={'name'}
                      filter={this.state.filters.name}
                    />
                    <ColumnHeader
                      {...defaultColumnProps}
                      header={'Max severity'}
                      filterName={'maxSeverity'}
                      filter={this.state.filters.maxSeverity}
                    />
                    <ColumnHeader
                      {...defaultColumnProps}
                      header={'Severity update'}
                      filterName={'timestampSeverityNewest'}
                      filter={this.state.filters.timestampSeverityNewest}
                    />
                    <ColumnHeader
                      {...defaultColumnProps}
                      header={'Status'}
                      filterName={'severity'}
                      filter={this.state.filters.severity}
                    />
                  </>
                );
              })()}
            </tr>
          </thead>
          <tbody onClick={this.closeFilterDialogs}>
            {data.sort(this.sortData).map((row) => {
              if (this.testFilter(row)) {
                const key = row.name;

                return (
                  <React.Fragment key={key}>
                    <tr className={styles.dataRow} onClick={() => this.clickGearIcon(key)}>
                      <td className={styles.string}>{row.name}</td>
                      <td className={styles.string}>{row.maxSeverity}</td>
                      <td className={styles.string} title={new Date(row.timestampSeverityNewest).toString()}>{timeDifference(currentTime, row.timestampSeverityNewest)}</td>
                      <td className={styles.string}>
                        {<Alarm severity={row.severity} acknowledged snoozed />}
                      </td>
                    </tr>
                    {this.state.expandedRows[key] ? (
                      <tr onClick={this.closeFilterDialogs} key={`${key}-expanded`} className={styles.expandedRow}>
                        <td colSpan={4}>
                          <div className={styles.expandedColumn}>
                            <div>
                              <div className={styles.title}>Reason:</div>
                              <div>
                                <p>{row.reason}</p>
                              </div>
                            </div>
                            <div>
                              <div className={styles.title}>Acknowledged by:</div>
                              <div>
                                <p>-</p>
                              </div>
                              <div className={styles.title}>Muted by:</div>
                              <div>
                                <p>-</p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </React.Fragment>
                );
              }
              return null;
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
