import React, { Component } from 'react';
import styles from './Filters.module.css';

export default class Filters extends Component {

    render() {
        return (
            <div className={styles.container}>
                <h3 className={styles.title}>Filter</h3>
                <div className={styles.separator}></div>
                <div className={styles.filters}>
                    <div className={styles.filter}>u</div>
                    <div className={styles.filter}>g</div>
                    <div className={styles.filter}>r</div>
                    <div className={styles.filter}>i</div>
                    <div className={styles.filter}>z</div>
                    <div className={styles.filter}>y</div>
                </div>
            </div>
        );
    };
}
