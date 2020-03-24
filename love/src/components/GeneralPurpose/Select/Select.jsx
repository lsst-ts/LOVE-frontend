import React from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import styles from './Select.module.css';

const MOBILE = 'Mobile';
const DESKTOP = 'Desktop';
const TABLET = 'Tablet';

const options = [MOBILE, DESKTOP, TABLET].map((v) => ({ value: v, label: v }));

const Select = (props) => {
  const [option, setOption] = React.useState(options[0]);

  const {
    className: propsClassName,
    controlClassName: propsControlClassName,
    menuClassName: propsMenuClassName,
    arrowClassName: propsArrowClassName,
    small,
    ...otherProps
  } = props;

  return (
    <Dropdown
      className={[styles.dropDownClassName, propsClassName].join(' ')}
      controlClassName={[styles.dropDownControlClassName, , small ? styles.small : '', propsControlClassName].join(' ')}
      menuClassName={[styles.dropDownMenuClassName, propsMenuClassName].join(' ')}
      arrowClassName={[styles.arrowClassName, propsArrowClassName].join(' ')}
      options={options}
      onChange={(option) => setOption(option)}
      value={option}
      placeholder="Select an option"
      {...otherProps}
    />
  );
};

export default Select;
