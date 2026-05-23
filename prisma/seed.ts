import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding MediTrack database...');

  try {
    // Delete existing data to ensure clean state
    await prisma.patientRecord.deleteMany();
    await prisma.user.deleteMany();
    console.log('🗑️  Cleared existing data');

    // Create victim user
    const jamesPassword = await bcrypt.hash('password123', 10);
    const james = await prisma.user.create({
      data: {
        email: 'james@meditrack.app',
        password: jamesPassword,
        name: 'James Okafor',
      },
    });
    console.log(`✅ Created victim user: ${james.email}`);

    // Create attacker user
    const attackerPassword = await bcrypt.hash('password123', 10);
    const attacker = await prisma.user.create({
      data: {
        email: 'attacker@meditrack.app',
        password: attackerPassword,
        name: 'Attacker User',
      },
    });
    console.log(`✅ Created attacker user: ${attacker.email}`);

    // Create demo patient record
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
    console.log(`✅ Inserted demo medical record: ${record.recordId}`);

    console.log('\n🎉 Seeding complete! Demo credentials:');
    console.log('Victim: james@meditrack.app / password123');
    console.log('Attacker: attacker@meditrack.app / password123\n');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
