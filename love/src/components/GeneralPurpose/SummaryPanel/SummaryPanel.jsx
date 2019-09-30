import React from 'react'
import styles from './SummaryPanel.module.css'

const SummaryPanel = ({children}) => {
    return (
        <div className={styles.summaryTable}>
            {children}
        </div>
    )
}

export default SummaryPanel