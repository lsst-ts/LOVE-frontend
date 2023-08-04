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
