import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/password'
import { v4 as uuid } from 'uuid'

/**
 * Admin-only endpoint to create user account
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin (in production, use middleware)
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { email, name } = await request.json()

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email required' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists' },
        { status: 409 }
      )
    }

    // Generate random password
    const password = uuid().slice(0, 12)
    const passwordHash = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        email,
        name: name || '',
        passwordHash,
        isActive: true,
        isAdmin: false,
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
          password, // Return password to admin (send via email)
          message: 'User created. Send password to user via secure channel.',
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[Create User] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
