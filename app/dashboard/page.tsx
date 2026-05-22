import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import NavBar from '@/components/NavBar';
import Link from 'next/link';
import { FileText, ChevronRight, ClipboardList } from 'lucide-react';

export default async function DashboardPage() {
  const session = await auth();
  if (!session || !session.user?.id) redirect('/login');

  const records = await prisma.patientRecord.findMany({
    where: { recordUserId: session.user.id },
  });

  return (
    <div className="min-h-screen">
      <NavBar userName={session.user.name ?? session.user.email ?? 'User'} />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground">My Records</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {records.length === 0
              ? 'No patient records found.'
              : `${records.length} record${records.length !== 1 ? 's' : ''} on file`}
          </p>
        </div>

        {records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No records available.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {records.map((record) => (
              <div
                key={record.id}
                className="bg-card border border-border rounded-xl p-6 hover:border-primary/40 transition-colors group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">{record.recordId}</span>
                  </div>
                </div>

                <h2 className="text-base font-medium text-foreground mb-1">{record.fullName}</h2>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{record.diagnosis}</p>

                <Link
                  href={`/records/${record.id}`}
                  className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  View Full Record
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
