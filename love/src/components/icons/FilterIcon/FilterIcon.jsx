import React, { Component } from 'react'
import styles from './FilterIcon.module.css'

export default class FilterIcon extends Component {
    onClickWrapper = (ev)=>{
        this.props.onClickHandler(ev, this.props.filterName);
    }
    
    render() {
        let status = this.props.active ? styles.active : styles.inactive;

        
        return (
            <svg className={styles.filterIcon}  onClick={this.onClickWrapper} viewBox='0 0 18 18'>
                <g>
                    <line className={status} x1="6.29" y1="13.7" x2="11.58" y2="13.7" />
                    <line className={status} x1="4.53" y1="9.29" x2="13.34" y2="9.29" />
                    <line className={status} x1="1" y1="4" x2="16.87" y2="4" />
                </g>
            </svg>
        )
    }
}
