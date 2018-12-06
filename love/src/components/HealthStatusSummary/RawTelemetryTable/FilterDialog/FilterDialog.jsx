import React, { Component } from 'react'
import styles from "./FilterDialog.module.css";
export default class FilterDialog extends Component {
    constructor(props) {
        super(props);
        this.container = React.createRef();
    }
    componentDidMount() {
        document.addEventListener("mouseup", this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener("mouseup", this.handleClickOutside);
    }

    handleClickOutside = e => {
        if (this.props.show && !this.container.current.contains(e.target)) {
            this.props.closeFilterDialogs();
        }
    };
    sortAscending = ()=>{
        this.props.changeSortDirection('ascending',this.props.columnName);
    }

    sortDescending = ()=>{
        this.props.changeSortDirection('descending',this.props.columnName)
    }
    
    render() {
        return (
            <div className={styles.superContainer} >
                <div ref={this.container} className={styles.filterContainer + ' ' + (this.props.show ? styles.show : styles.hide)}>
                    <div className={styles.dialogRowTitle}>
                        <span className={styles.filterText}>Sort as...</span>
                    </div>
                    <div onClick={this.sortAscending} className={styles.dialogRow}>
                        <span className={styles.sortOption}>A - Z</span>
                    </div>
                    <div onClick={this.sortDescending} className={styles.dialogRow}>
                        <span className={styles.sortOption}>Z - A</span>
                    </div>
                    <div className={styles.dialogRowTitle}>
                        <span className={styles.filterText}>Filter...</span>
                    </div>
                    <input type="text" className={styles.filterInput} onChange={this.props.changeFilter} />
                </div>
            </div>
        );

    }
}