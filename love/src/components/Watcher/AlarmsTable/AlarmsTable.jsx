import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import RowExpansionIcon from '../../icons/RowExpansionIcon/RowExpansionIcon';
import styles from './AlarmsTable.module.css';
import Alarm from '../Alarm/Alarm';
import ColumnHeader from './ColumnHeader/ColumnHeader';
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
      timestampSeverityOldest: { type: 'regexp', value: new RegExp('(?:)') },
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
      <div className={styles.dataTableWrapper}>
      <table className={styles.dataTable}>
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
                    className={styles.status}
                    header={'Status'}
                    filterName={'severity'}
                    filter={this.state.filters.severity}
                  />
                  <ColumnHeader
                    {...defaultColumnProps}
                    className={styles.maxSeverity}
                    header={'Max severity'}
                    filterName={'maxSeverity'}
                    filter={this.state.filters.maxSeverity}
                  />
                  <ColumnHeader
                    {...defaultColumnProps}
                    className={styles.name}
                    header={'Name'}
                    filterName={'name'}
                    filter={this.state.filters.name}
                  />
                  <ColumnHeader
                    {...defaultColumnProps}
                    className={styles.timestamp}
                    header={'Severity update'}
                    filterName={'timestampSeverityOldest'}
                    filter={this.state.filters.timestampSeverityOldest}
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
              const isExpanded = this.state.expandedRows[key];
              const reasonStr = 'Reason: ' + row.reason;
              const acknowledgedBy = row.acknowledgedBy ? row.acknowledgedBy : 'Not acknowledged'
              const mutedBy = row.mutedBy ? row.mutedBy : 'Not muted'
              return (
                <React.Fragment key={key}>
                  <tr
                    className={[
                      styles.dataRow,
                      !row.acknowledged ? styles.unackRow : '',
                      isExpanded ? styles.expandedRowParent : '',
                    ].join(' ')}
                    onClick={() => this.clickGearIcon(key)}
                  >
                    <td
                      title={reasonStr}
                      className={styles.status}
                    >
                      {
                        <>
                          <div className={styles.statusWrapper}>
                            <div className={styles.expansionIconWrapper}>
                              <RowExpansionIcon expanded={isExpanded}/>
                            </div>
                            <Alarm
                              severity={row.severity}
                              maxSeverity={row.maxSeverity}
                              acknowledged={row.acknowledged}
                              muted={row.mutedSeverity <= row.severity}
                              ackButtonLocation='left'
                              ackAlarm={(event) => {
                                event.stopPropagation();
                                this.props.ackAlarm(row.name, row.maxSeverity, this.props.user);
                              }}
                            />
                            <div className={styles.expansionIconWrapper}/>
                          </div>
                        </>
                      }
                    </td>
                    <td
                      title={reasonStr}
                      className={styles.maxSeverity}
                    >
                      <div className={styles.maxSeverityWrapper}>
                        <Alarm severity={row.maxSeverity} />
                      </div>
                    </td>
                    <td
                      title={reasonStr}
                      className={styles.name}
                    >
                      {row.name}
                    </td>
                    <td
                      // title={reasonStr}
                      title={new Date(row.timestampSeverityOldest * 1000).toString()}
                      className={styles.timestamp}
                    >
                      {timeDifference(currentTime, row.timestampSeverityOldest * 1000)}
                    </td>
                  </tr>
                  {isExpanded ? (
                    <tr
                      onClick={this.closeFilterDialogs}
                      key={`${key}-expanded`}
                      className={[
                        styles.expandedRow,
                        !row.acknowledged ? styles.unackExpandedRow : '',
                      ].join(' ')}
                    >
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
                              <p>{acknowledgedBy}</p>
                            </div>
                            <div className={styles.title}>Muted by:</div>
                            <div>
                              <p>{mutedBy}</p>
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
