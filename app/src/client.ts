import axios from 'axios'

type SignedUrlResponse = {
  id: string
  url: string
}

/**
 * Request a signed URL for an upload. Returns the ID for the upload and the URL to upload to.
 */
export async function requestSignedUrl(apiBaseUrl: string, file: File): Promise<SignedUrlResponse> {
  const {
    data: { id, url },
  } = await axios.post(`${apiBaseUrl}/uploads`, {
    contentType: file.type,
    filename: file.name,
    size: file.size,
  })

  return { id, url }
}

type UploadFileProps = {
  url: string
  file: File
  onUploadFileProgress?: (pct: number) => void
}

/**
 * Upload a file to the specified URL.
 */
export async function uploadFile({ url, file, onUploadFileProgress }: UploadFileProps): Promise<boolean> {
  await axios.put(url, file, {
    headers: {
      'Content-Type': file.type,
    },
    onUploadProgress: (progressEvent: ProgressEvent) => {
      onUploadFileProgress?.(Math.round((progressEvent.loaded / progressEvent.total) * 100))
    },
  })

  return true
}
