"use client"

import type React from "react"
import { useState, useRef, forwardRef, useImperativeHandle } from "react"
import { cn } from "@/lib/utils"
import { Upload, X, FileText } from "lucide-react"

interface FileUploaderProps {
  onFileSelected: (file: File) => void
  accept?: string
  maxSize?: number // in MB
}

const FileUploader = forwardRef<HTMLInputElement, FileUploaderProps>(
  ({ onFileSelected, accept = "application/pdf", maxSize = 10 }, ref) => {
    const [isDragging, setIsDragging] = useState(false)
    const [fileName, setFileName] = useState<string>("")
    const [fileSize, setFileSize] = useState<number>(0)
    const [error, setError] = useState<string>("")
    const fileInputRef = useRef<HTMLInputElement>(null)

    useImperativeHandle(ref, () => fileInputRef.current as HTMLInputElement)

    function handleFile(file: File) {
      setError("")

      // Validate file type
      if (accept && !file.type.match(accept)) {
        setError(`Please upload a valid ${accept.split("/")[1].toUpperCase()} file.`)
        return
      }

      // Validate file size
      if (maxSize && file.size > maxSize * 1024 * 1024) {
        setError(`File size must be less than ${maxSize}MB`)
        return
      }

      setFileName(file.name)
      setFileSize(file.size)
      onFileSelected(file)
    }

    function handleDrop(e: React.DragEvent) {
      e.preventDefault()
      setIsDragging(false)

      const droppedFile = e.dataTransfer.files[0]
      if (!droppedFile) return

      handleFile(droppedFile)
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const selectedFile = e.target.files?.[0]
      if (!selectedFile) return

      handleFile(selectedFile)
    }

    function removeFile() {
      setFileName("")
      setFileSize(0)
      setError("")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      onFileSelected(null as unknown as File)
    }

    return (
      <div className="w-full space-y-2">
        {error && <div className="text-sm text-red-500 font-medium">{error}</div>}
        <div
          className={cn(
            "relative group cursor-pointer",
            "rounded-lg border-2 border-dashed",
            "transition-colors duration-200",
            isDragging
              ? "border-green-500 bg-green-50/50 dark:bg-green-500/10"
              : error
                ? "border-red-300 dark:border-red-800"
                : "border-zinc-200 dark:border-zinc-800",
          )}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              fileInputRef.current?.click()
            }
          }}
          aria-label="Upload PDF file"
          tabIndex={0}
          role="button"
        >
          <input ref={fileInputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />

          <div className="p-6 space-y-4">
            {!fileName ? (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-green-500 dark:text-green-400" />
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Drag and drop your PDF file here or click to upload
                </p>
                <p className="text-xs text-zinc-500">Maximum file size: {maxSize}MB</p>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-500 dark:text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{fileName}</p>
                  <p className="text-xs text-zinc-500">
                    {fileSize ? `${(fileSize / 1024 / 1024).toFixed(2)} MB` : "0 MB"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile()
                  }}
                  className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded"
                  aria-label="Remove file"
                >
                  <X className="w-5 h-5 text-zinc-400" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  },
)

FileUploader.displayName = "FileUploader"

export default FileUploader
