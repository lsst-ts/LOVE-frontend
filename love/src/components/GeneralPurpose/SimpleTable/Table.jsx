import React from 'react';
import styles from './SimpleTable.module.css';


export function Table({ children, className }) {
    return <table className={[styles.common, styles.table, className].join(' ')}>{children}</table>;
}

export function Thead({ children, className }) {
    return <thead className={[styles.common, styles.thead, className].join(' ')}>{children}</thead>;
}

export function Tbody({ children, className }) {
    return <tbody className={[styles.common, styles.tbody, className].join(' ')}>{children}</tbody>;
}

export function Td({ children, isNumber, className }) {
    return (
        <td className={[styles.common, styles.td, className, isNumber ? styles.number : styles.string].join(' ')}>
            {children}
        </td>
    );
}

export function Th({ children, className }) {
    return <th className={[styles.common, styles.th, className].join(' ')}>{children}</th>;
}

export function Tr({ children, className }) {
    return <tr className={[styles.common, styles.tr, className].join(' ')}>{children}</tr>;
}