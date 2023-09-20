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
import LogoIcon from '../../icons/LogoIcon/LogoIcon';
import InriaLogo from '../../icons/InriaLogo/InriaLogo';
import styles from './AboutPanel.module.css';

import packageJson from '../../../../package.json';

export default class AboutPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: undefined,
    };
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <LogoIcon className={styles.logo} title="Love" />
        <div className={styles.textWrapper}>
          <div>
            <span>You are currently running on</span>
            <span className={styles.version}>LOVE frontend version {packageJson.version}</span>
          </div>
          <div>
            <span>
              L.O.V.E, the LSST Operators Visualization Environment, is a cutting-edge GUI, Graphic User Interface,
              which with it's intuitive interface and powerful tools enables observing specialist, scientists, and
              anyone with access, to efficiently navigate, monitor and explore the current status of the observatory's
              state-of-the-art instruments.
            </span>
          </div>
          <div className={styles.version}>Created with love by Inria.</div>
        </div>
        <div className={styles.inriaLogo}>
          <InriaLogo className={styles.logo} title="Love" />
        </div>
      </div>
    );
  }
}
