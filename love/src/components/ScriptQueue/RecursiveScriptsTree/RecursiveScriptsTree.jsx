import React, {useState, useCallback, memo} from 'react';
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
  console.log("HOLA");
  if (!scriptsTree) return null;
  const [collapseTree, setCollapseTree] = useState({});
  const cachedLaunchScriptConfig = useCallback(launchScriptConfig, []);

  const recursiveKeys = Object.keys(scriptsTree).filter((key) => key !== 'root');
  const collapsedCategory = collapseTree[category] || false;
  return (
    <div className={styles.container}>
      <h6>
        <span onClick={() => setCollapseTree({...collapseTree, [category]: !collapseTree[category]})}>{collapsedCategory ? 'V' : '>'}</span>
        {category}
      </h6>
      <div
        className={styles.rootContainer}
        style={{
          maxHeight: collapsedCategory ? 0 : '100%',
        }}
      >
        {scriptsTree.root &&
          scriptsTree.root.map((script) => {
            const fullScriptPath = breadCrumb ? breadCrumb + '/' + script : script;
            const scriptObject = availableScriptList?.find((s) => s.path === fullScriptPath);
            return scriptObject && <AvailableScript
              key={`${scriptObject.type}-${scriptObject.path}`}
              path={scriptObject.path}
              isStandard={scriptObject.type ? scriptObject.type.toLowerCase() === 'standard' : true}
              launchScriptConfig={cachedLaunchScriptConfig}
              script={scriptObject}
              commandExecutePermission={scriptsBlocked}
              isCompact={false}
              {...scriptObject}/>
          })}
        {/* Base Condition and Rendering recursive component from inside itself */}
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
      </div>
    </div>
  );
};

export default memo(RecursiveScriptsTree);