import axios from 'axios'
import crypto from 'crypto'

const AUPHONIC_BASE_URL = 'https://auphonic.com/api'
const AUPHONIC_USERNAME = process.env.AUPHONIC_USERNAME
const AUPHONIC_PASSWORD = process.env.AUPHONIC_PASSWORD

/**
 * Generate Auphonic authentication header
 */
function getAuphonicAuthHeader(): string {
  const credentials = `${AUPHONIC_USERNAME}:${AUPHONIC_PASSWORD}`
  return `Basic ${Buffer.from(credentials).toString('base64')}`
}

/**
 * Make request to Auphonic API
 */
export async function auphonicRequest<T = any>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  endpoint: string,
  data?: any
): Promise<T> {
  try {
    const response = await axios({
      method,
      url: `${AUPHONIC_BASE_URL}${endpoint}`,
      data,
      headers: {
        'Authorization': getAuphonicAuthHeader(),
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    })

    return response.data as T
  } catch (error) {
    console.error('[Auphonic] Request failed:', error)
    throw error
  }
}

/**
 * Create mastering production
 */
export async function createMasteringProduction(
  params: {
    title: string
    audioUrl: string
    limiter?: boolean
    loudness_target?: number
    true_peak_ceiling?: number
    oversampling?: boolean
    bass_enhancement?: number
    algorithm?: string
  }
) {
  return auphonicRequest('POST', '/productions.json', {
    metadata: {
      title: params.title,
    },
    upload_source_file: params.audioUrl,
    limiter: params.limiter ?? true,
    loudness_target: params.loudness_target ?? -14,
    true_peak_ceiling: params.true_peak_ceiling ?? -1,
    oversampling: params.oversampling ?? true,
    bass_enhancement: params.bass_enhancement ?? 0,
    algorithm: params.algorithm ?? 'mastering',
  })
}

/**
 * Get production details
 */
export async function getMasteringProduction(productionId: string) {
  return auphonicRequest('GET', `/productions/${productionId}.json`)
}

/**
 * Start mastering
 */
export async function startMastering(productionId: string) {
  return auphonicRequest('POST', `/productions/${productionId}/start.json`)
}
