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

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import RowExpansionIcon from 'components/icons/RowExpansionIcon/RowExpansionIcon';
import AvailableScript from '../Scripts/AvailableScript/AvailableScript';
import styles from './RecursiveScriptsTree.module.css';

const RecursiveScriptsTree = ({
  availableScriptList,
  category,
  scriptsTree,
  breadCrumb,
  scriptsBlocked = false,
  openTree,
  launchScriptConfig = () => {},
  setOpenTree = () => {},
}) => {
  if (!scriptsTree) return null;
  const recursiveKeys = Object.keys(scriptsTree).filter((key) => key !== 'root');
  const openedCategory = openTree[category] || false;
  const lastCategory = category.split('-').pop();
  return (
    <div className={styles.container}>
      <h6 onClick={() => setOpenTree({ ...openTree, [category]: !openTree[category] })}>
        <div className={styles.collapseIcon}>
          {openedCategory ? <RowExpansionIcon expanded /> : <RowExpansionIcon />}
        </div>
        {lastCategory.toUpperCase()}
      </h6>
      <div className={styles.horizontalSeparation} />
      <div
        className={styles.rootContainer}
        style={{
          maxHeight: openedCategory ? '100%' : 0,
        }}
      >
        {recursiveKeys.length > 0 &&
          recursiveKeys.map((key) => {
            return (
              <RecursiveScriptsTree
                key={key}
                availableScriptList={availableScriptList}
                category={category ? category + '-' + key : key}
                scriptsTree={scriptsTree[key]}
                breadCrumb={breadCrumb ? breadCrumb + '/' + key : key}
                scriptsBlocked={scriptsBlocked}
                launchScriptConfig={launchScriptConfig}
                openTree={openTree}
                setOpenTree={setOpenTree}
              />
            );
          })}
        {scriptsTree.root &&
          scriptsTree.root.map((script) => {
            const fullScriptPath = breadCrumb ? breadCrumb + '/' + script : script;
            const scriptObject = availableScriptList?.find((s) => s.path === fullScriptPath);
            return (
              scriptObject && (
                <AvailableScript
                  key={`${scriptObject.type}-${scriptObject.path}`}
                  path={scriptObject.path}
                  isStandard={scriptObject.type ? scriptObject.type.toLowerCase() === 'standard' : true}
                  launchScriptConfig={launchScriptConfig}
                  script={scriptObject}
                  commandExecutePermission={scriptsBlocked}
                  isCompact={true}
                  {...scriptObject}
                />
              )
            );
          })}
        {/* Base Condition and Rendering recursive component from inside itself */}
      </div>
    </div>
  );
};

RecursiveScriptsTree.propTypes = {
  /** List of script lists to show */
  availableScriptList: PropTypes.arrayOf(PropTypes.object),
  /** Category of the script list, e.g. standard or external */
  category: PropTypes.string,
  /** Scripts tree hierarchy */
  scriptsTree: PropTypes.object,
  /** Bread crumb to show in the tree */
  breadCrumb: PropTypes.string,
  /** Flag to block scripts */
  scriptsBlocked: PropTypes.bool,
  /** Object to store which folder is open */
  openTree: PropTypes.object,
  /** Function to launch script configuration */
  launchScriptConfig: PropTypes.func,
  /** Function to set which folder is open */
  setOpenTree: PropTypes.func,
};

function propsAreEqual(prevProps, nextProps) {
  return (
    isEqual(prevProps.availableScriptList, nextProps.availableScriptList) &&
    prevProps.category === nextProps.category &&
    isEqual(prevProps.scriptsTree, nextProps.scriptsTree) &&
    prevProps.breadCrumb === nextProps.breadCrumb &&
    prevProps.scriptsBlocked === nextProps.scriptsBlocked &&
    isEqual(prevProps.openTree, nextProps.openTree)
  );
}

export default memo(RecursiveScriptsTree, propsAreEqual);
