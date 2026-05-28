async function parseResponse(response) {
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Request failed')
  }

  return data
}

export async function postJson(path, body) {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  return parseResponse(response)
}

export async function getJson(path) {
  const response = await fetch(path)

  return parseResponse(response)
}

export async function uploadResearchPdf(file) {
  const formData = new FormData()
  formData.append('pdf', file)

  const response = await fetch('/research', {
    method: 'POST',
    body: formData,
  })

  return parseResponse(response)
}
