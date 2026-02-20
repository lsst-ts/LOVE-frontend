/** 
This file is part of LOVE-frontend.

Developed for the Vera C. Rubin Observatory Telescope and Site Systems.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import { useState, useEffect } from 'react';
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
    } else {
      setArrowType(null);
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
