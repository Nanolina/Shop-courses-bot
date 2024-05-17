import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting to seed...');

  // Creating a User
  const user = await prisma.user.create({
    data: {
      id: 145,
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
            imagePublicId: 'blockchain-course-image',
            modules: {
              create: [
                {
                  name: 'Basics of Blockchain',
                  description: 'Learn the basics of blockchain technology.',
                  imageUrl:
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6MmvPhkG-_lZiUw-isUoDWkIrKN-Q5jb84Bpl60ZYqw&s',
                  imagePublicId: 'module-image',
                  lessons: {
                    create: [
                      {
                        name: 'Lesson 1',
                        description: 'Learn the Tact language',
                        imageUrl:
                          'https://docs.tact-lang.org/_next/static/media/banner.0c18b672.jpeg',
                        imagePublicId: 'lesson-image',
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
