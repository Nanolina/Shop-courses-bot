import { pointsNumber } from '../data';

export const en = {
  // Buttons
  create_course: 'Create New Course',
  my_created_courses: 'My Created Courses',
  my_purchased_courses: 'My Purchased Courses',
  choose_course: 'Choose a Course',
  personal_data: 'My Personal Data',

  // Bot Messages
  start:
    'Hungry for new learning opportunities? Click here to start your journey through our diverse course offerings',
  create:
    "Ready to bring your course ideas to life? Click the button below and let's create something helpful together",
  created_courses:
    'Ready to make changes to your created courses? Just click below and make any necessary adjustments',
  purchased_courses:
    'Click the button below and start learning your courses today',
  personal_data_edit:
    'Ready to update your personal information? Click the button below to review and change your information',
  email_required:
    'Your e-mail is required for further work. You can add or change it by clicking the button below',

  // Socket Notifications
  course_create_success: `Data successfully updated on the blockchain! Thank you for activating the course! You have been awarded ${pointsNumber} points`,
  course_create_error:
    'Failed to update data on the blockchain. Please try to activate the course again',
  course_purchase_success:
    'Data successfully updated on the blockchain! Thank you for purchasing the course! You have been awarded ${pointsNumber} points',
  course_purchase_error:
    'Failed to update data on the blockchain. Please try to purchase the course again',

  // User
  phone_required: 'Your phone number is required for further work',
  phone_share: 'Share your phone number',
};
