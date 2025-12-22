const { prisma } = require('./src/lib/prisma');
(async () => {
  const feature = await prisma.feature.findUnique({ where: { name: 'checkout_customization' } });
  console.log(JSON.stringify(feature));
  await prisma.$disconnect();
})();
