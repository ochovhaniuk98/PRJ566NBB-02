export const fakeRestaurantData = {
  name: 'The Pomegranate Restaurant',
  cuisines: ['Persian', 'Middle Eastern'],
  rating: 4.6,
  numReviews: 1234,
  priceRange: '$',
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

export const fakeUser = {
  _id: '664abc1234567890fedcba98',
  supabaseId: 'abc-xyz-123',
  username: 'sarah_foodie',
  userBio: 'Always on the hunt for unique eats.',
  userProfilePicture: {
    url: '/img/placeholderImg.jpg',
    alt: 'Sarah profile picture',
  },
  userType: 'user',
  joinedSince: new Date('2025-08-15'),
  numChallengesCompleted: 8,
};

export const fakeComment = {
  _id: '6650abc1234567890fedcba9',
  body: 'This restaurant had amazing Laotian dishes. Highly recommend!',
  author: [fakeUser],
  date_posted: new Date('2025-06-20T15:32:00Z'),
  likes: {
    count: 2,
    users: [{ _id: 'userA_id' }, { _id: 'userB_id' }],
  },
  dislikes: {
    count: 1,
    users: [{ _id: 'userC_id' }],
  },
};

export const fakeBlogPost = {
  title: 'A Rainy Day Café Hunt',
  body: "I wandered into this small café during a storm and discovered the best chai latte I've ever had. Cozy vibes, vintage décor, and friendly staff — what a gem!",
  date_posted: new Date('2025-05-30T16:45:00Z'),
  likes: {
    count: 3,
    users: [
      '6650aeef5f0dcd889f6a1234', // User ObjectId
      '6650aeef5f0dcd889f6a5678',
      '6650aeef5f0dcd889f6a9876',
    ],
  },
  dislikes: {
    count: 0,
    users: [],
  },
  comments: [
    {
      body: "This sounds like a place I'd love! Do they have good pastries too?",
      author: ['6650aeef5f0dcd889f6a1234'], // User ObjectId
      date_posted: new Date('2025-05-31T09:00:00Z'),
      likes: {
        count: 2,
        users: ['6650aeef5f0dcd889f6a5678', '6650aeef5f0dcd889f6a9876'],
      },
      dislikes: {
        count: 0,
        users: [],
      },
    },
    {
      body: "I've been there! That chai is amazing. Great review :)",
      author: ['6650aeef5f0dcd889f6a5678'],
      date_posted: new Date('2025-05-31T10:22:00Z'),
      likes: {
        count: 1,
        users: ['6650aeef5f0dcd889f6a1234'],
      },
      dislikes: {
        count: 0,
        users: [],
      },
    },
  ],
  photos: [
    {
      url: '/img/placeholderImg.jpg',
      caption: 'Espresso served with a cookie on the side.',
      updated_at: new Date('2025-05-30T14:05:00Z'),
    },
  ],
  previewText:
    "I wandered into this small café during a storm and discovered the best chai latte I've ever had. Cozy vibes, vintage décor, and friendly staff — what a gem!",
  previewImage: '/img/placeholderImg.jpg',
  previewTitle: 'A Rainy Day Café Hunt',
};

///////////////////////////// FAKE DATA FOR CHALLENGES ///////////////////////////////////////////

// FAKE RESTAURANTS
export const fakeRestaurants = [
  {
    _id: 'r1',
    name: 'The Pomegranate Restaurant',
    location: '420 College St, Toronto, ON M5T 1T3',
  },
  {
    _id: 'r2',
    name: 'Pai',
    location: '18 Duncan St, Toronto, ON M5H 3G8',
  },
  {
    _id: 'r3',
    name: 'Gusto101',
    location: '12345 Another Address St. Totonto M32 1L6',
  },
  {
    _id: 'r4',
    name: 'The  Vegan Hub',
    location: '18 Duncan St, Toronto, ON M5H 3G8',
  },
  {
    _id: 'r5',
    name: 'The Pomegranate Restaurant',
    location: '420 College St, Toronto, ON M5T 1T3',
  },
];

// FAKE CHALLENGES
export const fakeChallenges = [
  {
    _id: 'abc',
    title: 'Around the World in 80 Days',
    description: 'See the world in Toronto! Try a cuisine from 5 different continents.',
    numberOfPoints: 300,
    thumbnailImage: '/img/placeholderImg.jpg',
    restaurants: ['r1', 'r2', 'r3', 'r4', 'r5'],
    duration: 80,
  },
  {
    _id: 'def',
    title: 'The Great Vegan Voyage',
    description: 'Greens, greens, eat your greens! Save the planet with your diet.',
    numberOfPoints: 500,
    thumbnailImage: '/img/placeholderImg.jpg',
    restaurants: ['r3', 'r5', 'r1'],
    duration: 30,
  },
  {
    _id: 'xyz',
    title: 'Shiapao Pow Showdown',
    description: 'Try different steamed buns from Toronto.',
    numberOfPoints: 200,
    thumbnailImage: '/img/placeholderImg.jpg',
    restaurants: ['r2', 'r4', 'r5'],
    duration: 3,
  },
  {
    _id: 'lmn',
    title: 'Taco Taco Taco',
    description: 'Eat tacos from 5 spots in the city.',
    numberOfPoints: 450,
    thumbnailImage: '/img/placeholderImg.jpg',
    restaurants: ['r1', 'r2', 'r3', 'r4', 'r5'],
    duration: 30,
  },
];

// FAKE ACTIVATED CHALLENGE DETAIL
export const fakeActivatedChallengeDetail = {
  _id: 'activation1',
  userId: '664abc1234567890fedcba98',
  challengeId: 'abc',
  challengeSteps: [
    {
      restaurantId: 'r1',
      verificationStatus: false,
    },
    {
      restaurantId: 'r2',
      verificationStatus: true,
    },
    {
      restaurantId: 'r3',
      verificationStatus: false,
    },
    {
      restaurantId: 'r4',
      verificationStatus: true,
    },
    {
      restaurantId: 'r5',
      verificationStatus: false,
    },
  ],
  completionStatus: 'in-progress', // or 'completed' or 'dropped'
  startDate: new Date('2025-07-01T00:00:00Z'),
  endDate: new Date('2025-08-15T00:00:00Z'),
};
