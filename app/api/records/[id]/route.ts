export const dynamic = "force-dynamic";

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const record = await prisma.patientRecord.findUnique({
    where: { recordId: params.id },
  });

  if (!record) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  return Response.json(record);
}
