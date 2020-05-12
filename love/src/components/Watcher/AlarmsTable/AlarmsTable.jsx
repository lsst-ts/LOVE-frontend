import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from '../../GeneralPurpose/Button/Button';
import RowExpansionIcon from '../../icons/RowExpansionIcon/RowExpansionIcon';
import Alarm from '../Alarm/Alarm';
import { severityToStatus } from '../../../Config';
import ColumnHeader from './ColumnHeader/ColumnHeader';
import DetailsPanel from './DetailsPanel/DetailsPanel';
import { formatTimestamp, relativeTime } from '../../../Utils';
import { isAcknowledged, isMuted, canUnack } from '../AlarmUtils';
import styles from './AlarmsTable.module.css';

/**
 * Configurable table displaying an arbitrary subset
 * of telemetries provided in the component props. It has an optional selection column
 * to be used as a telemetry selection feature. along with the filtering and sorting methods.
 * By pressing the Set button, the list of telemetries is passed to a callback function in the component props.
 *
 */
export default class AlarmsTable extends PureComponent {
  static propTypes = {
    /** Name of the current user */
    user: PropTypes.string,
    /** Number of seconds to add to a TAI timestamp to convert it in UTC */
    taiToUtc: PropTypes.number,
    /** List of alarms that are displayed. See examples below */
    alarms: PropTypes.array,
    /** Function to dispatch an alarm acknowledgement */
    ackAlarm: PropTypes.func,
    /** Function to dispatch an alarm unacknowledgement */
    unackAlarm: PropTypes.func,
    /** Function to dispatch an alarm mute */
    muteAlarm: PropTypes.func,
    /** Function to dispatch an alarm unmute */
    unmuteAlarm: PropTypes.func,
    /**
     * Map of functions to evaluate the value of rows for sorting.
     * The functions are indexed by the column or 'field? to use for sorting'
     */
    sortFunctions: PropTypes.object,
  };

  static defaultProps = {
    user: 'Unknown User',
    taiToUtc: 0,
    alarms: [],
    sortFunctions: {},
  };

  initialState = (taiToUtc) => {
    return {
      cleared: true,
      expandedRows: {},
      filters: {
        severity: {
          type: 'regexp',
          value: new RegExp('(?:)'),
          function: (value) => severityToStatus[value],
        },
        maxSeverity: {
          type: 'regexp',
          value: new RegExp('(?:)'),
          function: (value) => severityToStatus[value],
        },
        name: {
          type: 'regexp',
          value: new RegExp('(?:)'),
        },
        timestampSeverityOldest: {
          type: 'regexp',
          value: new RegExp('(?:)'),
          function: (value) => {
            return relativeTime(value * 1000, taiToUtc);
          },
        },
      },
      activeFilterDialog: 'None',
      sortingColumn: 'default',
      sortDirection: 'descending',
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      ...this.initialState(this.props.taiToUtc),
      setFilters: this.setFilters,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.taiToUtc !== this.props.taiToUtc) {
      this.resetState(this.props.taiToUtc);
    }
  }

  resetState(taiToUtc) {
    this.setState(this.initialState(taiToUtc));
  }

  evalSortFunction = (column, row) => {
    return this.props.sortFunctions[column] ? this.props.sortFunctions[column](row) : row[column];
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
    const values = Object.keys(this.state.filters).map((key) => {
      if (row[key]?.value !== undefined && this.state.filters[key].type === 'regexp') {
        const func = this.state.filters[key].function ? this.state.filters[key].function : (value) => value;
        return this.state.filters[key].value.test(func(row[key]?.value));
      }
      return true;
    });
    return values.reduce((a, b) => a && b, true);
  };

  changeFilter = (column) => (event) => {
    const filters = { ...this.state.filters };
    const value = event.target.value;
    try {
      filters[column].value = new RegExp(event.target.value, 'i');
      this.state.setFilters(filters);
    } catch (e) {
      console.log('Invalid filter');
    }
    this.setState({ cleared: value === undefined || value === '' });
  };

  columnOnClick = (_ev, filterName) => {
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
    const newColumn =
      column === this.state.sortingColumn && direction === 'None'
        ? this.initialState(this.props.taiToUtc).sortingColumn
        : column;
    /*
      direction can be "ascending" or "descending", otherwise no
      sorting will be applied
      Sorting is applied before filtering
    */
    this.setState({ sortDirection: direction, sortingColumn: newColumn, cleared: false });
  };

  sortData = (a, b) => {
    const direction = this.state.sortDirection === 'ascending' ? 1 : -1;
    const column = this.state.sortingColumn;
    const f_a = this.evalSortFunction(column, a);
    const f_b = this.evalSortFunction(column, b);
    return f_a <= f_b ? -direction : direction;
  };

  render() {
    let data = this.props.alarms;
    const user = this.props.user;
    const taiToUtc = this.props.taiToUtc;
    return (
      <div className={styles.wrapper}>
        <div className={styles.controlsContainer}>
          <Button
            className={this.state.cleared ? styles.hidden : null}
            title="Clear all filters and sorting options"
            onClick={(event) => {
              event.stopPropagation();
              this.resetState(this.props.taiToUtc);
            }}
          >
            &#10005; &nbsp; Clear filters and sort
          </Button>
        </div>
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
                      <td className={styles.ackButton} />
                      <ColumnHeader
                        {...defaultColumnProps}
                        className={styles.status}
                        header={'Severity'}
                        filterName={'severity'}
                        filter={this.state.filters.severity}
                        sortLabels={['Less critical first', 'More critical first']}
                      />
                      <ColumnHeader
                        {...defaultColumnProps}
                        className={styles.maxSeverity}
                        header={'Max severity'}
                        filterName={'maxSeverity'}
                        filter={this.state.filters.maxSeverity}
                        sortLabels={['Less critical first', 'More critical first']}
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
                        sortLabels={['Recents last', 'Recents first']}
                      />
                    </>
                  );
                })()}
              </tr>
            </thead>
            <tbody onClick={this.closeFilterDialogs}>
              {data.sort(this.sortData).map((row) => {
                if (this.testFilter(row)) {
                  const key = row.name.value;
                  const isExpanded = this.state.expandedRows[key];
                  const reasonStr = 'Reason: ' + row.reason.value;
                  const timestamp = row.timestampSeverityOldest.value * 1000;
                  return (
                    <React.Fragment key={key}>
                      <tr
                        className={[
                          !isAcknowledged(row) ? styles.unackRow : '',
                          isExpanded
                            ? isAcknowledged(row)
                              ? styles.expandedRowParent
                              : styles.unackExpandedRowParent
                            : '',
                        ].join(' ')}
                        onClick={() => this.clickGearIcon(key)}
                      >
                        <td title={reasonStr} className={[styles.firstColumn, styles.ackButton].join(' ')}>
                          {!isAcknowledged(row) ? (
                            <div className={styles.statusWrapper}>
                              <Button
                                title="Acknowledge this alarm"
                                status="info"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  this.props.ackAlarm(row.name.value, row.maxSeverity.value, user);
                                }}
                              >
                                ACK
                              </Button>
                            </div>
                          ) : (
                            canUnack(row) && (
                              <div className={styles.statusWrapper}>
                                <Button
                                  title="Unacknowledge this alarm"
                                  status="default"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    this.props.unackAlarm(row.name.value);
                                  }}
                                >
                                  Unack
                                </Button>
                              </div>
                            )
                          )}
                        </td>
                        <td title={reasonStr} className={[styles.cell, styles.status].join(' ')}>
                          <div className={styles.statusWrapper}>
                            <div className={styles.expansionIconWrapper}>
                              <RowExpansionIcon expanded={isExpanded} />
                            </div>
                            <Alarm
                              severity={row.severity.value}
                              maxSeverity={row.maxSeverity.value}
                              acknowledged={isAcknowledged(row)}
                              muted={isMuted(row)}
                              ackAlarm={(event) => {
                                event.stopPropagation();
                                this.props.ackAlarm(row.name.value, row.maxSeverity.value, user);
                              }}
                            />
                            <div className={styles.expansionIconWrapper} />
                          </div>
                        </td>
                        <td title={reasonStr} className={[styles.cell, styles.maxSeverity].join(' ')}>
                          <div className={styles.maxSeverityWrapper}>
                            <Alarm severity={row.maxSeverity.value} />
                          </div>
                        </td>
                        <td title={reasonStr} className={[styles.cell, styles.name].join(' ')}>
                          <div className={styles.textWrapper}> {row.name.value} </div>
                        </td>
                        <td title={formatTimestamp(timestamp)} className={[styles.cell, styles.timestamp].join(' ')}>
                          <div className={styles.textWrapper}>{relativeTime(timestamp, taiToUtc)}</div>
                        </td>
                      </tr>
                      {isExpanded ? (
                        <tr
                          onClick={this.closeFilterDialogs}
                          key={`${key}-expanded`}
                          className={[styles.expandedRow, !isAcknowledged(row) ? styles.unackExpandedRow : ''].join(
                            ' ',
                          )}
                        >
                          <td colSpan={1} className={styles.ackButton}></td>
                          <td colSpan={4} className={styles.expandedRowContent}>
                            <DetailsPanel
                              alarm={row}
                              taiToUtc={taiToUtc}
                              muteAlarm={(event, duration, severity) => {
                                event.stopPropagation();
                                this.props.muteAlarm(row.name.value, severity, duration, user);
                              }}
                              unmuteAlarm={(event) => {
                                event.stopPropagation();
                                this.props.unmuteAlarm(row.name.value);
                              }}
                            />
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
      </div>
    );
  }
}
