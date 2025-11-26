/**
 * Script to seed Moroccan regions and cities
 * Run with: npx tsx scripts/seed-moroccan-cities.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Moroccan regions with their main cities
const moroccanData = [
  {
    region: 'Tanger-Tétouan-Al Hoceïma',
    cities: ['Tanger', 'Tétouan', 'Al Hoceïma', 'Chefchaouen', 'Larache', 'Asilah', 'Ksar El Kébir', 'Ouezzane']
  },
  {
    region: 'Oriental',
    cities: ['Oujda', 'Nador', 'Berkane', 'Taourirt', 'Jerada', 'Guercif', 'Driouch']
  },
  {
    region: 'Fès-Meknès',
    cities: ['Fès', 'Meknès', 'Ifrane', 'Sefrou', 'El Hajeb', 'Boulemane', 'Taza', 'Moulay Yacoub']
  },
  {
    region: 'Rabat-Salé-Kénitra',
    cities: ['Rabat', 'Salé', 'Kénitra', 'Témara', 'Skhirat', 'Khémisset', 'Sidi Slimane', 'Sidi Kacem']
  },
  {
    region: 'Béni Mellal-Khénifra',
    cities: ['Béni Mellal', 'Khénifra', 'Khouribga', 'Fquih Ben Salah', 'Azilal', 'Kasba Tadla']
  },
  {
    region: 'Casablanca-Settat',
    cities: ['Casablanca', 'Mohammedia', 'El Jadida', 'Settat', 'Berrechid', 'Benslimane', 'Azemmour', 'Bouznika', 'Médiouna', 'Sidi Bennour']
  },
  {
    region: 'Marrakech-Safi',
    cities: ['Marrakech', 'Safi', 'Essaouira', 'El Kelâa des Sraghna', 'Youssoufia', 'Chichaoua', 'Rehamna']
  },
  {
    region: 'Drâa-Tafilalet',
    cities: ['Errachidia', 'Ouarzazate', 'Zagora', 'Tinghir', 'Midelt', 'Goulmima']
  },
  {
    region: 'Souss-Massa',
    cities: ['Agadir', 'Inezgane', 'Tiznit', 'Taroudant', 'Ouled Teïma', 'Ait Melloul', 'Biougra', 'Tafraout']
  },
  {
    region: 'Guelmim-Oued Noun',
    cities: ['Guelmim', 'Tan-Tan', 'Sidi Ifni', 'Assa', 'Bouizakarne']
  },
  {
    region: 'Laâyoune-Sakia El Hamra',
    cities: ['Laâyoune', 'Boujdour', 'Tarfaya', 'Es-Semara']
  },
  {
    region: 'Dakhla-Oued Ed-Dahab',
    cities: ['Dakhla', 'Aousserd']
  }
];

async function main() {
  console.log('🇲🇦 Seeding Moroccan regions and cities...\n');

  let totalRegions = 0;
  let totalCities = 0;
  let skippedRegions = 0;
  let skippedCities = 0;

  for (const data of moroccanData) {
    try {
      // Check if region already exists
      let region = await prisma.region.findFirst({
        where: { name: data.region }
      });

      if (region) {
        console.log(`⏭️  Region "${data.region}" already exists, skipping...`);
        skippedRegions++;
      } else {
        // Create region
        region = await prisma.region.create({
          data: {
            name: data.region,
            isActive: true,
          }
        });
        console.log(`✅ Created region: ${data.region}`);
        totalRegions++;
      }

      // Add cities for this region
      for (const cityName of data.cities) {
        // Check if city already exists in this region
        const existingCity = await prisma.city.findFirst({
          where: {
            name: cityName,
            regionId: region.id
          }
        });

        if (existingCity) {
          skippedCities++;
        } else {
          await prisma.city.create({
            data: {
              name: cityName,
              regionId: region.id,
              isActive: true,
            }
          });
          totalCities++;
        }
      }

      console.log(`   ➡️  Added ${data.cities.length} cities to ${data.region}\n`);
    } catch (error) {
      console.error(`❌ Error processing region "${data.region}":`, error);
    }
  }

  console.log('\n📊 Summary:');
  console.log(`   ✅ Regions created: ${totalRegions}`);
  console.log(`   ⏭️  Regions skipped (already exist): ${skippedRegions}`);
  console.log(`   ✅ Cities created: ${totalCities}`);
  console.log(`   ⏭️  Cities skipped (already exist): ${skippedCities}`);
  console.log(`\n🎉 Done! Morocco is ready for checkout!\n`);
}

main()
  .catch((error) => {
    console.error('Failed to seed Moroccan data:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
