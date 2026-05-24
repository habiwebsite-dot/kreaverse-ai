import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest, { params }: { params: { deviceId: string } }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { deviceId } = params

    // Verify device belongs to user
    const device = await prisma.device.findFirst({
      where: {
        id: deviceId,
        userId: user.userId,
      },
    })

    if (!device) {
      return NextResponse.json(
        { success: false, error: 'Device not found' },
        { status: 404 }
      )
    }

    // Deactivate device
    await prisma.device.update({
      where: { id: deviceId },
      data: { isActive: false },
    })

    return NextResponse.json(
      { success: true, message: 'Device removed' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[Remove Device] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
