import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.patientRecord.deleteMany();
  await prisma.user.deleteMany();

  const james = await prisma.user.create({
    data: {
      email: 'james@meditrack.app',
      password: await bcrypt.hash('patient123', 10),
      name: 'James Okafor',
    },
  });

  await prisma.user.create({
    data: {
      email: 'attacker@meditrack.app',
      password: await bcrypt.hash('attacker123', 10),
      name: 'Test User',
    },
  });

  await prisma.patientRecord.create({
    data: {
      recordId: 'REC-10041',
      recordUserId: james.id,
      fullName: 'James Okafor',
      dateOfBirth: '1988-03-14',
      email: 'j.okafor.personal@gmail.com',
      phone: '+91-98201-44312',
      diagnosis: 'Generalized Anxiety Disorder (GAD)',
      medications: 'Sertraline 50mg — once daily, Clonazepam 0.5mg — as needed',
      insurancePolicyNumber: 'SHI-2024-887432',
      notes: 'Patient requested records not be shared with employer.',
    },
  });

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
