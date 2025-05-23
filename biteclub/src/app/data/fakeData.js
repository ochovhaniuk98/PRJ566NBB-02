export const fakeRestaurantData = {
  name: 'The Pomegranate Restaurant',
  cuisines: ['Persian', 'Middle Eastern'],
  rating: 4.6,
  numReviews: 1234,
  priceRange: '10–20',
  dietaryOptions: ['Vegetarian', 'Vegan', 'Gluten-Free'],
  location: '420 College St, Toronto, ON M5T 1T3',

  businessHours: [
    { day: 'Sunday', opening: '17:00', closing: '21:00' },
    { day: 'Monday', opening: null, closing: null },
    { day: 'Tuesday', opening: '17:00', closing: '21:00' },
    { day: 'Wednesday', opening: '17:00', closing: '21:00' },
    { day: 'Thursday', opening: '17:00', closing: '21:00' },
    { day: 'Friday', opening: '16:00', closing: '22:00' },
    { day: 'Saturday', opening: '16:00', closing: '22:00' },
  ],

  bannerImages: [
    {
      url: '/img/placeholderImg.jpg',
      caption: 'Warm dining room with Persian decor',
      updated_at: new Date('2024-10-01'),
    },
    {
      url: '/img/placeholderImg.jpg',
      caption: 'Warm dining room with Persian decor',
      updated_at: new Date('2024-10-01'),
    },
    {
      url: '/img/placeholderImg.jpg',
      caption: 'Warm dining room with Persian decor',
      updated_at: new Date('2024-10-01'),
    },
    {
      url: '/img/placeholderImg.jpg',
      caption: 'Warm dining room with Persian decor',
      updated_at: new Date('2024-10-01'),
    },
  ],

  images: [
    {
      url: '/img/placeholderImg.jpg',
      caption: 'Interior with ambient lighting',
      updated_at: new Date('2024-10-01'),
    },
    {
      url: '/img/placeholderImg.jpg',
      caption: 'Grilled kebabs with saffron rice',
      updated_at: new Date('2024-10-02'),
    },
    {
      url: '/img/placeholderImg.jpg',
      caption: 'Fresh herbs and flatbread appetizer',
      updated_at: new Date('2024-10-03'),
    },
  ],
};

export const fakeReviews = [
  {
    title: 'A Memorable Dining Experience',
    body: 'The food was exceptional, especially the saffron rice and lamb stew. The ambiance felt like a journey through Persian culture.',
    rating: 5,
    date_posted: new Date('2024-11-01'),
    comments: [
      {
        body: 'Totally agree! Their kebabs are amazing.',
        date_posted: new Date('2024-11-02'),
        user_id: 'user123',
      },
    ],
    photos: [
      {
        url: '/img/placeholderImg.jpg',
        caption: 'Beautifully plated lamb stew',
        updated_at: new Date('2024-11-01'),
      },
    ],
    likes: {
      count: 12,
      users: ['user123', 'user456', 'user789'],
    },
    dislikes: {
      count: 1,
      users: ['user000'],
    },
    user_id: 'user123',
    restaurant_id: 'restaurant456',
  },
  {
    title: 'Good but Overpriced',
    body: 'I loved the ambiance, but the portion sizes were small for the price. Service was friendly though.',
    rating: 3,
    date_posted: new Date('2024-11-05'),
    comments: [],
    photos: [
      {
        url: '/img/placeholderImg.jpg',
        caption: 'Starter platter',
        updated_at: new Date('2024-11-05'),
      },
      {
        url: '/img/placeholderImg.jpg',
        caption: 'Fresh bread',
        updated_at: new Date('2024-11-05'),
      },
    ],
    likes: {
      count: 4,
      users: ['user234'],
    },
    dislikes: {
      count: 2,
      users: ['user777', 'user888'],
    },
    user_id: 'user234',
    restaurant_id: 'restaurant456',
  },
  {
    title: 'Hidden Gem!',
    body: 'I had never tried Persian food before and this place was the perfect intro. Warm service and flavor-packed dishes.',
    rating: 4,
    date_posted: new Date('2024-11-10'),
    comments: [
      {
        body: 'Welcome to the Persian food fan club! 😄',
        date_posted: new Date('2024-11-11'),
        user_id: 'user456',
      },
    ],
    photos: [],
    likes: {
      count: 8,
      users: ['user111', 'user222'],
    },
    dislikes: {
      count: 0,
      users: [],
    },
    user_id: 'user345',
    restaurant_id: 'restaurant456',
  },
  {
    title: 'A Memorable Dining Experience',
    body: 'The food was exceptional, especially the saffron rice and lamb stew. The ambiance felt like a journey through Persian culture.',
    rating: 5,
    date_posted: new Date('2024-11-01'),
    comments: [
      {
        body: 'Totally agree! Their kebabs are amazing.',
        date_posted: new Date('2024-11-02'),
        user_id: 'user123',
      },
    ],
    photos: [
      {
        url: '/img/placeholderImg.jpg',
        caption: 'Beautifully plated lamb stew',
        updated_at: new Date('2024-11-01'),
      },
    ],
    likes: {
      count: 12,
      users: ['user123', 'user456', 'user789'],
    },
    dislikes: {
      count: 1,
      users: ['user000'],
    },
    user_id: 'user123',
    restaurant_id: 'restaurant456',
  },
  {
    title: 'A Memorable Dining Experience',
    body: 'The food was exceptional, especially the saffron rice and lamb stew. The ambiance felt like a journey through Persian culture.',
    rating: 5,
    date_posted: new Date('2024-11-01'),
    comments: [
      {
        body: 'Totally agree! Their kebabs are amazing.',
        date_posted: new Date('2024-11-02'),
        user_id: 'user123',
      },
    ],
    photos: [
      {
        url: '/img/placeholderImg.jpg',
        caption: 'Beautifully plated lamb stew',
        updated_at: new Date('2024-11-01'),
      },
    ],
    likes: {
      count: 12,
      users: ['user123', 'user456', 'user789'],
    },
    dislikes: {
      count: 1,
      users: ['user000'],
    },
    user_id: 'user123',
    restaurant_id: 'restaurant456',
  },
  {
    title: 'Hidden Gem!',
    body: 'I had never tried Persian food before and this place was the perfect intro. Warm service and flavor-packed dishes.',
    rating: 4,
    date_posted: new Date('2024-11-10'),
    comments: [
      {
        body: 'Welcome to the Persian food fan club! 😄',
        date_posted: new Date('2024-11-11'),
        user_id: 'user456',
      },
    ],
    photos: [],
    likes: {
      count: 8,
      users: ['user111', 'user222'],
    },
    dislikes: {
      count: 0,
      users: [],
    },
    user_id: 'user345',
    restaurant_id: 'restaurant456',
  },
  {
    title: 'Hidden Gem!',
    body: 'I had never tried Persian food before and this place was the perfect intro. Warm service and flavor-packed dishes.',
    rating: 4,
    date_posted: new Date('2024-11-10'),
    comments: [
      {
        body: 'Welcome to the Persian food fan club! 😄',
        date_posted: new Date('2024-11-11'),
        user_id: 'user456',
      },
    ],
    photos: [],
    likes: {
      count: 8,
      users: ['user111', 'user222'],
    },
    dislikes: {
      count: 0,
      users: [],
    },
    user_id: 'user345',
    restaurant_id: 'restaurant456',
  },
  {
    title: 'Hidden Gem!',
    body: 'I had never tried Persian food before and this place was the perfect intro. Warm service and flavor-packed dishes.',
    rating: 4,
    date_posted: new Date('2024-11-10'),
    comments: [
      {
        body: 'Welcome to the Persian food fan club! 😄',
        date_posted: new Date('2024-11-11'),
        user_id: 'user456',
      },
    ],
    photos: [],
    likes: {
      count: 8,
      users: ['user111', 'user222'],
    },
    dislikes: {
      count: 0,
      users: [],
    },
    user_id: 'user345',
    restaurant_id: 'restaurant456',
  },
  {
    title: 'Hidden Gem!',
    body: 'I had never tried Persian food before and this place was the perfect intro. Warm service and flavor-packed dishes.',
    rating: 4,
    date_posted: new Date('2024-11-10'),
    comments: [
      {
        body: 'Welcome to the Persian food fan club! 😄',
        date_posted: new Date('2024-11-11'),
        user_id: 'user456',
      },
    ],
    photos: [],
    likes: {
      count: 8,
      users: ['user111', 'user222'],
    },
    dislikes: {
      count: 0,
      users: [],
    },
    user_id: 'user345',
    restaurant_id: 'restaurant456',
  },
  {
    title: 'Hidden Gem!',
    body: 'I had never tried Persian food before and this place was the perfect intro. Warm service and flavor-packed dishes.',
    rating: 4,
    date_posted: new Date('2024-11-10'),
    comments: [
      {
        body: 'Welcome to the Persian food fan club! 😄',
        date_posted: new Date('2024-11-11'),
        user_id: 'user456',
      },
    ],
    photos: [],
    likes: {
      count: 8,
      users: ['user111', 'user222'],
    },
    dislikes: {
      count: 0,
      users: [],
    },
    user_id: 'user345',
    restaurant_id: 'restaurant456',
  },
  {
    title: 'A Memorable Dining Experience',
    body: 'The food was exceptional, especially the saffron rice and lamb stew. The ambiance felt like a journey through Persian culture.',
    rating: 5,
    date_posted: new Date('2024-11-01'),
    comments: [
      {
        body: 'Totally agree! Their kebabs are amazing.',
        date_posted: new Date('2024-11-02'),
        user_id: 'user123',
      },
    ],
    photos: [
      {
        url: '/img/placeholderImg.jpg',
        caption: 'Beautifully plated lamb stew',
        updated_at: new Date('2024-11-01'),
      },
    ],
    likes: {
      count: 12,
      users: ['user123', 'user456', 'user789'],
    },
    dislikes: {
      count: 1,
      users: ['user000'],
    },
    user_id: 'user123',
    restaurant_id: 'restaurant456',
  },
  {
    title: 'A Memorable Dining Experience',
    body: 'The food was exceptional, especially the saffron rice and lamb stew. The ambiance felt like a journey through Persian culture.',
    rating: 5,
    date_posted: new Date('2024-11-01'),
    comments: [
      {
        body: 'Totally agree! Their kebabs are amazing.',
        date_posted: new Date('2024-11-02'),
        user_id: 'user123',
      },
    ],
    photos: [
      {
        url: '/img/placeholderImg.jpg',
        caption: 'Beautifully plated lamb stew',
        updated_at: new Date('2024-11-01'),
      },
    ],
    likes: {
      count: 12,
      users: ['user123', 'user456', 'user789'],
    },
    dislikes: {
      count: 1,
      users: ['user000'],
    },
    user_id: 'user123',
    restaurant_id: 'restaurant456',
  },
  {
    title: 'A Memorable Dining Experience',
    body: 'The food was exceptional, especially the saffron rice and lamb stew. The ambiance felt like a journey through Persian culture.',
    rating: 5,
    date_posted: new Date('2024-11-01'),
    comments: [
      {
        body: 'Totally agree! Their kebabs are amazing.',
        date_posted: new Date('2024-11-02'),
        user_id: 'user123',
      },
    ],
    photos: [
      {
        url: '/img/placeholderImg.jpg',
        caption: 'Beautifully plated lamb stew',
        updated_at: new Date('2024-11-01'),
      },
    ],
    likes: {
      count: 12,
      users: ['user123', 'user456', 'user789'],
    },
    dislikes: {
      count: 1,
      users: ['user000'],
    },
    user_id: 'user123',
    restaurant_id: 'restaurant456',
  },
  {
    title: 'A Memorable Dining Experience',
    body: 'The food was exceptional, especially the saffron rice and lamb stew. The ambiance felt like a journey through Persian culture.',
    rating: 5,
    date_posted: new Date('2024-11-01'),
    comments: [
      {
        body: 'Totally agree! Their kebabs are amazing.',
        date_posted: new Date('2024-11-02'),
        user_id: 'user123',
      },
    ],
    photos: [
      {
        url: '/img/placeholderImg.jpg',
        caption: 'Beautifully plated lamb stew',
        updated_at: new Date('2024-11-01'),
      },
    ],
    likes: {
      count: 12,
      users: ['user123', 'user456', 'user789'],
    },
    dislikes: {
      count: 1,
      users: ['user000'],
    },
    user_id: 'user123',
    restaurant_id: 'restaurant456',
  },
];

export const embedList = [
  { embedLink: 'https://www.instagram.com/p/DCZlEDqy2to/' },
  { embedLink: 'https://www.instagram.com/p/DCZlEDqy2to/' },
  { embedLink: 'https://www.instagram.com/p/DCZlEDqy2to/' },
  { embedLink: 'https://www.instagram.com/p/DCZlEDqy2to/' },
  { embedLink: 'https://www.instagram.com/p/DCZlEDqy2to/' },
  { embedLink: 'https://www.instagram.com/p/DCZlEDqy2to/' },
  { embedLink: 'https://www.instagram.com/p/DCZlEDqy2to/' },
];

/*
export const bannerImages = [
  '/img/placeholderImg.jpg',
  '/img/placeholderImg.jpg',
  '/img/placeholderImg.jpg',
  '/img/placeholderImg.jpg',
];

export const photosList = [
  '/img/placeholderImg.jpg',
  '/img/placeholderImg.jpg',
  '/img/placeholderImg.jpg',
  '/img/placeholderImg.jpg',
  '/img/placeholderImg.jpg',
  '/img/placeholderImg.jpg',
  '/img/placeholderImg.jpg',
  '/img/placeholderImg.jpg',
  '/img/placeholderImg.jpg',
  '/img/placeholderImg.jpg',
  '/img/placeholderImg.jpg',
  '/img/placeholderImg.jpg',
  '/img/placeholderImg.jpg',
  '/img/placeholderImg.jpg',
  '/img/placeholderImg.jpg',
  '/img/placeholderImg.jpg',
  '/img/placeholderImg.jpg',
];

export const reviewList = [
  { id: 1, imageSrc: bannerImages },
  { id: 2, imageSrc: bannerImages },
  { id: 3 },
  { id: 4, imageSrc: bannerImages },
  { id: 5 },
  { id: 6, imageSrc: bannerImages },
  { id: 7, imageSrc: bannerImages },
  { id: 8, imageSrc: bannerImages },
  { id: 9 },
  { id: 10 },
  { id: 11, imageSrc: bannerImages },
];
*/
