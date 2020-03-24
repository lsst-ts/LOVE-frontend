import React from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import styles from './Select.module.css';

const MOBILE = 'Mobile';
const DESKTOP = 'Desktop';
const TABLET = 'Tablet';

const options = [MOBILE, DESKTOP, TABLET].map((v) => ({ value: v, label: v }));

const Select = ({ children }) => {
  const [option, setOption] = React.useState(options[0]);
  const alarm = {};
  return (
    <Dropdown
      className={styles.dropDownClassName}
      controlClassName={styles.dropDownControlClassName}
      menuClassName={styles.dropDownMenuClassName}
      arrowClassName={styles.arrowClassName}
      options={options}
      onChange={(option) => console.log(option)}
      value={option}
      placeholder="Select an option"
    />
  );
};

export default Select;
