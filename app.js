'use strict';
/* =========================================================
   StudyItaly.kg — app.js  (Vanilla JS SPA)
   ---------------------------------------------------------
   КОМПОНЕНТТЕР (45):
   Header, Nav, BurgerMenu, ThemeToggle, LangSwitcher, AuthArea, UserDropdown,
   Hero, HeroSearch, Stats, WhyItaly, Steps, Testimonials, CTA, UniCard,
   SkeletonCard, Filters, SearchBar, SortSelect, Pagination, EmptyState,
   DetailPage, Gallery, Facts, ProgramsTable, Requirements, Weather, WikiInfo,
   MapEmbed, Stars, ReviewsBlock, ReviewForm, ReviewItem, CartPage, CartItem,
   Summary, CheckoutPage, PaymentForm, BookingPage, FavoritesPage, LoginPage,
   RegisterPage, OAuthButtons, ProfilePage, AdminPage, AdminDashboard (Charts),
   AdminUnis (CRUD), UniForm + ImageUpload, AdminOrders, AdminBookings,
   AdminUsers, AdminSettings, TranslatorPage, ChatBot, Toast, Modal,
   ConfirmModal, ErrorBoundary, NotFound, Forbidden, Footer
   ---------------------------------------------------------
   API: Mock REST (localStorage) + Wikipedia API (сүрөттөр) +
   Open-Meteo (аба ырайы) + MyMemory (котормо) + Telegram + EmailJS + Cloudinary
   ========================================================= */

/* =========================================================
   1. CONFIG — өз ачкычтарыңызды ушул жерге жазыңыз
   ========================================================= */
const CONFIG = {
  TELEGRAM_BOT_TOKEN: '',   // @BotFather берген токен, мис: '123456:ABC...'
  TELEGRAM_CHAT_ID: '',     // өзүңүздүн chat_id (мис: @userinfobot аркылуу)
  EMAILJS: { serviceId: '', templateId: '', publicKey: '' }, // emailjs.com
  CLOUDINARY: { cloudName: '', uploadPreset: '' },           // unsigned preset
  GOOGLE_CLIENT_ID: '',     // console.cloud.google.com → OAuth Client ID
  PAGE_SIZE: 6,
};

/* =========================================================
   2. I18N — котормолор (kg / ru / en)
   ========================================================= */
const I18N = {
  ky: {
    nav_home: 'Башкы бет', nav_unis: 'Университеттер', nav_favs: 'Тандалмалар', nav_cart: 'Себет', nav_booking: 'Бронь', nav_translator: 'Котормочу', nav_admin: 'Админ',
    login: 'Кирүү', register: 'Катталуу', logout: 'Чыгуу', profile: 'Профиль',
    hero_badge: '🇮🇹 2026–2027 окуу жылына кабыл алуу ачык',
    hero_title: 'Италиядагы мыкты университеттерде оку',
    hero_sub: '17 университет, 85+ программа, стипендиялар жана кабыл алуу боюнча толук маалымат — баары кыргыз тилинде.',
    hero_cta: 'Университеттерди көрүү', hero_cta2: 'Консультацияга жазылуу',
    search_ph: 'Университеттин, шаардын же программанын аты...', search: 'Издөө',
    stat_unis: 'университет', stat_cities: 'шаар', stat_oldest: 'эң байыркысы негизделген', stat_avg: 'орточо окуу акысы/жыл',
    top_unis: 'Эң жогорку рейтингдеги университеттер', see_all: 'Баарын көрүү →', cities_title: 'Шаарлар боюнча',
    why_title: 'Эмне үчүн Италия?',
    why1_t: 'Арзан окуу', why1_d: 'Мамлекеттик университеттерде окуу акысы үй-бүлөнүн кирешесине жараша жылына €0–€4000.',
    why2_t: 'Стипендиялар', why2_d: 'Регионалдык DSU стипендиялары: акча, жатакана жана тамак бекер болушу мүмкүн.',
    why3_t: 'Англис тилинде', why3_d: '500дөн ашык программа толугу менен англис тилинде окутулат.',
    why4_t: 'Европа дипломы', why4_d: 'Диплом бүт Евробиримдикте таанылат, окуудан кийин иш издөөгө уруксат берилет.',
    steps_title: 'Кабыл алуу кадамдары',
    step1: 'Университет жана программа тандоо', step2: 'Документтерди даярдоо (аттестат, IELTS)', step3: 'Онлайн арыз (pre-assessment)', step4: 'Universitaly аркылуу пре-катталуу', step5: 'Элчиликте D-виза алуу', step6: 'Италияга учуу жана Permesso di soggiorno',
    reviews_title: 'Студенттердин пикирлери', cta_title: 'Документтериңизди биз менен даярдаңыз', cta_sub: 'Акысыз 30 мүнөттүк онлайн консультация.',
    filters: 'Чыпкалар', city: 'Шаар', all: 'Баары', type: 'Түрү', state: 'Мамлекеттик', private: 'Жеке', max_tuition: 'Макс. окуу акысы', english_only: 'Англисче программасы бар', sort: 'Иреттөө', s_rating: 'Рейтинг боюнча', s_tuition: 'Арзаны биринчи', s_founded: 'Эң байыркы', s_name: 'Аты боюнча', found: 'университет табылды', reset: 'Тазалоо', no_results: 'Эч нерсе табылган жок', apply: 'Колдонуу',
    details: 'Толугураак', add_cart: 'Себетке', in_cart: 'Себетте', fav: 'Тандалмага', book: 'Брондоо',
    students: 'Студенттер', founded: 'Негизделген', tuition: 'Окуу акысы', per_year: '/жыл', qs: 'QS рейтинги', deadline: 'Арыз мөөнөтү', eng_programs: 'Англисче программа', yes: 'Бар', no: 'Жок', service_price: 'Арыз пакетинин баасы', exam: 'Кирүү сынагы', rating: 'Рейтинг',
    about: 'Университет жөнүндө', wiki_info: 'Википедиядан (англисче)', programs: 'Программалар', level: 'Деңгээл', language: 'Тил', duration: 'Мөөнөт', years: 'жыл', requirements: 'Талаптар жана документтер', scholarships: 'Стипендиялар', weather: 'Шаардагы аба ырайы', reviews: 'Пикирлер', write_review: 'Пикир калтыруу', comment: 'Пикириңизди жазыңыз...', send: 'Жөнөтүү', login_to_review: 'Пикир калтыруу үчүн аккаунтка кириңиз', similar: 'Окшош университеттер', map: 'Картада',
    cart_title: 'Себет', empty_cart: 'Себетиңиз азырынча бош', remove: 'Өчүрүү', subtotal: 'Аралык сумма', service_fee: 'Кызмат акысы', total: 'Жалпы', checkout: 'Заказ берүү', continue: 'Университет тандоо', package: 'Арыз берүү пакети: документтер, котормо, Universitaly',
    checkout_title: 'Заказды тариздөө', contact_info: 'Байланыш маалыматы', full_name: 'Аты-жөнү', email: 'Email', phone: 'Телефон', address: 'Шаар / дарек', payment: 'Төлөм ыкмасы', pay_card: 'Банк картасы (Stripe demo)', pay_postkg: 'Post.kg (demo)', pay_cash: 'Кеңседе накталай', card_number: 'Картанын номери', card_exp: 'ММ/ЖЖ', card_cvc: 'CVC', place_order: 'Төлөө жана заказ берүү', processing: 'Иштетилүүдө...', order_success: 'Заказ ийгиликтүү кабыл алынды!', card_declined: 'Карта четке кагылды', test_cards: 'Тест карта: 4242 4242 4242 4242 (ийгилик) · 4000 0000 0000 0002 (четке кагуу)', postkg_note: 'Post.kg аркылуу QR-код менен төлөм (демо режим).', cash_note: 'Бишкектеги кеңседе төлөйсүз.',
    booking_title: 'Консультацияга брондоо', booking_sub: 'Онлайн консультация, виртуалдык тур же документ текшерүү.', booking_type: 'Брондун түрү', b_online: 'Онлайн консультация', b_tour: 'Виртуалдык кампус-тур', b_docs: 'Документтерди текшерүү', date: 'Күнү', time: 'Убакыт', note: 'Кошумча маалымат', book_now: 'Брондоо', booking_success: 'Бронь ийгиликтүү катталды!', university: 'Университет',
    favs_title: 'Тандалма университеттер', empty_favs: 'Тандалмаларыңыз азырынча бош',
    password: 'Сырсөз', confirm_password: 'Сырсөздү кайталаңыз', no_account: 'Аккаунтуңуз жокпу?', have_account: 'Аккаунтуңуз барбы?', or: 'же', admin_hint: 'Демо админ: admin@uni.kg / admin123 · Колдонуучу: user@uni.kg / user123', bad_login: 'Email же сырсөз туура эмес', email_taken: 'Бул email мурда катталган', pass_short: 'Сырсөз кеминде 6 белги болушу керек', pass_mismatch: 'Сырсөздөр дал келбейт', welcome: 'Кош келиңиз', login_sub: 'Аккаунтуңузга кириңиз', register_sub: 'Жаңы аккаунт түзүңүз',
    my_orders: 'Менин заказдарым', my_bookings: 'Менин брондорум', role: 'Роль', token_exp: 'Сессия бүтөт', no_data: 'Азырынча маалымат жок', status: 'Статус', st_pending: 'Күтүүдө', st_paid: 'Төлөндү', st_done: 'Аткарылды', st_cancel: 'Жокко чыгарылды',
    admin_title: 'Админ панель', dashboard: 'Статистика', users: 'Колдонуучулар', orders: 'Заказдар', bookings: 'Брондор', settings: 'Жөндөөлөр', add_uni: '+ Университет кошуу', edit_uni: 'Университетти өзгөртүү', save: 'Сактоо', cancel: 'Жокко чыгаруу', delete: 'Өчүрүү', edit: 'Өзгөртүү', confirm_delete: 'Чын эле өчүрөсүзбү?', saved: 'Сакталды ✓', deleted: 'Өчүрүлдү', upload_img: 'Сүрөт жүктөө (Cloudinary)', name: 'Аталышы', short: 'Кыска аты', region: 'Аймак', image_url: 'Сүрөт URL', description: 'Сүрөттөмө', reset_db: 'Базаны баштапкы абалга келтирүү', reset_done: 'База жаңыланды', revenue: 'Киреше', chart_city: 'Шаарлар боюнча университеттер', chart_status: 'Заказдардын статусу', chart_rev: 'Акыркы 7 күндүн кирешеси', chart_top: 'Рейтинг ТОП-8', actions: 'Аракеттер', wiki_title: 'Wikipedia макаласы (сүрөт үчүн)', integrations: 'Интеграциялар', programs_hint: 'Ар бир сапка: Аты | Деңгээл | Тил | Жыл', uploading: 'Жүктөлүүдө...', reviews_count: 'пикир',
    tr_title: 'Котормочу', tr_sub: 'Кыргызча – Орусча – Англисче (MyMemory API)', from: 'Кайсы тилден', to: 'Кайсы тилге', translate: 'Которуу', copy: 'Көчүрүү', copied: 'Көчүрүлдү', tr_ph: 'Текстти бул жерге жазыңыз...',
    not_found: 'Барак табылган жок', go_home: 'Башкы бетке', forbidden: 'Бул бет администраторлор үчүн гана', error_title: 'Ката кетти', retry: 'Кайра аракет кылуу',
    login_required: 'Алгач аккаунтка кириңиз', new_order: 'Жаңы заказ', new_booking: 'Жаңы бронь', chat_title: 'StudyItaly жардамчысы', chat_hello: 'Салам! 👋 Мен Италиядагы окуу боюнча жардамчымын. Университет, шаар, стипендия, виза же документтер жөнүндө сураңыз.', chat_ph: 'Суроо жазыңыз...',
    footer_about: 'Италиядагы университеттер жөнүндө кыргыз тилиндеги эң чоң маалымат порталы.', footer_links: 'Шилтемелер', footer_contact: 'Байланыш', rights: 'Бардык укуктар корголгон.', prices_note: 'Сандар болжолдуу. Акыркы маалыматты университеттин расмий сайтынан текшериңиз.', loading: 'Жүктөлүүдө...',
    added_cart: 'Себетке кошулду 🛒', removed_cart: 'Себеттен өчүрүлдү', added_fav: 'Тандалмага кошулду ♥', removed_fav: 'Тандалмадан алынды', review_added: 'Пикириңиз үчүн рахмат!', fill_all: 'Бардык талааларды толтуруңуз', invalid_email: 'Email туура эмес', invalid_card: 'Карта маалыматы туура эмес', session_end: 'Сессия бүттү, кайра кириңиз', link_copied: 'Шилтеме көчүрүлдү', tg_sent: 'Telegram\'га билдирүү жөнөтүлдү', mail_sent: 'Email жөнөтүлдү', oldest: 'Эң байыркы',
  },
  ru: {
    nav_home: 'Главная', nav_unis: 'Университеты', nav_favs: 'Избранное', nav_cart: 'Корзина', nav_booking: 'Бронь', nav_translator: 'Переводчик', nav_admin: 'Админ',
    login: 'Войти', register: 'Регистрация', logout: 'Выйти', profile: 'Профиль',
    hero_badge: '🇮🇹 Открыт приём на 2026–2027 учебный год',
    hero_title: 'Учись в лучших университетах Италии',
    hero_sub: '17 университетов, 85+ программ, стипендии и полная информация о поступлении.',
    hero_cta: 'Смотреть университеты', hero_cta2: 'Записаться на консультацию',
    search_ph: 'Название университета, города или программы...', search: 'Поиск',
    stat_unis: 'университетов', stat_cities: 'городов', stat_oldest: 'год основания старейшего', stat_avg: 'средняя стоимость/год',
    top_unis: 'Университеты с самым высоким рейтингом', see_all: 'Смотреть все →', cities_title: 'По городам',
    why_title: 'Почему Италия?',
    why1_t: 'Доступное обучение', why1_d: 'В государственных вузах стоимость зависит от дохода семьи: €0–€4000 в год.',
    why2_t: 'Стипендии', why2_d: 'Региональные стипендии DSU: деньги, общежитие и бесплатное питание.',
    why3_t: 'На английском', why3_d: 'Более 500 программ полностью на английском языке.',
    why4_t: 'Европейский диплом', why4_d: 'Диплом признаётся во всём ЕС, после учёбы можно искать работу.',
    steps_title: 'Шаги поступления',
    step1: 'Выбор университета и программы', step2: 'Подготовка документов (аттестат, IELTS)', step3: 'Онлайн-заявка (pre-assessment)', step4: 'Предрегистрация на Universitaly', step5: 'Получение визы D в посольстве', step6: 'Перелёт и Permesso di soggiorno',
    reviews_title: 'Отзывы студентов', cta_title: 'Подготовьте документы вместе с нами', cta_sub: 'Бесплатная 30-минутная онлайн-консультация.',
    filters: 'Фильтры', city: 'Город', all: 'Все', type: 'Тип', state: 'Государственный', private: 'Частный', max_tuition: 'Макс. стоимость', english_only: 'Есть программы на английском', sort: 'Сортировка', s_rating: 'По рейтингу', s_tuition: 'Сначала дешёвые', s_founded: 'Самые старые', s_name: 'По названию', found: 'найдено', reset: 'Сбросить', no_results: 'Ничего не найдено', apply: 'Применить',
    details: 'Подробнее', add_cart: 'В корзину', in_cart: 'В корзине', fav: 'В избранное', book: 'Забронировать',
    students: 'Студенты', founded: 'Основан', tuition: 'Стоимость', per_year: '/год', qs: 'Рейтинг QS', deadline: 'Срок подачи', eng_programs: 'Программы на англ.', yes: 'Есть', no: 'Нет', service_price: 'Цена пакета подачи', exam: 'Вступительный экзамен', rating: 'Рейтинг',
    about: 'Об университете', wiki_info: 'Из Википедии (англ.)', programs: 'Программы', level: 'Уровень', language: 'Язык', duration: 'Срок', years: 'лет', requirements: 'Требования и документы', scholarships: 'Стипендии', weather: 'Погода в городе', reviews: 'Отзывы', write_review: 'Оставить отзыв', comment: 'Напишите отзыв...', send: 'Отправить', login_to_review: 'Войдите, чтобы оставить отзыв', similar: 'Похожие университеты', map: 'На карте',
    cart_title: 'Корзина', empty_cart: 'Корзина пуста', remove: 'Удалить', subtotal: 'Подытог', service_fee: 'Сервисный сбор', total: 'Итого', checkout: 'Оформить заказ', continue: 'Выбрать университет', package: 'Пакет подачи: документы, перевод, Universitaly',
    checkout_title: 'Оформление заказа', contact_info: 'Контактные данные', full_name: 'ФИО', email: 'Email', phone: 'Телефон', address: 'Город / адрес', payment: 'Способ оплаты', pay_card: 'Банковская карта (Stripe demo)', pay_postkg: 'Post.kg (demo)', pay_cash: 'Наличными в офисе', card_number: 'Номер карты', card_exp: 'ММ/ГГ', card_cvc: 'CVC', place_order: 'Оплатить и оформить', processing: 'Обработка...', order_success: 'Заказ успешно оформлен!', card_declined: 'Карта отклонена', test_cards: 'Тест: 4242 4242 4242 4242 (успех) · 4000 0000 0000 0002 (отказ)', postkg_note: 'Оплата QR-кодом через Post.kg (демо).', cash_note: 'Оплата в офисе в Бишкеке.',
    booking_title: 'Запись на консультацию', booking_sub: 'Онлайн-консультация, виртуальный тур или проверка документов.', booking_type: 'Тип брони', b_online: 'Онлайн-консультация', b_tour: 'Виртуальный тур по кампусу', b_docs: 'Проверка документов', date: 'Дата', time: 'Время', note: 'Комментарий', book_now: 'Забронировать', booking_success: 'Бронь успешно создана!', university: 'Университет',
    favs_title: 'Избранные университеты', empty_favs: 'В избранном пока пусто',
    password: 'Пароль', confirm_password: 'Повторите пароль', no_account: 'Нет аккаунта?', have_account: 'Уже есть аккаунт?', or: 'или', admin_hint: 'Демо админ: admin@uni.kg / admin123 · Пользователь: user@uni.kg / user123', bad_login: 'Неверный email или пароль', email_taken: 'Этот email уже зарегистрирован', pass_short: 'Пароль минимум 6 символов', pass_mismatch: 'Пароли не совпадают', welcome: 'Добро пожаловать', login_sub: 'Войдите в аккаунт', register_sub: 'Создайте новый аккаунт',
    my_orders: 'Мои заказы', my_bookings: 'Мои брони', role: 'Роль', token_exp: 'Сессия истекает', no_data: 'Пока нет данных', status: 'Статус', st_pending: 'Ожидает', st_paid: 'Оплачен', st_done: 'Выполнен', st_cancel: 'Отменён',
    admin_title: 'Админ панель', dashboard: 'Статистика', users: 'Пользователи', orders: 'Заказы', bookings: 'Брони', settings: 'Настройки', add_uni: '+ Добавить университет', edit_uni: 'Редактировать', save: 'Сохранить', cancel: 'Отмена', delete: 'Удалить', edit: 'Изменить', confirm_delete: 'Точно удалить?', saved: 'Сохранено ✓', deleted: 'Удалено', upload_img: 'Загрузить фото (Cloudinary)', name: 'Название', short: 'Кратко', region: 'Регион', image_url: 'URL фото', description: 'Описание', reset_db: 'Сбросить базу', reset_done: 'База сброшена', revenue: 'Выручка', chart_city: 'Университеты по городам', chart_status: 'Статусы заказов', chart_rev: 'Выручка за 7 дней', chart_top: 'Рейтинг ТОП-8', actions: 'Действия', wiki_title: 'Статья Wikipedia (для фото)', integrations: 'Интеграции', programs_hint: 'Каждая строка: Название | Уровень | Язык | Лет', uploading: 'Загрузка...', reviews_count: 'отзывов',
    tr_title: 'Переводчик', tr_sub: 'Кыргызский – Русский – Английский (MyMemory API)', from: 'С языка', to: 'На язык', translate: 'Перевести', copy: 'Копировать', copied: 'Скопировано', tr_ph: 'Введите текст...',
    not_found: 'Страница не найдена', go_home: 'На главную', forbidden: 'Страница только для администраторов', error_title: 'Произошла ошибка', retry: 'Повторить',
    login_required: 'Сначала войдите в аккаунт', new_order: 'Новый заказ', new_booking: 'Новая бронь', chat_title: 'Помощник StudyItaly', chat_hello: 'Привет! 👋 Я помощник по учёбе в Италии. Спросите об университетах, стипендиях, визе или документах.', chat_ph: 'Напишите вопрос...',
    footer_about: 'Крупнейший портал об университетах Италии на кыргызском языке.', footer_links: 'Ссылки', footer_contact: 'Контакты', rights: 'Все права защищены.', prices_note: 'Цифры приблизительные. Проверяйте на официальном сайте университета.', loading: 'Загрузка...',
    added_cart: 'Добавлено в корзину 🛒', removed_cart: 'Удалено из корзины', added_fav: 'Добавлено в избранное ♥', removed_fav: 'Удалено из избранного', review_added: 'Спасибо за отзыв!', fill_all: 'Заполните все поля', invalid_email: 'Неверный email', invalid_card: 'Неверные данные карты', session_end: 'Сессия истекла, войдите снова', link_copied: 'Ссылка скопирована', tg_sent: 'Уведомление отправлено в Telegram', mail_sent: 'Email отправлен', oldest: 'Старейший',
  },
  en: {
    nav_home: 'Home', nav_unis: 'Universities', nav_favs: 'Favorites', nav_cart: 'Cart', nav_booking: 'Booking', nav_translator: 'Translator', nav_admin: 'Admin',
    login: 'Log in', register: 'Sign up', logout: 'Log out', profile: 'Profile',
    hero_badge: '🇮🇹 Admissions open for 2026–2027',
    hero_title: 'Study at the best universities in Italy',
    hero_sub: '17 universities, 85+ programs, scholarships and complete admission info.',
    hero_cta: 'Browse universities', hero_cta2: 'Book a consultation',
    search_ph: 'University, city or program name...', search: 'Search',
    stat_unis: 'universities', stat_cities: 'cities', stat_oldest: 'oldest founded in', stat_avg: 'average tuition/year',
    top_unis: 'Top-rated universities', see_all: 'See all →', cities_title: 'By city',
    why_title: 'Why Italy?',
    why1_t: 'Affordable', why1_d: 'Public university tuition depends on family income: €0–€4000 per year.',
    why2_t: 'Scholarships', why2_d: 'Regional DSU grants: cash, free housing and meals.',
    why3_t: 'Taught in English', why3_d: '500+ programs fully taught in English.',
    why4_t: 'EU degree', why4_d: 'Recognised across the EU, with a post-study job-search permit.',
    steps_title: 'Admission steps',
    step1: 'Choose university & program', step2: 'Prepare documents (diploma, IELTS)', step3: 'Online application (pre-assessment)', step4: 'Pre-enrolment on Universitaly', step5: 'Get a D visa at the embassy', step6: 'Fly to Italy & Permesso di soggiorno',
    reviews_title: 'Student reviews', cta_title: 'Prepare your documents with us', cta_sub: 'Free 30-minute online consultation.',
    filters: 'Filters', city: 'City', all: 'All', type: 'Type', state: 'Public', private: 'Private', max_tuition: 'Max tuition', english_only: 'Has English programs', sort: 'Sort', s_rating: 'By rating', s_tuition: 'Cheapest first', s_founded: 'Oldest first', s_name: 'By name', found: 'found', reset: 'Reset', no_results: 'Nothing found', apply: 'Apply',
    details: 'Details', add_cart: 'Add to cart', in_cart: 'In cart', fav: 'Favorite', book: 'Book',
    students: 'Students', founded: 'Founded', tuition: 'Tuition', per_year: '/yr', qs: 'QS ranking', deadline: 'Deadline', eng_programs: 'English programs', yes: 'Yes', no: 'No', service_price: 'Application package', exam: 'Entrance exam', rating: 'Rating',
    about: 'About', wiki_info: 'From Wikipedia', programs: 'Programs', level: 'Level', language: 'Language', duration: 'Duration', years: 'yrs', requirements: 'Requirements & documents', scholarships: 'Scholarships', weather: 'Weather in the city', reviews: 'Reviews', write_review: 'Write a review', comment: 'Write your review...', send: 'Send', login_to_review: 'Log in to write a review', similar: 'Similar universities', map: 'Map',
    cart_title: 'Cart', empty_cart: 'Your cart is empty', remove: 'Remove', subtotal: 'Subtotal', service_fee: 'Service fee', total: 'Total', checkout: 'Checkout', continue: 'Choose a university', package: 'Application package: documents, translation, Universitaly',
    checkout_title: 'Checkout', contact_info: 'Contact info', full_name: 'Full name', email: 'Email', phone: 'Phone', address: 'City / address', payment: 'Payment method', pay_card: 'Card (Stripe demo)', pay_postkg: 'Post.kg (demo)', pay_cash: 'Cash at office', card_number: 'Card number', card_exp: 'MM/YY', card_cvc: 'CVC', place_order: 'Pay & place order', processing: 'Processing...', order_success: 'Order placed successfully!', card_declined: 'Card declined', test_cards: 'Test: 4242 4242 4242 4242 (success) · 4000 0000 0000 0002 (decline)', postkg_note: 'Pay by QR via Post.kg (demo).', cash_note: 'Pay at our Bishkek office.',
    booking_title: 'Book a consultation', booking_sub: 'Online consultation, virtual tour or document check.', booking_type: 'Booking type', b_online: 'Online consultation', b_tour: 'Virtual campus tour', b_docs: 'Document check', date: 'Date', time: 'Time', note: 'Notes', book_now: 'Book now', booking_success: 'Booking created!', university: 'University',
    favs_title: 'Favorite universities', empty_favs: 'No favorites yet',
    password: 'Password', confirm_password: 'Confirm password', no_account: 'No account?', have_account: 'Have an account?', or: 'or', admin_hint: 'Demo admin: admin@uni.kg / admin123 · User: user@uni.kg / user123', bad_login: 'Wrong email or password', email_taken: 'Email already registered', pass_short: 'Password must be 6+ characters', pass_mismatch: 'Passwords do not match', welcome: 'Welcome', login_sub: 'Log in to your account', register_sub: 'Create a new account',
    my_orders: 'My orders', my_bookings: 'My bookings', role: 'Role', token_exp: 'Session expires', no_data: 'No data yet', status: 'Status', st_pending: 'Pending', st_paid: 'Paid', st_done: 'Done', st_cancel: 'Cancelled',
    admin_title: 'Admin panel', dashboard: 'Dashboard', users: 'Users', orders: 'Orders', bookings: 'Bookings', settings: 'Settings', add_uni: '+ Add university', edit_uni: 'Edit university', save: 'Save', cancel: 'Cancel', delete: 'Delete', edit: 'Edit', confirm_delete: 'Really delete?', saved: 'Saved ✓', deleted: 'Deleted', upload_img: 'Upload image (Cloudinary)', name: 'Name', short: 'Short name', region: 'Region', image_url: 'Image URL', description: 'Description', reset_db: 'Reset database', reset_done: 'Database reset', revenue: 'Revenue', chart_city: 'Universities by city', chart_status: 'Order status', chart_rev: 'Revenue, last 7 days', chart_top: 'Top-8 rating', actions: 'Actions', wiki_title: 'Wikipedia article (for photos)', integrations: 'Integrations', programs_hint: 'Each line: Name | Level | Lang | Years', uploading: 'Uploading...', reviews_count: 'reviews',
    tr_title: 'Translator', tr_sub: 'Kyrgyz – Russian – English (MyMemory API)', from: 'From', to: 'To', translate: 'Translate', copy: 'Copy', copied: 'Copied', tr_ph: 'Type text here...',
    not_found: 'Page not found', go_home: 'Go home', forbidden: 'Admins only', error_title: 'Something went wrong', retry: 'Retry',
    login_required: 'Please log in first', new_order: 'New order', new_booking: 'New booking', chat_title: 'StudyItaly assistant', chat_hello: 'Hi! 👋 I help with studying in Italy. Ask about universities, scholarships, visas or documents.', chat_ph: 'Ask a question...',
    footer_about: 'The biggest Kyrgyz-language portal about Italian universities.', footer_links: 'Links', footer_contact: 'Contact', rights: 'All rights reserved.', prices_note: 'Figures are approximate. Check the official university website.', loading: 'Loading...',
    added_cart: 'Added to cart 🛒', removed_cart: 'Removed from cart', added_fav: 'Added to favorites ♥', removed_fav: 'Removed from favorites', review_added: 'Thanks for your review!', fill_all: 'Please fill all fields', invalid_email: 'Invalid email', invalid_card: 'Invalid card details', session_end: 'Session expired, log in again', link_copied: 'Link copied', tg_sent: 'Telegram notification sent', mail_sent: 'Email sent', oldest: 'Oldest',
  },
};

/* =========================================================
   3. SEED DATA — 17 университет (баштапкы маалымат базасы)
   ========================================================= */
const COMMON_REQ = [
  'Орто билим жөнүндө аттестат. Италия 12 жылдык билимди талап кылат — Кыргызстанда мектеп 11 жыл болгондуктан, ЖОЖдо 1 жыл окуу же Foundation курсу керек.',
  'Англис тили: IELTS 5.5–6.5 же TOEFL iBT 72–90 (англисче программалар үчүн). Италиянча программалар үчүн италиян тили B2.',
  'Мотивациялык кат (Statement of Purpose) жана CV.',
  '1–2 сунуш кат (мугалимден же жетекчиден).',
  'Universitaly порталында пре-катталуу (апрель–июль).',
  'Dichiarazione di Valore же CIMEA сертификаты (документтерди таануу).',
  'Эл аралык паспорт, D-виза, медициналык камсыздандыруу.',
  'Финансылык кепилдик: банк эсебинде жылына болжол менен €6000+.',
];

const SEED = [
  { id: 'unibo', name: 'Болонья университети', short: 'UniBo', wiki: 'University_of_Bologna', city: 'Болонья', region: 'Эмилия-Романья', founded: 1088, type: 'state', students: 90000, qs: 138, rating: 4.8, ratingCount: 214, tuitionMin: 160, tuitionMax: 3800, price: 290, english: true, deadline: 'Январь – Апрель', exam: 'TOLC / IMAT (медицина)', lat: 44.4949, lon: 11.3426,
    desc: 'Болонья университети 1088-жылы негизделген жана дүйнөдөгү эң байыркы иштеп жаткан университет болуп эсептелет. Ал «Alma Mater Studiorum» деп аталат жана Европадагы Болонья процессинин символу. Кампустары Болонья, Чезена, Форли, Равенна жана Римини шаарларында жайгашкан. Англис тилинде 100дөн ашык бакалавр жана магистратура программасы бар. Шаар студенттик, коопсуз жана Миланга караганда арзаныраак.',
    scholar: 'ER.GO регионалдык стипендиясы (жылына ~€7000га чейин + жатакана), Unibo Study Grants чет элдик студенттер үчүн.',
    programs: [['Medicine and Surgery', 'Single-cycle', 'EN', 6], ['Business and Economics', 'Bachelor', 'EN', 3], ['Computer Science', 'Master', 'EN', 2], ['International Relations', 'Master', 'EN', 2], ['Genomics', 'Bachelor', 'EN', 3]] },
  { id: 'sapienza', name: 'Рим Сапиенца университети', short: 'Sapienza', wiki: 'Sapienza_University_of_Rome', city: 'Рим', region: 'Лацио', founded: 1303, type: 'state', students: 112000, qs: 134, rating: 4.6, ratingCount: 188, tuitionMin: 160, tuitionMax: 3000, price: 280, english: true, deadline: 'Февраль – Май', exam: 'IMAT / ички тест', lat: 41.9028, lon: 12.4964,
    desc: 'Сапиенца — Римдеги эң чоң мамлекеттик университет, 1303-жылы Рим папасы Бонифаций VIII тарабынан негизделген. Студенттердин саны боюнча Европадагы эң ири университеттердин бири. Классикалык илимдер жана археология боюнча дүйнөлүк рейтингде №1 орунда турган жылдары болгон. Физика, медицина жана инженерия багыттары да күчтүү. Римде окуу — тарыхтын ортосунда жашоо дегенди билдирет.',
    scholar: 'DiSCo Lazio регионалдык стипендиясы, Sapienza Excellence Scholarship.',
    programs: [['Medicine and Surgery', 'Single-cycle', 'EN', 6], ['Applied Computer Science and AI', 'Bachelor', 'EN', 3], ['Classics', 'Master', 'EN', 2], ['Physics', 'Master', 'EN', 2], ['Management Engineering', 'Master', 'EN', 2]] },
  { id: 'polimi', name: 'Милан политехникалык университети', short: 'PoliMi', wiki: 'Polytechnic_University_of_Milan', city: 'Милан', region: 'Ломбардия', founded: 1863, type: 'state', students: 47000, qs: 111, rating: 4.9, ratingCount: 241, tuitionMin: 160, tuitionMax: 3900, price: 350, english: true, deadline: 'Ноябрь – Март', exam: 'TOL / TIL / портфолио', lat: 45.4785, lon: 9.2277,
    desc: 'Милан политехникалык университети — Италиядагы инженерия, архитектура жана дизайн боюнча №1 университет. 1863-жылы негизделген. QS рейтингинде дизайн жана архитектура боюнча дүйнөдө алдыңкы ондуктун ичинде. Магистратуранын көпчүлүгү англис тилинде окутулат. Милан — Италиянын экономикалык борбору, стажировка жана иш табуу мүмкүнчүлүгү абдан жогору.',
    scholar: 'DSU Polimi стипендиясы, Gold / Platinum Merit Scholarships (€5000–€10000).',
    programs: [['Architectural Design', 'Bachelor', 'EN', 3], ['Computer Science and Engineering', 'Master', 'EN', 2], ['Design & Engineering', 'Master', 'EN', 2], ['Aerospace Engineering', 'Master', 'EN', 2], ['Management Engineering', 'Master', 'EN', 2]] },
  { id: 'unipd', name: 'Падуя университети', short: 'UniPD', wiki: 'University_of_Padua', city: 'Падуя', region: 'Венето', founded: 1222, type: 'state', students: 65000, qs: 233, rating: 4.7, ratingCount: 176, tuitionMin: 190, tuitionMax: 2700, price: 270, english: true, deadline: 'Январь – Апрель', exam: 'SAT / IMAT', lat: 45.4064, lon: 11.8768,
    desc: 'Падуя университети 1222-жылы негизделген — Италиядагы экинчи эң байыркы университет. Бул жерде Галилео Галилей 18 жыл сабак берген, ал эми 1678-жылы Елена Корнаро дүйнөдөгү биринчи илимий даражасы бар аял болгон. Медицина, психология, айыл чарба жана инженерия факультеттери күчтүү. Падуядан Венецияга поезд менен 30 мүнөт.',
    scholar: 'ESU Padova регионалдык стипендиясы, Padua International Excellence Scholarship.',
    programs: [['Medicine and Surgery', 'Single-cycle', 'EN', 6], ['Psychological Science', 'Bachelor', 'EN', 3], ['Computer Engineering', 'Master', 'EN', 2], ['Data Science', 'Master', 'EN', 2], ['Economics and Management', 'Bachelor', 'EN', 3]] },
  { id: 'unimi', name: 'Милан мамлекеттик университети', short: 'UniMi', wiki: 'University_of_Milan', city: 'Милан', region: 'Ломбардия', founded: 1924, type: 'state', students: 60000, qs: 276, rating: 4.5, ratingCount: 132, tuitionMin: 150, tuitionMax: 4000, price: 300, english: true, deadline: 'Февраль – Май', exam: 'TOLC / IMAT', lat: 45.4602, lon: 9.1946,
    desc: 'Милан мамлекеттик университети (La Statale) — 1924-жылы негизделген ири изилдөө университети. Европадагы алдыңкы изилдөө университеттеринин лигасы LERU\'нун Италиядан жалгыз мүчөсү. Медицина, укук, саясий илимдер жана биотехнология багыттары күчтүү. Негизги имараты шаардын так борборунда, тарыхый Ca\' Granda ооруканасынын имаратында жайгашкан.',
    scholar: 'DSU UniMi стипендиясы, Unimi Excellence Scholarship (магистратура үчүн).',
    programs: [['Medicine and Surgery', 'Single-cycle', 'EN', 6], ['Political Sciences', 'Bachelor', 'EN', 3], ['Data Science and Economics', 'Master', 'EN', 2], ['Biotechnology', 'Master', 'EN', 2], ['Law', 'Single-cycle', 'IT', 5]] },
  { id: 'bocconi', name: 'Боккони университети', short: 'Bocconi', wiki: 'Bocconi_University', city: 'Милан', region: 'Ломбардия', founded: 1902, type: 'private', students: 15000, qs: null, rating: 4.9, ratingCount: 198, tuitionMin: 14000, tuitionMax: 16500, price: 390, english: true, deadline: 'Октябрь – Апрель', exam: 'SAT / Bocconi Online Test', lat: 45.4505, lon: 9.1899,
    desc: 'Боккони — Миландагы жеке университет, экономика, финансы жана менеджмент боюнча Европанын эң мыкты мектептеринин бири. 1902-жылы негизделген. Окуу акысы мамлекеттик университеттерге караганда кымбатыраак, бирок мыкты студенттерге толук стипендиялар берилет. Бүтүрүүчүлөрү дүйнөлүк банктарда, консалтинг компанияларында жана эл аралык уюмдарда иштешет.',
    scholar: 'ISU Bocconi стипендиясы (кирешеге жараша), Bocconi Merit Award — окуу акысынан толук бошотуу.',
    programs: [['Economics and Management', 'Bachelor', 'EN', 3], ['Finance', 'Master', 'EN', 2], ['International Economics and Management', 'Bachelor', 'EN', 3], ['Mathematical & Computing Sciences for AI', 'Bachelor', 'EN', 3], ['Law', 'Single-cycle', 'EN', 5]] },
  { id: 'polito', name: 'Турин политехникалык университети', short: 'PoliTo', wiki: 'Polytechnic_University_of_Turin', city: 'Турин', region: 'Пьемонт', founded: 1859, type: 'state', students: 38000, qs: 252, rating: 4.7, ratingCount: 154, tuitionMin: 150, tuitionMax: 2600, price: 300, english: true, deadline: 'Ноябрь – Июль', exam: 'TIL / SAT', lat: 45.0625, lon: 7.6624,
    desc: 'Турин политехникасы 1859-жылы негизделген. Автомобиль, аэрокосмос, энергетика жана IT инженериясы боюнча өтө күчтүү — FIAT, Stellantis, Lavazza жана Avio Aero сыяктуу компаниялар менен тыгыз кызматташат. Англис тилиндеги бакалавр программалары бар. Турин Миланга салыштырмалуу жашоого арзаныраак жана тынчыраак шаар.',
    scholar: 'EDISU Piemonte регионалдык стипендиясы, PoliTo чет элдик студенттер үчүн гранттары.',
    programs: [['Automotive Engineering', 'Master', 'EN', 2], ['Computer Engineering', 'Bachelor', 'EN', 3], ['Electronic Engineering', 'Bachelor', 'EN', 3], ['Architecture', 'Bachelor', 'EN', 3], ['Mechanical Engineering', 'Bachelor', 'EN', 3]] },
  { id: 'unifi', name: 'Флоренция университети', short: 'UniFi', wiki: 'University_of_Florence', city: 'Флоренция', region: 'Тоскана', founded: 1321, type: 'state', students: 50000, qs: 358, rating: 4.5, ratingCount: 121, tuitionMin: 150, tuitionMax: 2900, price: 260, english: true, deadline: 'Февраль – Июнь', exam: 'TOLC / ички тест', lat: 43.7696, lon: 11.2558,
    desc: 'Флоренция университети Ренессанстын бешигинде жайгашкан. Анын тамыры 1321-жылы түзүлгөн Studium Generale\'ге барып такалат. Архитектура, искусство тарыхы, айыл чарба жана инженерия багыттары белгилүү. Флоренциянын ар бир көчөсү — ачык асман астындагы музей, бул искусство жана дизайн студенттери үчүн өзгөчө илхам.',
    scholar: 'DSU Toscana регионалдык стипендиясы (акча + жатакана + тамак).',
    programs: [['Architecture', 'Single-cycle', 'IT', 5], ['Business Economics', 'Master', 'EN', 2], ['Agricultural Sciences', 'Bachelor', 'IT', 3], ['Electronics Engineering', 'Master', 'EN', 2], ['Design', 'Bachelor', 'IT', 3]] },
  { id: 'unipi', name: 'Пиза университети', short: 'UniPi', wiki: 'University_of_Pisa', city: 'Пиза', region: 'Тоскана', founded: 1343, type: 'state', students: 45000, qs: 349, rating: 4.6, ratingCount: 117, tuitionMin: 150, tuitionMax: 2400, price: 250, english: true, deadline: 'Январь – Июнь', exam: 'TOLC / ички тест', lat: 43.7228, lon: 10.4017,
    desc: 'Пиза университети 1343-жылы негизделген. Галилео Галилей ушул университетте окуган жана сабак берген. Информатика, инженерия жана физика боюнча Италиянын алдыңкы борборлорунун бири — Италиядагы биринчи компьютер ушул жерде курулган. Пиза кичинекей, студенттик шаар, жашоо баасы арзан жана деңизге жакын.',
    scholar: 'DSU Toscana регионалдык стипендиясы, UniPi Study Grants.',
    programs: [['Computer Science', 'Master', 'EN', 2], ['Artificial Intelligence and Data Engineering', 'Master', 'EN', 2], ['Physics', 'Master', 'EN', 2], ['Medicine and Surgery', 'Single-cycle', 'IT', 6], ['Economics', 'Master', 'EN', 2]] },
  { id: 'unina', name: 'Неаполь Федерико II университети', short: 'Federico II', wiki: 'University_of_Naples_Federico_II', city: 'Неаполь', region: 'Кампания', founded: 1224, type: 'state', students: 75000, qs: 335, rating: 4.4, ratingCount: 109, tuitionMin: 150, tuitionMax: 2500, price: 240, english: true, deadline: 'Март – Июль', exam: 'IMAT / TOLC', lat: 40.8518, lon: 14.2681,
    desc: 'Неаполь Федерико II университети 1224-жылы император Фридрих II тарабынан негизделген — дүйнөдөгү эң эски мамлекеттик (светтик) университет. Apple Developer Academy Европадагы биринчи жолу ушул университетте ачылган. Түштүк Италиядагы эң ири университет. Жашоо баасы түндүк шаарларга караганда бир топ арзан, климаты жылуу.',
    scholar: 'ADISURC (Кампания) регионалдык стипендиясы.',
    programs: [['Medicine and Surgery', 'Single-cycle', 'EN', 6], ['Industrial Bioengineering', 'Master', 'EN', 2], ['Computer Engineering', 'Bachelor', 'IT', 3], ['Hospitality Management', 'Master', 'EN', 2], ['Biotechnology', 'Master', 'EN', 2]] },
  { id: 'unito', name: 'Турин университети', short: 'UniTo', wiki: 'University_of_Turin', city: 'Турин', region: 'Пьемонт', founded: 1404, type: 'state', students: 80000, qs: 364, rating: 4.4, ratingCount: 98, tuitionMin: 150, tuitionMax: 2900, price: 250, english: true, deadline: 'Январь – Июль', exam: 'TOLC / IMAT', lat: 45.0703, lon: 7.6869,
    desc: 'Турин университети 1404-жылы негизделген. Белгилүү гуманист Эразм Роттердамский 1506-жылы ушул жерден доктордук даража алган. 27 департамент жана 150дөн ашык программа бар. Экономика, медицина, тамак-аш илимдери жана физика боюнча күчтүү. Шаарда Альп тоолоруна жакын, кыш мезгилинде лыжа тебүүгө ыңгайлуу.',
    scholar: 'EDISU Piemonte регионалдык стипендиясы.',
    programs: [['Medicine and Surgery', 'Single-cycle', 'EN', 6], ['Economics', 'Master', 'EN', 2], ['Business & Management', 'Bachelor', 'EN', 3], ['Physics of Complex Systems', 'Master', 'EN', 2], ['Food Science', 'Bachelor', 'IT', 3]] },
  { id: 'unipv', name: 'Павия университети', short: 'UniPv', wiki: 'University_of_Pavia', city: 'Павия', region: 'Ломбардия', founded: 1361, type: 'state', students: 25000, qs: 581, rating: 4.6, ratingCount: 93, tuitionMin: 150, tuitionMax: 3800, price: 270, english: true, deadline: 'Январь – Май', exam: 'IMAT / ички тест', lat: 45.1847, lon: 9.1582,
    desc: 'Павия университети 1361-жылы негизделген. Кичинекей, тынч шаарда жайгашкан жана Collegio Ghislieri, Collegio Borromeo сыяктуу тарыхый колледж-жатаканалары менен белгилүү. Англис тилиндеги «Harvey» медицина программасы абдан популярдуу. Павиядан Миланга поезд менен болгону 30 мүнөт.',
    scholar: 'EDiSU Pavia стипендиясы, колледждердин өз стипендиялары (жатакана бекер).',
    programs: [['Medicine and Surgery (Harvey)', 'Single-cycle', 'EN', 6], ['Economics', 'Master', 'EN', 2], ['Electronic Engineering', 'Master', 'EN', 2], ['Biotechnology', 'Master', 'EN', 2], ['Political Science', 'Master', 'EN', 2]] },
  { id: 'sns', name: 'Скуола Нормале Супериоре', short: 'SNS', wiki: 'Scuola_Normale_Superiore', city: 'Пиза', region: 'Тоскана', founded: 1810, type: 'state', students: 600, qs: null, rating: 4.9, ratingCount: 61, tuitionMin: 0, tuitionMax: 0, price: 350, english: false, deadline: 'Июль – Август', exam: 'Жазуу + оозеки сынак (өтө катаал)', lat: 43.7194, lon: 10.4018,
    desc: 'Скуола Нормале Супериоре — 1810-жылы Наполеон тарабынан негизделген элиталык мектеп. Окуу толугу менен акысыз, студенттер жатакана жана тамак менен камсыз болот, ал эми кабыл алуу сынагы Италиядагы эң катаал сынак. Нобель сыйлыгынын лауреаттары Энрико Ферми, Карло Руббиа жана Джозуэ Кардуччи ушул жерде окуган.',
    scholar: 'Окуу акысыз + бекер жатакана + тамак + айлык стипендия бардык студенттерге.',
    programs: [['Mathematics', 'Ordinary course', 'IT', 5], ['Physics', 'Ordinary course', 'IT', 5], ['Chemistry', 'Ordinary course', 'IT', 5], ['Humanities (Lettere)', 'Ordinary course', 'IT', 5], ['Political Science (PhD)', 'PhD', 'EN', 3]] },
  { id: 'unitn', name: 'Тренто университети', short: 'UniTn', wiki: 'University_of_Trento', city: 'Тренто', region: 'Трентино', founded: 1962, type: 'state', students: 16000, qs: 397, rating: 4.7, ratingCount: 88, tuitionMin: 200, tuitionMax: 3000, price: 260, english: true, deadline: 'Январь – Май', exam: 'SAT / ички тест', lat: 46.0748, lon: 11.1217,
    desc: 'Тренто университети 1962-жылы негизделген. Жаш болгонуна карабай, CENSIS рейтинги боюнча Италиянын эң мыкты орто көлөмдөгү мамлекеттик университеттеринин бири. Альп тоолорунун этегинде жайгашкан, жашоо сапаты боюнча Италияда биринчилерден. Информатика, социология жана когнитивдик илимдер күчтүү.',
    scholar: 'Opera Universitaria Trento стипендиясы (акча + жатакана).',
    programs: [['Computer Science', 'Bachelor', 'EN', 3], ['Cognitive Science', 'Master', 'EN', 2], ['Sociology and Social Research', 'Master', 'EN', 2], ['Economics', 'Master', 'EN', 2], ['Physics', 'Master', 'EN', 2]] },
  { id: 'unive', name: 'Венеция Ка\' Фоскари университети', short: 'Ca\' Foscari', wiki: 'Ca\'_Foscari_University_of_Venice', city: 'Венеция', region: 'Венето', founded: 1868, type: 'state', students: 22000, qs: 709, rating: 4.5, ratingCount: 79, tuitionMin: 200, tuitionMax: 2300, price: 250, english: true, deadline: 'Ноябрь – Май', exam: 'Онлайн арыз + интервью', lat: 45.4344, lon: 12.3267,
    desc: 'Ка\' Фоскари университети 1868-жылы Венецияда Италиядагы биринчи соода мектеби катары негизделген. Экономика, менеджмент, чыгыш тилдери (кытай, жапон, араб) жана туризм боюнча белгилүү. Негизги имараты Гранд-каналдын жээгиндеги XV кылымдагы готикалык сарайда жайгашкан. Дүйнөдөгү эң кооз кампустардын бири.',
    scholar: 'ESU Venezia стипендиясы, Ca\' Foscari International Scholarships.',
    programs: [['Economics and Management', 'Bachelor', 'EN', 3], ['Languages, Economics and Institutions of Asia', 'Master', 'EN', 2], ['Digital Management', 'Bachelor', 'EN', 3], ['Global Development and Entrepreneurship', 'Master', 'EN', 2], ['Environmental Sciences', 'Master', 'EN', 2]] },
  { id: 'unisi', name: 'Сиена университети', short: 'UniSi', wiki: 'University_of_Siena', city: 'Сиена', region: 'Тоскана', founded: 1240, type: 'state', students: 18000, qs: null, rating: 4.4, ratingCount: 72, tuitionMin: 0, tuitionMax: 2500, price: 230, english: true, deadline: 'Январь – Июль', exam: 'IMAT / ички тест', lat: 43.3188, lon: 11.3308,
    desc: 'Сиена университети 1240-жылы негизделген. Тоскана аймагынын жүрөгүндө, ЮНЕСКОнун мурастарынын тизмесиндеги орто кылымдык шаарда жайгашкан. Англис тилиндеги медицина, экономика, банк иши жана дипломатия программалары бар. Чет элдик студенттер үчүн шаар коопсуз, жайлуу жана жашоо баасы орточо.',
    scholar: 'DSU Toscana регионалдык стипендиясы, UniSi Tuition Fee Waivers.',
    programs: [['Medicine and Surgery', 'Single-cycle', 'EN', 6], ['Economics and Banking', 'Master', 'EN', 2], ['Artificial Intelligence and Automation Engineering', 'Master', 'EN', 2], ['Biotechnology', 'Master', 'EN', 2], ['International Relations', 'Master', 'EN', 2]] },
  { id: 'unige', name: 'Генуя университети', short: 'UniGe', wiki: 'University_of_Genoa', city: 'Генуя', region: 'Лигурия', founded: 1481, type: 'state', students: 30000, qs: 555, rating: 4.3, ratingCount: 67, tuitionMin: 150, tuitionMax: 3000, price: 230, english: true, deadline: 'Февраль – Июль', exam: 'TOLC / ички тест', lat: 44.4056, lon: 8.9463,
    desc: 'Генуя университети 1481-жылы негизделген. Деңиз инженериясы, робототехника жана экономика багыттары күчтүү — Италиянын Технология институту (IIT) менен тыгыз кызматташат. Генуя — Лигурия деңизинин жээгиндеги ири порт шаар, климаты жумшак. Робототехника боюнча англисче магистратура Европада белгилүү.',
    scholar: 'ALiSEO (Лигурия) регионалдык стипендиясы.',
    programs: [['Robotics Engineering', 'Master', 'EN', 2], ['Maritime Science and Technology', 'Bachelor', 'EN', 3], ['Engineering Technology for Strategy and Security', 'Master', 'EN', 2], ['Economics and Data Science', 'Master', 'EN', 2], ['Medicine and Surgery', 'Single-cycle', 'IT', 6]] },
];

const SEED_REVIEWS = [
  ['unibo', 'Айгерим', 5, 'Болоньяда окуганыма 2 жыл болду. Шаар абдан жандуу, ER.GO стипендиясы аркылуу жатакана бекер.'],
  ['polimi', 'Бекзат', 5, 'Computer Science магистратурасы өтө күчтүү. Стажировканы Миландагы IT компаниядан таптым.'],
  ['sapienza', 'Алина', 4, 'Рим укмуш! Бирок бюрократия көп, документтерди эрте даярдаңыз.'],
  ['unipd', 'Нурлан', 5, 'Медицина англисче, мугалимдер мыкты. Падуя — тынч жана коопсуз шаар.'],
  ['bocconi', 'Тимур', 5, 'Кымбат, бирок мүмкүнчүлүктөр чоң. Merit Award алып, окуу акысын төлөбөйм.'],
  ['unitn', 'Жибек', 5, 'Тоолор, таза аба жана мыкты университет. Жашоо сапаты абдан жогору.'],
];

/* =========================================================
   4. ЖАРДАМЧЫ ФУНКЦИЯЛАР
   ========================================================= */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const ls = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { console.warn('Storage full', e); } },
  del(k) { try { localStorage.removeItem(k); } catch { /* */ } },
};
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = n => '€' + Number(n || 0).toLocaleString('en-US');
const num = n => Number(n || 0).toLocaleString('en-US');
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const hash = s => { let h = 5381; for (const c of String(s)) h = ((h << 5) + h + c.charCodeAt(0)) | 0; return 'h' + (h >>> 0).toString(16); };
const debounce = (fn, ms = 300) => { let tm; return (...a) => { clearTimeout(tm); tm = setTimeout(() => fn(...a), ms); }; };
const fmtDate = d => new Date(d).toLocaleDateString(state.lang === 'en' ? 'en-GB' : 'ru-RU');
const luhn = n => { if (!/^\d{13,19}$/.test(n)) return false; let s = 0, alt = false; for (let i = n.length - 1; i >= 0; i--) { let d = +n[i]; if (alt) { d *= 2; if (d > 9) d -= 9; } s += d; alt = !alt; } return s % 10 === 0; };
const loadScript = src => new Promise((res, rej) => { if ($(`script[src="${src}"]`)) return res(); const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); });

function placeholder(u) {
  const ini = esc((u.short || u.name || '').slice(0, 4));
  const hue = [...String(u.id || 'x')].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue},55%,42%)"/><stop offset="1" stop-color="hsl(${(hue + 50) % 360},60%,25%)"/></linearGradient></defs><rect width="400" height="250" fill="url(#g)"/><text x="200" y="142" font-family="Arial" font-size="52" font-weight="700" fill="rgba(255,255,255,.85)" text-anchor="middle">${ini}</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

/* =========================================================
   5. STATE (абал)
   ========================================================= */
const DEFAULT_FILTERS = { q: '', city: '', type: '', maxT: 20000, eng: false, sort: 'rating', page: 1 };
const state = {
  lang: ls.get('lang', 'ky'),
  theme: ls.get('theme', window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
  token: ls.get('token', null),
  cart: ls.get('cart', []),
  favs: ls.get('favs', []),
  unis: [], loaded: false,
  filters: { ...DEFAULT_FILTERS },
  query: {}, renderId: 0, adminTab: 'dashboard', charts: [],
};
const t = k => (I18N[state.lang] && I18N[state.lang][k]) || I18N.ky[k] || k;
const alive = id => id === state.renderId;

/* =========================================================
   6. MOCK DATABASE (localStorage) + JWT
   ========================================================= */
let _db = null;
function db() {
  if (_db) return _db;
  let d = ls.get('ita_db', null);
  if (!d || d.v !== 3) {
    const now = Date.now(), day = 86400000;
    const reviews = {};
    SEED_REVIEWS.forEach(([id, name, rating, text], i) => {
      (reviews[id] = reviews[id] || []).push({ id: uid(), uniId: id, userId: 'seed', name, rating, text, date: new Date(now - (i + 1) * day * 3).toISOString() });
    });
    const orders = [
      ['polimi', 2, 'paid'], ['unibo', 1, 'done'], ['bocconi', 3, 'pending'], ['unipd', 4, 'paid'], ['sapienza', 5, 'paid'], ['unitn', 6, 'cancel'],
    ].map(([id, ago, status]) => {
      const u = SEED.find(x => x.id === id);
      return { id: 'ORD-' + uid().toUpperCase().slice(-6), userId: 'u2', name: 'Demo User', email: 'user@uni.kg', phone: '+996700000000', address: 'Бишкек', items: [{ id, name: u.name, price: u.price, qty: 1 }], total: u.price + 10, method: 'card', status, date: new Date(now - ago * day).toISOString() };
    });
    d = {
      v: 3, unis: SEED, reviews, orders, bookings: [],
      users: [
        { id: 'u1', name: 'Admin', email: 'admin@uni.kg', pass: hash('admin123'), role: 'admin', provider: 'local', created: new Date().toISOString() },
        { id: 'u2', name: 'Demo User', email: 'user@uni.kg', pass: hash('user123'), role: 'user', provider: 'local', created: new Date().toISOString() },
      ],
    };
    ls.set('ita_db', d);
  }
  _db = d;
  return d;
}
function saveDb(d) { _db = d; ls.set('ita_db', d); }

const b64url = obj => btoa(unescape(encodeURIComponent(JSON.stringify(obj)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const parseJwt = token => { try { const p = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'); return JSON.parse(decodeURIComponent(escape(atob(p)))); } catch { return null; } };
function signJWT(payload) {
  const body = { ...payload, iat: Date.now(), exp: Date.now() + 24 * 3600 * 1000 };
  return b64url({ alg: 'HS256', typ: 'JWT' }) + '.' + b64url(body) + '.' + hash(JSON.stringify(body) + 'studyitaly-secret');
}
function verifyJWT(token) {
  if (!token) return null;
  const p = parseJwt(token);
  if (!p || p.exp < Date.now()) return null;
  if (token.split('.')[2] !== hash(JSON.stringify(p) + 'studyitaly-secret')) return null;
  return p;
}

/* =========================================================
   7. API катмары (mock REST + реалдуу тышкы API'лар)
   ========================================================= */
const _wcache = {};
const BAD_IMG = /logo|seal|sigil|stemma|coat_of_arms|emblem|map|flag|icon|signature|firma|wappen|crest|locator|location|svg/i;
const API = {
  delay: (ms = 450) => sleep(ms + Math.random() * 250),
  clone: o => JSON.parse(JSON.stringify(o)),

  // --- Университеттер (CRUD) ---
  async getUnis() { await this.delay(); return this.clone(db().unis); },
  async getUni(id) { await this.delay(250); const u = db().unis.find(x => x.id === id); return u ? this.clone(u) : null; },
  async createUni(data) { await this.delay(200); const d = db(); const u = { ...data, id: data.id || uid(), rating: 5, ratingCount: 0 }; d.unis.unshift(u); saveDb(d); return u; },
  async updateUni(id, data) { await this.delay(200); const d = db(); const i = d.unis.findIndex(x => x.id === id); if (i < 0) throw new Error('404'); d.unis[i] = { ...d.unis[i], ...data, id }; saveDb(d); return d.unis[i]; },
  async deleteUni(id) { await this.delay(200); const d = db(); d.unis = d.unis.filter(x => x.id !== id); delete d.reviews[id]; saveDb(d); },

  // --- Заказ / бронь / пикир ---
  async createOrder(o) { await this.delay(300); const d = db(); d.orders.unshift(o); saveDb(d); return o; },
  async createBooking(b) { await this.delay(300); const d = db(); d.bookings.unshift(b); saveDb(d); return b; },
  async addReview(r) { await this.delay(200); const d = db(); (d.reviews[r.uniId] = d.reviews[r.uniId] || []).push(r); saveDb(d); return r; },

  // --- Wikipedia: университеттин сүрөттөрү ---
  wikiImages(title) {
    if (!title) return Promise.resolve([]);
    if (_wcache[title]) return _wcache[title];
    const cached = ls.get('wimg:' + title, null);
    if (cached && cached.length) return (_wcache[title] = Promise.resolve(cached));
    _wcache[title] = (async () => {
      let out = [];
      try {
        const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(title)}`);
        if (r.ok) {
          const j = await r.json();
          out = (j.items || [])
            .filter(i => i.type === 'image' && /\.(jpe?g|webp)$/i.test(i.title || '') && !BAD_IMG.test(i.title || '') && i.srcset && i.srcset.length)
            .map(i => { const s = i.srcset[i.srcset.length - 1].src; return s.startsWith('//') ? 'https:' + s : s; });
        }
      } catch (e) { console.warn('wiki media', e); }
      if (!out.length) {
        try { const s = await this.wikiSummary(title); const src = s && (s.thumbnail?.source || s.originalimage?.source); if (src) out = [src]; } catch { /* */ }
      }
      out = [...new Set(out)].slice(0, 8);
      if (out.length) ls.set('wimg:' + title, out);
      return out;
    })();
    return _wcache[title];
  },
  async wikiSummary(title) {
    const key = 'wsum:' + title; const c = ls.get(key, null); if (c) return c;
    const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
    if (!r.ok) throw new Error('wiki ' + r.status);
    const j = await r.json(); ls.set(key, { extract: j.extract, thumbnail: j.thumbnail, originalimage: j.originalimage, url: j.content_urls?.desktop?.page });
    return j;
  },

  // --- Open-Meteo: аба ырайы ---
  async weather(lat, lon) {
    const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m`);
    if (!r.ok) throw new Error('weather');
    return (await r.json()).current;
  },

  // --- MyMemory: котормо ---
  async translate(text, from, to) {
    const r = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`);
    if (!r.ok) throw new Error('translate');
    const j = await r.json();
    return j.responseData?.translatedText || '';
  },
};

/* =========================================================
   8. ИНТЕГРАЦИЯЛАР: Telegram, Email, Cloudinary, Realtime
   ========================================================= */
async function notifyTelegram(text) {
  if (!CONFIG.TELEGRAM_BOT_TOKEN || !CONFIG.TELEGRAM_CHAT_ID) return false;
  try {
    const r = await fetch(`https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CONFIG.TELEGRAM_CHAT_ID, text, parse_mode: 'HTML' }),
    });
    return r.ok;
  } catch { return false; }
}
async function sendEmail(params) {
  const c = CONFIG.EMAILJS;
  if (!c.serviceId || !c.templateId || !c.publicKey) return false;
  try {
    const r = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ service_id: c.serviceId, template_id: c.templateId, user_id: c.publicKey, template_params: params }),
    });
    return r.ok;
  } catch { return false; }
}
function fileToDataURL(file, maxW = 1000) {
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onerror = rej;
    fr.onload = () => {
      const img = new Image();
      img.onload = () => {
        const k = Math.min(1, maxW / img.width);
        const cv = document.createElement('canvas'); cv.width = img.width * k; cv.height = img.height * k;
        cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
        res(cv.toDataURL('image/jpeg', .8));
      };
      img.onerror = rej; img.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
}
async function uploadImage(file) {
  const c = CONFIG.CLOUDINARY;
  if (c.cloudName && c.uploadPreset) {
    const fd = new FormData(); fd.append('file', file); fd.append('upload_preset', c.uploadPreset);
    const r = await fetch(`https://api.cloudinary.com/v1_1/${c.cloudName}/image/upload`, { method: 'POST', body: fd });
    const j = await r.json();
    if (j.secure_url) return j.secure_url;
    throw new Error(j.error?.message || 'Upload error');
  }
  return fileToDataURL(file); // Cloudinary жок болсо — локалдык сактоо
}

// Realtime: башка өтмөктөр (tabs) ортосунда синхрондоо (Firebase/Socket.io ордуна)
const bus = ('BroadcastChannel' in window) ? new BroadcastChannel('studyitaly') : null;
const emit = (type, data) => { try { bus && bus.postMessage({ type, data }); } catch { /* */ } };
if (bus) {
  bus.onmessage = ({ data: msg }) => {
    _db = null; state.loaded = false;
    const path = currentPath();
    if (msg.type === 'order' && Auth.isAdmin()) toast(`🔔 ${t('new_order')}: <b>${esc(msg.data.name)}</b> — ${money(msg.data.total)}`, 'info');
    if (msg.type === 'booking' && Auth.isAdmin()) toast(`📅 ${t('new_booking')}: <b>${esc(msg.data.name)}</b>`, 'info');
    if (path === '/admin') renderAdminTab();
    else if (msg.type === 'review' && path === '/uni/' + msg.data.uniId) refreshReviews(msg.data.uniId);
    else if (msg.type === 'db' && (path === '/universities' || path === '/')) router();
  };
}
window.addEventListener('storage', e => {
  if (e.key === 'ita_db') _db = null;
  if (e.key === 'token') { state.token = ls.get('token', null); renderAuthArea(); }
});

/* =========================================================
   9. AUTH (JWT + роль + OAuth)
   ========================================================= */
const Auth = {
  user() { const p = verifyJWT(state.token); if (state.token && !p) { state.token = null; ls.del('token'); } return p; },
  isAdmin() { return this.user()?.role === 'admin'; },
  setSession(u) {
    state.token = signJWT({ sub: u.id, name: u.name, email: u.email, role: u.role, avatar: u.avatar || '' });
    ls.set('token', state.token); renderAuthArea();
  },
  async login(email, pass) {
    await API.delay(300);
    const u = db().users.find(x => x.email === email.trim().toLowerCase() && x.pass === hash(pass));
    if (!u) throw new Error(t('bad_login'));
    this.setSession(u);
  },
  async register(name, email, pass) {
    await API.delay(300);
    const d = db(); email = email.trim().toLowerCase();
    if (d.users.some(x => x.email === email)) throw new Error(t('email_taken'));
    const u = { id: uid(), name: name.trim(), email, pass: hash(pass), role: 'user', provider: 'local', created: new Date().toISOString() };
    d.users.push(u); saveDb(d); this.setSession(u);
  },
  async oauth(provider, profile) {
    await API.delay(300);
    const d = db(); const email = profile.email.trim().toLowerCase();
    let u = d.users.find(x => x.email === email);
    if (!u) { u = { id: uid(), name: profile.name, email, pass: '', role: 'user', provider, avatar: profile.avatar || '', created: new Date().toISOString() }; d.users.push(u); saveDb(d); }
    this.setSession(u);
  },
  logout() { state.token = null; ls.del('token'); renderAuthArea(); toast('👋 ' + t('logout')); location.hash = '#/'; },
};

async function oauthLogin(provider) {
  if (provider === 'google' && CONFIG.GOOGLE_CLIENT_ID) {
    try {
      await loadScript('https://accounts.google.com/gsi/client');
      google.accounts.id.initialize({
        client_id: CONFIG.GOOGLE_CLIENT_ID,
        callback: async resp => { const p = parseJwt(resp.credential); await Auth.oauth('google', { name: p.name, email: p.email, avatar: p.picture }); afterLogin(); },
      });
      google.accounts.id.prompt();
      return;
    } catch { toast('Google SDK error', 'error'); }
  }
  const label = provider === 'google' ? 'Google' : 'GitHub';
  openModal(`<h3>${label} OAuth (demo)</h3>
    <p class="notice warn">Чыныгы OAuth үчүн app.js ичиндеги CONFIG.GOOGLE_CLIENT_ID толтуруңуз (GitHub OAuth сервер талап кылат).</p>
    <form id="oauthForm" class="form" style="margin-top:16px">
      <label class="field"><span>${t('full_name')}</span><input name="name" required value="${label} User"></label>
      <label class="field"><span>Email</span><input name="email" type="email" required value="${provider}.user@demo.kg"></label>
      <button class="btn w100">${t('login')} — ${label}</button>
    </form>`);
  $('#oauthForm').onsubmit = async ev => {
    ev.preventDefault();
    const fd = Object.fromEntries(new FormData(ev.target));
    await Auth.oauth(provider, fd); closeModal(); afterLogin();
  };
}
function afterLogin() {
  toast(`${t('welcome')}, <b>${esc(Auth.user()?.name)}</b>!`, 'success');
  const r = ls.get('redirect', null); ls.del('redirect');
  location.hash = r || (Auth.isAdmin() ? '#/admin' : '#/profile');
}

/* =========================================================
   10. СЕБЕТ / ТАНДАЛМАЛАР
   ========================================================= */
const inCart = id => state.cart.some(i => i.id === id);
const isFav = id => state.favs.includes(id);
function persistCart() { ls.set('cart', state.cart); updateBadges(); }
function addToCart(id) {
  const it = state.cart.find(i => i.id === id);
  if (it) it.qty++; else state.cart.push({ id, qty: 1 });
  persistCart(); toast(t('added_cart'), 'success'); refreshCartBtns(id);
}
function changeQty(id, d) {
  const it = state.cart.find(i => i.id === id); if (!it) return;
  it.qty = Math.max(1, Math.min(5, it.qty + d)); persistCart(); router();
}
function removeFromCart(id) { state.cart = state.cart.filter(i => i.id !== id); persistCart(); toast(t('removed_cart')); router(); }
function toggleFav(id) {
  if (isFav(id)) { state.favs = state.favs.filter(x => x !== id); toast(t('removed_fav')); }
  else { state.favs.push(id); toast(t('added_fav'), 'success'); }
  ls.set('favs', state.favs); updateBadges();
  $$(`[data-action="fav"][data-id="${id}"]`).forEach(b => b.classList.toggle('on', isFav(id)));
  if (currentPath() === '/favorites') router();
}
function refreshCartBtns(id) {
  $$(`[data-action="cart"][data-id="${id}"]`).forEach(b => { b.innerHTML = inCart(id) ? '✓ ' + t('in_cart') : '🛒 ' + t('add_cart'); });
}
function updateBadges() {
  const c = state.cart.reduce((a, i) => a + i.qty, 0);
  $('#cartCount').textContent = c || ''; $('#cartCount').dataset.zero = c ? '0' : '1';
  $('#favCount').textContent = state.favs.length || ''; $('#favCount').dataset.zero = state.favs.length ? '0' : '1';
}
function cartItems(unis) { return state.cart.map(i => ({ ...i, u: unis.find(u => u.id === i.id) })).filter(i => i.u); }
function cartTotals(items) { const sub = items.reduce((a, i) => a + i.u.price * i.qty, 0); const fee = sub ? 10 : 0; return { sub, fee, total: sub + fee }; }

/* =========================================================
   11. РЕЙТИНГ
   ========================================================= */
const reviewsOf = id => db().reviews[id] || [];
function avgRating(u) { const r = reviewsOf(u.id); const n = (u.ratingCount || 0) + r.length; if (!n) return 0; return ((u.rating || 0) * (u.ratingCount || 0) + r.reduce((a, x) => a + x.rating, 0)) / n; }
const reviewCount = u => (u.ratingCount || 0) + reviewsOf(u.id).length;

/* =========================================================
   12. UI КОМПОНЕНТТЕР
   ========================================================= */
function Img(u, cls = '', idx = 0) {
  const ph = placeholder(u);
  if (u.image && idx === 0) return `<img class="${cls}" src="${esc(u.image)}" data-fallback="${ph}" alt="${esc(u.name)}" loading="lazy">`;
  return `<img class="${cls}" src="${ph}" data-fallback="${ph}" data-wiki="${esc(u.wiki || '')}" data-idx="${idx}" alt="${esc(u.name)}" loading="lazy">`;
}
function hydrateImages(root = document) {
  $$('img[data-wiki]:not([data-done])', root).forEach(async img => {
    img.dataset.done = '1';
    if (!img.dataset.wiki) return;
    const imgs = await API.wikiImages(img.dataset.wiki);
    const src = imgs[+img.dataset.idx || 0] || imgs[0];
    if (!src) return;
    const pre = new Image();
    pre.onload = () => { img.src = src; };
    pre.src = src;
  });
}

const Stars = (v, size = '') => { const f = Math.round(v); return `<span class="stars ${size}" title="${v.toFixed(1)}">${'★'.repeat(f)}${'☆'.repeat(5 - f)}<b>${v.toFixed(1)}</b></span>`; };
const SkeletonCard = () => `<div class="card skeleton"><div class="sk sk-img"></div><div class="card-body"><div class="sk sk-line w40"></div><div class="sk sk-line w90" style="height:20px"></div><div class="sk sk-line w60"></div><div class="sk sk-line"></div><div class="sk sk-line w90"></div></div></div>`;
const Skeletons = n => Array.from({ length: n }, SkeletonCard).join('');
const EmptyState = (ic, text, btn = '') => `<div class="empty"><div class="empty-ic">${ic}</div><h3>${text}</h3><p></p>${btn}</div>`;
const Fact = (ic, label, val) => `<div class="fact"><span class="fact-ic">${ic}</span><div><small>${label}</small><b>${val}</b></div></div>`;
const tuitionText = u => u.tuitionMax === 0 ? (state.lang === 'en' ? 'Free' : state.lang === 'ru' ? 'Бесплатно' : 'Акысыз') : `${money(u.tuitionMin)}–${money(u.tuitionMax)}`;

function UniCard(u) {
  return `<article class="card">
    <a href="#/uni/${u.id}" class="card-img">
      ${Img(u)}
      <span class="badge ${u.type}">${t(u.type)}</span>
      ${u.founded < 1300 ? `<span class="badge old">🏛 ${u.founded}</span>` : ''}
    </a>
    <button class="fav-btn ${isFav(u.id) ? 'on' : ''}" data-action="fav" data-id="${u.id}" aria-label="${t('fav')}">♥</button>
    <div class="card-body">
      <div class="card-meta">📍 ${esc(u.city)} · ${esc(u.region)}</div>
      <h3><a href="#/uni/${u.id}">${esc(u.name)}</a></h3>
      <div>${Stars(avgRating(u))} <small class="muted">(${reviewCount(u)})</small></div>
      <p class="muted clamp">${esc(u.desc)}</p>
      <div class="card-tags">
        ${u.english ? '<span class="tag">🇬🇧 English</span>' : '<span class="tag gold">🇮🇹 Italiano</span>'}
        ${u.qs ? `<span class="tag blue">QS #${u.qs}</span>` : ''}
        <span class="tag red">👥 ${num(u.students)}</span>
      </div>
      <div class="card-foot">
        <div><small>${t('tuition')}${t('per_year')}</small><b>${tuitionText(u)}</b></div>
        <button class="btn btn-sm" data-action="cart" data-id="${u.id}">${inCart(u.id) ? '✓ ' + t('in_cart') : '🛒 ' + t('add_cart')}</button>
      </div>
    </div>
  </article>`;
}

function Pagination(page, pages) {
  if (pages <= 1) return '';
  let html = `<nav class="pagination" aria-label="${t('page')}"><button data-action="page" data-page="${page - 1}" ${page === 1 ? 'disabled' : ''}>‹</button>`;
  for (let i = 1; i <= pages; i++) html += `<button class="${i === page ? 'on' : ''}" data-action="page" data-page="${i}">${i}</button>`;
  return html + `<button data-action="page" data-page="${page + 1}" ${page === pages ? 'disabled' : ''}>›</button></nav>`;
}

const PageHead = (title, sub = '') => `<section class="page-head"><div class="container"><h1>${title}</h1>${sub ? `<p class="muted">${sub}</p>` : ''}</div></section>`;
const NotFound = () => `<div class="container error-box"><div class="code">404</div><h2>${t('not_found')}</h2><a href="#/" class="btn">${t('go_home')}</a></div>`;
const Forbidden = () => `<div class="container error-box"><div class="code">403</div><h2>${t('forbidden')}</h2><a href="#/" class="btn">${t('go_home')}</a></div>`;
const ErrorBoundary = e => `<div class="container error-box"><div class="code">⚠️</div><h2>${t('error_title')}</h2><p class="muted">${esc(e && e.message)}</p><button class="btn" data-action="retry">${t('retry')}</button></div>`;

/* =========================================================
   13. БАРАКТАР (PAGES)
   ========================================================= */

/* ---------- 13.1 Башкы бет ---------- */
async function HomePage(app) {
  const my = state.renderId;
  app.innerHTML = `
  <section class="hero">
    <img class="hero-bg" data-wiki="Florence_Cathedral" src="${placeholder({ id: 'hero', short: ' ' })}" alt="">
    <div class="hero-overlay"></div>
    <div class="container hero-content">
      <span class="pill">${t('hero_badge')}</span>
      <h1>${t('hero_title')}</h1>
      <p>${t('hero_sub')}</p>
      <form class="hero-search" id="heroSearch">
        <input name="q" placeholder="${t('search_ph')}" autocomplete="off">
        <button class="btn">🔍 ${t('search')}</button>
      </form>
      <div class="hero-btns">
        <a href="#/universities" class="btn btn-lg">${t('hero_cta')}</a>
        <a href="#/booking" class="btn btn-lg btn-ghost">📅 ${t('hero_cta2')}</a>
      </div>
    </div>
  </section>
  <section class="container"><div class="stats" id="stats">${'<div class="stat sk"></div>'.repeat(4)}</div></section>
  <section class="section container">
    <div class="section-head"><h2>${t('top_unis')}</h2><a href="#/universities" class="link">${t('see_all')}</a></div>
    <div class="grid" id="topGrid">${Skeletons(6)}</div>
  </section>
  <section class="section container" style="padding-top:0">
    <h2>${t('cities_title')}</h2>
    <div class="city-chips" id="cityChips"></div>
  </section>
  <section class="section container">
    <h2>${t('why_title')}</h2>
    <div class="features">
      ${[['💶', 'why1'], ['🎁', 'why2'], ['🇬🇧', 'why3'], ['🎓', 'why4']].map(([ic, k]) => `<div class="feature"><div class="feature-ic">${ic}</div><h3>${t(k + '_t')}</h3><p class="muted">${t(k + '_d')}</p></div>`).join('')}
    </div>
  </section>
  <section class="section container">
    <h2>${t('steps_title')}</h2>
    <div class="steps">${[1, 2, 3, 4, 5, 6].map(i => `<div class="step">${t('step' + i)}</div>`).join('')}</div>
  </section>
  <section class="section container">
    <h2>${t('reviews_title')}</h2>
    <div class="testimonials" id="testi"></div>
  </section>
  <section class="container">
    <div class="cta"><div><h2>${t('cta_title')}</h2><p>${t('cta_sub')}</p></div><a href="#/booking" class="btn btn-lg btn-white">📅 ${t('hero_cta2')}</a></div>
  </section>`;

  $('#heroSearch').onsubmit = e => {
    e.preventDefault();
    state.filters = { ...DEFAULT_FILTERS, q: new FormData(e.target).get('q') || '' };
    location.hash = '#/universities';
  };
  hydrateImages(app);

  const unis = await loadUnis();
  if (!alive(my)) return;
  const cities = [...new Set(unis.map(u => u.city))];
  const avg = Math.round(unis.reduce((a, u) => a + (u.tuitionMin + u.tuitionMax) / 2, 0) / (unis.length || 1));
  $('#stats').innerHTML = `
    <div class="stat"><b>${unis.length}</b><span>${t('stat_unis')}</span></div>
    <div class="stat"><b>${cities.length}</b><span>${t('stat_cities')}</span></div>
    <div class="stat"><b>${Math.min(...unis.map(u => u.founded))}</b><span>${t('stat_oldest')}</span></div>
    <div class="stat"><b>${money(avg)}</b><span>${t('stat_avg')}</span></div>`;
  const top = [...unis].sort((a, b) => avgRating(b) - avgRating(a)).slice(0, 6);
  $('#topGrid').innerHTML = top.map(UniCard).join('');
  $('#cityChips').innerHTML = cities.map(c => `<button class="chip" data-action="city-go" data-city="${esc(c)}">📍 ${esc(c)} <b>${unis.filter(u => u.city === c).length}</b></button>`).join('');
  const all = Object.values(db().reviews).flat().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
  $('#testi').innerHTML = all.map(r => {
    const u = unis.find(x => x.id === r.uniId);
    return `<div class="testi">${Stars(r.rating, 'sm')}<p>“${esc(r.text)}”</p><div class="testi-foot"><div class="avatar">${esc(r.name[0])}</div><div><b>${esc(r.name)}</b><br><small class="muted">${u ? `<a href="#/uni/${u.id}">${esc(u.name)}</a>` : ''}</small></div></div></div>`;
  }).join('');
  hydrateImages(app);
}

/* ---------- 13.2 Университеттер тизмеси ---------- */
function filterUnis(list, f) {
  const q = f.q.trim().toLowerCase();
  const res = list.filter(u => {
    if (q && !`${u.name} ${u.short} ${u.city} ${u.region} ${u.programs.map(p => p[0]).join(' ')}`.toLowerCase().includes(q)) return false;
    if (f.city && u.city !== f.city) return false;
    if (f.type && u.type !== f.type) return false;
    if (u.tuitionMin > f.maxT) return false;
    if (f.eng && !u.english) return false;
    return true;
  });
  const sorters = {
    rating: (a, b) => avgRating(b) - avgRating(a),
    tuition: (a, b) => a.tuitionMin - b.tuitionMin,
    founded: (a, b) => a.founded - b.founded,
    name: (a, b) => a.name.localeCompare(b.name),
  };
  return res.sort(sorters[f.sort] || sorters.rating);
}

async function UniversitiesPage(app) {
  const my = state.renderId; const f = state.filters;
  app.innerHTML = `${PageHead(t('nav_unis'), t('prices_note'))}
  <div class="container list-layout">
    <aside class="filters" id="filters"><div class="sk sk-block"></div></aside>
    <div class="results">
      <div class="toolbar">
        <div class="search-box"><input id="searchInput" type="search" value="${esc(f.q)}" placeholder="${t('search_ph')}"></div>
        <select id="sortSel" aria-label="${t('sort')}">
          ${['rating', 'tuition', 'founded', 'name'].map(s => `<option value="${s}" ${f.sort === s ? 'selected' : ''}>${t('s_' + s)}</option>`).join('')}
        </select>
        <button class="btn btn-outline only-mobile" data-action="toggle-filters">⚙️ ${t('filters')}</button>
      </div>
      <p class="result-count muted" id="count">${t('loading')}</p>
      <div class="grid" id="uniGrid">${Skeletons(6)}</div>
      <div id="pager"></div>
    </div>
  </div>`;

  $('#searchInput').addEventListener('input', debounce(e => { f.q = e.target.value; f.page = 1; renderList(); }, 250));
  $('#sortSel').onchange = e => { f.sort = e.target.value; renderList(); };

  const unis = await loadUnis();
  if (!alive(my)) return;
  const cities = [...new Set(unis.map(u => u.city))].sort();
  $('#filters').innerHTML = `
    <div class="filters-head"><h3>⚙️ ${t('filters')}</h3><button class="icon-btn only-mobile" data-action="toggle-filters">✕</button></div>
    <label class="field"><span>${t('city')}</span>
      <select id="fCity"><option value="">${t('all')}</option>${cities.map(c => `<option value="${esc(c)}" ${f.city === c ? 'selected' : ''}>${esc(c)}</option>`).join('')}</select>
    </label>
    <div class="field"><span>${t('type')}</span>
      <div class="chips">${['', 'state', 'private'].map(v => `<button class="chip ${f.type === v ? 'on' : ''}" data-action="ftype" data-v="${v}">${v ? t(v) : t('all')}</button>`).join('')}</div>
    </div>
    <label class="field"><span>${t('max_tuition')}: <b id="maxTVal">${money(f.maxT)}</b></span>
      <input type="range" id="fMaxT" min="0" max="20000" step="500" value="${f.maxT}">
    </label>
    <label class="check"><input type="checkbox" id="fEng" ${f.eng ? 'checked' : ''}> ${t('english_only')}</label>
    <button class="btn btn-outline w100" data-action="freset">↺ ${t('reset')}</button>
    <button class="btn w100 only-mobile" data-action="toggle-filters">${t('apply')}</button>`;
  $('#fCity').onchange = e => { f.city = e.target.value; f.page = 1; renderList(); };
  $('#fMaxT').oninput = e => { f.maxT = +e.target.value; $('#maxTVal').textContent = money(f.maxT); f.page = 1; renderList(); };
  $('#fEng').onchange = e => { f.eng = e.target.checked; f.page = 1; renderList(); };
  renderList();
}

function renderList() {
  const grid = $('#uniGrid'); if (!grid) return;
  const f = state.filters; const PS = CONFIG.PAGE_SIZE;
  const res = filterUnis(state.unis, f);
  const pages = Math.max(1, Math.ceil(res.length / PS));
  if (f.page > pages) f.page = pages;
  const slice = res.slice((f.page - 1) * PS, f.page * PS);
  $('#count').textContent = `${res.length} ${t('found')}`;
  grid.innerHTML = slice.length ? slice.map(UniCard).join('') : EmptyState('🔎', t('no_results'), `<button class="btn" data-action="freset">${t('reset')}</button>`);
  $('#pager').innerHTML = Pagination(f.page, pages);
  hydrateImages(grid);
}

/* ---------- 13.3 Университеттин толук бети ---------- */
async function DetailPage(app, id) {
  const my = state.renderId;
  app.innerHTML = `<div class="container" style="padding:40px 28px"><div class="detail-top"><div class="sk sk-block"></div><div><div class="sk sk-title"></div><div class="sk sk-line"></div><div class="sk sk-line w90"></div><div class="sk sk-line w60"></div><div class="sk sk-line w40"></div></div></div></div>`;
  const u = await API.getUni(id);
  if (!alive(my)) return;
  if (!u) { app.innerHTML = NotFound(); return; }
  const unis = await loadUnis();
  if (!alive(my)) return;
  const others = unis.filter(x => x.id !== u.id && (x.region === u.region || x.city === u.city)).concat(unis.filter(x => x.id !== u.id)).filter((x, i, a) => a.indexOf(x) === i).slice(0, 3);
  const firstSentence = u.desc.split('. ')[0] + '.';
  const mapBox = `${u.lon - 0.03},${u.lat - 0.018},${u.lon + 0.03},${u.lat + 0.018}`;

  app.innerHTML = `
  <div class="container"><nav class="crumbs"><a href="#/">${t('nav_home')}</a> / <a href="#/universities">${t('nav_unis')}</a> / <span>${esc(u.name)}</span></nav></div>
  <section class="container detail">
    <div class="detail-top">
      <div class="gallery">
        <div class="g-main">${Img(u, '', 0).replace('<img', '<img id="gMain"')}<span class="badge ${u.type}">${t(u.type)}</span></div>
        <div class="g-thumbs" id="thumbs">${'<div class="g-th sk"></div>'.repeat(6)}</div>
      </div>
      <div class="detail-info">
        <div class="muted">📍 ${esc(u.city)}, ${esc(u.region)} · ${t('founded')} ${u.founded}</div>
        <h1>${esc(u.name)}</h1>
        <div class="row">${Stars(avgRating(u), 'lg')} <button class="link" data-action="scroll" data-target="reviews">${reviewCount(u)} ${t('reviews_count')}</button></div>
        <p class="lead">${esc(firstSentence)}</p>
        <div class="card-tags">
          ${u.english ? '<span class="tag">🇬🇧 English</span>' : '<span class="tag gold">🇮🇹 Italiano</span>'}
          ${u.qs ? `<span class="tag blue">QS #${u.qs}</span>` : ''}
          <span class="tag red">${esc(u.short)}</span>
        </div>
        <div class="price-box"><div><small class="muted">${t('service_price')}</small><br><small>${t('package')}</small></div><b>${money(u.price)}</b></div>
        <div class="detail-actions">
          <button class="btn btn-lg" data-action="cart" data-id="${u.id}">${inCart(u.id) ? '✓ ' + t('in_cart') : '🛒 ' + t('add_cart')}</button>
          <a class="btn btn-lg btn-outline" href="#/booking/${u.id}">📅 ${t('book')}</a>
          <button class="icon-btn lg fav-toggle ${isFav(u.id) ? 'on' : ''}" data-action="fav" data-id="${u.id}" aria-label="${t('fav')}">♥</button>
          <button class="icon-btn lg" data-action="share" data-id="${u.id}" aria-label="Share">↗</button>
        </div>
      </div>
    </div>

    <div class="facts">
      ${Fact('🏛', t('founded'), u.founded)}
      ${Fact('👥', t('students'), num(u.students))}
      ${Fact('💶', t('tuition') + t('per_year'), tuitionText(u))}
      ${Fact('🏆', t('qs'), u.qs ? '#' + u.qs : '—')}
      ${Fact('📆', t('deadline'), esc(u.deadline))}
      ${Fact('🇬🇧', t('eng_programs'), u.english ? t('yes') : t('no'))}
      ${Fact('📝', t('exam'), esc(u.exam))}
      ${Fact('⭐', t('rating'), avgRating(u).toFixed(1) + ' / 5')}
    </div>

    <div class="detail-grid">
      <div class="detail-main">
        <article class="panel"><h2>${t('about')}</h2><p>${esc(u.desc)}</p>
          <h4>📖 ${t('wiki_info')}</h4><p id="wikiText" class="muted">${t('loading')}</p></article>
        <article class="panel"><h2>${t('programs')}</h2>
          <div class="table-wrap"><table class="table">
            <thead><tr><th>${t('programs')}</th><th>${t('level')}</th><th>${t('language')}</th><th>${t('duration')}</th></tr></thead>
            <tbody>${u.programs.map(p => `<tr><td><b>${esc(p[0])}</b></td><td>${esc(p[1])}</td><td><span class="tag ${p[2] === 'EN' ? '' : 'gold'}">${esc(p[2])}</span></td><td>${p[3]} ${t('years')}</td></tr>`).join('')}</tbody>
          </table></div></article>
        <article class="panel"><h2>${t('requirements')}</h2>
          <ul class="checklist">${COMMON_REQ.map(r => `<li>${esc(r)}</li>`).join('')}<li>${t('exam')}: <b>${esc(u.exam)}</b></li></ul></article>
        <article class="panel" id="reviews"><h2>${t('reviews')}</h2><div id="reviewsBlock">${ReviewsBlock(u)}</div></article>
      </div>
      <aside class="detail-side">
        <div class="panel"><h3>🌤 ${t('weather')}</h3><div id="weather" class="muted">${t('loading')}</div></div>
        <div class="panel"><h3>🎁 ${t('scholarships')}</h3><p>${esc(u.scholar)}</p></div>
        <div class="panel"><h3>📆 ${t('deadline')}</h3><p><b>${esc(u.deadline)}</b></p><small class="muted">${t('prices_note')}</small></div>
        <div class="panel map-panel"><iframe title="${t('map')}" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=${mapBox}&layer=mapnik&marker=${u.lat},${u.lon}"></iframe></div>
      </aside>
    </div>

    <section class="section"><h2>${t('similar')}</h2><div class="grid">${others.map(UniCard).join('')}</div></section>
  </section>`;

  bindReviewForm(u);
  hydrateImages(app);

  // Галерея (Wikipedia API)
  const imgs = await API.wikiImages(u.wiki);
  if (!alive(my)) return;
  const all = [...(u.image ? [u.image] : []), ...imgs].slice(0, 8);
  $('#thumbs').innerHTML = all.length
    ? all.map((src, i) => `<button class="g-th ${i === 0 ? 'on' : ''}" data-action="gthumb" data-src="${esc(src)}"><img src="${esc(src)}" alt="" loading="lazy"></button>`).join('')
    : '';
  if (all[0]) $('#gMain').src = all[0];

  // Wikipedia маалымат
  API.wikiSummary(u.wiki).then(s => {
    if (!alive(my) || !$('#wikiText')) return;
    $('#wikiText').innerHTML = `${esc(s.extract || '')} ${s.url || s.content_urls ? `<a class="link" target="_blank" rel="noopener" href="${esc(s.url || s.content_urls.desktop.page)}">Wikipedia ↗</a>` : ''}`;
  }).catch(() => { $('#wikiText') && ($('#wikiText').textContent = '—'); });

  // Аба ырайы (Open-Meteo API)
  API.weather(u.lat, u.lon).then(w => {
    if (!alive(my) || !$('#weather')) return;
    $('#weather').innerHTML = `<div class="weather-big">${wIcon(w.weather_code)} ${Math.round(w.temperature_2m)}°C</div><small>💨 ${w.wind_speed_10m} km/h · 💧 ${w.relative_humidity_2m}% · ${esc(u.city)}</small>`;
  }).catch(() => { $('#weather') && ($('#weather').textContent = '—'); });
}
function wIcon(c) { if (c === 0) return '☀️'; if (c <= 3) return '⛅'; if (c <= 48) return '🌫️'; if (c <= 67) return '🌧️'; if (c <= 77) return '❄️'; if (c <= 82) return '🌦️'; return '⛈️'; }

function ReviewsBlock(u) {
  const list = reviewsOf(u.id).slice().reverse();
  const user = Auth.user();
  return `<div class="reviews-summary">${Stars(avgRating(u), 'lg')} <span class="muted">${reviewCount(u)} ${t('reviews_count')}</span></div>
    ${user ? `<form class="review-form" id="reviewForm">
        <b>${t('write_review')}</b>
        <div class="star-input" id="starInput">${[1, 2, 3, 4, 5].map(i => `<button type="button" class="on" data-star="${i}" aria-label="${i}">★</button>`).join('')}</div>
        <input type="hidden" name="rating" value="5">
        <textarea name="text" required minlength="3" maxlength="600" placeholder="${t('comment')}"></textarea>
        <button class="btn">${t('send')}</button>
      </form>` : `<p class="notice"><a class="link" href="#/login">${t('login_to_review')} →</a></p>`}
    <div class="review-list">${list.length ? list.map(ReviewItem).join('') : `<p class="muted" style="margin-top:14px">${t('no_data')}</p>`}</div>`;
}
function ReviewItem(r) {
  const me = Auth.user();
  const canDel = me && (me.role === 'admin' || me.sub === r.userId);
  return `<div class="review"><div class="avatar">${esc((r.name || '?')[0])}</div><div style="flex:1">
    <div class="review-head"><b>${esc(r.name)}</b>${Stars(r.rating, 'sm')}<small class="muted">${fmtDate(r.date)}</small>
    ${canDel ? `<button class="link danger" style="margin-left:auto" data-action="del-review" data-uni="${r.uniId}" data-id="${r.id}">${t('delete')}</button>` : ''}</div>
    <p>${esc(r.text)}</p></div></div>`;
}
function bindReviewForm(u) {
  const form = $('#reviewForm'); if (!form) return;
  $$('#starInput button').forEach(b => b.onclick = () => {
    const v = +b.dataset.star; form.rating.value = v;
    $$('#starInput button').forEach(x => x.classList.toggle('on', +x.dataset.star <= v));
  });
  form.onsubmit = async e => {
    e.preventDefault();
    const user = Auth.user(); if (!user) return;
    const r = { id: uid(), uniId: u.id, userId: user.sub, name: user.name, rating: +form.rating.value, text: form.text.value.trim(), date: new Date().toISOString() };
    if (r.text.length < 3) return toast(t('fill_all'), 'warn');
    await API.addReview(r);
    emit('review', { uniId: u.id });
    toast(t('review_added'), 'success');
    refreshReviews(u.id);
  };
}
async function refreshReviews(id) {
  const u = db().unis.find(x => x.id === id); const el = $('#reviewsBlock');
  if (!u || !el) return;
  el.innerHTML = ReviewsBlock(u); bindReviewForm(u);
}

/* ---------- 13.4 Себет ---------- */
async function CartPage(app) {
  const my = state.renderId;
  app.innerHTML = PageHead('🛒 ' + t('cart_title')) + `<div class="container">${Skeletons(2)}</div>`;
  const unis = await loadUnis(); if (!alive(my)) return;
  const items = cartItems(unis);
  if (!items.length) {
    app.innerHTML = PageHead('🛒 ' + t('cart_title')) + `<div class="container">${EmptyState('🛒', t('empty_cart'), `<a href="#/universities" class="btn">${t('continue')}</a>`)}</div>`;
    return;
  }
  const { sub, fee, total } = cartTotals(items);
  app.innerHTML = PageHead('🛒 ' + t('cart_title')) + `
  <div class="container cart-layout">
    <div class="cart-list">
      ${items.map(i => `<div class="cart-item">
        <a href="#/uni/${i.u.id}">${Img(i.u)}</a>
        <div><h3><a href="#/uni/${i.u.id}">${esc(i.u.name)}</a></h3><small class="muted">📍 ${esc(i.u.city)} · ${t('package')}</small></div>
        <div class="qty"><button data-action="qty" data-id="${i.id}" data-d="-1">−</button><span>${i.qty}</span><button data-action="qty" data-id="${i.id}" data-d="1">+</button></div>
        <b>${money(i.u.price * i.qty)}</b>
        <button class="icon-btn" data-action="remove" data-id="${i.id}" aria-label="${t('remove')}">🗑</button>
      </div>`).join('')}
    </div>
    <aside class="summary">
      <h3>${t('total')}</h3>
      <div class="sum-row"><span class="muted">${t('subtotal')}</span><b>${money(sub)}</b></div>
      <div class="sum-row"><span class="muted">${t('service_fee')}</span><b>${money(fee)}</b></div>
      <div class="sum-row total"><span>${t('total')}</span><span>${money(total)}</span></div>
      <a href="#/checkout" class="btn btn-lg w100">${t('checkout')} →</a>
      <a href="#/universities" class="btn btn-outline w100">${t('continue')}</a>
    </aside>
  </div>`;
  hydrateImages(app);
}

/* ---------- 13.5 Checkout + төлөм ---------- */
async function CheckoutPage(app) {
  const my = state.renderId;
  const unis = await loadUnis(); if (!alive(my)) return;
  const items = cartItems(unis);
  if (!items.length) { location.hash = '#/cart'; return; }
  const { sub, fee, total } = cartTotals(items);
  const user = Auth.user();
  app.innerHTML = PageHead('💳 ' + t('checkout_title')) + `
  <div class="container cart-layout">
    <form class="panel form" id="checkoutForm" novalidate>
      <h3>${t('contact_info')}</h3>
      <div class="form-grid">
        <label class="field"><span>${t('full_name')}</span><input name="name" required value="${esc(user.name)}"></label>
        <label class="field"><span>${t('email')}</span><input name="email" type="email" required value="${esc(user.email)}"></label>
        <label class="field"><span>${t('phone')}</span><input name="phone" type="tel" required placeholder="+996 700 000 000"></label>
        <label class="field"><span>${t('address')}</span><input name="address" placeholder="Бишкек"></label>
      </div>
      <h3>${t('payment')}</h3>
      <label class="radio-card"><input type="radio" name="method" value="card" checked> 💳 ${t('pay_card')}</label>
      <label class="radio-card"><input type="radio" name="method" value="postkg"> 📮 ${t('pay_postkg')}</label>
      <label class="radio-card"><input type="radio" name="method" value="cash"> 💵 ${t('pay_cash')}</label>
      <div id="payBox"></div>
      <button class="btn btn-lg w100" id="payBtn">🔒 ${t('place_order')} — ${money(total)}</button>
    </form>
    <aside class="summary">
      <h3>${t('cart_title')} (${items.length})</h3>
      ${items.map(i => `<div class="sum-row"><span>${esc(i.u.short)} × ${i.qty}</span><b>${money(i.u.price * i.qty)}</b></div>`).join('')}
      <div class="sum-row"><span class="muted">${t('service_fee')}</span><b>${money(fee)}</b></div>
      <div class="sum-row total"><span>${t('total')}</span><span>${money(total)}</span></div>
      <small class="muted">🔒 SSL · Stripe / Post.kg demo</small>
    </aside>
  </div>`;

  const form = $('#checkoutForm');
  const renderPay = () => {
    const m = form.method.value;
    $('#payBox').innerHTML = m === 'card' ? `<div class="pay-demo form">
        <div class="card-fields">
          <label class="field full-xs"><span style="color:#cbd5e1">${t('card_number')}</span><input name="card" inputmode="numeric" maxlength="19" placeholder="4242 4242 4242 4242"></label>
          <label class="field"><span style="color:#cbd5e1">${t('card_exp')}</span><input name="exp" maxlength="5" placeholder="12/28"></label>
          <label class="field"><span style="color:#cbd5e1">${t('card_cvc')}</span><input name="cvc" inputmode="numeric" maxlength="4" placeholder="123"></label>
        </div><small>${t('test_cards')}</small></div>`
      : `<p class="notice">${m === 'postkg' ? '📮 ' + t('postkg_note') : '💵 ' + t('cash_note')}</p>`;
    const card = form.card;
    if (card) {
      card.oninput = () => { card.value = card.value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 '); };
      form.exp.oninput = () => { let v = form.exp.value.replace(/\D/g, '').slice(0, 4); if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2); form.exp.value = v; };
    }
  };
  $$('input[name=method]', form).forEach(r => r.onchange = renderPay);
  renderPay();

  form.onsubmit = async e => {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(form));
    if (!fd.name || !fd.email || !fd.phone) return toast(t('fill_all'), 'warn');
    if (!/^\S+@\S+\.\S+$/.test(fd.email)) return toast(t('invalid_email'), 'error');
    const btn = $('#payBtn'); const old = btn.innerHTML;
    btn.disabled = true; btn.innerHTML = '⏳ ' + t('processing');
    let status = 'pending';
    try {
      if (fd.method === 'card') {
        const n = (fd.card || '').replace(/\s/g, '');
        if (!luhn(n) || !/^\d{2}\/\d{2}$/.test(fd.exp || '') || !/^\d{3,4}$/.test(fd.cvc || '')) throw new Error(t('invalid_card'));
        await sleep(1500);
        if (n === '4000000000000002') throw new Error(t('card_declined'));
        status = 'paid';
      } else if (fd.method === 'postkg') { await sleep(1200); status = 'paid'; }
      const order = {
        id: 'ORD-' + uid().toUpperCase().slice(-6), userId: user.sub, name: fd.name, email: fd.email, phone: fd.phone, address: fd.address || '',
        items: items.map(i => ({ id: i.u.id, name: i.u.name, price: i.u.price, qty: i.qty })), total, method: fd.method, status, date: new Date().toISOString(),
      };
      await API.createOrder(order);
      emit('order', order);
      state.cart = []; persistCart();
      notifyAll('order', order);
      openModal(`<div class="success-ic">🎉</div><h3 class="center" style="padding:0">${t('order_success')}</h3>
        <p class="center muted">№ <b>${order.id}</b> · ${money(order.total)} · ${t('st_' + status)}</p>
        <div class="row-end" style="justify-content:center"><a href="#/profile" class="btn" data-action="modal-close">${t('my_orders')}</a></div>`);
      location.hash = '#/profile';
    } catch (err) {
      toast('❌ ' + esc(err.message), 'error');
      btn.disabled = false; btn.innerHTML = old;
    }
  };
}

async function notifyAll(kind, o) {
  const text = kind === 'order'
    ? `🧾 <b>${t('new_order')}</b> ${o.id}\n👤 ${o.name}\n📞 ${o.phone}\n✉️ ${o.email}\n🎓 ${o.items.map(i => i.name + ' ×' + i.qty).join(', ')}\n💶 ${money(o.total)} (${o.method}, ${o.status})`
    : `📅 <b>${t('new_booking')}</b>\n👤 ${o.name}\n📞 ${o.phone}\n🎓 ${o.uniName}\n🗓 ${o.date} ${o.time}\n📝 ${o.type}`;
  if (await notifyTelegram(text)) toast('✈️ ' + t('tg_sent'), 'success');
  const mail = await sendEmail({ to_email: o.email || '', to_name: o.name, subject: kind === 'order' ? t('new_order') + ' ' + o.id : t('new_booking'), message: text.replace(/<[^>]+>/g, '') });
  if (mail) toast('📧 ' + t('mail_sent'), 'success');
}

/* ---------- 13.6 Бронь ---------- */
async function BookingPage(app, id) {
  const my = state.renderId;
  const unis = await loadUnis(); if (!alive(my)) return;
  const user = Auth.user();
  const today = new Date().toISOString().slice(0, 10);
  app.innerHTML = PageHead('📅 ' + t('booking_title'), t('booking_sub')) + `
  <div class="container cart-layout">
    <form class="panel form" id="bookingForm">
      <label class="field"><span>${t('university')}</span>
        <select name="uni" required>${unis.map(u => `<option value="${u.id}" ${u.id === id ? 'selected' : ''}>${esc(u.name)} — ${esc(u.city)}</option>`).join('')}</select></label>
      <div class="field"><span>${t('booking_type')}</span>
        ${['b_online', 'b_tour', 'b_docs'].map((k, i) => `<label class="radio-card"><input type="radio" name="type" value="${k}" ${i === 0 ? 'checked' : ''}> ${['💻', '🏛', '📄'][i]} ${t(k)}</label>`).join('')}
      </div>
      <div class="form-grid">
        <label class="field"><span>${t('date')}</span><input type="date" name="date" min="${today}" required></label>
        <label class="field"><span>${t('time')}</span><select name="time">${['10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'].map(x => `<option>${x}</option>`).join('')}</select></label>
        <label class="field"><span>${t('full_name')}</span><input name="name" required value="${esc(user.name)}"></label>
        <label class="field"><span>${t('phone')}</span><input name="phone" type="tel" required placeholder="+996 700 000 000"></label>
        <label class="field full"><span>${t('note')}</span><textarea name="note" placeholder="..."></textarea></label>
      </div>
      <button class="btn btn-lg w100">📅 ${t('book_now')}</button>
    </form>
    <aside class="summary" id="bookingUni"></aside>
  </div>`;
  const form = $('#bookingForm');
  const showUni = () => {
    const u = unis.find(x => x.id === form.uni.value);
    $('#bookingUni').innerHTML = `<div class="g-main">${Img(u)}</div><h3>${esc(u.name)}</h3><p class="muted">📍 ${esc(u.city)} · ${t('deadline')}: ${esc(u.deadline)}</p>${Stars(avgRating(u))}<a class="link" href="#/uni/${u.id}">${t('details')} →</a>`;
    hydrateImages($('#bookingUni'));
  };
  form.uni.onchange = showUni; showUni();
  form.onsubmit = async e => {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(form));
    if (!fd.date || !fd.name || !fd.phone) return toast(t('fill_all'), 'warn');
    const u = unis.find(x => x.id === fd.uni);
    const b = { id: uid(), userId: user.sub, email: user.email, uniId: u.id, uniName: u.name, type: t(fd.type), date: fd.date, time: fd.time, name: fd.name, phone: fd.phone, note: fd.note, created: new Date().toISOString() };
    await API.createBooking(b);
    emit('booking', b); notifyAll('booking', b);
    toast('✅ ' + t('booking_success'), 'success');
    location.hash = '#/profile';
  };
}

/* ---------- 13.7 Тандалмалар ---------- */
async function FavoritesPage(app) {
  const my = state.renderId;
  app.innerHTML = PageHead('♥ ' + t('favs_title')) + `<div class="container"><div class="grid">${Skeletons(3)}</div></div>`;
  const unis = await loadUnis(); if (!alive(my)) return;
  const list = unis.filter(u => isFav(u.id));
  app.innerHTML = PageHead('♥ ' + t('favs_title')) + `<div class="container section" style="padding-top:0"><div class="grid">${list.length ? list.map(UniCard).join('') : EmptyState('💔', t('empty_favs'), `<a href="#/universities" class="btn">${t('continue')}</a>`)}</div></div>`;
  hydrateImages(app);
}

/* ---------- 13.8 Логин / Катталуу ---------- */
const OAuthButtons = () => `<div class="divider">${t('or')}</div>
  <div class="oauth">
    <button type="button" class="btn btn-white" data-action="oauth" data-provider="google"><b style="color:#4285f4">G</b> Google</button>
    <button type="button" class="btn btn-dark" data-action="oauth" data-provider="github">🐙 GitHub</button>
  </div>`;

function LoginPage(app) {
  if (Auth.user()) { location.hash = '#/profile'; return; }
  app.innerHTML = `<div class="auth-wrap"><div class="auth-card">
    <h1>${t('login')}</h1><p class="muted">${t('login_sub')}</p>
    <form class="form" id="loginForm" style="margin-top:20px">
      <label class="field"><span>${t('email')}</span><input name="email" type="email" required autocomplete="email"></label>
      <label class="field"><span>${t('password')}</span><input name="pass" type="password" required autocomplete="current-password"></label>
      <button class="btn btn-lg w100">${t('login')}</button>
      ${OAuthButtons()}
      <p class="center muted">${t('no_account')} <a class="link" href="#/register">${t('register')}</a></p>
      <p class="notice" style="font-size:13px">🔑 ${t('admin_hint')}</p>
    </form></div></div>`;
  $('#loginForm').onsubmit = async e => {
    e.preventDefault();
    const btn = e.target.querySelector('button'); btn.disabled = true;
    try { await Auth.login(e.target.email.value, e.target.pass.value); afterLogin(); }
    catch (err) { toast('❌ ' + esc(err.message), 'error'); btn.disabled = false; }
  };
}

function RegisterPage(app) {
  if (Auth.user()) { location.hash = '#/profile'; return; }
  app.innerHTML = `<div class="auth-wrap"><div class="auth-card">
    <h1>${t('register')}</h1><p class="muted">${t('register_sub')}</p>
    <form class="form" id="regForm" style="margin-top:20px">
      <label class="field"><span>${t('full_name')}</span><input name="name" required minlength="2"></label>
      <label class="field"><span>${t('email')}</span><input name="email" type="email" required></label>
      <label class="field"><span>${t('password')}</span><input name="pass" type="password" required minlength="6" autocomplete="new-password"></label>
      <label class="field"><span>${t('confirm_password')}</span><input name="pass2" type="password" required autocomplete="new-password"></label>
      <button class="btn btn-lg w100">${t('register')}</button>
      ${OAuthButtons()}
      <p class="center muted">${t('have_account')} <a class="link" href="#/login">${t('login')}</a></p>
    </form></div></div>`;
  $('#regForm').onsubmit = async e => {
    e.preventDefault();
    const f = e.target;
    if (!/^\S+@\S+\.\S+$/.test(f.email.value)) return toast(t('invalid_email'), 'error');
    if (f.pass.value.length < 6) return toast(t('pass_short'), 'error');
    if (f.pass.value !== f.pass2.value) return toast(t('pass_mismatch'), 'error');
    try { await Auth.register(f.name.value, f.email.value, f.pass.value); afterLogin(); }
    catch (err) { toast('❌ ' + esc(err.message), 'error'); }
  };
}

/* ---------- 13.9 Профиль ---------- */
function ProfilePage(app) {
  const u = Auth.user(); const d = db();
  const orders = d.orders.filter(o => o.userId === u.sub);
  const bookings = d.bookings.filter(b => b.userId === u.sub);
  app.innerHTML = PageHead('👤 ' + t('profile')) + `
  <div class="container">
    <div class="profile-head">
      <div class="avatar lg">${esc(u.name[0])}</div>
      <div style="flex:1"><h2 style="margin:0">${esc(u.name)}</h2><p class="muted" style="margin:0">${esc(u.email)}</p>
        <div class="row" style="margin-top:8px"><span class="tag ${u.role === 'admin' ? 'red' : ''}">${t('role')}: ${u.role}</span><span class="tag blue">JWT · ${t('token_exp')}: ${new Date(u.exp).toLocaleString()}</span></div></div>
      ${u.role === 'admin' ? `<a href="#/admin" class="btn">⚙️ ${t('admin_title')}</a>` : ''}
      <button class="btn btn-outline" data-action="logout">🚪 ${t('logout')}</button>
    </div>
    <div class="profile-grid">
      <div class="panel"><h3>🧾 ${t('my_orders')} (${orders.length})</h3>
        ${orders.length ? orders.map(o => `<div class="list-item"><div><b>${o.id}</b><br><small class="muted">${fmtDate(o.date)} · ${o.items.map(i => esc(i.name)).join(', ')}</small></div><div style="text-align:right"><b>${money(o.total)}</b><br><span class="tag ${o.status === 'cancel' ? 'red' : o.status === 'pending' ? 'gold' : ''}">${t('st_' + o.status)}</span></div></div>`).join('') : `<p class="muted">${t('no_data')}</p>`}
      </div>
      <div class="panel"><h3>📅 ${t('my_bookings')} (${bookings.length})</h3>
        ${bookings.length ? bookings.map(b => `<div class="list-item"><div><b>${esc(b.uniName)}</b><br><small class="muted">${esc(b.type)}</small></div><div style="text-align:right"><b>${esc(b.date)}</b><br><small>${esc(b.time)}</small></div></div>`).join('') : `<p class="muted">${t('no_data')}</p>`}
      </div>
    </div>
  </div>`;
}

/* ---------- 13.10 Админ панель ---------- */
function AdminPage(app) {
  const tabs = [['dashboard', '📊'], ['nav_unis', '🎓'], ['orders', '🧾'], ['bookings', '📅'], ['users', '👥'], ['settings', '⚙️']];
  app.innerHTML = PageHead('⚙️ ' + t('admin_title')) + `
  <div class="container admin">
    <div class="tabs">${tabs.map(([k, ic]) => `<button class="tab ${state.adminTab === k ? 'on' : ''}" data-action="admin-tab" data-tab="${k}">${ic} ${t(k)}</button>`).join('')}</div>
    <div id="adminBody"></div>
  </div>`;
  renderAdminTab();
}

function renderAdminTab() {
  const b = $('#adminBody'); if (!b) return;
  const d = db();
  state.charts.forEach(c => { try { c.destroy(); } catch { /* */ } }); state.charts = [];
  $$('.tab').forEach(x => x.classList.toggle('on', x.dataset.tab === state.adminTab));

  if (state.adminTab === 'dashboard') {
    const revenue = d.orders.filter(o => o.status === 'paid' || o.status === 'done').reduce((a, o) => a + o.total, 0);
    const reviews = Object.values(d.reviews).flat().length;
    b.innerHTML = `<div class="kpis">
      <div class="kpi"><span>🎓</span><b>${d.unis.length}</b><small>${t('nav_unis')}</small></div>
      <div class="kpi"><span>👥</span><b>${d.users.length}</b><small>${t('users')}</small></div>
      <div class="kpi"><span>🧾</span><b>${d.orders.length}</b><small>${t('orders')}</small></div>
      <div class="kpi"><span>💶</span><b>${money(revenue)}</b><small>${t('revenue')}</small></div>
      <div class="kpi"><span>📅</span><b>${d.bookings.length}</b><small>${t('bookings')}</small></div>
      <div class="kpi"><span>⭐</span><b>${reviews}</b><small>${t('reviews')}</small></div>
    </div>
    <div class="charts">
      <div class="chart-box"><h3>${t('chart_city')}</h3><div class="cv"><canvas id="c1"></canvas></div></div>
      <div class="chart-box"><h3>${t('chart_status')}</h3><div class="cv"><canvas id="c2"></canvas></div></div>
      <div class="chart-box"><h3>${t('chart_rev')}</h3><div class="cv"><canvas id="c3"></canvas></div></div>
      <div class="chart-box"><h3>${t('chart_top')}</h3><div class="cv"><canvas id="c4"></canvas></div></div>
    </div>`;
    drawCharts(d);
  }

  else if (state.adminTab === 'nav_unis') {
    b.innerHTML = `<div class="admin-bar"><h3>${t('nav_unis')} (${d.unis.length})</h3><button class="btn" data-action="uni-add">${t('add_uni')}</button></div>
    <div class="table-wrap"><table class="table">
      <thead><tr><th></th><th>${t('name')}</th><th>${t('city')}</th><th>${t('type')}</th><th>${t('tuition')}</th><th>${t('service_price')}</th><th>${t('rating')}</th><th>${t('actions')}</th></tr></thead>
      <tbody>${d.unis.map(u => `<tr>
        <td>${Img(u)}</td><td><a class="link" href="#/uni/${u.id}">${esc(u.name)}</a><br><small class="muted">${esc(u.short)} · ${u.founded}</small></td>
        <td>${esc(u.city)}</td><td><span class="tag ${u.type === 'private' ? 'red' : ''}">${t(u.type)}</span></td>
        <td>${tuitionText(u)}</td><td>${money(u.price)}</td><td>⭐ ${avgRating(u).toFixed(1)}</td>
        <td><div class="row"><button class="btn btn-sm btn-outline" data-action="uni-edit" data-id="${u.id}">✏️</button><button class="btn btn-sm btn-danger" data-action="uni-del" data-id="${u.id}">🗑</button></div></td>
      </tr>`).join('')}</tbody></table></div>`;
    hydrateImages(b);
  }

  else if (state.adminTab === 'orders') {
    b.innerHTML = `<h3 style="margin-bottom:14px">${t('orders')} (${d.orders.length})</h3>
    <div class="table-wrap"><table class="table">
      <thead><tr><th>ID</th><th>${t('full_name')}</th><th>${t('nav_unis')}</th><th>${t('total')}</th><th>${t('payment')}</th><th>${t('date')}</th><th>${t('status')}</th><th></th></tr></thead>
      <tbody>${d.orders.map(o => `<tr><td><b>${o.id}</b></td><td>${esc(o.name)}<br><small class="muted">${esc(o.phone)}</small></td>
        <td>${o.items.map(i => esc(i.name)).join('<br>')}</td><td><b>${money(o.total)}</b></td><td>${esc(o.method)}</td><td>${fmtDate(o.date)}</td>
        <td><select class="order-status" data-id="${o.id}">${['pending', 'paid', 'done', 'cancel'].map(s => `<option value="${s}" ${o.status === s ? 'selected' : ''}>${t('st_' + s)}</option>`).join('')}</select></td>
        <td><button class="btn btn-sm btn-danger" data-action="order-del" data-id="${o.id}">🗑</button></td></tr>`).join('') || `<tr><td colspan="8">${t('no_data')}</td></tr>`}</tbody></table></div>`;
  }

  else if (state.adminTab === 'bookings') {
    b.innerHTML = `<h3 style="margin-bottom:14px">${t('bookings')} (${d.bookings.length})</h3>
    <div class="table-wrap"><table class="table">
      <thead><tr><th>${t('full_name')}</th><th>${t('university')}</th><th>${t('booking_type')}</th><th>${t('date')}</th><th>${t('note')}</th><th></th></tr></thead>
      <tbody>${d.bookings.map(x => `<tr><td>${esc(x.name)}<br><small class="muted">${esc(x.phone)}</small></td><td>${esc(x.uniName)}</td><td>${esc(x.type)}</td><td>${esc(x.date)} ${esc(x.time)}</td><td>${esc(x.note || '—')}</td>
        <td><button class="btn btn-sm btn-danger" data-action="booking-del" data-id="${x.id}">🗑</button></td></tr>`).join('') || `<tr><td colspan="6">${t('no_data')}</td></tr>`}</tbody></table></div>`;
  }

  else if (state.adminTab === 'users') {
    const me = Auth.user();
    b.innerHTML = `<h3 style="margin-bottom:14px">${t('users')} (${d.users.length})</h3>
    <div class="table-wrap"><table class="table">
      <thead><tr><th>${t('full_name')}</th><th>Email</th><th>Provider</th><th>${t('role')}</th><th></th></tr></thead>
      <tbody>${d.users.map(u => `<tr><td><div class="row"><div class="avatar" style="width:34px;height:34px;font-size:14px">${esc(u.name[0])}</div>${esc(u.name)}</div></td><td>${esc(u.email)}</td><td>${esc(u.provider || 'local')}</td>
        <td><select class="role-select" data-id="${u.id}" ${u.id === me.sub ? 'disabled' : ''}><option value="user" ${u.role === 'user' ? 'selected' : ''}>user</option><option value="admin" ${u.role === 'admin' ? 'selected' : ''}>admin</option></select></td>
        <td>${u.id === me.sub ? '' : `<button class="btn btn-sm btn-danger" data-action="user-del" data-id="${u.id}">🗑</button>`}</td></tr>`).join('')}</tbody></table></div>`;
  }

  else if (state.adminTab === 'settings') {
    const ok = v => v ? '<span class="tag">✓ ON</span>' : '<span class="tag gold">demo</span>';
    b.innerHTML = `<div class="profile-grid" style="padding:0">
      <div class="panel"><h3>🔌 ${t('integrations')}</h3><ul class="int-list">
        <li>Telegram Bot ${ok(CONFIG.TELEGRAM_BOT_TOKEN && CONFIG.TELEGRAM_CHAT_ID)}</li>
        <li>EmailJS ${ok(CONFIG.EMAILJS.serviceId)}</li>
        <li>Cloudinary ${ok(CONFIG.CLOUDINARY.cloudName)}</li>
        <li>Google OAuth ${ok(CONFIG.GOOGLE_CLIENT_ID)}</li>
        <li>Wikipedia API <span class="tag">✓ ON</span></li>
        <li>Open-Meteo API <span class="tag">✓ ON</span></li>
        <li>MyMemory Translate <span class="tag">✓ ON</span></li>
        <li>Realtime (BroadcastChannel) <span class="tag">${bus ? '✓ ON' : '—'}</span></li>
      </ul><p class="muted" style="margin-top:12px;font-size:13px">app.js → CONFIG</p></div>
      <div class="panel"><h3>🗄 Database</h3><p class="muted">localStorage · ita_db</p>
        <button class="btn btn-danger" data-action="reset-db">↺ ${t('reset_db')}</button></div>
    </div>`;
  }
}

function drawCharts(d) {
  if (!window.Chart) { $('#adminBody').insertAdjacentHTML('beforeend', '<p class="notice warn">Chart.js жүктөлгөн жок (интернетти текшериңиз)</p>'); return; }
  const css = getComputedStyle(document.documentElement);
  Chart.defaults.color = css.getPropertyValue('--muted').trim();
  Chart.defaults.borderColor = css.getPropertyValue('--border').trim();
  Chart.defaults.font.family = 'Inter, sans-serif';
  const opts = { responsive: true, maintainAspectRatio: false };
  const byCity = {}; d.unis.forEach(u => { byCity[u.city] = (byCity[u.city] || 0) + 1; });
  state.charts.push(new Chart($('#c1'), { type: 'bar', data: { labels: Object.keys(byCity), datasets: [{ label: t('nav_unis'), data: Object.values(byCity), backgroundColor: '#0f8a4b', borderRadius: 8 }] }, options: { ...opts, plugins: { legend: { display: false } }, scales: { y: { ticks: { stepSize: 1 } } } } }));
  const st = ['pending', 'paid', 'done', 'cancel'];
  state.charts.push(new Chart($('#c2'), { type: 'doughnut', data: { labels: st.map(s => t('st_' + s)), datasets: [{ data: st.map(s => d.orders.filter(o => o.status === s).length), backgroundColor: ['#f5b301', '#0f8a4b', '#2563eb', '#d62839'], borderWidth: 0 }] }, options: { ...opts, cutout: '62%' } }));
  const days = [...Array(7)].map((_, i) => { const x = new Date(); x.setDate(x.getDate() - 6 + i); return x.toISOString().slice(0, 10); });
  const rev = days.map(day => d.orders.filter(o => o.date.slice(0, 10) === day && o.status !== 'cancel').reduce((a, o) => a + o.total, 0));
  state.charts.push(new Chart($('#c3'), { type: 'line', data: { labels: days.map(x => x.slice(5)), datasets: [{ label: t('revenue') + ' €', data: rev, borderColor: '#d62839', backgroundColor: 'rgba(214,40,57,.15)', fill: true, tension: .35, pointRadius: 4 }] }, options: opts }));
  const top = [...d.unis].sort((a, b) => avgRating(b) - avgRating(a)).slice(0, 8);
  state.charts.push(new Chart($('#c4'), { type: 'bar', data: { labels: top.map(u => u.short), datasets: [{ label: t('rating'), data: top.map(u => +avgRating(u).toFixed(2)), backgroundColor: '#f5b301', borderRadius: 8 }] }, options: { ...opts, indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { min: 3.5, max: 5 } } } }));
}

function openUniForm(id) {
  const u = id ? db().unis.find(x => x.id === id) : { type: 'state', english: true, founded: 1900, students: 10000, tuitionMin: 150, tuitionMax: 3000, price: 250, lat: 41.9, lon: 12.5, programs: [] };
  openModal(`<h3>${id ? '✏️ ' + t('edit_uni') : t('add_uni')}</h3>
  <form class="form" id="uniForm">
    <div class="form-grid">
      <label class="field full"><span>${t('name')}</span><input name="name" required value="${esc(u.name)}"></label>
      <label class="field"><span>${t('short')}</span><input name="short" required value="${esc(u.short)}"></label>
      <label class="field"><span>${t('city')}</span><input name="city" required value="${esc(u.city)}"></label>
      <label class="field"><span>${t('region')}</span><input name="region" value="${esc(u.region)}"></label>
      <label class="field"><span>${t('founded')}</span><input name="founded" type="number" value="${u.founded}"></label>
      <label class="field"><span>${t('type')}</span><select name="type"><option value="state" ${u.type === 'state' ? 'selected' : ''}>${t('state')}</option><option value="private" ${u.type === 'private' ? 'selected' : ''}>${t('private')}</option></select></label>
      <label class="field"><span>${t('students')}</span><input name="students" type="number" value="${u.students}"></label>
      <label class="field"><span>QS</span><input name="qs" type="number" value="${u.qs || ''}"></label>
      <label class="field"><span>${t('tuition')} min €</span><input name="tuitionMin" type="number" value="${u.tuitionMin}"></label>
      <label class="field"><span>${t('tuition')} max €</span><input name="tuitionMax" type="number" value="${u.tuitionMax}"></label>
      <label class="field"><span>${t('service_price')} €</span><input name="price" type="number" required value="${u.price}"></label>
      <label class="field"><span>${t('deadline')}</span><input name="deadline" value="${esc(u.deadline)}"></label>
      <label class="field"><span>${t('exam')}</span><input name="exam" value="${esc(u.exam)}"></label>
      <label class="field"><span>Lat</span><input name="lat" type="number" step="any" value="${u.lat}"></label>
      <label class="field"><span>Lon</span><input name="lon" type="number" step="any" value="${u.lon}"></label>
      <label class="check full"><input type="checkbox" name="english" ${u.english ? 'checked' : ''}> ${t('eng_programs')}</label>
      <label class="field full"><span>${t('wiki_title')}</span><input name="wiki" value="${esc(u.wiki)}" placeholder="University_of_Bologna"></label>
      <label class="field full"><span>${t('upload_img')}</span><input type="file" accept="image/*" id="imgFile">
        <input type="hidden" name="image" value="${esc(u.image || '')}">
        <img id="imgPrev" class="img-preview" src="${esc(u.image || '')}" ${u.image ? '' : 'hidden'} alt=""></label>
      <label class="field full"><span>${t('description')}</span><textarea name="desc" required>${esc(u.desc)}</textarea></label>
      <label class="field full"><span>${t('scholarships')}</span><textarea name="scholar" style="min-height:70px">${esc(u.scholar)}</textarea></label>
      <label class="field full"><span>${t('programs')} — <small>${t('programs_hint')}</small></span><textarea name="programs">${esc((u.programs || []).map(p => p.join(' | ')).join('\n'))}</textarea></label>
    </div>
    <div class="row-end"><button type="button" class="btn btn-outline" data-action="modal-close">${t('cancel')}</button><button class="btn" id="uniSave">💾 ${t('save')}</button></div>
  </form>`);
  const form = $('#uniForm');
  $('#imgFile').onchange = async e => {
    const file = e.target.files[0]; if (!file) return;
    const btn = $('#uniSave'); btn.disabled = true; btn.textContent = t('uploading');
    try { const url = await uploadImage(file); form.image.value = url; $('#imgPrev').src = url; $('#imgPrev').hidden = false; }
    catch (err) { toast('❌ ' + esc(err.message), 'error'); }
    btn.disabled = false; btn.textContent = '💾 ' + t('save');
  };
  form.onsubmit = async e => {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(form));
    const data = {
      name: fd.name.trim(), short: fd.short.trim(), city: fd.city.trim(), region: fd.region.trim(), founded: +fd.founded, type: fd.type,
      students: +fd.students, qs: fd.qs ? +fd.qs : null, tuitionMin: +fd.tuitionMin, tuitionMax: +fd.tuitionMax, price: +fd.price,
      deadline: fd.deadline, exam: fd.exam, lat: +fd.lat, lon: +fd.lon, english: !!fd.english, wiki: fd.wiki.trim(), image: fd.image,
      desc: fd.desc.trim(), scholar: fd.scholar.trim(),
      programs: fd.programs.split('\n').map(l => l.split('|').map(s => s.trim())).filter(p => p[0]).map(p => [p[0], p[1] || 'Bachelor', p[2] || 'EN', +p[3] || 3]),
    };
    try {
      if (id) await API.updateUni(id, data); else await API.createUni(data);
      closeModal(); afterDbChange(); toast(t('saved'), 'success');
    } catch (err) { toast('❌ ' + esc(err.message), 'error'); }
  };
}
function afterDbChange() { state.loaded = false; emit('db', {}); renderAdminTab(); }

/* ---------- 13.11 Котормочу ---------- */
function TranslatorPage(app) {
  const L = [['ky', '🇰🇬 Кыргызча'], ['ru', '🇷🇺 Русский'], ['en', '🇬🇧 English'], ['it', '🇮🇹 Italiano']];
  const opt = sel => L.map(([v, n]) => `<option value="${v}" ${v === sel ? 'selected' : ''}>${n}</option>`).join('');
  app.innerHTML = PageHead('🌐 ' + t('tr_title'), t('tr_sub')) + `
  <div class="container translator">
    <div class="tr-box"><select id="trFrom">${opt('ky')}</select><textarea id="trIn" maxlength="500" placeholder="${t('tr_ph')}">Мен Италияда окугум келет</textarea></div>
    <div class="tr-mid"><button class="icon-btn lg" data-action="tr-swap" aria-label="swap">⇄</button><button class="btn" id="trBtn">${t('translate')}</button></div>
    <div class="tr-box"><select id="trTo">${opt('en')}</select><div class="tr-out" id="trOut"></div><button class="btn btn-outline btn-sm" data-action="tr-copy">📋 ${t('copy')}</button></div>
  </div>`;
  $('#trBtn').onclick = async () => {
    const text = $('#trIn').value.trim(); if (!text) return;
    const btn = $('#trBtn'); btn.disabled = true; $('#trOut').textContent = '⏳ ' + t('loading');
    try { $('#trOut').textContent = await API.translate(text, $('#trFrom').value, $('#trTo').value); }
    catch { $('#trOut').textContent = '❌ ' + t('error_title'); }
    btn.disabled = false;
  };
}

/* =========================================================
   14. CHATBOT
   ========================================================= */
function addMsg(who, html) {
  const box = $('#chatMsgs'); const div = document.createElement('div');
  div.className = 'msg ' + who; div.innerHTML = html; box.appendChild(div);
  box.scrollTop = box.scrollHeight; return div;
}
async function botReply(text) {
  const m = text.toLowerCase();
  const unis = await loadUnis();
  const found = unis.filter(u => [u.short, u.city, u.name.split(' ')[0]].some(k => k && m.includes(k.toLowerCase())));
  if (found.length) {
    return found.slice(0, 3).map(u => `🎓 <b>${esc(u.name)}</b> (${esc(u.city)}, ${u.founded})<br>💶 ${tuitionText(u)}${t('per_year')} · ⭐ ${avgRating(u).toFixed(1)}<br>📆 ${esc(u.deadline)} · <a href="#/uni/${u.id}">${t('details')} →</a>`).join('<hr style="border:0;border-top:1px solid var(--border);margin:8px 0">');
  }
  if (/стипенд|scholar|грант|dsu|бекер|акысыз|free/.test(m)) return '🎁 Италияда ар бир аймактын DSU стипендиясы бар (ER.GO, DiSCo, EDISU, DSU Toscana ж.б.). Үй-бүлөнүн кирешеси аз болсо: жылына €5000–€7500 акча, бекер жатакана жана тамак. Документтер: кирешени тастыктоочу справка (ISEE parificato). Толук окуу акысыз: <a href="#/uni/sns">Scuola Normale</a>.';
  if (/виза|visa|permesso/.test(m)) return '🛂 D-виза (окуу визасы) Италиянын Алматыдагы элчилиги же VFS аркылуу алынат. Керек: Universitaly катталуусу, кабыл алуу каты, банк эсеби (~€6000+), жатакана, камсыздандыруу. Италияга келгенден 8 күн ичинде Permesso di soggiorno алуу керек.';
  if (/документ|талап|кабыл|ielts|toefl|аттестат|document|requirement/.test(m)) return '📄 Негизги документтер:<br>• Аттестат + 1 жыл ЖОЖ (12 жыл шарты)<br>• IELTS 6.0+ же TOEFL<br>• Мотивациялык кат, CV<br>• Сунуш каттары<br>• Universitaly + CIMEA<br><a href="#/booking">📅 Документ текшерүүгө жазылуу</a>';
  if (/арзан|баа|акы|кымбат|price|cheap|стоим|цена|€/.test(m)) {
    const ch = [...unis].sort((a, b) => a.tuitionMin - b.tuitionMin).slice(0, 4);
    return '💶 Эң арзан университеттер:<br>' + ch.map(u => `• <a href="#/uni/${u.id}">${esc(u.name)}</a> — ${tuitionText(u)}`).join('<br>');
  }
  if (/медицин|medicine|imat|врач|дарыгер/.test(m)) return '🩺 Англисче медицина (IMAT сынагы аркылуу): ' + unis.filter(u => u.programs.some(p => /medicine/i.test(p[0]) && p[2] === 'EN')).map(u => `<a href="#/uni/${u.id}">${esc(u.short)}</a>`).join(', ');
  if (/инженер|engineer|it|программ|computer/.test(m)) return '💻 IT жана инженерия үчүн мыкты: <a href="#/uni/polimi">PoliMi</a>, <a href="#/uni/polito">PoliTo</a>, <a href="#/uni/unipi">UniPi</a>, <a href="#/uni/unitn">UniTn</a>.';
  if (/салам|привет|hello|hi|кандай/.test(m)) return '👋 Салам! Кайсы шаарда же кайсы багытта окугуңуз келет?';
  if (/рахмат|спасибо|thank/.test(m)) return '😊 Ар дайым кызматыңыздамын! Ийгилик!';
  return '🤔 Түшүнгөн жокмун. Мындай сураңыз: «Болонья», «Милан», «стипендия», «виза», «медицина», «эң арзан».<br>Же <a href="#/booking">консультацияга</a> жазылыңыз.';
}
async function sendChat(text) {
  text = (text || '').trim(); if (!text) return;
  addMsg('user', esc(text));
  const typing = addMsg('bot', '<span class="typing"><span></span><span></span><span></span></span>');
  await sleep(600 + Math.random() * 500);
  typing.innerHTML = await botReply(text);
  $('#chatMsgs').scrollTop = $('#chatMsgs').scrollHeight;
  const hist = ls.get('chat', []); hist.push(text); ls.set('chat', hist.slice(-20));
}
function toggleChat() {
  const c = $('#chat'); c.classList.toggle('open');
  if (c.classList.contains('open')) {
    if (!$('#chatMsgs').children.length) addMsg('bot', t('chat_hello'));
    setTimeout(() => $('#chatInput').focus(), 200);
  }
}

/* =========================================================
   15. TOAST / MODAL
   ========================================================= */
function toast(msg, type = 'info') {
  const el = document.createElement('div'); el.className = 'toast ' + type; el.innerHTML = msg;
  $('#toasts').appendChild(el);
  setTimeout(() => el.classList.add('hide'), 3200); setTimeout(() => el.remove(), 3600);
}
let _confirmResolve = null;
function openModal(html) { $('#modalBody').innerHTML = html; $('#modal').classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeModal() {
  $('#modal').classList.remove('open'); document.body.style.overflow = '';
  if (_confirmResolve) { _confirmResolve(false); _confirmResolve = null; }
}
function confirmModal(text) {
  return new Promise(res => {
    openModal(`<h3>⚠️ ${esc(text)}</h3><div class="row-end"><button class="btn btn-outline" data-action="modal-close">${t('cancel')}</button><button class="btn btn-danger" id="confirmYes">${t('delete')}</button></div>`);
    _confirmResolve = res;
    $('#confirmYes').onclick = () => { _confirmResolve = null; res(true); closeModal(); };
  });
}

/* =========================================================
   16. ROUTER (Private + Role-based routes)
   ========================================================= */
const routes = [
  { path: /^\/$/, view: HomePage },
  { path: /^\/universities$/, view: UniversitiesPage },
  { path: /^\/uni\/([\w-]+)$/, view: DetailPage },
  { path: /^\/cart$/, view: CartPage },
  { path: /^\/checkout$/, view: CheckoutPage, auth: true },
  { path: /^\/favorites$/, view: FavoritesPage },
  { path: /^\/booking(?:\/([\w-]+))?$/, view: BookingPage, auth: true },
  { path: /^\/login$/, view: LoginPage },
  { path: /^\/register$/, view: RegisterPage },
  { path: /^\/profile$/, view: ProfilePage, auth: true },
  { path: /^\/admin$/, view: AdminPage, auth: true, role: 'admin' },
  { path: /^\/translator$/, view: TranslatorPage },
];
function currentPath() { return (location.hash.replace(/^#/, '').split('?')[0]) || '/'; }

let _lastPath = null;
async function router() {
  const path = currentPath();
  const app = $('#app');
  state.renderId++;
  closeMenu();
  $$('.nav a[data-nav]').forEach(a => a.classList.toggle('active', a.dataset.nav === '/' ? path === '/' : path.startsWith(a.dataset.nav)));
  if (path !== _lastPath) { window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' }); _lastPath = path; }

  const r = routes.find(x => x.path.test(path));
  if (!r) { app.innerHTML = NotFound(); return; }
  if (r.auth && !Auth.user()) {
    ls.set('redirect', '#' + path); toast(t('login_required'), 'warn');
    location.hash = '#/login'; return;
  }
  if (r.role && Auth.user()?.role !== r.role) { app.innerHTML = Forbidden(); return; }
  const params = path.match(r.path).slice(1);
  try { await r.view(app, ...params); }
  catch (e) { console.error(e); app.innerHTML = ErrorBoundary(e); }
}
async function loadUnis(force = false) {
  if (state.loaded && !force) return state.unis;
  state.unis = await API.getUnis(); state.loaded = true;
  return state.unis;
}

/* =========================================================
   17. ТЕМА / ТИЛ / HEADER
   ========================================================= */
function setTheme(th) {
  state.theme = th; ls.set('theme', th);
  document.documentElement.dataset.theme = th;
  $('#themeBtn').textContent = th === 'dark' ? '☀️' : '🌙';
  if (currentPath() === '/admin' && state.adminTab === 'dashboard') renderAdminTab();
}
function applyI18n() {
  document.documentElement.lang = state.lang === 'ky' ? 'ky' : state.lang;
  $$('[data-i18n]').forEach(e => { e.textContent = t(e.dataset.i18n); });
  $$('[data-i18n-ph]').forEach(e => { e.placeholder = t(e.dataset.i18nPh); });
}
function setLang(l) { state.lang = l; ls.set('lang', l); applyI18n(); renderAuthArea(); router(); }
function renderAuthArea() {
  const u = Auth.user(); const el = $('#authArea'); if (!el) return;
  el.innerHTML = u
    ? `<div class="user-menu"><button class="avatar-btn" data-action="user-menu" aria-label="${t('profile')}">${esc(u.name[0]).toUpperCase()}</button>
        <div class="dropdown" id="userDrop">
          <div class="dd-head"><b>${esc(u.name)}</b><small>${esc(u.email)}</small></div>
          <a href="#/profile">👤 ${t('profile')}</a>
          ${u.role === 'admin' ? `<a href="#/admin">⚙️ ${t('admin_title')}</a>` : ''}
          <a href="#/booking">📅 ${t('nav_booking')}</a>
          <button data-action="logout">🚪 ${t('logout')}</button>
        </div></div>`
    : `<a href="#/login" class="btn btn-sm">${t('login')}</a>`;
  $$('[data-admin-only]').forEach(e => { e.hidden = !(u && u.role === 'admin'); });
  $$('.nav-foot').forEach(e => { e.hidden = !!u; });
}
function closeMenu() { document.body.classList.remove('menu-open'); }

/* =========================================================
   18. ОКУЯЛАР (Event delegation)
   ========================================================= */
document.addEventListener('click', async e => {
  if (!e.target.closest('.user-menu')) $('#userDrop')?.classList.remove('open');
  const el = e.target.closest('[data-action]'); if (!el) return;
  const { action, id } = el.dataset;
  switch (action) {
    case 'theme': setTheme(state.theme === 'dark' ? 'light' : 'dark'); break;
    case 'burger': document.body.classList.toggle('menu-open'); break;
    case 'burger-close': closeMenu(); break;
    case 'cart': e.preventDefault(); if (inCart(id)) location.hash = '#/cart'; else addToCart(id); break;
    case 'fav': e.preventDefault(); toggleFav(id); break;
    case 'qty': changeQty(id, +el.dataset.d); break;
    case 'remove': removeFromCart(id); break;
    case 'page': state.filters.page = +el.dataset.page; renderList(); $('.results')?.scrollIntoView({ behavior: 'smooth' }); break;
    case 'ftype': state.filters.type = el.dataset.v; state.filters.page = 1; $$('[data-action="ftype"]').forEach(b => b.classList.toggle('on', b === el)); renderList(); break;
    case 'freset': state.filters = { ...DEFAULT_FILTERS }; router(); break;
    case 'toggle-filters': $('#filters')?.classList.toggle('open'); break;
    case 'city-go': state.filters = { ...DEFAULT_FILTERS, city: el.dataset.city }; location.hash = '#/universities'; break;
    case 'scroll': $('#' + el.dataset.target)?.scrollIntoView({ behavior: 'smooth' }); break;
    case 'gthumb': $('#gMain').src = el.dataset.src; $$('.g-th').forEach(b => b.classList.toggle('on', b === el)); break;
    case 'share': {
      const url = location.href;
      if (navigator.share) { try { await navigator.share({ title: document.title, url }); } catch { /* */ } }
      else { try { await navigator.clipboard.writeText(url); toast(t('link_copied'), 'success'); } catch { /* */ } }
      break;
    }
    case 'logout': Auth.logout(); break;
    case 'user-menu': $('#userDrop')?.classList.toggle('open'); break;
    case 'oauth': oauthLogin(el.dataset.provider); break;
    case 'del-review': {
      if (!(await confirmModal(t('confirm_delete')))) break;
      const d = db(); d.reviews[el.dataset.uni] = (d.reviews[el.dataset.uni] || []).filter(r => r.id !== id); saveDb(d);
      emit('review', { uniId: el.dataset.uni }); refreshReviews(el.dataset.uni); toast(t('deleted')); break;
    }
    case 'admin-tab': state.adminTab = el.dataset.tab; renderAdminTab(); break;
    case 'uni-add': openUniForm(); break;
    case 'uni-edit': openUniForm(id); break;
    case 'uni-del':
      if (await confirmModal(t('confirm_delete'))) { await API.deleteUni(id); state.cart = state.cart.filter(i => i.id !== id); persistCart(); afterDbChange(); toast(t('deleted')); }
      break;
    case 'order-del':
      if (await confirmModal(t('confirm_delete'))) { const d = db(); d.orders = d.orders.filter(o => o.id !== id); saveDb(d); afterDbChange(); toast(t('deleted')); }
      break;
    case 'booking-del':
      if (await confirmModal(t('confirm_delete'))) { const d = db(); d.bookings = d.bookings.filter(o => o.id !== id); saveDb(d); afterDbChange(); toast(t('deleted')); }
      break;
    case 'user-del':
      if (await confirmModal(t('confirm_delete'))) { const d = db(); d.users = d.users.filter(o => o.id !== id); saveDb(d); afterDbChange(); toast(t('deleted')); }
      break;
    case 'reset-db':
      if (await confirmModal(t('reset_db') + '?')) { ls.del('ita_db'); _db = null; db(); afterDbChange(); toast(t('reset_done'), 'success'); }
      break;
    case 'chat': toggleChat(); break;
    case 'chat-q': sendChat(el.dataset.q); break;
    case 'modal-close': closeModal(); break;
    case 'retry': router(); break;
    case 'tr-swap': { const a = $('#trFrom'), b = $('#trTo'); [a.value, b.value] = [b.value, a.value]; const o = $('#trOut').textContent; if (o && !o.startsWith('⏳') && !o.startsWith('❌')) { $('#trIn').value = o; $('#trOut').textContent = ''; } break; }
    case 'tr-copy': try { await navigator.clipboard.writeText($('#trOut').textContent); toast(t('copied'), 'success'); } catch { /* */ } break;
  }
});

document.addEventListener('change', e => {
  const el = e.target;
  if (el.id === 'langSelect') setLang(el.value);
  if (el.matches('.order-status')) { const d = db(); const o = d.orders.find(x => x.id === el.dataset.id); if (o) { o.status = el.value; saveDb(d); emit('db', {}); toast(t('saved'), 'success'); renderAdminTab(); } }
  if (el.matches('.role-select')) { const d = db(); const u = d.users.find(x => x.id === el.dataset.id); if (u) { u.role = el.value; saveDb(d); toast(t('saved'), 'success'); } }
});

// Сүрөт жүктөлбөсө — fallback (gradient)
document.addEventListener('error', e => {
  const img = e.target;
  if (img && img.tagName === 'IMG' && img.dataset.fallback && img.src !== img.dataset.fallback) img.src = img.dataset.fallback;
}, true);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal(); closeMenu(); $('#chat').classList.remove('open'); $('#filters')?.classList.remove('open'); }
});
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });
$('#chatForm').addEventListener('submit', e => { e.preventDefault(); const v = $('#chatInput').value; $('#chatInput').value = ''; sendChat(v); });

// Глобалдык Error boundary
window.addEventListener('error', e => { if (e.message) console.error('Global error:', e.message); });
window.addEventListener('unhandledrejection', e => { console.error('Unhandled:', e.reason); toast('⚠️ ' + t('error_title'), 'error'); });

/* =========================================================
   19. INIT
   ========================================================= */
function init() {
  db();
  setTheme(state.theme);
  $('#langSelect').value = state.lang;
  $('#year').textContent = new Date().getFullYear();
  applyI18n();
  renderAuthArea();
  updateBadges();
  window.addEventListener('hashchange', router);
  router();
  // JWT мөөнөтүн текшерүү (ар мүнөт)
  setInterval(() => { if (state.token && !verifyJWT(state.token)) { state.token = null; ls.del('token'); renderAuthArea(); toast(t('session_end'), 'warn'); } }, 60000);
}
init();
