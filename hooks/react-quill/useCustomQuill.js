"use client"

import { useMemo } from 'react'
import dynamic from 'next/dynamic'

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 h-20 rounded"></div>
})

export const useCustomQuill = () => {
  // Memoized modules configuration
  const quillModules = useMemo(() => ({
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }],
      ['link'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    },
  }), [])

  const quillFormats = useMemo(() => [
    'bold', 'italic', 'underline',
    'list',
    'link'
  ], [])

  const quillStyles = `
    .custom-quill-wrapper {
      margin-bottom: 1rem;
    }
    
    .custom-quill-wrapper .ql-toolbar {
      border-top-left-radius: 0.375rem;
      border-top-right-radius: 0.375rem;
      border: 1px solid #d1d5db;
      border-bottom: none;
      background-color: #f9fafb;
    }
    
    .custom-quill-wrapper .ql-container {
      border-bottom-left-radius: 0.375rem;
      border-bottom-right-radius: 0.375rem;
      border: 1px solid #d1d5db;
      border-top: none;
      font-family: inherit;
    }
    
    .custom-quill-wrapper .ql-editor {
      min-height: 80px;
      max-height: 200px;
      overflow-y: auto;
      font-size: 14px;
      line-height: 1.5;
    }
    
    .custom-quill-wrapper .ql-editor.ql-blank::before {
      font-style: normal;
      color: #9ca3af;
    }
    
    .custom-quill-wrapper .ql-toolbar {
      z-index: 1;
    }
    
    .custom-quill-wrapper .ql-tooltip {
      z-index: 1000;
    }
    
    .custom-quill-wrapper + .custom-quill-wrapper {
      margin-top: 1rem;
    }
  `

  return {
    ReactQuill,
    quillModules,
    quillFormats,
    quillStyles
  }
}
