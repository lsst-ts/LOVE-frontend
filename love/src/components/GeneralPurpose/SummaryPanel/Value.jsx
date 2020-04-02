import React from 'react';
import styles from './SummaryPanel.module.css';

const Value = ({ children, raw = false }) => {
  let child = children;
  if (raw && Array.isArray(children)) {
    return (
      <span className={styles.arrayValue}>
        {children.map((c, i) => {
          return (
            <span key={i} className={styles.value}>
              {c}
            </span>
          );
        })}
      </span>
    );
  }
  if (typeof children === 'object' && !React.isValidElement(children)) {
    if (children.value !== undefined) child = children.value;
    else child = JSON.stringify(children);
  }
  if (Array.isArray(child)) {
    return (
      <span className={styles.arrayValue}>
        {child.map((c) => {
          return (
            <span key={c} className={styles.value}>
              {c.toFixed && !raw ? c.toFixed(4) : c}
            </span>
          );
        })}
      </span>
    );
  }
  return <span className={styles.value}>{child.toFixed && !raw ? child.toFixed(4) : child}</span>;
};

export default Value;
