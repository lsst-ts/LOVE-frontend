import React, { useState, useEffect, useRef, memo, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import styles from './RichTextEditor.module.css';
import 'react-quill/dist/quill.snow.css';

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['link'],
    // TODO: DM-41265
    // ['bold', 'italic', 'underline', 'strike'],
    // [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    // ['clean'],
  ],
};

function RichTextEditor({ defaultValue, className, onChange = () => {} }, ref) {
  const [value, setValue] = useState(defaultValue);
  const reactQuillRef = useRef(null);

  const handleChange = (value) => {
    setValue(value);
    onChange(value);
  };

  useImperativeHandle(ref, () => ({
    cleanContent() {
      setValue('');
    },
  }));

  const attachQuillRefs = () => {
    if (typeof reactQuillRef?.current?.getEditor !== 'function') return;
    const quillRef = reactQuillRef.current.getEditor();
    quillRef.clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) => {
      let ops = [];
      delta.ops.forEach((op) => {
        if (op.insert && typeof op.insert === 'string') {
          ops.push({
            insert: op.insert,
          });
        }
      });
      delta.ops = ops;
      return delta;
    });
  };

  useEffect(() => {
    attachQuillRefs();
  }, []);

  return (
    <div className={[className ?? '', styles.container].join(' ')}>
      <ReactQuill ref={reactQuillRef} modules={modules} theme="snow" value={value} onChange={handleChange} />
    </div>
  );
}

RichTextEditor.propTypes = {
  /** Default value for the editor */
  defaultValue: PropTypes.string,
  /** Class name to apply to the component */
  className: PropTypes.string,
  /** Function to handle ReactQuill onChange */
  onChange: PropTypes.func,
};

export default memo(forwardRef(RichTextEditor));
