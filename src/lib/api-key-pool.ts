import { prisma } from './prisma'

interface ApiKeyPoolItem {
  id: string
  key: string
  provider: string
  isActive: boolean
  failureCount: number
}

/**
 * Get active API key from pool (with failover logic)
 */
export async function getActiveApiKey(provider: string = 'evolink'): Promise<string | null> {
  try {
    // Get all active keys, sorted by failure count (ascending)
    const keys = await prisma.adminApiKeyPool.findMany({
      where: {
        provider,
        isActive: true,
      },
      orderBy: {
        failureCount: 'asc',
      },
      take: 1,
    })

    return keys.length > 0 ? keys[0].key : null
  } catch (error) {
    console.error('[API Key Pool] Error fetching active key:', error)
    return null
  }
}

/**
 * Mark API key as failed
 */
export async function markApiKeyFailed(key: string): Promise<void> {
  try {
    await prisma.adminApiKeyPool.update({
      where: { key },
      data: {
        failureCount: {
          increment: 1,
        },
        lastFailedAt: new Date(),
      },
    })
  } catch (error) {
    console.error('[API Key Pool] Error marking key as failed:', error)
  }
}

/**
 * Reset API key failure count
 */
export async function resetApiKeyFailures(key: string): Promise<void> {
  try {
    await prisma.adminApiKeyPool.update({
      where: { key },
      data: {
        failureCount: 0,
        lastFailedAt: null,
      },
    })
  } catch (error) {
    console.error('[API Key Pool] Error resetting key failures:', error)
  }
}

/**
 * Get all API keys in pool
 */
export async function getAllApiKeys(provider: string = 'evolink'): Promise<ApiKeyPoolItem[]> {
  try {
    return await prisma.adminApiKeyPool.findMany({
      where: { provider },
      orderBy: { createdAt: 'asc' },
    })
  } catch (error) {
    console.error('[API Key Pool] Error fetching all keys:', error)
    return []
  }
}
