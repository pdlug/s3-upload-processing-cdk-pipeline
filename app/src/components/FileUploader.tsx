import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

import * as Icons from './Icons'

type FileUploadProps = {
  onFileAccepted?: (file: File) => void
}

const FileUpload = ({ onFileAccepted }: FileUploadProps): JSX.Element => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      onFileAccepted?.(acceptedFiles[0])
    },
    [onFileAccepted],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
  })

  return (
    <div
      className={`flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md ${
        isDragActive ? 'bg-gray-100' : ''
      }`}
      {...getRootProps()}
    >
      <div className="text-center">
        <Icons.Document className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-1 text-sm text-gray-600">
          <label
            htmlFor="file-upload"
            className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline transition duration-150 ease-in-out"
          >
            <input id="file-upload" {...getInputProps()} />
            Upload a file
          </label>{' '}
          or drag and drop
        </p>
      </div>
    </div>
  )
}

export default FileUpload
