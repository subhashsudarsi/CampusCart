const SAMPLE_USERS = [
  { name: 'Admin User', email: 'admin@campuscart.com', role: 'admin' },
  { name: 'Raj Kumar', email: 'raj@student.com', role: 'student' },
  { name: 'Priya Sharma', email: 'priya@student.com', role: 'student' },
  { name: 'Arjun Singh', email: 'arjun@student.com', role: 'student' },
];

const SAMPLE_PRODUCTS = [
  {
    title: 'MacBook Pro 2021',
    price: 35000,
    description: 'Excellent condition, barely used',
    sellerEmail: 'admin@campuscart.com',
    location: 'Delhi',
    category: 'electronics',
  },
  {
    title: 'Physics Textbook',
    price: 300,
    description: 'NCERT Physics for JEE preparation',
    sellerEmail: 'raj@student.com',
    location: 'Mumbai',
    category: 'books',
  },
  {
    title: 'Mountain Bike',
    price: 8000,
    description: 'Trek mountain bike with accessories, good condition',
    sellerEmail: 'priya@student.com',
    location: 'Bangalore',
    category: 'sports',
  },
  {
    title: 'Headphones - Sony WH1000',
    price: 5500,
    description: 'Noise-cancelling, wireless, original box included',
    sellerEmail: 'admin@campuscart.com',
    location: 'Hyderabad',
    category: 'electronics',
  },
  {
    title: 'Study Desk - Wooden',
    price: 2000,
    description: 'Spacious wooden desk, perfect for study',
    sellerEmail: 'raj@student.com',
    location: 'Pune',
    category: 'furniture',
  },
  {
    title: 'Guitar - Acoustic',
    price: 6000,
    description: 'Yamaha acoustic guitar, perfect condition',
    sellerEmail: 'priya@student.com',
    location: 'Chennai',
    category: 'music',
  },
];

const SAMPLE_CONVERSATIONS = [
  {
    participantEmails: ['raj@student.com', 'priya@student.com'],
    productTitle: 'Physics Textbook',
    messages: [
      {
        senderEmail: 'raj@student.com',
        text: 'Hi Priya, is the Physics textbook still available?',
      },
      {
        senderEmail: 'priya@student.com',
        text: 'Yes, it is available. Are you interested?',
      },
      {
        senderEmail: 'raj@student.com',
        text: 'Yes, can we meet tomorrow near the library?',
      },
    ],
  },
  {
    participantEmails: ['arjun@student.com', 'raj@student.com'],
    productTitle: 'Study Desk - Wooden',
    messages: [
      {
        senderEmail: 'arjun@student.com',
        text: 'Hey Raj, can you share the desk dimensions?',
      },
      {
        senderEmail: 'raj@student.com',
        text: 'Sure, around 4ft x 2ft. Good for a study setup.',
      },
    ],
  },
];

module.exports = {
  SAMPLE_USERS,
  SAMPLE_PRODUCTS,
  SAMPLE_CONVERSATIONS,
};
