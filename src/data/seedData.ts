import { City, Movie, Theater, Show, Format, SeatTier, ScreenConfig, ScreenLayout, FnbItem } from '../types';

export const CITIES: City[] = [
  {
    id: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    lat: 13.0827,
    lng: 80.2707,
    theatersCount: 5,
  },
  {
    id: 'bangalore',
    name: 'Bangalore',
    state: 'Karnataka',
    lat: 12.9716,
    lng: 77.5946,
    theatersCount: 5,
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    lat: 19.0760,
    lng: 72.8777,
    theatersCount: 6,
  },
];

export const MOVIES: Movie[] = [
  {
    id: 'mov-1',
    title: 'Dune: Part Two',
    tagline: 'Long live the fighters.',
    languages: ['English', 'Hindi'],
    primaryLanguage: 'English',
    genres: ['Sci-Fi', 'Adventure', 'Action'],
    certificate: 'UA',
    runtimeMin: 166,
    synopsis: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family, facing a choice between love and the fate of the universe.',
    posterBg: '#1b1712',
    posterAccent: '#F84464',
    posterUrl: '/posters/mov-1.jpg',
    rating: 8.8,
    votes: '142K',
  },
  {
    id: 'mov-2',
    title: 'Kantara: A Legend Chapter 1',
    tagline: 'The divine forest reclaims its oath.',
    languages: ['Kannada', 'Tamil', 'Telugu', 'Hindi'],
    primaryLanguage: 'Kannada',
    genres: ['Action', 'Drama', 'Thriller'],
    certificate: 'A',
    runtimeMin: 154,
    synopsis: 'Set during the reign of the Kadambas, this prequel delves into the mythological origins of the fierce demigod protector of the coastal hinterlands.',
    posterBg: '#1c130d',
    posterAccent: '#F84464',
    posterUrl: '/posters/mov-2.jpg',
    rating: 8.9,
    votes: '98K',
  },
  {
    id: 'mov-3',
    title: 'The Greatest of All Time (GOAT)',
    tagline: 'Every legend writes a final verse.',
    languages: ['Tamil', 'Telugu', 'Hindi'],
    primaryLanguage: 'Tamil',
    genres: ['Action', 'Thriller'],
    certificate: 'UA',
    runtimeMin: 162,
    synopsis: 'An undercover intelligence operative returns to face his unresolved past and a deadly rogue syndicate.',
    posterBg: '#161922',
    posterAccent: '#F84464',
    posterUrl: '/posters/mov-3.jpg',
    rating: 8.6,
    votes: '110K',
  },
  {
    id: 'mov-4',
    title: 'Kalki 2898 AD: Prophecy',
    tagline: 'The future was foretold five thousand years ago.',
    languages: ['Telugu', 'Hindi', 'Tamil'],
    primaryLanguage: 'Telugu',
    genres: ['Sci-Fi', 'Action'],
    certificate: 'UA',
    runtimeMin: 180,
    synopsis: 'In a dystopian post-apocalyptic Kasi ruled by Supreme Yaskin, a desperate bounty hunter crosses paths with Ashwatthama guarding the divine unborn avatar.',
    posterBg: '#1a1924',
    posterAccent: '#F84464',
    posterUrl: '/posters/mov-4.jpg',
    rating: 8.4,
    votes: '85K',
  },
  {
    id: 'mov-5',
    title: 'Interstellar: IMAX Re-release',
    tagline: 'Mankind was born on Earth. It was never meant to die here.',
    languages: ['English'],
    primaryLanguage: 'English',
    genres: ['Sci-Fi', 'Drama'],
    certificate: 'UA',
    runtimeMin: 169,
    synopsis: 'A team of explorers travel through a wormhole near Saturn in search of a new habitable planet for humanity facing extinction on Earth.',
    posterBg: '#0f1422',
    posterAccent: '#F84464',
    posterUrl: '/posters/mov-5.jpg',
    rating: 9.0,
    votes: '240K',
  },
  {
    id: 'mov-6',
    title: 'Stree 2: Sarkate Ka Aatank',
    tagline: 'O Stree kal mat aana, aaj aao.',
    languages: ['Hindi'],
    primaryLanguage: 'Hindi',
    genres: ['Comedy', 'Thriller'],
    certificate: 'UA',
    runtimeMin: 148,
    synopsis: 'The town of Chanderi is haunted once more, this time by a headless apparition targeting progressive women. Vicky and friends join hands with Stree.',
    posterBg: '#181216',
    posterAccent: '#F84464',
    posterUrl: '/posters/mov-6.jpg',
    rating: 8.2,
    votes: '64K',
  },
  {
    id: 'mov-7',
    title: 'Viduthalai Part 2',
    tagline: 'Truth is the weapon of the silenced.',
    languages: ['Tamil', 'Telugu'],
    primaryLanguage: 'Tamil',
    genres: ['Drama', 'Thriller'],
    certificate: 'A',
    runtimeMin: 158,
    synopsis: 'Vetrimaaran’s hard-hitting confrontation reaches its apex as Constable Kumaresan navigates the ruthless state machinery and the charismatic rebel leader Perumal.',
    posterBg: '#1a1713',
    posterAccent: '#F84464',
    posterUrl: '/posters/mov-7.jpg',
    rating: 8.7,
    votes: '42K',
  },
  {
    id: 'mov-8',
    title: 'Oppenheimer',
    tagline: 'The world forever changes.',
    languages: ['English', 'Hindi'],
    primaryLanguage: 'English',
    genres: ['Drama'],
    certificate: 'A',
    runtimeMin: 180,
    synopsis: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during the Manhattan Project.',
    posterBg: '#211710',
    posterAccent: '#F84464',
    posterUrl: '/posters/mov-8.jpg',
    rating: 8.9,
    votes: '190K',
  },
  {
    id: 'mov-9',
    title: 'Devara: Part 1',
    tagline: 'Red sea shall remember his courage.',
    languages: ['Telugu', 'Hindi', 'Tamil', 'Kannada'],
    primaryLanguage: 'Telugu',
    genres: ['Action', 'Drama'],
    certificate: 'UA',
    runtimeMin: 172,
    synopsis: 'A fearless chieftain guarding coastal trade routes against pirates is betrayed from within, setting up a clash of bloodlines.',
    posterBg: '#111824',
    posterAccent: '#F84464',
    posterUrl: '/posters/mov-9.jpg',
    rating: 7.9,
    votes: '52K',
  },
  {
    id: 'mov-10',
    title: 'Meiyazhagan',
    tagline: 'A night of innocence, homecoming and brotherhood.',
    languages: ['Tamil', 'Telugu'],
    primaryLanguage: 'Tamil',
    genres: ['Drama'],
    certificate: 'U',
    runtimeMin: 177,
    synopsis: 'A disillusioned man returns to his ancestral village for a family wedding and unexpectedly forms a soul-stirring bond with a relentlessly kind cousin.',
    posterBg: '#141818',
    posterAccent: '#F84464',
    posterUrl: '/posters/mov-10.jpg',
    rating: 8.8,
    votes: '38K',
  },
  {
    id: 'mov-11',
    title: 'Gladiator II',
    tagline: 'What we do in life echoes in eternity.',
    languages: ['English', 'Hindi'],
    primaryLanguage: 'English',
    genres: ['Action', 'Adventure', 'Drama'],
    certificate: 'A',
    runtimeMin: 148,
    synopsis: 'Years after witnessing the death of Maximus, Lucius enters the Colosseum after his home is conquered by the tyrannical emperors of Rome.',
    posterBg: '#1e1610',
    posterAccent: '#F84464',
    posterUrl: '/posters/mov-11.jpg',
    rating: 8.1,
    votes: '72K',
  },
  {
    id: 'mov-12',
    title: 'Mookuthi Amman 2',
    tagline: 'The divine protector returns with celestial comedy.',
    languages: ['Tamil', 'Telugu', 'Hindi', 'Kannada'],
    primaryLanguage: 'Tamil',
    genres: ['Comedy', 'Drama', 'Adventure'],
    certificate: 'U',
    runtimeMin: 142,
    synopsis: 'RJ Balaji and Nayanthara reunite as Goddess Mookuthi Amman descends once more to protect her devotees from modern high-stakes deceit.',
    posterBg: '#1e1418',
    posterAccent: '#F84464',
    posterUrl: '/posters/mov-12.jpg',
    rating: 8.7,
    votes: '68K',
  },
];

export const FNB_ITEMS: FnbItem[] = [
  {
    id: 'fnb-combo-cheese',
    name: 'Combo 2 (Cheese)',
    description: 'Cheese Popcorn 170g + 2 Coke 450ml (1155 Kcal | Allergens: Milk. Caffeine)',
    category: 'Combos',
    isVeg: true,
    price: 1250,
    imageUrl: 'https://images.unsplash.com/photo-1585647347384-2593bc35786b?auto=format&fit=crop&w=400&q=80',
    caloriesKcal: 1155,
    allergens: 'Milk, Caffeine',
  },
  {
    id: 'fnb-combo-caramel',
    name: 'Combo 2 (Caramel)',
    description: 'Caramel Popcorn 170g + 2 Coke 450ml (1136 Kcal | Allergens: Soybean, Caffeine)',
    category: 'Combos',
    isVeg: true,
    price: 1250,
    imageUrl: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=400&q=80',
    caloriesKcal: 1136,
    allergens: 'Soybean, Caffeine',
  },
  {
    id: 'fnb-veg-nachos',
    name: 'Veg Cheesy Nachos 110g',
    description: 'Veg Cheesy Nachos 110g (398 Kcal | Allergens: Milk, Gluten)',
    category: 'Snacks',
    isVeg: true,
    price: 480,
    imageUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=400&q=80',
    caloriesKcal: 398,
    allergens: 'Milk, Gluten',
  },
  {
    id: 'fnb-chicken-nachos',
    name: 'Chicken Cheesy Nachos 125g',
    description: 'Chicken Cheesy Nachos 125g (1104 kcal)',
    category: 'Snacks',
    isVeg: false,
    price: 480,
    imageUrl: 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?auto=format&fit=crop&w=400&q=80',
    caloriesKcal: 1104,
  },
  {
    id: 'fnb-salted-popcorn',
    name: 'Regular Salted Popcorn 80g',
    description: 'Regular Salted Popcorn 80g (425 Kcal | Allergens: None)',
    category: 'Popcorn',
    isVeg: true,
    price: 380,
    imageUrl: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?auto=format&fit=crop&w=400&q=80',
    caloriesKcal: 425,
  },
  {
    id: 'fnb-cheese-popcorn',
    name: 'Regular Cheese Popcorn 80g',
    description: 'Regular Cheese Popcorn 80g (423 Kcal | Allergens: Milk)',
    category: 'Popcorn',
    isVeg: true,
    price: 420,
    imageUrl: 'https://images.unsplash.com/photo-1572177191856-3cde618dee1f?auto=format&fit=crop&w=400&q=80',
    caloriesKcal: 423,
    allergens: 'Milk',
  },
  {
    id: 'fnb-coke',
    name: 'Coca Cola 450ml',
    description: 'Chilled Refreshing Coca Cola Fountain Cup (180 Kcal)',
    category: 'Beverages',
    isVeg: true,
    price: 240,
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80',
    caloriesKcal: 180,
  },
  {
    id: 'fnb-sprite',
    name: 'Sprite Lemon Lime 450ml',
    description: 'Crisp clear lemon lime soda (175 Kcal)',
    category: 'Beverages',
    isVeg: true,
    price: 240,
    imageUrl: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&w=400&q=80',
    caloriesKcal: 175,
  },
];

// Screen configurations with realistic auditorium architectures
export const STANDARD_SCREENS: ScreenConfig[] = [
  {
    id: 'scr-imax',
    name: 'Audi 1 - IMAX with Laser',
    format: 'IMAX 2D',
    layout: {
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K'],
      seatsPerRow: 16,
      aisleGapsAfter: [4, 12],
      tierMap: {
        A: 'Silver',
        B: 'Silver',
        C: 'Gold',
        D: 'Gold',
        E: 'Gold',
        F: 'Gold',
        G: 'Platinum',
        H: 'Platinum',
        J: 'Platinum',
        K: 'Platinum',
      },
      rakeAngleDeg: 14.5,
      rowDistanceMeters: 1.15,
      screenWidthMeters: 20,
      screenHeightMeters: 11,
      screenDistanceMeters: 5.5,
      screenCurvatureMeters: 28,
    },
    pricing: [
      { tier: 'Silver', label: 'Silver (Rows A-B)', basePrice: 240, rows: ['A', 'B'] },
      { tier: 'Gold', label: 'Gold (Rows C-F)', basePrice: 380, rows: ['C', 'D', 'E', 'F'] },
      { tier: 'Platinum', label: 'Platinum Recliner (Rows G-K)', basePrice: 650, rows: ['G', 'H', 'J', 'K'] },
    ],
  },
  {
    id: 'scr-dolby',
    name: 'Audi 2 - Dolby Atmos Premium',
    format: 'Dolby Atmos',
    layout: {
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
      seatsPerRow: 14,
      aisleGapsAfter: [3, 11],
      tierMap: {
        A: 'Silver',
        B: 'Silver',
        C: 'Gold',
        D: 'Gold',
        E: 'Gold',
        F: 'Platinum',
        G: 'Platinum',
        H: 'Platinum',
      },
      rakeAngleDeg: 13.0,
      rowDistanceMeters: 1.05,
      screenWidthMeters: 15,
      screenHeightMeters: 7.8,
      screenDistanceMeters: 4.8,
      screenCurvatureMeters: 24,
    },
    pricing: [
      { tier: 'Silver', label: 'Silver (Rows A-B)', basePrice: 200, rows: ['A', 'B'] },
      { tier: 'Gold', label: 'Gold (Rows C-E)', basePrice: 320, rows: ['C', 'D', 'E'] },
      { tier: 'Platinum', label: 'Platinum (Rows F-H)', basePrice: 520, rows: ['F', 'G', 'H'] },
    ],
  },
  {
    id: 'scr-luxe',
    name: 'Audi 3 - Luxe Classic 2D',
    format: '2D',
    layout: {
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      seatsPerRow: 12,
      aisleGapsAfter: [3, 9],
      tierMap: {
        A: 'Silver',
        B: 'Silver',
        C: 'Gold',
        D: 'Gold',
        E: 'Platinum',
        F: 'Platinum',
        G: 'Platinum',
      },
      rakeAngleDeg: 15.0,
      rowDistanceMeters: 1.25,
      screenWidthMeters: 13,
      screenHeightMeters: 6.8,
      screenDistanceMeters: 4.2,
      screenCurvatureMeters: 22,
    },
    pricing: [
      { tier: 'Silver', label: 'Silver (Rows A-B)', basePrice: 180, rows: ['A', 'B'] },
      { tier: 'Gold', label: 'Gold (Rows C-D)', basePrice: 280, rows: ['C', 'D'] },
      { tier: 'Platinum', label: 'Platinum Lounge (Rows E-G)', basePrice: 480, rows: ['E', 'F', 'G'] },
    ],
  },
];

export const THEATERS: Theater[] = [
  // Chennai Theaters
  {
    id: 'th-chn-sathyam',
    cityId: 'chennai',
    name: 'Sathyam Cinemas',
    area: 'Royapettah',
    address: '8, Thiru-Vi-Ka Road, Royapettah, Chennai 600014',
    screens: STANDARD_SCREENS,
  },
  {
    id: 'th-chn-luxe',
    cityId: 'chennai',
    name: 'Luxe Cinemas',
    area: 'Phoenix MarketCity, Velachery',
    address: 'Velachery Main Road, Indira Gandhi Nagar, Chennai 600042',
    screens: STANDARD_SCREENS,
  },
  {
    id: 'th-chn-escape',
    cityId: 'chennai',
    name: 'Escape Cinemas',
    area: 'Express Avenue, Royapettah',
    address: '49/50L, Whites Road, Royapettah, Chennai 600014',
    screens: STANDARD_SCREENS,
  },
  {
    id: 'th-chn-ags',
    cityId: 'chennai',
    name: 'AGS Cinemas',
    area: 'OMR, Navalur',
    address: 'OMR Road, Navalur, Chennai 603103',
    screens: STANDARD_SCREENS,
  },
  {
    id: 'th-chn-rohini',
    cityId: 'chennai',
    name: 'Rohini Silver Screens',
    area: 'Koyambedu',
    address: '141/2, Poonamallee High Rd, Koyambedu, Chennai 600107',
    screens: STANDARD_SCREENS,
  },

  // Bangalore Theaters
  {
    id: 'th-blr-forum',
    cityId: 'bangalore',
    name: 'PVR Forum Mall',
    area: 'Koramangala',
    address: 'Hosur Road, Koramangala, Bengaluru 560095',
    screens: STANDARD_SCREENS,
  },
  {
    id: 'th-blr-garuda',
    cityId: 'bangalore',
    name: 'INOX Garuda Mall',
    area: 'Magrath Road',
    address: 'Garuda Mall, Magrath Rd, Ashok Nagar, Bengaluru 560025',
    screens: STANDARD_SCREENS,
  },
  {
    id: 'th-blr-orion',
    cityId: 'bangalore',
    name: 'PVR Orion Mall',
    area: 'Rajajinagar',
    address: 'Brigade Gateway, 26/1 Dr Rajkumar Rd, Malleshwaram, Bengaluru 560055',
    screens: STANDARD_SCREENS,
  },
  {
    id: 'th-blr-phoenix',
    cityId: 'bangalore',
    name: 'PVR Phoenix Marketcity',
    area: 'Whitefield',
    address: 'Mahadevapura, Whitefield Main Rd, Bengaluru 560048',
    screens: STANDARD_SCREENS,
  },
  {
    id: 'th-blr-shantiniketan',
    cityId: 'bangalore',
    name: 'Cinepolis Nexus Shantiniketan',
    area: 'Whitefield',
    address: 'Nexus Shantiniketan Mall, Thigalarapalya, Bengaluru 560067',
    screens: STANDARD_SCREENS,
  },

  // Mumbai Theaters
  {
    id: 'th-mum-rcity',
    cityId: 'mumbai',
    name: 'INOX: R-City, Ghatkopar',
    area: 'Ghatkopar West',
    address: 'R-City Mall, 3rd Floor, LBS Marg, Ghatkopar West, Mumbai 400086',
    screens: STANDARD_SCREENS,
  },
  {
    id: 'th-mum-palladium',
    cityId: 'mumbai',
    name: 'PVR ICON Phoenix Palladium',
    area: 'Lower Parel',
    address: 'Senapati Bapat Marg, Lower Parel, Mumbai 400013',
    screens: STANDARD_SCREENS,
  },
  {
    id: 'th-mum-inorbit',
    cityId: 'mumbai',
    name: 'INOX Megaplex Inorbit',
    area: 'Malad West',
    address: 'Inorbit Mall, Link Rd, Malad West, Mumbai 400064',
    screens: STANDARD_SCREENS,
  },
  {
    id: 'th-mum-gaiety',
    cityId: 'mumbai',
    name: 'Gaiety Galaxy Cinemas',
    area: 'Bandra West',
    address: '30th Road, Bandra West, Mumbai 400050',
    screens: STANDARD_SCREENS,
  },
  {
    id: 'th-mum-maratha',
    cityId: 'mumbai',
    name: 'Maratha Mandir',
    area: 'Mumbai Central',
    address: 'Dr Anandrao Nair Marg, Mumbai Central, Mumbai 400008',
    screens: STANDARD_SCREENS,
  },
  {
    id: 'th-mum-fun',
    cityId: 'mumbai',
    name: 'Cinepolis Fun Republic',
    area: 'Andheri West',
    address: 'Veera Desai Road, Andheri West, Mumbai 400053',
    screens: STANDARD_SCREENS,
  },
];

// Helper to generate 7 days from today
export function getAvailableDates(): { dateStr: string; displayDay: string; displayDate: string; isToday: boolean }[] {
  const dates = [];
  const now = new Date();
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    dates.push({
      dateStr,
      displayDay: i === 0 ? 'TODAY' : dayNames[d.getDay()],
      displayDate: `${d.getDate()} ${monthNames[d.getMonth()]}`,
      isToday: i === 0,
    });
  }
  return dates;
}

// Generate seeded showtimes
export function generateShowsForMovieAndCity(movieId: string, cityId: string, dateStr: string): Show[] {
  const theaters = THEATERS.filter((t) => t.cityId === cityId);
  const shows: Show[] = [];

  const timeSlots: { timeStr: string; timeOfDay: 'Morning' | 'Afternoon' | 'Evening' | 'Night'; hour: number }[] = [
    { timeStr: '10:00 AM', timeOfDay: 'Morning', hour: 10 },
    { timeStr: '01:30 PM', timeOfDay: 'Afternoon', hour: 13.5 },
    { timeStr: '04:45 PM', timeOfDay: 'Evening', hour: 16.75 },
    { timeStr: '07:30 PM', timeOfDay: 'Evening', hour: 19.5 },
    { timeStr: '10:45 PM', timeOfDay: 'Night', hour: 22.75 },
  ];

  theaters.forEach((theater, thIdx) => {
    // Pick 2 screens per theater
    const activeScreens = theater.screens.slice(0, 2);

    activeScreens.forEach((screen, scIdx) => {
      // Pick 2-3 showtimes per screen based on hash
      timeSlots.forEach((slot, slotIdx) => {
        // Pseudo-random deterministic show picker
        const hash = (thIdx * 17 + scIdx * 23 + slotIdx * 11 + dateStr.length) % 10;
        if (hash < 7) {
          const availability: 'Available' | 'Filling fast' | 'Almost full' =
            hash > 4 ? 'Almost full' : hash > 2 ? 'Filling fast' : 'Available';

          const basePrices: Record<SeatTier, number> = {
            Silver: screen.pricing.find((p) => p.tier === 'Silver')?.basePrice || 200,
            Gold: screen.pricing.find((p) => p.tier === 'Gold')?.basePrice || 320,
            Platinum: screen.pricing.find((p) => p.tier === 'Platinum')?.basePrice || 550,
          };

          // Evening/night premium modifier
          if (slot.timeOfDay === 'Evening' || slot.timeOfDay === 'Night') {
            basePrices.Silver += 20;
            basePrices.Gold += 30;
            basePrices.Platinum += 50;
          }

          shows.push({
            id: `show-${theater.id}-${screen.id}-${dateStr}-${slotIdx}`,
            movieId,
            theaterId: theater.id,
            screenId: screen.id,
            dateStr,
            timeStr: slot.timeStr,
            timeOfDay: slot.timeOfDay,
            format: screen.format,
            availability,
            basePriceConfig: basePrices,
          });
        }
      });
    });
  });

  return shows;
}

// Generate seeded booked seats for a show (deterministic by showId)
export function getSeededBookedSeatIds(showId: string, screenLayout: ScreenLayout): string[] {
  let hash = 0;
  for (let i = 0; i < showId.length; i++) {
    hash = (hash << 5) - hash + showId.charCodeAt(i);
    hash |= 0;
  }
  const booked: string[] = [];

  screenLayout.rows.forEach((row, rowIdx) => {
    for (let num = 1; num <= screenLayout.seatsPerRow; num++) {
      // Don't mark wheelchair spots
      if (row === 'A' && (num === 1 || num === screenLayout.seatsPerRow)) continue;

      const seatSeed = Math.sin(hash + rowIdx * 13 + num * 7);
      // Roughly 30% of seats booked, preferring center seats in gold/platinum
      const isCenter = Math.abs(num - screenLayout.seatsPerRow / 2) < screenLayout.seatsPerRow * 0.35;
      const threshold = isCenter ? 0.35 : 0.7;
      if (Math.abs(seatSeed) > threshold) {
        booked.push(`${row}-${num}`);
      }
    }
  });

  return booked;
}
