/**
 * Base HTTP client with error handling
 */
export async function apiRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      credentials: 'include', // Always include cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    // Try to parse as JSON, handle errors gracefully
    let data
    try {
      data = await response.json()
    } catch (parseError) {
      // If JSON parsing fails, try to get text for better error message
      const text = await response.text()
      console.error('Failed to parse JSON response:', text.substring(0, 200))
      throw new Error(
        `Server returned invalid JSON response (${response.status})`
      )
    }

    if (!response.ok) {
      throw new Error(data.message || 'API Error')
    }

    return data
  } catch (error) {
    console.error('API Request Error:', error)
    throw error
  }
}
