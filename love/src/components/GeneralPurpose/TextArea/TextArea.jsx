/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './TextArea.module.css';

function TextArea({ value, className, callback, ...otherProps }) {
  const [content, setContent] = useState(value ?? '');

  useEffect(() => {
    setContent(value ?? '');
  }, [value]);

  const onChange = (e) => {
    setContent(e.target.value);
    callback(e.target.value);
  };

  return (
    <textarea
      value={content}
      onChange={onChange}
      className={[styles.textarea, className].join(' ')}
      {...otherProps}
    ></textarea>
  );
}

TextArea.propTypes = {
  /** Value of the text area */
  value: PropTypes.string,
  /** Class name for the text area */
  className: PropTypes.string,
  /** Callback function to be called when the text area changes */
  callback: PropTypes.func,
};

export default TextArea;
