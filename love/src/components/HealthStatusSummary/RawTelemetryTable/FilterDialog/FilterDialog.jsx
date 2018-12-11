import React, { Component } from 'react'
import styles from "./FilterDialog.module.css";
export default class FilterDialog extends Component {

    constructor(props) {
        super(props);
        // create a ref to store the textInput DOM element
        this.textInput = React.createRef();
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        console.log('this.props', this.props)
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

    onInputKeyPress = (ev) => {
        if (ev.key === "Enter") {
            this.props.closeFilterDialogs();
        }
    }

    render() {
        return (
            <div className={styles.superContainer} >
                <div ref={this.container} className={styles.filterContainer + ' ' + (this.props.show ? styles.show : styles.hide)}>
                    <div className={styles.dialogRowTitle}>
                        <span className={styles.filterText}>Sort as...</span>
                    </div>
                    <div onClick={this.sortAscending}
                        className={styles.dialogRow}>
                        <span className={styles.sortOption}>A - Z</span>
                    </div>
                    <div onClick={this.sortDescending}
                        className={styles.dialogRow}>
                        <span className={styles.sortOption}>Z - A</span>
                    </div>

                    <div className={styles.line}> </div>
                    <div className={styles.dialogRowTitle}>
                        <span className={styles.filterText}>Filter...</span>
                    </div>
                    <input ref={this.textInput} type="text" className={styles.filterInput} onChange={this.props.changeFilter} onKeyPress={this.onInputKeyPress} />
                </div>
            </div>
        );

    }
}