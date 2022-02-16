import { range } from 'lodash';
import React, { Component } from 'react';

import SimpleTable from '../../../GeneralPurpose/SimpleTable/SimpleTable';
import styles from './Drives.module.css';


export default class Drives extends Component {

    getFieldName(num) {
        return 'angle-' + num;
    }
    getHeaderAngle(num) {
        return {
            field: this.getFieldName(num),
            title: num,
            type: 'number',
            className: styles.angleColumn,
            render: (value) => (isNaN(value) || Number.isInteger(value) ? value : `${value.toFixed(2)}º`),
        };
    }

    render() {
        const li = Array.from({length: 16}, (_, i) => i + 1).map((value) => this.getHeaderAngle(value));
        const headers = [
            {
              field: 'name',
              title: 'Drivers',
            },
            ...li,
        ];
        const azimuthDrives = this.props.azimuthDrives;
        const elevationDrives = this.props.elevationDrives;
        
        const data = {
            azimuth : {
                name: (
                    <>
                        Azimuth <span className={styles.units}>[%]</span>
                    </>
                ),
            },
            elevation: {
                name: (
                    <>
                        Elevation <span className={styles.units}>[%]</span>
                    </>
                ),
            },
        };

        for ( const i in range(16)) {
            data.azimuth[this.getFieldName((parseInt(i) + 1))] = azimuthDrives[i] >= 0 ? azimuthDrives[i] : '-';
            data.elevation[this.getFieldName((parseInt(i) + 1))] = elevationDrives[i] >= 0 ? elevationDrives[i] : '-';
        }

        const simpleData = Object.values(data);
        
        return (
            <div className={styles.container}>
                <SimpleTable headers={headers} data={simpleData} />
            </div>
        );
    }
}