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

const RichTextEditor = forwardRef(
  ({ defaultValue, className, onChange = () => {}, onKeyCombination = () => {} }, ref) => {
    const [value, setValue] = useState(defaultValue);
    const [isControlPressed, setIsControlPressed] = useState(false);
    const reactQuillRef = useRef(null);

    const handleChange = (value) => {
      setValue(value);
      onChange(value);
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        if (isControlPressed) {
          event.preventDefault();
          event.stopPropagation();
          onKeyCombination('ctrl+enter');
        }
      } else if (event.key === 'Control') {
        event.preventDefault();
        event.stopPropagation();
        setIsControlPressed(true);
      }
    };

    const handleKeyUp = (event) => {
      if (event.key === 'Control') {
        event.preventDefault();
        event.stopPropagation();
        setIsControlPressed(false);
      }
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
        <ReactQuill
          ref={reactQuillRef}
          modules={modules}
          formats={[]}
          theme="snow"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
        />
      </div>
    );
  },
);

RichTextEditor.propTypes = {
  /** Default value for the editor */
  defaultValue: PropTypes.string,
  /** Class name to apply to the component */
  className: PropTypes.string,
  /** Function to handle ReactQuill onChange */
  onChange: PropTypes.func,
  /** Function to handle key combinations
   * @param {string} combination - Key combination pressed
   * Notes:
   * - Only 'ctrl+enter' is supported at the moment
   */
  onKeyCombination: PropTypes.func,
};

RichTextEditor.displayName = 'RichTextEditor';

export default memo(RichTextEditor);
