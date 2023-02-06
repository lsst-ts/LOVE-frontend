import React, { Component } from 'react';
import styles from './AccordionSummary.module.css';
import LastTarget from './LastTarget';
import NextTarget from './NextTarget';
import PredictedTarget from './PredictedTargets';
import Surveys from './Surveys';
import Blocks from './Blocks';

export default class AccordionSummary extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpenLast: false,
            isOpenNext: false,
            isOpenPredicted: false,
            isOpenSurveys: false,
            isOpenBlocks: false,
        };
    }

    toggleContentLast() {
        this.setState((prevState) => ({isOpenLast: !prevState.isOpenLast}));
    };

    toggleContentNext() {
        this.setState((prevState) => ({isOpenNext: !prevState.isOpenNext}));
    };

    toggleContentPredicted() {
        this.setState((prevState) => ({isOpenPredicted: !prevState.isOpenPredicted}));
    };

    toggleContentSurveys() {
        this.setState((prevState) => ({isOpenSurveys: !prevState.isOpenSurveys}));
    };

    toggleContentBlocks() {
        this.setState((prevState) => ({isOpenBlocks: !prevState.isOpenBlocks}));
    };

    render() {
        return (
            <div className={styles.container}>
                <LastTarget showContent={() => this.toggleContentLast()} isOpen={this.state.isOpenLast}/>
                <NextTarget showContent={() => this.toggleContentNext()} isOpen={this.state.isOpenNext} />
                <PredictedTarget showContent={() => this.toggleContentPredicted()} isOpen={this.state.isOpenPredicted} />
                <Surveys showContent={() => this.toggleContentSurveys()} isOpen={this.state.isOpenSurveys} />
                <Blocks showContent={() => this.toggleContentBlocks()} isOpen={this.state.isOpenPredicted} />
            </div>
        );
    };
}
