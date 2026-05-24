import axios from 'axios'
import { getActiveApiKey, markApiKeyFailed, resetApiKeyFailures } from './api-key-pool'

const EVOLINK_BASE_URL = process.env.EVOLINK_BASE_URL || 'https://api.evolink.ai'
const EVOLINK_TIMEOUT = parseInt(process.env.EVOLINK_API_TIMEOUT || '120000')

interface EvolinkRequestConfig {
  method: 'POST' | 'GET'
  endpoint: string
  data?: any
  apiKey?: string
  timeout?: number
}

interface EvolinkResponse<T = any> {
  code: number
  msg: string
  data?: T
}

/**
 * Make request to Evolink API with failover
 */
export async function evolinkRequest<T = any>(config: EvolinkRequestConfig): Promise<T> {
  const { method, endpoint, data, apiKey: customApiKey, timeout = EVOLINK_TIMEOUT } = config

  // Use custom API key or get from pool
  const apiKey = customApiKey || (await getActiveApiKey('evolink'))

  if (!apiKey) {
    throw new Error('No available API key in pool')
  }

  try {
    const response = await axios({
      method,
      url: `${EVOLINK_BASE_URL}${endpoint}`,
      data,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout,
    })

    const result = response.data as EvolinkResponse<T>

    if (result.code !== 0) {
      throw new Error(`Evolink API Error: ${result.msg}`)
    }

    // Reset failure count on success
    if (!customApiKey) {
      await resetApiKeyFailures(apiKey)
    }

    return result.data as T
  } catch (error) {
    // Mark key as failed for automatic failover
    if (!customApiKey && error instanceof Error && !error.message.includes('No available')) {
      await markApiKeyFailed(apiKey)
    }
    throw error
  }
}

/**
 * Get task details from Evolink
 */
export async function getTaskDetails(
  taskId: string,
  apiKey?: string
): Promise<{
  id: string
  status: string
  progress: number
  output_url?: string
  error?: string
}> {
  return evolinkRequest({
    method: 'GET',
    endpoint: `/api/v1/task-management/get-task-detail?task_id=${taskId}`,
    apiKey,
  })
}

/**
 * Get account credits
 */
export async function getAccountCredits(apiKey?: string): Promise<{
  credits: number
  monthly_limit?: number
}> {
  return evolinkRequest({
    method: 'GET',
    endpoint: '/api/v1/account-management/get-credits',
    apiKey,
  })
}
