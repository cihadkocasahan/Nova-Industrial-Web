import React, { useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  height?: number;
}

function RichTextEditor({ value, onChange, placeholder, error, height = 300 }: RichTextEditorProps) {
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    },
  }), []);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet', 'indent',
    'align',
    'blockquote', 'code-block',
    'link', 'image'
  ];

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        border: error ? '2px solid #EF4444' : '2px solid #e0e0e0',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: 'white',
        width: '100%',
      }}>
        <ReactQuill
          theme="snow"
          value={value || ''}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
        />
      </div>
      <style>{`
        .quill {
          width: 100%;
          display: flex;
          flex-direction: column;
          font-size: 1rem;
        }
        .quill .ql-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          font-size: 1rem;
          font-family: inherit;
          border-bottom: none;
          border-left: none;
          border-right: none;
        }
        .quill .ql-editor {
          flex: 1;
          min-height: ${height - 100}px;
          padding: 0.75rem;
          font-size: 1rem;
        }
        .quill .ql-editor.ql-blank::before {
          color: #999;
          font-style: normal;
          left: 0.75rem;
        }
        .quill .ql-toolbar {
          border-top: none;
          border-left: none;
          border-right: none;
          border-bottom: 1px solid #e0e0e0;
          padding: 0.5rem;
          background-color: #fafafa;
        }
        .quill .ql-toolbar .ql-formats {
          margin-right: 1rem;
        }
        .quill .ql-toolbar .ql-stroke {
          stroke: #666;
        }
        .quill .ql-toolbar .ql-fill {
          fill: #666;
        }
        .quill .ql-toolbar .ql-picker-label {
          color: #666;
        }
        .quill .ql-toolbar button:hover,
        .quill .ql-toolbar button:focus,
        .quill .ql-toolbar button.ql-active {
          color: #16a34a;
        }
        .quill .ql-toolbar button:hover .ql-stroke,
        .quill .ql-toolbar button:focus .ql-stroke,
        .quill .ql-toolbar button.ql-active .ql-stroke {
          stroke: #16a34a;
        }
      `}</style>
      {error && (
        <div style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          {error}
        </div>
      )}
    </div>
  );
}

export default RichTextEditor;

