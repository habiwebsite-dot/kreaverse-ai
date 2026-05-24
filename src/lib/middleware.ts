import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

/**
 * Middleware to verify admin access
 */
export function withAdmin(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
    const user = await getCurrentUser()

    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    return handler(request, ...args)
  }
}

/**
 * Middleware to verify authentication
 */
export function withAuth(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    return handler(request, ...args)
  }
}
