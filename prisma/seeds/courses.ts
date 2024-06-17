import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting to seed...');

  const coursesDataAlina = [
    {
      name: 'Meditation',
      description:
        'Guided courses to help you achieve mindfulness and relaxation.',
      category: 'personal-development',
      subcategory: 'yoga-mindfulness-and-meditation',
      price: 12,
      currency: 'TON',
      imageUrl:
        'https://res.cloudinary.com/dbrquscbv/image/upload/v1718612312/course/Screenshot_2024-06-17_at_12.17.53_rkxonh.png',
      imagePublicId: 'course/Screenshot_2024-06-17_at_12.17.53_rkxonh',
      modules: [
        {
          name: 'Basics of Meditation',
          description: 'Understand the fundamental techniques of meditation.',
          lessons: [
            {
              name: 'Breathing Techniques',
              description:
                'Learn how to control your breath and use it to foster calmness.',
              videoUrl:
                'https://res.cloudinary.com/dbrquscbv/video/upload/v1718612367/lesson/huermkicjsvm2vlpac1l.mp4',
              videoPublicId: 'lesson/huermkicjsvm2vlpac1l',
            },
          ],
        },
      ],
    },
    {
      name: 'Dance Training',
      description:
        'Step-by-step dance lessons to get you moving to the rhythm.',
      category: 'lifestyle-and-entertainment',
      subcategory: 'music-and-dance',
      price: 18,
      currency: 'TON',
      imageUrl:
        'https://res.cloudinary.com/dbrquscbv/image/upload/v1718613014/course/Screenshot_2024-06-17_at_12.29.47_ziavve.png',
      imagePublicId: 'course/Screenshot_2024-06-17_at_12.29.47_ziavve',
      modules: [
        {
          name: 'Beginner Steps',
          description:
            'Start your dance journey with simple, foundational steps.',
          lessons: [
            {
              name: 'Basic Footwork',
              description: 'Learn the basic footwork of popular dance styles.',
              videoUrl:
                'https://res.cloudinary.com/dbrquscbv/video/upload/v1718613172/lesson/x9cejjegc0v5dk9krtlw.mp4',
              videoPublicId: 'lesson/x9cejjegc0v5dk9krtlw',
            },
            {
              name: 'Hands',
              description: 'Learn the basic handswork of popular dance styles.',
              videoUrl:
                'https://res.cloudinary.com/dbrquscbv/video/upload/v1718613281/lesson/t0dvnhag2k3wbdfrrrox.mp4',
              videoPublicId: 'lesson/t0dvnhag2k3wbdfrrrox',
            },
          ],
        },
      ],
    },
    {
      name: 'Yoga',
      description:
        'Yoga courses designed to improve flexibility and mental health.',
      category: 'personal-development',
      subcategory: 'yoga-mindfulness-and-meditation',
      price: 15,
      currency: 'TON',
      imageUrl:
        'https://res.cloudinary.com/dbrquscbv/image/upload/v1718613360/course/Screenshot_2024-06-17_at_12.35.26_fnncbe.png',
      imagePublicId: 'course/Screenshot_2024-06-17_at_12.35.26_fnncbe',
      modules: [
        {
          name: 'Yoga Foundations',
          description: 'Fundamental yoga poses and sequences for beginners.',
          lessons: [
            {
              name: 'Yoga Poses for Beginners',
              description:
                'Learn the core yoga poses and how to perform them safely.',
              videoUrl:
                'https://res.cloudinary.com/dbrquscbv/video/upload/v1718613547/lesson/gud7e5n6uwqx6cyaedhq.mp4',
              videoPublicId: 'lesson/gud7e5n6uwqx6cyaedhq',
            },
          ],
        },
      ],
    },
    {
      name: 'Product Photography',
      description:
        'Learn the techniques for taking professional quality product photos.',
      category: 'arts-design-and-media',
      subcategory: 'photography',
      price: 22,
      currency: 'TON',
      imageUrl:
        'https://res.cloudinary.com/dbrquscbv/image/upload/v1718613813/course/Screenshot_2024-06-17_at_12.43.03_fuivco.png',
      imagePublicId: 'course/Screenshot_2024-06-17_at_12.43.03_fuivco',
      modules: [
        {
          name: 'Jewelry Photography',
          description:
            'Learn the specific techniques required for photographing jewelry with precision and clarity.',
          lessons: [
            {
              name: 'Composition Techniques',
              description:
                'Explore how to compose shots that focus on the elegance and details of jewelry pieces.',
              videoUrl:
                'https://res.cloudinary.com/dbrquscbv/video/upload/v1718613692/lesson/dievnnfwsemp5gurrdnn.mp4',
              videoPublicId: 'lesson/dievnnfwsemp5gurrdnn',
            },
          ],
        },
        {
          name: 'Cake Photography',
          description:
            'Master the art of capturing stunning photos of cakes for bakeries and events.',
          lessons: [
            {
              name: 'Lighting and Composition for Cakes',
              description:
                'Learn the best lighting setups and compositional techniques to make cakes look appealing in photos.',
              videoUrl:
                'https://res.cloudinary.com/dbrquscbv/video/upload/v1718613603/lesson/jdwtnxhycu4lswgrvvy9.mp4',
              videoPublicId: 'lesson/jdwtnxhycu4lswgrvvy9',
            },
          ],
        },
      ],
    },
    {
      name: 'Sponge Cake Baking with Crème Brûlée Icing',
      description:
        'Learn to bake a classic sponge cake topped with delicious crème brûlée icing from scratch.',
      category: 'lifestyle-and-entertainment',
      subcategory: 'cooking-and-baking',
      price: 20,
      currency: 'TON',
      imageUrl:
        'https://res.cloudinary.com/dbrquscbv/image/upload/v1718615669/course/pexels-zvolskiy-1721932_l0fuve.jpg',
      imagePublicId: 'course/pexels-zvolskiy-1721932_l0fuve',
      modules: [
        {
          name: 'Baking the Sponge Cake with cream',
          description:
            'Master the art of baking the perfect sponge cake with step-by-step instructions.',
          lessons: [
            {
              name: 'Preparing the Batter',
              description:
                'Learn how to mix the batter to achieve a light and fluffy sponge.',
              imageUrl:
                'https://res.cloudinary.com/dbrquscbv/image/upload/v1718615463/course/Screenshot_2024-06-17_at_13.05.49_justvk.png',
              imagePublicId: 'course/Screenshot_2024-06-17_at_13.05.49_justvk',
              videoUrl:
                'https://res.cloudinary.com/dbrquscbv/video/upload/v1718615770/lesson/veawrugaxhmye2ttkpyu.mp4',
              videoPublicId: 'lesson/veawrugaxhmye2ttkpyu',
            },
          ],
        },
        {
          name: 'Assembling the cake',
          description: 'Learn how to properly assemble a sponge cake',
          imageUrl:
            'https://res.cloudinary.com/dbrquscbv/image/upload/v1718615463/course/Screenshot_2024-06-17_at_13.06.38_hwaxid.png',
          imagePublicId: 'course/Screenshot_2024-06-17_at_13.06.38_hwaxid',
          lessons: [
            {
              name: 'Put the filling on the biscuit',
              description:
                'Learn how to spread the cream so that the cake does not fall apart and is the same size on all sides.',
              videoUrl:
                'https://res.cloudinary.com/dbrquscbv/video/upload/v1718615827/lesson/bj5ngbax2m5r3ipamiee.mp4',
              videoPublicId: 'lesson/bj5ngbax2m5r3ipamiee',
            },
          ],
        },
      ],
    },
  ];
  const coursedDataSnezhanna = [
    {
      name: 'Videography',
      description:
        'Courses on shooting and editing video to create stunning visual content.',
      category: 'arts-design-and-media',
      subcategory: 'video-production-and-editing',
      price: 25,
      currency: 'TON',
      imageUrl:
        'https://res.cloudinary.com/dbrquscbv/image/upload/v1718614671/course/Screenshot_2024-06-17_at_12.53.42_ceemyl.png',
      imagePublicId: 'course/Screenshot_2024-06-17_at_12.53.42_ceemyl',
      modules: [
        {
          name: 'Video Editing',
          description:
            'Learn the basics of video editing from cutting clips to adding effects.',
          lessons: [
            {
              name: 'Creating a composition for video shooting',
              description:
                'Peculiarities of camera placement in different situations',
              videoUrl:
                'https://res.cloudinary.com/dbrquscbv/video/upload/v1718613908/lesson/oqsgcdxxtfxwsumdvmdt.mp4',
              videoPublicId: 'lesson/oqsgcdxxtfxwsumdvmdt',
            },
          ],
        },
      ],
    },
    {
      name: 'Advanced Mathematics',
      description: 'Explore complex mathematical theories and applications.',
      category: 'academic-subjects',
      subcategory: 'mathematics-and-statistics',
      price: 15,
      currency: 'TON',
      imageUrl:
        'https://res.cloudinary.com/dbrquscbv/image/upload/v1718614669/course/Screenshot_2024-06-17_at_12.54.34_ilmhfz.png',
      imagePublicUrl: 'course/Screenshot_2024-06-17_at_12.54.34_ilmhfz',
      modules: [
        {
          name: 'Calculus',
          description:
            'Dive into the fundamentals of calculus, including derivatives and integrals.',
          lessons: [
            {
              name: 'Fundamentals',
              videoUrl:
                'https://res.cloudinary.com/dbrquscbv/video/upload/v1718613937/lesson/v5xyywkodakcoi5jkhnz.mp4',
              videoPublicId: 'lesson/v5xyywkodakcoi5jkhnz',
            },
          ],
        },
      ],
    },
    {
      name: 'Gardening',
      description: 'Learn about plant care and landscape management.',
      category: 'lifestyle-and-entertainment',
      subcategory: 'gardening-and-horticulture',
      price: 10,
      currency: 'TON',
      imageUrl:
        'https://res.cloudinary.com/dbrquscbv/image/upload/v1718614682/course/Screenshot_2024-06-17_at_12.56.27_n09tn9.png',
      imagePublicId: 'course/Screenshot_2024-06-17_at_12.56.27_n09tn9',
      modules: [
        {
          name: 'Plant Basics',
          description:
            'Get to know the essentials of plant care from an expert.',
          lessons: [
            {
              name: 'Spikes',
              description: 'Learn more about spikes',
              videoUrl:
                'https://res.cloudinary.com/dbrquscbv/video/upload/v1718614007/lesson/ucwzryxa9agf3vbgclgp.mp4',
              videoPublicId: 'lesson/ucwzryxa9agf3vbgclgp',
            },
          ],
        },
      ],
    },
    {
      name: 'Oil Painting',
      description: 'Master the art of painting with oil-based paints.',
      category: 'arts-design-and-media',
      subcategory: 'illustrations',
      price: 20,
      currency: 'TON',
      imageUrl:
        'https://res.cloudinary.com/dbrquscbv/image/upload/v1718614703/course/Screenshot_2024-06-17_at_12.58.00_nmugaa.png',
      imagePublicId: 'course/Screenshot_2024-06-17_at_12.58.00_nmugaa',
      modules: [
        {
          name: 'Painting Techniques',
          description:
            'Learn various oil painting techniques to enhance your artistic skills.',
          lessons: [
            {
              name: 'Brush Handling',
              description: 'Gain control and finesse in your brushwork.',
              videoUrl:
                'https://res.cloudinary.com/dbrquscbv/video/upload/v1718614192/lesson/ew5rs2npwmwrnnk5eqtx.mp4',
              videoPublicId: 'lesson/ew5rs2npwmwrnnk5eqtx',
            },
          ],
        },
        {
          name: 'The first picture',
          description: 'Create your first painting',
          imageUrl:
            'https://res.cloudinary.com/dbrquscbv/image/upload/v1718614671/course/Screenshot_2024-06-17_at_12.56.59_cn0gkc.png',
          imagePublicId: 'course/Screenshot_2024-06-17_at_12.56.59_cn0gkc',
          lessons: [
            {
              name: 'Landscape',
              videoUrl:
                'https://res.cloudinary.com/dbrquscbv/video/upload/v1718614152/lesson/duuy927rxzcxwenkhew0.mp4',
              videoPublicId: 'lesson/duuy927rxzcxwenkhew0',
            },
          ],
        },
      ],
    },
  ];

  const usersCourses = {
    1708576552: coursesDataAlina,
    5075565141: coursedDataSnezhanna,
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
              modules: {
                create: course.modules.map((module) => ({
                  name: module.name,
                  description: module.description,
                  imageUrl: module.imageUrl,
                  lessons: {
                    create: module.lessons.map((lesson) => ({
                      name: lesson.name,
                      description: lesson.description,
                      imageUrl: lesson.imageUrl,
                      videoUrl: lesson.videoUrl,
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
