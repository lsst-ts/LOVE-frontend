import React, { Component } from 'react'
import styles from "./FilterDialog.module.css";
import FilterIcon from "../../../icons/FilterIcon/FilterIcon"
import ArrowIcon from '../../../icons/ArrowIcon/ArrowIcon';
export default class FilterDialog extends Component {

    constructor(props) {
        super(props);
        // create a ref to store the textInput DOM element
        this.textInput = React.createRef();
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        this.textInput.current.focus();
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return nextProps.show !== this.props.show;
    }

    sortAscending = () => {
        this.props.changeSortDirection('ascending', this.props.columnName);
        this.props.closeFilterDialogs();
    }

    sortDescending = () => {
        this.props.changeSortDirection('descending', this.props.columnName);
        this.props.closeFilterDialogs();
    }

    onInputKeyUp = (ev) => {
        if (ev.key === "Enter") {
            this.props.closeFilterDialogs();
        }
        if( ev.key ==="Escape"){
            this.props.closeFilterDialogs();
            ev.target.value = "";
            this.props.changeFilter({target:''});
        }
    }

    clearAllOnClick = () =>{
        this.textInput.current.value = "";
        this.props.changeFilter({target:''});
        if(this.props.columnName===this.props.sortingColumn){
            this.props.changeSortDirection('None', this.props.columnName);
        }
    }

    render() {
        return (
            <div className={styles.superContainer} >
                <div ref={this.container} className={styles.filterContainer + ' ' + (this.props.show ? styles.show : styles.hide)}>
                    <div className={styles.dialogRowTitle}>
                        <div className={styles.filterIconWrapper}>
                            <FilterIcon />
                        </div>
                        <span className={styles.filterText}>Sort as...</span>
                        <a href='#' className={styles.clearAll} onClick={this.clearAllOnClick}> Clear all</a>
                    </div>
                    <div onClick={this.sortAscending}
                        className={styles.dialogRow}>
                        <div className={styles.filterIconWrapper}>
                            <ArrowIcon active={false} up/>
                        </div>
                        <span className={styles.sortOption}>A - Z</span>
                    </div>
                    <div onClick={this.sortDescending}
                        className={styles.dialogRow}>
                        <div className={styles.filterIconWrapper}>
                            <ArrowIcon active={false}/>
                        </div>
                        <span className={styles.sortOption}>Z - A</span>
                    </div>

                    <div className={styles.line}> </div>
                    <div className={styles.dialogRowTitle}>
                        <div className={styles.filterIconWrapper}>
                            <FilterIcon active={false} isFiltered/>
                        </div>
                        <span className={styles.filterText}>Filter...</span>
                    </div>
                    <input ref={this.textInput} type="text" className={styles.filterInput} onChange={this.props.changeFilter} onKeyUp={this.onInputKeyUp} />
                </div>
            </div>
        );

    }
}