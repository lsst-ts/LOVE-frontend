import React, { Component } from 'react'
import styles from './StatusText.module.css'

export default class StatusText extends Component {
    // {this.props.statusCode}

    getRenderValue = (statusCode) => {
        // console.log('satautscode', statusCode, this.props.getHealthText(statusCode))

        switch (statusCode) {
            case 0:
                return <span className={[styles.status, styles.undefined].join(' ')}>{this.props.getHealthText(statusCode)}</span>
            case -1:
                return <span className={[styles.status, styles.invalid].join(' ')}>{this.props.getHealthText(statusCode)}</span>
            case 1:
                return <span className={[styles.status, styles.ok].join(' ')}>{this.props.getHealthText(statusCode)}</span>
            case 2:
                return <span className={[styles.status, styles.warning].join(' ')}>{this.props.getHealthText(statusCode)}</span>
            case 3:
                return <span className={[styles.status, styles.alert].join(' ')}>{this.props.getHealthText(statusCode)}</span>
            default:
                return <span className={[styles.status, styles.invalid].join(' ')}>{this.props.getHealthText(statusCode)}</span>
        }
    }

    render() {
        return (
            this.getRenderValue(this.props.statusCode)
        )
    }
}
