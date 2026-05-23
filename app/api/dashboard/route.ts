export const dynamic = "force-dynamic";

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session || !session.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const records = await prisma.patientRecord.findMany({
    where: { recordUserId: session.user.id },
  });

  return Response.json(records);
}
