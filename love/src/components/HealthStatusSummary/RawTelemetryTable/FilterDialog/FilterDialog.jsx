import React, { Component } from 'react'
import styles from "./FilterDialog.module.css";
export default class FilterDialog extends Component {

    constructor(props){
        super(props);
    }

    render(){
        return(
            
            <div className={styles.superContainer}>
                <div className={styles.filterContainer}>
                    <p>Sort A - Z</p>
                    <p>Sort Z - A</p>
                    <input type="text" className={styles.filterInput} onChange={this.props.changeFilter} />
                </div>
            </div>
        );

    }
}