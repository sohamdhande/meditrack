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
  // VibeAudit: ownership check to prevent BOLA
  if (record.recordUserId !== session.user.id) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  return Response.json(record);
}