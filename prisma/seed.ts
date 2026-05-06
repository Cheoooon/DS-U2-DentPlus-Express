
import { prisma } from "../src/lib/prisma";

async function main() {
  // Comprobamos si ya existen membresías para no duplicarlas si corres el seed dos veces
  const count = await prisma.membership.count();
  
  if (count === 0) {
    await prisma.membership.createMany({
      data: [
        { name: 'Silver', discountPercentage: 5 },
        { name: 'Gold', discountPercentage: 10 },
        { name: 'Platinum', discountPercentage: 20 },
      ],
    });
    console.log('🌱 Seed: Membresías creadas exitosamente.');
  }
  else {
    console.log('🌱 Seed: Las membresías ya existen en la base de datos.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });