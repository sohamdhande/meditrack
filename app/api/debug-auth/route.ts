import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { prisma } = await import('@/lib/prisma');
    const bcrypt = (await import('bcryptjs')).default;

    // 1. Check env
    const envStatus = {
      AUTH_SECRET: !!process.env.AUTH_SECRET,
      AUTH_SECRET_LENGTH: process.env.AUTH_SECRET?.length ?? 0,
      DATABASE_URL: !!process.env.DATABASE_URL,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    };

    // 2. Query user
    const user = await prisma.user.findUnique({
      where: { email: 'james@meditrack.app' },
    });

    // 3. Test bcrypt
    let bcryptResult = null;
    if (user) {
      bcryptResult = await bcrypt.compare('password123', user.password);
    }

    // 4. Count all users
    const userCount = await prisma.user.count();
    const allUsers = await prisma.user.findMany({
      select: { email: true, name: true, id: true },
    });

    return NextResponse.json({
      env: envStatus,
      userFound: !!user,
      userEmail: user?.email ?? null,
      storedHashPrefix: user?.password?.substring(0, 10) ?? null,
      bcryptMatch: bcryptResult,
      totalUsers: userCount,
      allUsers,
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack?.split('\n').slice(0, 5),
    }, { status: 500 });
  }
}
