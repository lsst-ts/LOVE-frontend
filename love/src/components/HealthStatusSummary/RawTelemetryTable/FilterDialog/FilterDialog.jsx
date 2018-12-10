import React, { Component } from 'react'
import styles from "./FilterDialog.module.css";
export default class FilterDialog extends Component {
    constructor(props){
        super(props)
        this.state = {
            AZMouseOver: false
        }
    }

    sortAscending = ()=>{
        this.props.changeSortDirection('ascending',this.props.columnName);
        this.props.closeFilterDialogs();
    }

    sortDescending = ()=>{
        this.props.changeSortDirection('descending',this.props.columnName);
        this.props.closeFilterDialogs();
    }
    
    sortMouseOver = (row)=>{
        if(row ==='AZ'){
            this.setState({AZMouseOver: true});
        }
        else if(row ==='ZA'){
            this.setState({ZAMouseOver: true});
        }
    }
    sortMouseLeave = (row)=>{
        if(row ==='AZ'){
            this.setState({AZMouseOver: false});
        }
        else if(row ==='ZA'){
            this.setState({ZAMouseOver: false});
        }
    }
    render() {

        let AZStyle = styles.dialogRow;
        if(this.state.AZMouseOver){
            AZStyle = AZStyle +' '+ styles.mouseOver;
        }
        let ZAStyle = styles.dialogRow;
        if(this.state.ZAMouseOver){
            ZAStyle = ZAStyle +' '+ styles.mouseOver;
        }



        return (
            <div className={styles.superContainer} >
                <div ref={this.container} className={styles.filterContainer + ' ' + (this.props.show ? styles.show : styles.hide)}>
                    <div className={styles.dialogRowTitle}>
                        <span className={styles.filterText}>Sort as...</span>
                    </div>
                    <div onClick={this.sortAscending} 
                        className={AZStyle} 
                        onMouseOver={()=>{this.sortMouseOver('AZ')}}
                        onMouseLeave={()=>{this.sortMouseLeave('AZ')}}>
                        <span className={styles.sortOption}>A - Z</span>
                    </div>
                    <div onClick={this.sortDescending} 
                        className={ZAStyle}
                        onMouseOver={()=>{this.sortMouseOver('ZA')}}
                        onMouseLeave={()=>{this.sortMouseLeave('ZA')}}>                        
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