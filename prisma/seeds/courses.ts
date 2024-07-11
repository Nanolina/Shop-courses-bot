import { PrismaClient } from '@prisma/client';
import { coursesDataAlinaDev, coursesDataAlinaProd } from './coursesDataAlina';
import {
  coursedDataSnezhannaDev,
  coursedDataSnezhannaProd,
} from './coursesSnezhanna';

const prisma = new PrismaClient();
const isProduction = process.env.ENVIRONMENT === 'production';

async function main() {
  console.log('Starting to seed...');

  const usersCourses = isProduction
    ? {
        1708576552: coursesDataAlinaProd,
        5075565141: coursedDataSnezhannaProd,
      }
    : {
        1708576552: coursesDataAlinaDev,
        5075565141: coursedDataSnezhannaDev,
      };

  async function createCoursesForUser(userId, courses) {
    try {
      await prisma.user.create({
        data: {
          id: userId,
          courses: {
            create: courses.map((course) => ({
              name: course.name,
              description: course.description,
              category: course.category,
              subcategory: course.subcategory,
              price: course.price,
              currency: course.currency,
              imageUrl: course.imageUrl,
              imagePublicId: course.imagePublicId,
              modules: {
                create: course.modules.map((module) => ({
                  name: module.name,
                  description: module.description,
                  imageUrl: module.imageUrl,
                  imagePublicId: module.imagePublicId,
                  lessons: {
                    create: module.lessons.map((lesson) => ({
                      name: lesson.name,
                      description: lesson.description,
                      imageUrl: lesson.imageUrl,
                      imagePublicId: lesson.imagePublicId,
                      videoUrl: lesson.videoUrl,
                      videoPublicId: lesson.videoPublicId,
                    })),
                  },
                })),
              },
            })),
          },
        },
      });
      console.log(`Courses created for user ${userId}`);
    } catch (e) {
      console.error(`Failed to create courses for user ${userId}:`, e);
    }
  }

  // Create courses for each user
  for (const [userId, courses] of Object.entries(usersCourses)) {
    await createCoursesForUser(userId, courses);
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
