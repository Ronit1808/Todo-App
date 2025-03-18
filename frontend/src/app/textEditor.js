
'use client';

import React, { useEffect } from 'react';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';

export default function TextEditor({ value, onChange }) {
  const { quill, quillRef } = useQuill({
    theme: 'snow',
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, false] }], 
        ['bold', 'italic', 'underline', 'strike'], 
        [{ 'list': 'ordered' }, { 'list': 'bullet' }], 
        [{ 'color': [] }, { 'background': [] }], 
        ['clean'] 
      ]
    }
  });

  // Effect to handle incoming value 
  useEffect(() => {
    if (quill && value !== undefined) {
      const currentContent = quill.getText().trim();
      if (currentContent !== value.trim()) {
        quill.setText(value);
      }
    }
  }, [quill, value]);

  // Effect to handle changes made in the editor
  useEffect(() => {
    if (quill) {
      quill.on('text-change', () => {
        const content = quill.getText();
        if (onChange) {
          onChange(content);
        }
      });
    }
    
    // Cleanup function 
    return () => {
      if (quill) {
        quill.off('text-change');
      }
    };
  }, [quill, onChange]);

  return (
    <div className="rounded w-full sm:w-80 lg:w-2xl h-64 overflow-hidden">
      <div ref={quillRef} className="w-full h-full" />
    </div>
  );
}