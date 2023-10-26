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

import React from 'react';
import SimpleTable from '../SimpleTable/SimpleTable';
import styles from './PaginatedTable.module.css';
import Select from '../Select/Select';
import PropTypes from 'prop-types';
import Input from '../Input/Input';
import RowExpansionIcon from 'components/icons/RowExpansionIcon/RowExpansionIcon';

const AVAILABLE_ITEMS_PER_PAGE = [10, 25, 50, 100];
/**
 * Adds pagination handlers to #SimpleTable.
 */
const PaginatedTable = ({ title, headers, data, paginationOptions, callBack }) => {
  const availableItemsPerPage = paginationOptions ?? AVAILABLE_ITEMS_PER_PAGE;
  const [itemsPerPage, setItemsPerPage] = React.useState(availableItemsPerPage[0].toString());
  const [page, setPage] = React.useState(0);
  const [dataFilter, setDataFilter] = React.useState(0);

  const length = dataFilter ? dataFilter.length : data.length;
  const lastPage =
    length % itemsPerPage === 0 ? Math.floor(length / itemsPerPage) - 1 : Math.floor(length / itemsPerPage);

  const pageData = dataFilter
    ? dataFilter.slice(page * itemsPerPage, (page + 1) * itemsPerPage)
    : data.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  const goToNext = () => {
    setPage((page) => Math.min(page + 1, lastPage));
  };

  const goToPrevious = () => {
    setPage((page) => Math.max(page - 1, 0));
  };

  const goToPage = (pageNumber) => {
    setPage(pageNumber - 1);
  };

  const searchPage = (numString) => {
    const number = parseInt(numString, 10);
    if (number && number < lastPage + 2) setPage(number - 1);
  };

  const searchElements = (elem) => {
    let dataFilter = [];
    data.map((arrow) => {
      const arrayValues = Object.values(arrow);
      arrayValues.some((value) => {
        if (typeof value === 'string') {
          if (value.includes(elem)) dataFilter.push(arrow);
        } else {
          if (value === parseInt(elem, 10)) dataFilter.push(arrow);
        }
      });
    });
    setDataFilter(dataFilter);
    setPage(0);
  };

  const onSelectChange = (option) => {
    setItemsPerPage(option.value);
    setPage(0);
  };

  React.useEffect(() => {
    setPage(0);
  }, [JSON.stringify(data), JSON.stringify(headers)]);

  React.useEffect(() => {
    callBack?.(pageData);
  }, [page]);

  const feasibleItemsPerPage = availableItemsPerPage.filter((threshold) => length > threshold);

  const paginationLengthArray = lastPage < 2 ? [] : new Array(lastPage - 1).fill(0);

  return (
    <div className={styles.paginatedTable}>
      {/* Header and Search */}
      <div className={styles.tableHeader}>
        <div className={styles.tableHeaderBox}>
          <div className={styles.DTlfLeft}>{title ?? 'TITLE HEADER'}</div>
          <div className={styles.DTlfRight}>
            <div className={styles.DTperPage}>
              <span className={styles.spanLabel}>Per page: </span>
              <Select
                onChange={onSelectChange}
                controlClassName={styles.select}
                className={styles.selectDiv}
                option={itemsPerPage}
                options={feasibleItemsPerPage.map((v) => v.toString())}
              />
            </div>
            <div className={styles.DTsearch}>
              <Input onChange={(n) => searchElements(n.target.value)} placeholder={'Search'}></Input>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <SimpleTable headers={headers} data={pageData} />

      {/* Paginator */}
      {lastPage > 0 && (
        <div className={styles.paginationContainer}>
          <span className={styles.contentRange}>
            {page * itemsPerPage + 1}-{(page + 1) * itemsPerPage} of {length}
          </span>
          <div className={styles.selectPage}>
            <ul className={styles.pagination}>
              <li onClick={goToPrevious} className={styles.pageNumber}>
                <span className={styles.arrow}>&#60;</span>
              </li>
              <li key={1} onClick={() => goToPage(1)} className={styles.pageNumber}>
                {1}
              </li>
              {lastPage >= 6 ? (
                page > 3 && page < lastPage - 3 ? (
                  <>
                    <li key={'pointsPrev'} className={styles.pageNumber}>
                      ...
                    </li>
                    <li key={page} onClick={() => goToPage(page)} className={styles.pageNumber}>
                      {page}
                    </li>
                    <li key={page + 1} onClick={() => goToPage(page + 1)} className={styles.pageNumber}>
                      {page + 1}
                    </li>
                    <li key={page + 2} onClick={() => goToPage(page + 2)} className={styles.pageNumber}>
                      {page + 2}
                    </li>
                    <li key={'pointsNext'} className={styles.pageNumber}>
                      ...
                    </li>
                  </>
                ) : page <= 3 ? (
                  <>
                    <li key={2} onClick={() => goToPage(2)} className={styles.pageNumber}>
                      2
                    </li>
                    <li key={3} onClick={() => goToPage(3)} className={styles.pageNumber}>
                      3
                    </li>
                    <li key={4} onClick={() => goToPage(4)} className={styles.pageNumber}>
                      4
                    </li>
                    <li key={5} onClick={() => goToPage(5)} className={styles.pageNumber}>
                      5
                    </li>
                    <li key={'pointsNext'} className={styles.pageNumber}>
                      ...
                    </li>
                  </>
                ) : (
                  <>
                    <li key={'pointsPrev'} className={styles.pageNumber}>
                      ...
                    </li>
                    <li key={lastPage - 3} onClick={() => goToPage(lastPage - 3)} className={styles.pageNumber}>
                      {lastPage - 3}
                    </li>
                    <li key={lastPage - 2} onClick={() => goToPage(lastPage - 2)} className={styles.pageNumber}>
                      {lastPage - 2}
                    </li>
                    <li key={lastPage - 1} onClick={() => goToPage(lastPage - 1)} className={styles.pageNumber}>
                      {lastPage - 1}
                    </li>
                    <li key={lastPage} onClick={() => goToPage(lastPage)} className={styles.pageNumber}>
                      {lastPage}
                    </li>
                  </>
                )
              ) : (
                paginationLengthArray.map((value, index) => {
                  return (
                    <li key={index + 2} onClick={() => goToPage(index + 2)} className={styles.pageNumber}>
                      {index + 2}
                    </li>
                  );
                })
              )}
              <li key={lastPage + 1} onClick={() => goToPage(lastPage + 1)} className={styles.pageNumber}>
                {lastPage + 1}
              </li>
              <li onClick={goToNext} className={styles.pageNumber}>
                <span className={styles.arrow}>&#62;</span>
              </li>
            </ul>
            <div className={styles.input}>
              <Input
                iconButton={<RowExpansionIcon></RowExpansionIcon>}
                onClick={(n) => searchPage(n)}
                placeholder={'Go to page'}
              ></Input>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

PaginatedTable.propTypes = {
  paginationOptions: PropTypes.arrayOf(PropTypes.number),
};
export default PaginatedTable;
