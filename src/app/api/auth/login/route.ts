import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePassword, hashPassword } from '@/lib/password'
import { generateToken, setAuthCookie } from '@/lib/auth'
import { generateDeviceFingerprint } from '@/lib/device-fingerprint'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password required' },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.passwordHash)
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    if (!user.isActive) {
      return NextResponse.json(
        { success: false, error: 'Account is inactive' },
        { status: 403 }
      )
    }

    // Get device info
    const userAgent = request.headers.get('user-agent') || 'Unknown'
    const ipAddress = request.headers.get('x-forwarded-for') || '0.0.0.0'
    const deviceFingerprint = generateDeviceFingerprint(userAgent, ipAddress)

    // Check for device lock - other active devices
    const otherActiveDevices = await prisma.device.findMany({
      where: {
        userId: user.id,
        fingerprint: {
          not: deviceFingerprint,
        },
        isActive: true,
      },
    })

    // If other devices are active, deactivate them and notify
    if (otherActiveDevices.length > 0) {
      await prisma.device.updateMany({
        where: {
          id: {
            in: otherActiveDevices.map((d) => d.id),
          },
        },
        data: {
          isActive: false,
        },
      })

      // TODO: Send SSE notification to other devices
    }

    // Find or create device
    let device = await prisma.device.findUnique({
      where: { fingerprint: deviceFingerprint },
    })

    if (!device) {
      device = await prisma.device.create({
        data: {
          userId: user.id,
          fingerprint: deviceFingerprint,
          userAgent,
          ipAddress,
          isActive: true,
        },
      })
    } else {
      device = await prisma.device.update({
        where: { fingerprint: deviceFingerprint },
        data: {
          lastActiveAt: new Date(),
          isActive: true,
        },
      })
    }

    // Generate JWT
    const token = generateToken({
      userId: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
      deviceId: device.id,
    })

    // Set HTTP-only cookie
    const response = NextResponse.json(
      {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin,
          },
          token,
          deviceId: device.id,
        },
      },
      { status: 200 }
    )

    await setAuthCookie(token)
    return response
  } catch (error) {
    console.error('[Login] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
