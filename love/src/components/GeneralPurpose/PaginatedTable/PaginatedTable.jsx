import React from 'react';
import SimpleTable from '../SimpleTable/SimpleTable';
import styles from './PaginatedTable.module.css';
import Button from '../Button/Button';
import Select from '../Select/Select';
import PropTypes from 'prop-types';

const AVAILABLE_ITEMS_PER_PAGE = [10, 25, 50, 100];
/**
 * Adds pagination handlers to #SimpleTable.
 */
const PaginatedTable = ({ headers, data, paginationOptions }) => {
  const availableItemsPerPage = paginationOptions ?? AVAILABLE_ITEMS_PER_PAGE;
  const [itemsPerPage, setItemsPerPage] = React.useState(availableItemsPerPage[0].toString());
  const [page, setPage] = React.useState(0);

  const lastPage =
    data.length % itemsPerPage === 0
      ? Math.floor(data.length / itemsPerPage) - 1
      : Math.floor(data.length / itemsPerPage);
  const pageData = data.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  const goToFirst = () => {
    setPage(0);
  };

  const goToLast = () => {
    setPage(lastPage);
  };

  const goToNext = () => {
    setPage((page) => Math.min(page + 1, lastPage));
  };

  const goToPrevious = () => {
    setPage((page) => Math.max(page - 1, 0));
  };

  const onSelectChange = (option) => {
    setItemsPerPage(option.value);
    setPage(0);
  };

  React.useEffect(()=>{
    setPage(0);
  }, [data, headers]);

  const feasibleItemsPerPage = availableItemsPerPage.filter((threshold) => data.length > threshold);
  return (
    <div>
      <SimpleTable headers={headers} data={pageData} />
      {feasibleItemsPerPage.length > 0 && (
        <div className={styles.paginationContainer}>
          <Select
            onChange={onSelectChange}
            controlClassName={styles.select}
            option={itemsPerPage}
            options={feasibleItemsPerPage.map((v) => v.toString())}
          />
          <Button status="transparent" onClick={goToFirst} className={styles.iconBtn}>
            &#x21E4;
          </Button>
          <span className={styles.adjacentPageControl}>
            <Button status="transparent" onClick={goToPrevious} className={styles.iconBtn}>
              &#x2190;
            </Button>
            <span className={styles.contentRange}>
              {page * itemsPerPage + 1}-{(page + 1) * itemsPerPage} of {data.length}
            </span>
            <Button status="transparent" onClick={goToNext} className={styles.iconBtn}>
              &#x2192;
            </Button>
          </span>
          <Button status="transparent" onClick={goToLast} className={styles.iconBtn}>
            &#x21E5;
          </Button>
        </div>
      )}
    </div>
  );
};

PaginatedTable.propTypes = {
  paginationOptions: PropTypes.arrayOf(PropTypes.number)
}
export default PaginatedTable;
