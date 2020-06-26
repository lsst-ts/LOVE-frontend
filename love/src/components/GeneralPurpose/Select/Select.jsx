import React from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import styles from './Select.module.css';

const Select = ({ options = [], small = false, onChange = () => {}, option = undefined, ...props }) => {
  const {
    className: propsClassName,
    controlClassName: propsControlClassName,
    menuClassName: propsMenuClassName,
    arrowClassName: propsArrowClassName,
    // placeholderClassName: propsPlaceholderClassName,
    ...otherProps
  } = props;

  return (
    <Dropdown
      className={[styles.dropDownClassName, propsClassName].join(' ')}
      controlClassName={[styles.dropDownControlClassName, small ? styles.small : '', propsControlClassName].join(' ')}
      menuClassName={[styles.dropDownMenuClassName, propsMenuClassName].join(' ')}
      arrowClassName={[styles.arrowClassName, propsArrowClassName].join(' ')}
      placeholderClassName={option ? null : styles.dropDownPlaceHolderClassName}
      options={options}
      onChange={onChange}
      value={option}
      placeholder="Select an option"
      {...otherProps}
    />
  );
};

export default Select;
