import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting to seed...');

  // Creating a User
  const user = await prisma.user.create({
    data: {
      id: 'ca5df41b-f2b0-4442-9c0b-943e2732fa02',
      tgId: 3458,
      courses: {
        create: [
          {
            name: 'Introduction to Blockchain',
            description: 'A comprehensive guide to blockchain technology.',
            category: 'Technology',
            subcategory: 'Blockchain',
            price: 12,
            currency: 'TON',
            imageUrl:
              'https://www.shutterstock.com/image-vector/blockchain-line-icon-logo-concept-600nw-754816570.jpg',

            walletAddressSeller:
              '0:12ee206614c0d755460d0728d875c6ce46065c138b1d2ce5d1524b5f74715d61',
            modules: {
              create: [
                {
                  name: 'Basics of Blockchain',
                  description: 'Learn the basics of blockchain technology.',
                  imageUrl:
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6MmvPhkG-_lZiUw-isUoDWkIrKN-Q5jb84Bpl60ZYqw&s',
                  lessons: {
                    create: [
                      {
                        name: 'Lesson 1',
                        description: 'Learn the Tact language',
                        imageUrl:
                          'https://docs.tact-lang.org/_next/static/media/banner.0c18b672.jpeg',
                        videoUrl: 'https://www.youtube.com/watch?v=a3Jyy-z4Kmo',
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log(`Created user with ID: ${user.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
