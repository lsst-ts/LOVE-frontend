import React from 'react'
import styles from './SummaryPanel.module.css'

const SummaryPanel = ({className, children}) => {
    return (
        <div className={[styles.summaryTable, className].join(' ')}>
            {children}
        </div>
    )
}

export default SummaryPanel