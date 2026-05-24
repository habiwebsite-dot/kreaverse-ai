import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashEmail } from '@/lib/admin-auth'
import crypto from 'crypto'
import { generateToken, setAuthCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, passwordHash } = await request.json()

    if (!email || !passwordHash) {
      return NextResponse.json(
        { success: false, error: 'Email and password hash required' },
        { status: 400 }
      )
    }

    // Verify admin credentials
    const expectedEmailHash = process.env.ADMIN_EMAIL_HASH
    const expectedPasswordHash = process.env.ADMIN_PASSWORD_HASH

    const emailHash = hashEmail(email)

    if (emailHash !== expectedEmailHash || passwordHash !== expectedPasswordHash) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin credentials' },
        { status: 401 }
      )
    }

    // TODO: Verify 2FA TOTP token

    // Find or create admin user
    let adminUser = await prisma.user.findUnique({
      where: { email },
    })

    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          email,
          name: 'Admin',
          passwordHash: passwordHash, // Already hashed from env
          isAdmin: true,
          isActive: true,
        },
      })
    }

    // Generate JWT
    const token = generateToken({
      userId: adminUser.id,
      email: adminUser.email,
      isAdmin: true,
    })

    const response = NextResponse.json(
      {
        success: true,
        data: {
          user: {
            id: adminUser.id,
            email: adminUser.email,
            isAdmin: true,
          },
          token,
        },
      },
      { status: 200 }
    )

    await setAuthCookie(token)
    return response
  } catch (error) {
    console.error('[Admin Login] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
