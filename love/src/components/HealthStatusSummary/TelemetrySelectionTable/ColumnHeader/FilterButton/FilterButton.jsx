import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './FilterButton.module.css';
import DefaultFilterIcon from '../../../../icons/FilterIcon/DefaultFilterIcon';
import ActiveFilterIcon from '../../../../icons/FilterIcon/ActiveFilterIcon';
import ArrowIcon from '../../../../icons/ArrowIcon/ArrowIcon';

export default class FilterButton extends Component {
  static propTypes = {
    sortDirection: PropTypes.string,
    selected: PropTypes.bool,
    isFiltered: PropTypes.bool,
    columnOnClick: PropTypes.func,
    filterName: PropTypes.string,
  }

  render() {
    const isSorted = this.props.sortDirection === 'ascending' || this.props.sortDirection === 'descending';
    const wrapperSortedStyle = isSorted ? styles.wrapperSorted : '';

    const statusStyle = this.props.selected || this.props.isFiltered ? styles.selected : styles.default;

    const sortedIconStyle = isSorted ? styles.iconSorted : '';

    return (
      <div
        className={[styles.filterIconWrapper, statusStyle, wrapperSortedStyle].join(' ')}
        onClick={(e) => this.props.columnOnClick(e, this.props.filterName)}
      >
        {this.props.isFiltered ? (
          <ActiveFilterIcon style={[styles.filterIcon, sortedIconStyle].join(' ')} />
        ) : (
          <DefaultFilterIcon style={[styles.filterIcon, sortedIconStyle].join(' ')} />
        )}

        {isSorted ? (
          <ArrowIcon
            active={true}
            up={this.props.sortDirection === 'ascending'}
            style={[sortedIconStyle, styles.arrowIcon].join(' ')}
          />
        ) : null}
      </div>
    );
  }
}

// export default class FilterIcon extends Component {
//     render() {
//         // active =
//         let statusStyle = this.props.selected ? styles.selected : styles.default;

//         const icons = {
//             default: <g>
//                     <line x1="6.29" y1="13.7" x2="11.58" y2="13.7" />
//                     <line x1="4.53" y1="9.29" x2="13.34" y2="9.29" />
//                     <line x1="1" y1="4" x2="16.87" y2="4" />
//                 </g>,
//             filtered: <path d="M16.94,1.44A.68.68,0,0,0,16.27,1H1.73a.68.68,0,0,0-.67.44.67.67,0,0,0,.16.8l5.6,5.6V13a.7.7,0,0,0,.22.52l2.9,3.26a.67.67,0,0,0,.51.22.79.79,0,0,0,.29-.06.68.68,0,0,0,.44-.67V7.84l5.6-5.6A.67.67,0,0,0,16.94,1.44Z" />

//         }

//         let icon = icons.default;
//         if(this.props.isFiltered){
//             icon = icons.filtered;;
//             statusStyle = styles.active;
//         }

//         return (
//             <svg className={[styles.filterIcon, statusStyle].join(' ')} viewBox='0 0 18 18'>
//                 {icon}
//             </svg>
//         )
//     }
// }
