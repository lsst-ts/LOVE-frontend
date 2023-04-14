import React, { useState, useCallback, memo } from 'react';
import RowExpansionIcon from 'components/icons/RowExpansionIcon/RowExpansionIcon';
import AvailableScript from '../Scripts/AvailableScript/AvailableScript';
import styles from './RecursiveScriptsTree.module.css';

const RecursiveScriptsTree = ({
  availableScriptList,
  category,
  scriptsTree,
  breadCrumb,
  scriptsBlocked = false,
  launchScriptConfig = () => {},
}) => {
  if (!scriptsTree) return null;
  const [openTree, setOpenTree] = useState({});
  const cachedLaunchScriptConfig = useCallback(launchScriptConfig, []);

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
                launchScriptConfig={cachedLaunchScriptConfig}
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
                  launchScriptConfig={cachedLaunchScriptConfig}
                  script={scriptObject}
                  commandExecutePermission={scriptsBlocked}
                  isCompact={false}
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

export default memo(RecursiveScriptsTree);
