import React, { Component } from 'react'
import styles from "./FilterDialog.module.css";
export default class FilterDialog extends Component {
    constructor(props){
        super(props);
        this.container = React.createRef();
    }
    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
    }
    
    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }
    
    handleClickOutside = e => {
        if (this.props.show && !this.container.current.contains(e.target) ) {
          this.props.closeFilterDialogs();
        }
      };
    
    render(){
        return(
            <div className={styles.superContainer} >
                <div ref={this.container} className={styles.filterContainer + ' '+ (this.props.show ? styles.show: styles.hide) }>
                    <p>Sort A - Z</p>
                    <p>Sort Z - A</p>
                    <input type="text" className={styles.filterInput} onChange={this.props.changeFilter} />
                </div>
            </div>
        );

    }
}