"use client"

import { useCustomQuill } from '@/hooks/react-quill/useCustomQuill'

export default function CustomQuill({ 
  value, 
  onChange, 
  placeholder = "Nhập nội dung...", 
  disabled = false,
  className = "",
  minHeight = 80,
  maxHeight = 200 
}) {
  const { ReactQuill, quillModules, quillFormats, quillStyles } = useCustomQuill()

  // Custom styles with dynamic height
  const dynamicStyles = `
    ${quillStyles}
    .custom-quill-wrapper .ql-editor {
      min-height: ${minHeight}px;
      max-height: ${maxHeight}px;
      overflow-y: auto;
      font-size: 14px;
      line-height: 1.5;
    }
  `

  return (
    <>
      <div className={`custom-quill-wrapper ${className}`}>
        <ReactQuill
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          theme="snow"
          modules={quillModules}
          formats={quillFormats}
          readOnly={disabled}
        />
      </div>
      
      {/* Inject styles */}
      <style jsx global>{dynamicStyles}</style>
    </>
  )
}

// Export hook for direct usage if needed
export { useCustomQuill }
