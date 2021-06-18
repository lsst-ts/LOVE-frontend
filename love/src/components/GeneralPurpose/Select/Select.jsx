import React from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import styles from './Select.module.css';

const labelStyle = {
  display: "inline-block",
  marginBottom: 4,
}

const Select = ({ options = [], small = false, onChange = () => {}, option = undefined, label,...props }) => {
  const {
    className: propsClassName,
    controlClassName: propsControlClassName,
    menuClassName: propsMenuClassName,
    arrowClassName: propsArrowClassName,
    // placeholderClassName: propsPlaceholderClassName,
    ...otherProps
  } = props;

  return label ? (
    <label>
      <span style={labelStyle}>{label}</span>
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
    </label>
  ) :
  (
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
