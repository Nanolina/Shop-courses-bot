import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting to seed...');

  // Creating a User Alina
  const userAlina = await prisma.user.create({
    data: {
      id: 1708576552,
      courses: {
        create: [
          {
            name: 'Introduction to Blockchain',
            description: 'A comprehensive guide to blockchain technology.',
            category: 'technology-and-innovation',
            subcategory: 'blockchain-development',
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
                      {
                        name: 'Lesson 2',
                        description: 'First smart-contracts',
                        imageUrl:
                          'https://media.geeksforgeeks.org/wp-content/uploads/20220527093234/Howdoesasmartcontractwork1.jpg',
                        videoUrl: 'https://youtu.be/vZnR-pCiGNQ',
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

  // Creating a User Sneganna
  const userSneganna = await prisma.user.create({
    data: {
      id: 5075565141,
      courses: {
        create: [
          {
            name: 'React',
            description:
              'React Полный курс от А до Я. Рассмотрим основные концепции и разработаем функционал, который встречается в каждом приложении.',
            category: 'technology-and-innovation',
            subcategory: 'artificial-intelligence',
            price: 12,
            currency: 'TON',
            imageUrl:
              'https://avatars.mds.yandex.net/i?id=26246968997c93bde28e69b7017205039296dbdc-10393597-images-thumbs&n=13',
            walletAddressSeller:
              '0:16ee206614c0d755460d0728d875c6ce46065c138b1d2ce5d1524b5f74715d61',
            modules: {
              create: [
                {
                  name: 'Теория',
                  description: 'Рассмотрим ключевые моменты',
                  imageUrl:
                    'https://avatars.mds.yandex.net/i?id=11f761e7e525de063283c1945737b93a-4504275-images-thumbs&n=13',
                  lessons: {
                    create: [
                      {
                        name: 'Создание проекта',
                        description:
                          'Научимся создавать первый React проект и изучим всю структуру файлов',
                        videoUrl:
                          'https://youtu.be/GNrdg3PzpJQ?list=PL6DxKON1uLOHya4bDIynPTCwZHrezUlFs',
                      },
                      {
                        name: 'Компоненты',
                        description: 'Напишем первые компоненты на React',
                        imageUrl:
                          'https://www.pvsm.ru/images/2018/11/13/vvedenie-v-React%C2%A0Hooks-17.png',
                        videoUrl: 'https://youtu.be/H2GCkRF9eko',
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

  console.log(`Created user with ID: ${userAlina.id}`);
  console.log(`Created user with ID: ${userSneganna.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
