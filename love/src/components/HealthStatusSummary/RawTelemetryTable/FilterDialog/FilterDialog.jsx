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
                    <input type="text" onChange={this.props.changeFilter} />
                </div>
            </div>
        );

    }
}