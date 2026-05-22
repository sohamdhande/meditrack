import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding MediTrack database...');

  try {
    // Check if data already exists
    const existingUsers = await prisma.user.count();
    if (existingUsers > 0) {
      console.log('✅ Database already seeded, skipping...');
      return;
    }

    // Delete existing data
    await prisma.patientRecord.deleteMany();
    await prisma.user.deleteMany();

    // Create victim user
    const james = await prisma.user.create({
      data: {
        email: 'james@meditrack.app',
        password: await bcrypt.hash('patient123', 10),
        name: 'James Okafor',
      },
    });
    console.log(`✅ Created victim user: ${james.email}`);

    // Create attacker user
    const attacker = await prisma.user.create({
      data: {
        email: 'attacker@meditrack.app',
        password: await bcrypt.hash('attacker123', 10),
        name: 'Attacker User',
      },
    });
    console.log(`✅ Created attacker user: ${attacker.email}`);

    // Create patient record (intentionally vulnerable - accessible to anyone with session)
    const record = await prisma.patientRecord.create({
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
    console.log(`✅ Created patient record: ${record.recordId}`);

    console.log('🌱 Seeding complete!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
