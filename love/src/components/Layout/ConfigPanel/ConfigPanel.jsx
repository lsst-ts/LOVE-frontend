import React from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import 'brace/mode/json';
import 'brace/theme/solarized_dark';
import styles from './ConfigPanel.module.css';

ConfigPanel.propTypes = {
  /** Current LOVE configuration */
  config: PropTypes.object,
};

/** Contents of the Config File view Panel, displayed in a modal */
export default function ConfigPanel({ config }) {
  const configStr = JSON.stringify(config, null, 2);
  return (
    <div className={styles.container}>
      <div className={styles.title}>LOVE Configuration File</div>
      <AceEditor
        mode="json"
        className={styles.rndEditor}
        theme="solarized_dark"
        name="UNIQUE_ID_OF_DIV"
        width={'100%'}
        value={configStr}
        readOnly
        editorProps={{ $blockScrolling: true }}
        fontSize={14}
      />
    </div>
  );
}
