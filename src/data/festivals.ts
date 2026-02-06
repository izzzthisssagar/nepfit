export interface Festival {
  id: string;
  name: string;
  nameNepali?: string;
  nameHindi?: string;
  date: string; // ISO date string (recurring yearly, use current year)
  type: "nepali" | "indian" | "both";
  region: string[];
  description: string;
  traditionalFoods: {
    name: string;
    description: string;
    calories?: number;
    isHealthy: boolean;
    tips?: string;
  }[];
  healthTips: string[];
  fastingDay?: boolean;
  significance: string;
}

// Helper to get date for current year
const getDateThisYear = (month: number, day: number): string => {
  const year = new Date().getFullYear();
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};

export const festivals: Festival[] = [
  // Nepali Festivals
  {
    id: "dashain",
    name: "Dashain",
    nameNepali: "दशैं",
    date: getDateThisYear(10, 15), // Approximate - varies by lunar calendar
    type: "nepali",
    region: ["Nepal"],
    description: "The biggest festival in Nepal, celebrating the victory of goddess Durga over the demon Mahishasura.",
    traditionalFoods: [
      {
        name: "Mutton Curry",
        description: "Rich goat meat curry prepared during Dashain",
        calories: 450,
        isHealthy: false,
        tips: "Enjoy in moderation. Balance with vegetables and go easy on the gravy.",
      },
      {
        name: "Sel Roti",
        description: "Ring-shaped sweet rice bread, deep fried",
        calories: 180,
        isHealthy: false,
        tips: "Traditional but high in calories. Limit to 1-2 pieces.",
      },
      {
        name: "Aloo Tama",
        description: "Potato and bamboo shoot curry",
        calories: 150,
        isHealthy: true,
        tips: "A healthier option! Rich in fiber.",
      },
    ],
    healthTips: [
      "Balance meat dishes with plenty of vegetables",
      "Stay active - play traditional games like swing (ping)",
      "Limit sel roti and other fried items",
      "Stay hydrated between feasts",
    ],
    significance: "15-day festival celebrating good over evil",
  },
  {
    id: "tihar",
    name: "Tihar",
    nameNepali: "तिहार",
    date: getDateThisYear(11, 1), // Approximate
    type: "nepali",
    region: ["Nepal"],
    description: "The festival of lights, celebrating crows, dogs, cows, oxen, and the bond between brothers and sisters.",
    traditionalFoods: [
      {
        name: "Sel Roti",
        description: "Sweet rice bread rings",
        calories: 180,
        isHealthy: false,
        tips: "Made fresh during Tihar. Enjoy sparingly.",
      },
      {
        name: "Anarsa",
        description: "Sweet rice flour cookies with sesame",
        calories: 120,
        isHealthy: false,
        tips: "High in sugar. One or two as a treat.",
      },
      {
        name: "Kheer",
        description: "Rice pudding with milk and sugar",
        calories: 200,
        isHealthy: false,
        tips: "Can be made healthier with less sugar and low-fat milk.",
      },
    ],
    healthTips: [
      "The 5-day festival involves many sweets - pace yourself",
      "Make healthier versions of traditional sweets at home",
      "Include fruits as part of Laxmi Puja offerings",
      "Stay active with rangoli making and decorating",
    ],
    significance: "5-day festival of lights honoring animals and siblings",
  },
  {
    id: "teej",
    name: "Teej",
    nameNepali: "तीज",
    date: getDateThisYear(9, 5), // Approximate
    type: "both",
    region: ["Nepal", "North India"],
    description: "Festival celebrating the union of Shiva and Parvati, observed by women for marital bliss.",
    traditionalFoods: [
      {
        name: "Dar (Pre-fast feast)",
        description: "Elaborate feast eaten before the fast",
        calories: 800,
        isHealthy: false,
        tips: "Eat mindfully even during the feast - it's not about quantity.",
      },
      {
        name: "Fruits and Milk",
        description: "Post-fast breaking foods",
        calories: 150,
        isHealthy: true,
        tips: "Perfect for breaking the fast gently.",
      },
    ],
    healthTips: [
      "If fasting, stay hydrated when allowed",
      "Break fast gently with fruits and light foods",
      "Don't overeat during Dar - it makes fasting harder",
      "Listen to your body during the fast",
    ],
    fastingDay: true,
    significance: "Women's festival with fasting for husband's well-being",
  },

  // Indian Festivals
  {
    id: "diwali",
    name: "Diwali",
    nameHindi: "दीवाली",
    date: getDateThisYear(11, 12), // Approximate
    type: "indian",
    region: ["India", "Nepal"],
    description: "The festival of lights celebrating the return of Lord Rama to Ayodhya.",
    traditionalFoods: [
      {
        name: "Gulab Jamun",
        description: "Deep-fried milk dumplings in sugar syrup",
        calories: 150,
        isHealthy: false,
        tips: "Very high in sugar. One piece is enough.",
      },
      {
        name: "Kaju Katli",
        description: "Cashew fudge, a premium sweet",
        calories: 120,
        isHealthy: false,
        tips: "Made with nuts, so has some nutrition. Still high in sugar.",
      },
      {
        name: "Chakli/Murukku",
        description: "Spiral savory snack",
        calories: 100,
        isHealthy: false,
        tips: "Better than sweets but still fried. Enjoy in moderation.",
      },
      {
        name: "Dry Fruits Mix",
        description: "Mixed nuts and dried fruits",
        calories: 180,
        isHealthy: true,
        tips: "The healthiest Diwali snack! Great for gifting too.",
      },
    ],
    healthTips: [
      "Gift and request healthier options like dry fruits",
      "Make sweets at home with less sugar and healthier oils",
      "Balance festive eating with morning walks",
      "Stay mindful during card parties - snacking adds up",
    ],
    significance: "Victory of light over darkness, knowledge over ignorance",
  },
  {
    id: "holi",
    name: "Holi",
    nameHindi: "होली",
    date: getDateThisYear(3, 25), // Approximate
    type: "indian",
    region: ["India", "Nepal"],
    description: "The festival of colors celebrating the arrival of spring.",
    traditionalFoods: [
      {
        name: "Gujiya",
        description: "Sweet dumplings filled with khoya and nuts",
        calories: 200,
        isHealthy: false,
        tips: "Can be baked instead of fried for a healthier version.",
      },
      {
        name: "Thandai",
        description: "Spiced milk drink with nuts",
        calories: 180,
        isHealthy: true,
        tips: "Nutritious! Skip if it contains bhang unless traditional.",
      },
      {
        name: "Dahi Bhalla",
        description: "Lentil dumplings in yogurt",
        calories: 250,
        isHealthy: false,
        tips: "Good protein from lentils and yogurt. Go easy on chutneys.",
      },
    ],
    healthTips: [
      "Stay hydrated - Holi is physically active!",
      "Thandai is cooling and nutritious",
      "Protect your skin and hair with oil before playing",
      "Avoid excessive bhang consumption",
    ],
    significance: "Celebration of spring, colors, love, and forgiveness",
  },
  {
    id: "navratri",
    name: "Navratri",
    nameHindi: "नवरात्रि",
    date: getDateThisYear(10, 3), // Approximate
    type: "indian",
    region: ["India"],
    description: "Nine nights celebrating the goddess Durga with fasting and worship.",
    traditionalFoods: [
      {
        name: "Sabudana Khichdi",
        description: "Tapioca pearls with peanuts and potatoes",
        calories: 300,
        isHealthy: true,
        tips: "Good energy food for fasting days.",
      },
      {
        name: "Kuttu Ki Puri",
        description: "Buckwheat flour deep-fried bread",
        calories: 150,
        isHealthy: false,
        tips: "Buckwheat is healthy but deep frying adds calories.",
      },
      {
        name: "Fruit Chaat",
        description: "Mixed fruits with spices",
        calories: 100,
        isHealthy: true,
        tips: "Excellent choice! Hydrating and nutritious.",
      },
      {
        name: "Singhare Ka Atta Halwa",
        description: "Water chestnut flour dessert",
        calories: 250,
        isHealthy: false,
        tips: "Traditional but high in ghee and sugar.",
      },
    ],
    healthTips: [
      "Fasting can be healthy if done right",
      "Focus on fruits, vegetables, and dairy",
      "Avoid overeating during fasting meals",
      "Stay active with Garba/Dandiya dance!",
    ],
    fastingDay: true,
    significance: "Nine days of fasting and worship of goddess Durga",
  },
  {
    id: "makar-sankranti",
    name: "Makar Sankranti",
    nameHindi: "मकर संक्रांति",
    date: getDateThisYear(1, 14),
    type: "indian",
    region: ["India"],
    description: "Harvest festival marking the sun's transition into Capricorn.",
    traditionalFoods: [
      {
        name: "Til Gul (Sesame Jaggery)",
        description: "Sesame and jaggery sweets",
        calories: 100,
        isHealthy: true,
        tips: "Sesame is rich in calcium. Jaggery is better than sugar.",
      },
      {
        name: "Khichdi",
        description: "Rice and lentil comfort dish",
        calories: 250,
        isHealthy: true,
        tips: "Nutritious and easy to digest. A complete meal.",
      },
      {
        name: "Puran Poli",
        description: "Sweet stuffed flatbread",
        calories: 300,
        isHealthy: false,
        tips: "High in calories but can be made healthier with less ghee.",
      },
    ],
    healthTips: [
      "Til (sesame) warms the body in winter - enjoy it!",
      "Fly kites for some outdoor activity",
      "Khichdi is perfect winter comfort food",
      "Jaggery is healthier than refined sugar",
    ],
    significance: "Harvest festival celebrating sun and farmers",
  },
  {
    id: "janai-purnima",
    name: "Janai Purnima",
    nameNepali: "जनै पूर्णिमा",
    date: getDateThisYear(8, 19), // Approximate
    type: "nepali",
    region: ["Nepal"],
    description: "Sacred thread changing ceremony, also known as Raksha Bandhan in parts of Nepal.",
    traditionalFoods: [
      {
        name: "Kwati",
        description: "Mixed sprouted beans soup",
        calories: 180,
        isHealthy: true,
        tips: "Extremely nutritious! 9 types of beans = complete protein.",
      },
      {
        name: "Ghee Rice",
        description: "Rice cooked with clarified butter",
        calories: 350,
        isHealthy: false,
        tips: "Ghee has benefits but is calorie-dense. Moderate portions.",
      },
    ],
    healthTips: [
      "Kwati is one of the healthiest festival foods - enjoy plenty!",
      "The monsoon timing means immune-boosting foods are perfect",
      "Sprouted beans aid digestion",
      "This is a great festival for health-conscious eating",
    ],
    significance: "Sacred thread renewal and protective strings (rakhi)",
  },
  {
    id: "chhath",
    name: "Chhath Puja",
    nameHindi: "छठ पूजा",
    date: getDateThisYear(11, 7), // Approximate
    type: "both",
    region: ["Bihar", "Nepal Terai", "Jharkhand"],
    description: "Ancient Hindu festival dedicated to the Sun God and Chhathi Maiya.",
    traditionalFoods: [
      {
        name: "Thekua",
        description: "Wheat flour sweet with ghee and jaggery",
        calories: 150,
        isHealthy: false,
        tips: "Traditional prasad. Made with whole wheat so has some fiber.",
      },
      {
        name: "Kheer",
        description: "Rice pudding offered to the sun",
        calories: 200,
        isHealthy: false,
        tips: "Make with less sugar for a healthier version.",
      },
      {
        name: "Fruits",
        description: "Sugarcane, coconut, bananas as offerings",
        calories: 100,
        isHealthy: true,
        tips: "The healthiest part of Chhath offerings!",
      },
    ],
    healthTips: [
      "36-hour fast is intense - prepare properly",
      "Break fast gently with prasad and fruits",
      "Standing in water is great exercise",
      "Focus on fruits in offerings for nutrition",
    ],
    fastingDay: true,
    significance: "Thanking the Sun God for life and energy",
  },
];

// Get upcoming festivals within next N days
export function getUpcomingFestivals(days: number = 30): Festival[] {
  const today = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + days);

  return festivals
    .filter((festival) => {
      const festivalDate = new Date(festival.date);
      return festivalDate >= today && festivalDate <= endDate;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

// Get festivals for a specific month
export function getFestivalsForMonth(month: number): Festival[] {
  return festivals.filter((festival) => {
    const festivalDate = new Date(festival.date);
    return festivalDate.getMonth() + 1 === month;
  });
}

// Get today's festival if any
export function getTodaysFestival(): Festival | null {
  const today = new Date().toISOString().split("T")[0];
  return festivals.find((festival) => festival.date === today) || null;
}

// Get festival by ID
export function getFestivalById(id: string): Festival | undefined {
  return festivals.find((festival) => festival.id === id);
}
