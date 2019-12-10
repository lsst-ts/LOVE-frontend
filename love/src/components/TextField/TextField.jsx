import React from 'react';
import styles from './TextField.module.css';
/**
 * TexField allow users to input text. 
 * Supports password and normal text fields.
 * 
 * The <input> element can be ref'd from props and any className 
 * will be appended at the end of the default ones.
 */
export default React.forwardRef(({ className, ...props }, ref) => (
  <input
    type={props.type === 'password' ? props.type : 'text'}
    {...props}
    ref={ref}
    className={[styles.input, className].join(' ')}
  />
));
