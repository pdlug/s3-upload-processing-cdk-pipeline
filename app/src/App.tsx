import { useState } from 'react'
import FileUpload from './components/FileUploader'
import { ProgressBar } from './components/ProgressBar'

import { requestSignedUrl, uploadFile } from './client'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

type IdleState = {
  status: 'idle'
}

type UploadingState = {
  status: 'uploading'
  percentUploaded: number
}

type UploadedState = {
  status: 'uploaded'
  id: string
}

type ErrorState = {
  status: 'error'
  error: unknown
}

type State = IdleState | UploadingState | UploadedState | ErrorState

function App() {
  const [state, setState] = useState<State>({ status: 'idle' })

  const onUploadFileProgress = (percentUploaded: number) => setState({ status: 'uploading', percentUploaded })

  return (
    <div className="mx-auto p-12">
      <main>
        <h1 className="font-bold text-4xl">Upload Demo</h1>

        <div className="mt-8 max-w-lg ">
          {state.status === 'idle' ? (
            <FileUpload
              onFileAccepted={async (file) => {
                const { id, url } = await requestSignedUrl(API_BASE_URL, file)
                setState({ status: 'uploading', percentUploaded: 0 })
                await uploadFile({ url, file, onUploadFileProgress })
                setState({ status: 'uploaded', id })
              }}
            />
          ) : null}
          {state.status === 'uploading' ? <ProgressBar percent={state.percentUploaded} /> : null}
          {state.status === 'uploaded' ? <div>Upload complete: {state.id}</div> : null}
        </div>
      </main>
    </div>
  )
}

export default App
