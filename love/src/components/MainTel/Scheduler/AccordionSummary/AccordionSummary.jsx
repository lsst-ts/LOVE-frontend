import React, { Component } from 'react';
import styles from './AccordionSummary.module.css';
import LastTarget from './LastTarget';
import NextTarget from './NextTarget';

export default class AccordionSummary extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpenLast: false,
            isOpenNext: false,
        };
    }

    toggleContentLast() {
        this.setState((prevState) => ({isOpenLast: !prevState.isOpenLast}));
    };

    showContentNext() {
        this.setState({isOpenNext: true});
    };

    render() {
        return (
            <div className={styles.container}>
                <LastTarget showContent={() => this.toggleContentLast()} isOpen={this.state.isOpenLast}/>
                <NextTarget showContent={() => this.showContentNext()} isOpen={this.state.isOpenNext} />
            </div>
        );
    };
}
