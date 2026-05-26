const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Memulai proses seeding...');

  // 1. Membuat data Admin awal
  const admin = await prisma.user.upsert({
    where: { email: 'admin@luxecommerce.com' },
    update: {},
    create: {
      name: 'Admin Luxe',
      email: 'admin@luxecommerce.com',
      password: 'password123', // Catatan: Di produksi nanti wajib di-hash dengan bcrypt!
      role: 'ADMIN',
    },
  });

  console.log(`Admin berhasil dibuat: ${admin.email}`);
  console.log('Proses seeding selesai dengan sukses!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });