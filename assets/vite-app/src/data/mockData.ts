
import { Quote, User, Hotel, Activity, Transportation, City, DailyItinerary } from "@/types/quote";
import { generateUniqueId } from "@/utils/quoteUtils";

// Sample users
export const sampleUsers: User[] = [
  {
    id: "user1",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    role: "travel_specialist"
  },
  {
    id: "user2",
    name: "Tom Wilson",
    email: "tom.wilson@example.com",
    role: "travel_specialist"
  },
  {
    id: "user3",
    name: "Maria Rodriguez",
    email: "maria.rodriguez@example.com",
    role: "team_manager"
  },
  {
    id: "user4",
    name: "David Lee",
    email: "david.lee@example.com",
    role: "qa_reviewer"
  }
];

// Sample cities
export const sampleCities: City[] = [
  {
    id: "city1",
    name: "Dublin",
    country: "Ireland",
    checkIn: new Date(2025, 5, 10),
    checkOut: new Date(2025, 5, 13)
  },
  {
    id: "city2",
    name: "Galway",
    country: "Ireland",
    checkIn: new Date(2025, 5, 13),
    checkOut: new Date(2025, 5, 16)
  },
  {
    id: "city3",
    name: "Edinburgh",
    country: "Scotland",
    checkIn: new Date(2025, 5, 16),
    checkOut: new Date(2025, 5, 19)
  },
  {
    id: "city4",
    name: "Glasgow",
    country: "Scotland",
    checkIn: new Date(2025, 5, 19),
    checkOut: new Date(2025, 5, 21)
  }
];

// Sample hotels
export const sampleHotels: Hotel[] = [
  {
    id: "hotel1",
    name: "The Shelbourne",
    city: "city1",
    isPrimary: true,
    roomCategories: [
      {
        id: generateUniqueId(),
        name: "Deluxe Room",
        rate: 350,
        quantity: 5
      },
      {
        id: generateUniqueId(),
        name: "Suite",
        rate: 550,
        quantity: 2
      }
    ],
    extras: [
      {
        id: generateUniqueId(),
        name: "Breakfast",
        rate: 35,
        quantity: 14
      }
    ],
    notes: "Historic 5-star hotel in the heart of Dublin"
  },
  {
    id: "hotel2",
    name: "Glenlo Abbey Hotel",
    city: "city2",
    isPrimary: true,
    roomCategories: [
      {
        id: generateUniqueId(),
        name: "Classic Room",
        rate: 280,
        quantity: 4
      },
      {
        id: generateUniqueId(),
        name: "River View Suite",
        rate: 420,
        quantity: 3
      }
    ],
    extras: [
      {
        id: generateUniqueId(),
        name: "Dinner Package",
        rate: 75,
        quantity: 14
      }
    ],
    notes: "Luxury estate on the shores of Lough Corrib"
  },
  {
    id: "hotel3",
    name: "The Balmoral",
    city: "city3",
    isPrimary: true,
    roomCategories: [
      {
        id: generateUniqueId(),
        name: "Classic Room",
        rate: 310,
        quantity: 5
      },
      {
        id: generateUniqueId(),
        name: "Executive Suite",
        rate: 520,
        quantity: 2
      }
    ],
    extras: [
      {
        id: generateUniqueId(),
        name: "Afternoon Tea",
        rate: 45,
        quantity: 10
      }
    ],
    notes: "Landmark hotel in the heart of Edinburgh"
  },
  {
    id: "hotel4",
    name: "Kimpton Blythswood Square",
    city: "city4",
    isPrimary: true,
    roomCategories: [
      {
        id: generateUniqueId(),
        name: "Superior Room",
        rate: 240,
        quantity: 5
      },
      {
        id: generateUniqueId(),
        name: "Junior Suite",
        rate: 380,
        quantity: 2
      }
    ],
    extras: [
      {
        id: generateUniqueId(),
        name: "Spa Access",
        rate: 60,
        quantity: 14
      }
    ],
    notes: "Luxury hotel with award-winning spa"
  }
];

// Sample activities
export const sampleActivities: Activity[] = [
  {
    id: "activity1",
    name: "Guinness Storehouse Tour",
    date: new Date(2025, 5, 11),
    city: "city1",
    type: "tour",
    cost: 25,
    perPerson: true,
    notes: "Private guided tour of the Guinness Storehouse"
  },
  {
    id: "activity2",
    name: "Dinner at Chapter One",
    date: new Date(2025, 5, 12),
    city: "city1",
    type: "restaurant",
    cost: 120,
    perPerson: true,
    notes: "Michelin-starred restaurant in Dublin"
  },
  {
    id: "activity3",
    name: "Cliffs of Moher Day Trip",
    date: new Date(2025, 5, 14),
    city: "city2",
    type: "tour",
    cost: 85,
    perPerson: true,
    notes: "Full day excursion to the magnificent Cliffs of Moher"
  },
  {
    id: "activity4",
    name: "Edinburgh Castle Tour",
    date: new Date(2025, 5, 17),
    city: "city3",
    type: "tour",
    cost: 35,
    perPerson: true,
    notes: "Guided tour of historic Edinburgh Castle"
  },
  {
    id: "activity5",
    name: "Royal Mile Walking Tour",
    date: new Date(2025, 5, 18),
    city: "city3",
    type: "tour",
    cost: 15,
    perPerson: true,
    notes: "Guided walking tour of Edinburgh's Royal Mile"
  },
  {
    id: "activity6",
    name: "Golf at St Andrews",
    date: new Date(2025, 5, 20),
    city: "city4",
    type: "golf",
    cost: 250,
    perPerson: true,
    notes: "Round of golf at the famous St Andrews Links"
  }
];

// Sample transportation
export const sampleTransportation: Transportation[] = [
  {
    id: "transport1",
    type: "air",
    from: "New York",
    to: "Dublin",
    date: new Date(2025, 5, 10),
    cost: 8500,
    notes: "Group flight with Aer Lingus",
    details: "EI100, Departing 7:30pm, Arriving 7:00am"
  },
  {
    id: "transport2",
    type: "coaching",
    from: "Dublin",
    to: "Galway",
    date: new Date(2025, 5, 13),
    cost: 750,
    notes: "Luxury coach with bathroom and Wi-Fi",
    details: "3-hour journey with scenic stops"
  },
  {
    id: "transport3",
    type: "ferry",
    from: "Belfast",
    to: "Cairnryan",
    date: new Date(2025, 5, 16),
    cost: 950,
    notes: "Stena Line ferry with reserved seating",
    details: "2.5-hour sailing"
  },
  {
    id: "transport4",
    type: "coaching",
    from: "Cairnryan",
    to: "Edinburgh",
    date: new Date(2025, 5, 16),
    cost: 650,
    notes: "Luxury coach transfer",
    details: "3-hour journey with comfort stops"
  },
  {
    id: "transport5",
    type: "coaching",
    from: "Edinburgh",
    to: "Glasgow",
    date: new Date(2025, 5, 19),
    cost: 350,
    notes: "Luxury coach transfer",
    details: "1-hour journey"
  },
  {
    id: "transport6",
    type: "air",
    from: "Glasgow",
    to: "New York",
    date: new Date(2025, 5, 21),
    cost: 8500,
    notes: "Group flight with British Airways",
    details: "BA178, Departing 11:30am, Arriving 2:15pm"
  }
];

// Sample daily itinerary
export const sampleItinerary: DailyItinerary[] = [
  {
    id: "itinerary1",
    date: new Date(2025, 5, 10),
    description: "Arrive in Dublin. Transfer to The Shelbourne Hotel. Evening welcome dinner at the hotel.",
    activities: []
  },
  {
    id: "itinerary2",
    date: new Date(2025, 5, 11),
    description: "Morning visit to Trinity College and the Book of Kells. Afternoon tour of the Guinness Storehouse. Evening at leisure.",
    activities: ["activity1"]
  },
  {
    id: "itinerary3",
    date: new Date(2025, 5, 12),
    description: "Day trip to Newgrange and the Boyne Valley. Evening dinner at Chapter One restaurant.",
    activities: ["activity2"]
  },
  {
    id: "itinerary4",
    date: new Date(2025, 5, 13),
    description: "Depart Dublin for Galway. Check in to Glenlo Abbey Hotel. Afternoon walking tour of Galway. Evening at leisure.",
    activities: []
  },
  {
    id: "itinerary5",
    date: new Date(2025, 5, 14),
    description: "Full day excursion to the Cliffs of Moher and the Burren. Evening dinner at the hotel.",
    activities: ["activity3"]
  },
  {
    id: "itinerary6",
    date: new Date(2025, 5, 15),
    description: "Day at leisure in Galway with optional activities. Evening traditional Irish music session.",
    activities: []
  },
  {
    id: "itinerary7",
    date: new Date(2025, 5, 16),
    description: "Depart Galway for Edinburgh. Ferry from Belfast to Cairnryan, then coach to Edinburgh. Check in to The Balmoral Hotel.",
    activities: []
  },
  {
    id: "itinerary8",
    date: new Date(2025, 5, 17),
    description: "Morning tour of Edinburgh Castle. Afternoon at leisure. Evening group dinner.",
    activities: ["activity4"]
  },
  {
    id: "itinerary9",
    date: new Date(2025, 5, 18),
    description: "Morning Royal Mile walking tour. Afternoon visit to the Royal Yacht Britannia. Evening whisky tasting.",
    activities: ["activity5"]
  },
  {
    id: "itinerary10",
    date: new Date(2025, 5, 19),
    description: "Depart Edinburgh for Glasgow. Check in to Kimpton Blythswood Square. Afternoon city tour.",
    activities: []
  },
  {
    id: "itinerary11",
    date: new Date(2025, 5, 20),
    description: "Day trip to St Andrews for golf or sightseeing. Farewell dinner in Glasgow.",
    activities: ["activity6"]
  },
  {
    id: "itinerary12",
    date: new Date(2025, 5, 21),
    description: "Depart Glasgow for return flight to New York.",
    activities: []
  }
];

// Sample quote
export const sampleQuote: Quote = {
  id: "q-12345",
  name: "Ireland & Scotland Group Tour",
  startDate: new Date(2025, 5, 10),
  endDate: new Date(2025, 5, 21),
  agentName: "Jennifer Smith",
  agencyName: "Luxury Travel Experts",
  groupType: 'known',
  travelerCount: 14,
  groupRanges: [
    { id: '10-14', label: '10-14 travelers', min: 10, max: 14, selected: true },
    { id: '15-19', label: '15-19 travelers', min: 15, max: 19, selected: true },
    { id: '20-24', label: '20-24 travelers', min: 20, max: 24, selected: true }
  ],
  budget: 75000,
  cities: sampleCities,
  hotels: sampleHotels,
  activities: sampleActivities,
  transportation: sampleTransportation,
  itinerary: sampleItinerary,
  inclusions: [
    "11 nights accommodation in 4-5 star hotels",
    "Daily breakfast",
    "Welcome and farewell dinners",
    "Luxury coach transportation as per itinerary",
    "Professional tour director throughout",
    "Local guides for city tours",
    "Entrance fees to all attractions listed in the itinerary",
    "Porterage at all hotels"
  ],
  exclusions: [
    "Airfare (can be arranged upon request)",
    "Travel insurance",
    "Meals not mentioned in the inclusions",
    "Personal expenses",
    "Gratuities for guides and drivers"
  ],
  termsAndConditions: "50% deposit required at time of booking. Final payment due 60 days prior to departure. Cancellation fees apply.",
  notes: "Group requires accessible rooms for two travelers. One traveler has dietary restrictions (gluten-free).",
  createdBy: "user1",
  createdAt: new Date(2025, 2, 15),
  updatedBy: "user1",
  updatedAt: new Date(2025, 2, 20),
  status: "draft",
  phase: "initialization"
};

export const emptyQuote: Quote = {
  id: generateUniqueId(),
  name: "",
  startDate: new Date(),
  endDate: new Date(),
  agentName: "",
  agencyName: "",
  groupType: 'known',
  travelerCount: 10,
  groupRanges: [
    { id: '10-14', label: '10-14 travelers', min: 10, max: 14, selected: true },
    { id: '15-19', label: '15-19 travelers', min: 15, max: 19, selected: true },
    { id: '20-24', label: '20-24 travelers', min: 20, max: 24, selected: true }
  ],
  budget: 0,
  cities: [],
  hotels: [],
  activities: [],
  transportation: [],
  itinerary: [],
  inclusions: [],
  exclusions: [],
  termsAndConditions: "",
  notes: "",
  createdBy: "user1",
  createdAt: new Date(),
  updatedBy: "user1",
  updatedAt: new Date(),
  status: "draft",
  phase: "initialization"
};
