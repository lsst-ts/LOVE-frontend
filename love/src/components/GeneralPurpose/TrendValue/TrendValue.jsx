import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './TrendValue.module.css';

const ARROW_TYPES = {
  INCREASED: {
    node: '▲',
    class: styles.increased,
  },
  DECREASED: {
    node: '▼',
    class: styles.decreased,
  },
};

function TrendValue({ change, children }) {
  const [arrowType, setArrowType] = useState();

  useEffect(() => {
    if (change > 0) {
      setArrowType(ARROW_TYPES.INCREASED);
    } else if (change < 0) {
      setArrowType(ARROW_TYPES.DECREASED);
    }
  }, [change]);

  return (
    <div className={styles.container}>
      {arrowType && <div className={arrowType.class}>{arrowType.node}</div>}
      <div>{children}</div>
    </div>
  );
}

TrendValue.propTypes = {
  change: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
};

export default TrendValue;
