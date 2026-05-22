import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import NavBar from '@/components/NavBar';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Calendar,
  Mail,
  Phone,
  Stethoscope,
  Pill,
  Shield,
  FileText,
} from 'lucide-react';

interface FieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function RecordField({ icon, label, value }: FieldProps) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 text-muted-foreground shrink-0">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <p className="text-sm text-foreground">{value}</p>
      </div>
    </div>
  );
}

export default async function RecordPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session || !session.user?.id) redirect('/login');

  const record = await prisma.patientRecord.findUnique({
    where: { id: params.id },
  });

  if (!record) notFound();

  return (
    <div className="min-h-screen">
      <NavBar userName={session.user.name ?? session.user.email ?? 'User'} />

      <main className="mx-auto max-w-3xl px-6 py-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="border-b border-border px-8 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                {record.fullName}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5 font-mono">
                {record.recordId}
              </p>
            </div>
            <span className="text-xs font-medium bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1">
              Active Record
            </span>
          </div>

          <div className="p-8 space-y-8">
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                Personal Information
              </h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <RecordField
                  icon={<User className="h-4 w-4" />}
                  label="Full Name"
                  value={record.fullName}
                />
                <RecordField
                  icon={<Calendar className="h-4 w-4" />}
                  label="Date of Birth"
                  value={record.dateOfBirth}
                />
                <RecordField
                  icon={<Mail className="h-4 w-4" />}
                  label="Email"
                  value={record.email}
                />
                <RecordField
                  icon={<Phone className="h-4 w-4" />}
                  label="Phone"
                  value={record.phone}
                />
              </div>
            </section>

            <div className="border-t border-border" />

            <section>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                Clinical Information
              </h2>
              <div className="space-y-5">
                <RecordField
                  icon={<Stethoscope className="h-4 w-4" />}
                  label="Diagnosis"
                  value={record.diagnosis}
                />
                <RecordField
                  icon={<Pill className="h-4 w-4" />}
                  label="Medications"
                  value={record.medications}
                />
              </div>
            </section>

            <div className="border-t border-border" />

            <section>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                Insurance & Notes
              </h2>
              <div className="space-y-5">
                <RecordField
                  icon={<Shield className="h-4 w-4" />}
                  label="Insurance Policy Number"
                  value={record.insurancePolicyNumber}
                />
                <RecordField
                  icon={<FileText className="h-4 w-4" />}
                  label="Notes"
                  value={record.notes}
                />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
