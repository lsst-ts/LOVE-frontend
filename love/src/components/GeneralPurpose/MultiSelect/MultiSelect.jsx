import React from 'react';
import { Multiselect as ReactMultiselect } from 'multiselect-react-dropdown';
import styles from './MultiSelect.module.css';

const MultiSelect = ({ options = [], onChange = () => {}, ...props }) => {
  const { className: propsClassName, ...otherProps } = props;

  return (
    <ReactMultiselect
      isObject={false}
      className={[styles.dropDownClassName, propsClassName].join(' ')}
      options={options}
      onSelect={onChange}
      placeholder="Select an option"
      style={{
        chips: {
          backgroundColor: 'var(--second-senary-background-dimmed-color)',
        },
        multiselectContainer: {
          backgroundColor: 'var(--second-secondary-background-color)',
        },
        optionContainer: {
          backgroundColor: 'var(--second-secondary-background-color)',
        },
        option: {
          color: 'var(--highlighted-font-color)',
        },
        searchBox: {
          border: 'none',
          borderRadius: '0px',
        },
        inputField: {
          width: '100%',
          color: 'var(--base-font-color)',
        },
      }}
      {...otherProps}
    />
  );
};

export default MultiSelect;
