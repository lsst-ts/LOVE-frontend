import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/GeneralPurpose/Button/Button';
import Input from 'components/GeneralPurpose/Input/Input';
import SimpleTable from 'components/GeneralPurpose/SimpleTable/SimpleTable';
import styles from './BulkSelect.module.css';

function BulkSelect({ options = [], selectedOptions = [], onSelect = () => {}, className = '' }) {
  const [search, setSearch] = useState('');

  const selected = new Set(selectedOptions);
  const filteredOptions = options.filter((option) => option.toLowerCase().includes(search.toLowerCase()));
  const filteredSet = new Set(filteredOptions);
  const tableOptions = filteredOptions.map((option, index) => ({
    key: option,
    value: option,
  }));

  const handleSingleCheck = (event, option) => {
    event.stopPropagation();
    const { checked } = event.target;
    const newSet = new Set([...selected]);
    if (checked) {
      newSet.add(option);
      onSelect([...newSet]);
    } else {
      newSet.delete(option);
      onSelect([...newSet]);
    }
  };

  const handleMouseClick = (event, option) => {
    const newSet = new Set([...selected]);
    newSet.add(option);
    onSelect([...newSet]);
  };

  const handleMouseDown = (event, option) => {
    const newSet = new Set([...selected]);
    newSet.add(option);
    onSelect([...newSet]);
  };

  const handleMouseOver = (event, option) => {
    const { buttons } = event;
    if (buttons === 1) {
      const newSet = new Set([...selected]);
      newSet.add(option);
      onSelect([...newSet]);
    }
  };

  const handleSelectAll = () => {
    const newSet = selected.union(filteredSet);
    onSelect([...newSet]);
  };

  const handleDeselectAll = () => {
    const newSet = selected.difference(filteredSet);
    onSelect([...newSet]);
  };

  const AllCheckbox = () => {
    const allSelected = filteredSet.difference(selected).size === 0;
    return (
      <Input
        type="checkbox"
        checked={allSelected}
        onChange={(e) => {
          if (allSelected) {
            handleDeselectAll();
          } else {
            handleSelectAll();
          }
        }}
      />
    );
  };

  const tableHeaders = [
    {
      field: 'key',
      title: <AllCheckbox />,
      className: styles.checkboxHeader,
      render: (value, option) => {
        const isSelected = selected.has(option.value);
        return (
          <div
            className={styles.checkboxWrapper}
            onClick={(e) => handleMouseClick(e, option.value)}
            onMouseDown={(e) => handleMouseDown(e, option.value)}
            onMouseOver={(e) => handleMouseOver(e, option.value)}
          >
            <Input
              type="checkbox"
              checked={isSelected}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onMouseOver={(e) => e.stopPropagation()}
              onChange={(e) => handleSingleCheck(e, option.value)}
            />
          </div>
        );
      },
    },
    { field: 'value', title: 'Name' },
  ];

  return (
    <div className={[styles.container, className].join(' ')}>
      <div>
        <div className={styles.controlers}>
          <Input
            placeholder="Search"
            value={search}
            className={styles.search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={handleSelectAll}>Select All</Button>
          <Button onClick={handleDeselectAll}>Deselect All</Button>
        </div>
        <div className={styles.info}>
          Showing: {filteredSet.size} · Selected: {selected.size}
        </div>
        <div className={styles.options}>
          <SimpleTable headers={tableHeaders} data={tableOptions} />
        </div>
      </div>
    </div>
  );
}

BulkSelect.propTypes = {
  /** Array of options to be displayed */
  options: PropTypes.array,
  /** Array of selected options */
  selectedOptions: PropTypes.array,
  /** CSS class to be applied to the outermost element */
  className: PropTypes.string,
  /** Function to be called when options are selected or removed */
  onSelect: PropTypes.func,
};

export default BulkSelect;
