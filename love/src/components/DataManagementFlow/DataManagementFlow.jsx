/** This file is part of LOVE-frontend.

Developed for Inria Chile Tech Team.

See the COPYRIGHT file at the top-level directory of this distribution
for details of code ownership.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component } from 'react';
import Process from './Process';
import styles from './DataManagementFlow.module.css';

export default class DataManagementFlow extends Component {
  render = () => (
    <div className={styles.dataManagementFlow}>
      <Process className={styles.processWrapper} name="DAQ" />
      <Process className={styles.processWrapper} name="LOCALLY" />
      <Process className={styles.processWrapper} name="BASE FACILITY" />
      <Process className={styles.processWrapper} name="NCSA" />
      <Process className={styles.processWrapper} name="NCSA ARCHIVE" />
    </div>
  );
}
