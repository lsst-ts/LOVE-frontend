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
import styles from './SimpleTable.module.css';

export function Table({ children, className }) {
  return <table className={[styles.common, styles.table, className].join(' ')}>{children}</table>;
}

export function Thead({ children, className }) {
  return <thead className={[styles.common, styles.thead, className].join(' ')}>{children}</thead>;
}

export function Tbody({ children, className }) {
  return <tbody className={[styles.common, styles.tbody, className].join(' ')}>{children}</tbody>;
}

export function Td({ children, isNumber, className }) {
  return (
    <td className={[styles.common, styles.td, className, isNumber ? styles.number : styles.string].join(' ')}>
      {children}
    </td>
  );
}

export function Th({ children, className }) {
  return <th className={[styles.common, styles.th, className].join(' ')}>{children}</th>;
}

export function Tr({ children, className }) {
  return <tr className={[styles.common, styles.tr, className].join(' ')}>{children}</tr>;
}
