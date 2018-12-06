import React, { Component } from 'react'
import styles from "./FilterDialog.module.css";
export default class FilterDialog extends Component {
    constructor(props){
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
        if (this.props.show && !this.container.current.contains(e.target) ) {
          this.props.closeFilterDialogs();
        }
    };

    sortAscending = ()=>{
        this.props.changeSortDirection('ascending',this.props.columnName);
    }

    sortDescending = ()=>{
        this.props.changeSortDirection('descending',this.props.columnName)
    }
    
    render(){
        return(
            <div className={styles.superContainer} >
                <div ref={this.container} className={styles.filterContainer + ' '+ (this.props.show ? styles.show: styles.hide) }>
                    <p onClick={this.sortAscending}>Sort A - Z</p>
                    <p onClick={this.sortDescending}>Sort Z - A</p>
                    <input type="text" className={styles.filterInput} onChange={this.props.changeFilter} />
                </div>
            </div>
        );

    }
}