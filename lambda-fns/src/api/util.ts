export function jsonResponse(data: any, statusCode: number = 200) {
  return {
    statusCode,
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(data),
  }
}

export const notFoundResponse = () => jsonResponse({ message: 'Not Found' }, 404)
