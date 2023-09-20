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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './AvailableScript.module.css';
import scriptStyles from '../Scripts.module.css';
import LaunchScriptIcon from '../../../icons/ScriptQueue/LaunchScriptIcon/LaunchScriptIcon';

export default class AvailableScript extends PureComponent {
  static propTypes = {
    /** SAL property: Index of Script SAL component */
    index: PropTypes.number,
    /** SAL property: True if this is a standard script, False if an external script */
    isStandard: PropTypes.bool,
    /** SAL property: Path of script, relative to standard or external root directory */
    path: PropTypes.string,
    /** SAL property: Estimated duration of the script, excluding slewing to the initial position required by the script */
    estimatedTime: PropTypes.number,
    /** SAL property: State of the script; see Script_Events.xml for enum values; 0 if the script is not yet loaded */
    state: PropTypes.string,
    /** Function called when launching the script configuration panel */
    launchScriptConfig: PropTypes.func,
    /** True if the script is displayed in compact view */
    isCompact: PropTypes.bool,
  };

  static defaultProps = {
    index: -1,
    isStandard: true,
    path: 'Unknown',
    estimatedTime: 0,
    state: 'Unknown',
    onLaunch: () => 0,
    isCompact: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  render() {
    const { path } = this.props;
    const fileFolder = path.substring(0, path.lastIndexOf('/') + 1);
    const fileName =
      path.lastIndexOf('.') > -1
        ? path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'))
        : path.substring(path.lastIndexOf('/') + 1);
    const fileExtension = path.lastIndexOf('.') > -1 ? path.substring(path.lastIndexOf('.')) : '';
    return (
      <div className={scriptStyles.scriptContainer}>
        <div className={styles.availableScriptContainer}>
          <div className={scriptStyles.pathTextContainer} title={path}>
            {(() => {
              if (!this.props.isCompact) {
                return <span className={scriptStyles.pathText}>{fileFolder}</span>;
              }
              if (fileFolder !== '') {
                return <span className={scriptStyles.pathText}>.../</span>;
              }
              return null;
            })()}
            <span className={[scriptStyles.pathText, scriptStyles.highlighted].join(' ')}>{fileName}</span>
            <span className={scriptStyles.pathText}>{fileExtension}</span>
          </div>
        </div>
        {this.props.commandExecutePermission && (
          <div
            className={scriptStyles.mainScriptButton}
            onClick={(e) => this.props.launchScriptConfig(e, { name: fileName, ...this.props.script })}
          >
            <span className={scriptStyles.launchIconWrapper}>
              <LaunchScriptIcon title="Launch script: Configure" />
            </span>
          </div>
        )}
      </div>
    );
  }
}
