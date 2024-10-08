import { pointsNumber } from '../data';

export const ru = {
  // Buttons
  create_course: 'Создать Новый Курс',
  my_created_courses: 'Мои Созданные Курсы',
  my_purchased_courses: 'Мои Купленные Курсы',
  choose_course: 'Выберите Курс',
  personal_data: 'Мои Персональные Данные',

  // Bot Messages
  start:
    'Жаждете новых возможностей для обучения? Кликните здесь, чтобы начать путешествие по нашему разнообразному предложению курсов',
  create:
    'Готовы воплотить ваши идеи курса в жизнь? Нажимайте на кнопку ниже и давайте создавать что-то познавательное вместе',
  created_courses:
    'Готовы внести изменения в ваши существующие курсы? Просто кликните ниже и вносите все необходимые корректировки',
  purchased_courses:
    'Нажмите на кнопку ниже и начните изучать ваши курсы уже сегодня',
  personal_data_edit:
    'Готовы обновить ваши персональные данные? Нажмите на кнопку ниже, чтобы просмотреть и изменить вашу информацию',
  email_required:
    'Для дальнейшей работы необходима ваша электронная почта. Добавить или изменить её вы можете, нажав на кнопку ниже',

  // Socket Notifications
  course_create_success: `Данные успешно обновились в блокчейне! Спасибо за активацию курса! Вам начислено ${pointsNumber} баллов`,
  course_create_error:
    'Не удалось обновить данные в блокчейне. Пожалуйста, попробуйте активировать курс еще раз',
  course_purchase_success: `Данные успешно обновились в блокчейне! Спасибо за покупку курса! Вам начислено ${pointsNumber} баллов`,
  course_purchase_error:
    'Не удалось обновить данные в блокчейне. Пожалуйста, попробуйте купить курс еще раз',

  // User
  phone_required: 'Для дальнейшей работы необходим ваш номер телефона',
  phone_share: 'Поделиться номером телефона',
};
