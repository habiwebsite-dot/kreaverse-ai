import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get active devices for this user
    const devices = await prisma.device.findMany({
      where: { userId: user.userId },
      select: {
        id: true,
        fingerprint: true,
        userAgent: true,
        ipAddress: true,
        lastActiveAt: true,
        isActive: true,
      },
      orderBy: { lastActiveAt: 'desc' },
    })

    return NextResponse.json(
      {
        success: true,
        data: devices,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[Get Devices] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
