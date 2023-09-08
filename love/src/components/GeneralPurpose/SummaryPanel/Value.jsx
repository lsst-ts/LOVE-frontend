/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React from 'react';
import PropTypes from 'prop-types';
import { fixedFloat } from 'Utils';
import styles from './SummaryPanel.module.css';

const Value = ({ children, raw = false }) => {
  if (raw) {
    /** Display booleans as 'true' or 'false' */
    if (typeof children === 'boolean') {
      return <span className={styles.value}>{JSON.stringify(children)}</span>;
    }
    /** Display array of values when children is an array */
    if (Array.isArray(children)) {
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
    /** Display strings and numbers */
    return <span className={styles.value}>{children}</span>;
  }

  let parsedChild = children;
  /** Parse children when they are an object. If they have a value, use that, 
   otherwise use the stringified version */
  if (typeof children === 'object' && !React.isValidElement(children)) {
    if (children.value !== undefined) parsedChild = children.value;
    else parsedChild = JSON.stringify(children);
  }
  /** Display array of values when children is an array */
  if (Array.isArray(parsedChild)) {
    return (
      <span className={styles.arrayValue}>
        {parsedChild.map((c) => {
          return (
            <span key={c} className={styles.value}>
              {c?.toFixed ? fixedFloat(c, 2) : c}
            </span>
          );
        })}
      </span>
    );
  }
  /** Display strings and numbers. Truncate to 4 decimal places in the case of numbers */
  // TODO: implement cases depending of specific units. For example, if units===degrees then units == '°'
  return (
    <span className={styles.value}>
      {parsedChild?.toFixed ? fixedFloat(parsedChild, 2) : parsedChild}
      {children?.units ? ' ' + children?.units : ''}
    </span>
  );
};

Value.propTypes = {
  /** The value to display */
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object, PropTypes.array]),
  /** Wheter to display raw values, instead of truncating to decimal places  */
  raw: PropTypes.bool,
};

export default Value;
