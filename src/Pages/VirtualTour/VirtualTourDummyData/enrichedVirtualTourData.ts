import { TrekData } from '../types';

export const virtualTourData: TrekData = {
  trek: {
    name: "Panchpokhari Trek",
    slug: "panchpokhari",
    region: "Sindhupalchok, Nepal",
    country: "Nepal",
    coverImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2938&auto=format&fit=crop",
    totalDistance: 45,
    totalDistanceUnit: "km",
    totalAscent: 2700,
    totalAscentUnit: "m",
    maxAltitude: 4100,
    duration: "5-6 days",
    difficulty: "Moderate",
    bestSeason: "March-May, Sep-Nov",
    startingPoint: "Chhimti",
    endingPoint: "Panchpokhari",
    overview: "A pristine alpine trek leading to a group of five sacred Hindu lakes.",
    permitRequired: true,
    estimatedCost: "$300-500",
    destinations: [
      {
        destinationPointerNumber: 1,
        dayNumber: 1,
        hasMultipleNextDestination: false,
        travelTimeToNext: 2,
        travelTimeFromPrevious: 0,
        distanceFromPrevious: 0,
        slug: "panchpokhari-chhimti",
        name: "Chhimti",
        altitude: 1900,
        altitudeFt: 6233,
        latLong: [27.9799309, 85.6593453],
        description: "The starting point of the Panchpokhari trek.",
        shortDescription: "Starting village of the trek.",
        featuredImage: "https://images.unsplash.com/photo-1626082896492-766af4eb65ed?q=80&w=2000&auto=format&fit=crop",
        terrainType: "Forest and village path",
        difficultyRating: "Easy",
        trailCondition: "Dirt road, clear path",
        tags: ["Starting Point"],
        facilities: [
          { type: "tea_house", name: "Tea House", icon: "🏠", available: true },
          { type: "phone_signal", name: "NTC Signal", icon: "📱", available: true }
        ],
        destinationTypes: ["village"],
        gallery: [
          {
            id: "chhimti-1",
            type: "image",
            src: "https://images.unsplash.com/photo-1626082896492-766af4eb65ed?q=80&w=2000&auto=format&fit=crop",
            thumbnail: "https://images.unsplash.com/photo-1626082896492-766af4eb65ed?q=80&w=300&auto=format&fit=crop",
            caption: "Chhimti Village",
            category: "village"
          }
        ],
        panoramicViews: [
          {
            type: "google_embed",
            title: "Panchpokhari 360",
            googleMapsSrc: "//www.google.com/maps/embed?pb=!4v1788339744240!6m8!1m7!1sCAoSHENJQUJJaEEwczZqWS1PWXVfMDRKb0VPZ3JUeHI.!2m2!1d27.98088426527329!2d85.66614326829281!3f35.63251602567518!4f-2.320373578464171!5f0.7820865974627469",
            thumbnail: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=300&auto=format&fit=crop"
          }
        ],
        stays: [
          {
            name: "Chhimti Guest House",
            type: "Tea House",
            rating: 4.0,
            priceRange: "$10-15",
            image: "https://images.unsplash.com/photo-1587162145558-94fb2e25d21a?q=80&w=800&auto=format&fit=crop",
            amenities: ["Food", "Basic Room"],
            bookingAvailable: false
          }
        ],

        weather: {
          bestMonths: ["March", "April", "May"],
          temperatureRange: { min: 10, max: 25, unit: "°C" },
          typicalConditions: "Clear and warm"
        },
        specialties: [],
        tips: ["Buy remaining supplies here."],
        emergencyInfo: {
          nearestHospital: "Melamchi",
          helicopterEvacuation: false,
          phoneSignal: "Available"
        }
      },
      {
        destinationPointerNumber: 2,
        dayNumber: 1,
        hasMultipleNextDestination: false,
        travelTimeToNext: 1.5,
        travelTimeFromPrevious: 2,
        distanceFromPrevious: 4.5,
        slug: "panchpokhari-deurali",
        name: "Deurali",
        altitude: 2020,
        altitudeFt: 6627,
        latLong: [27.9879800, 85.6630625],
        description: "A small resting place along the forested ascent with a few tea houses.",
        shortDescription: "A resting place in the forest.",
        featuredImage: "https://images.unsplash.com/photo-1518712392764-f3c5b8b60a37?q=80&w=2000&auto=format&fit=crop",
        terrainType: "Forest",
        difficultyRating: "Moderate",
        trailCondition: "Steep stone steps",
        tags: ["Rest Stop"],
        facilities: [
          { type: "tea_house", name: "Tea House", icon: "🏠", available: true },
          { type: "water", name: "Drinking Water", icon: "💧", available: true }
        ],
        destinationTypes: ["hotel_stays"],
        gallery: [],
        panoramicViews: [
          {
            type: "google_embed",
            title: "Panchpokhari 360",
            googleMapsSrc: "https://www.google.com/maps/embed?pb=!4v1788331773880!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJRGUzcHlKTEE.!2m2!1d28.0415936244545!2d85.71675869668344!3f27.46979598011207!4f-15.164704263147996!5f0.7820865974627469",
            thumbnail: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=300&auto=format&fit=crop"
          }
        ], stays: [],
        weather: {
          bestMonths: ["March", "April", "May"],
          temperatureRange: { min: 8, max: 22, unit: "°C" },
          typicalConditions: "Cool and shaded"
        },
        specialties: [],
        tips: ["Good spot for a short break."],
        emergencyInfo: {
          nearestHospital: "Melamchi",
          helicopterEvacuation: false,
          phoneSignal: "Weak"
        }
      },
      {
        destinationPointerNumber: 3,
        dayNumber: 1,
        hasMultipleNextDestination: false,
        travelTimeToNext: 3,
        travelTimeFromPrevious: 1.5,
        distanceFromPrevious: 3,
        slug: "panchpokhari-tuppi-danda",
        name: "Tuppi Dandass ",
        altitude: 2750,
        altitudeFt: 9022,
        latLong: [27.9925005, 85.6881351],
        description: "A ridge offering the first panoramic views of the surrounding mountains and valleys.",
        shortDescription: "High ridge with great views.",
        featuredImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop",
        terrainType: "Ridge",
        difficultyRating: "Moderate",
        trailCondition: "Steep ascent",
        tags: ["Viewpoint"],
        facilities: [
          { type: "tea_house", name: "Tea House", icon: "🏠", available: true }
        ],
        destinationTypes: ["hotel_stays", "viewpoint"],
        gallery: [],
        panoramicViews: [
          {
            type: "google_embed",
            title: "Tuppidanda 360",
            googleMapsSrc: "https://www.google.com/maps/embed?pb=!4v1788339928929!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJRGV3N0x4TXc.!2m2!1d27.9924412122364!2d85.6881103897294!3f128.59060369075846!4f0.31060359494016154!5f0.7820865974627469",
            thumbnail: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=300&auto=format&fit=crop"
          },
          {
            type: "google_embed",
            title: "Tuppidanda 360",
            googleMapsSrc: "https://www.google.com/maps/embed?pb=!4v1788340037690!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJRGU5cHl5N3dF!2m2!1d27.99249747301731!2d85.68813851353012!3f171.0261707529173!4f13.968610882219423!5f0.7820865974627469",
            thumbnail: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=300&auto=format&fit=crop"
          }
        ],
        stays: [],
        weather: {
          bestMonths: ["March", "April", "May"],
          temperatureRange: { min: 5, max: 18, unit: "°C" },
          typicalConditions: "Windy, cooler"
        },
        specialties: [],
        tips: ["Drink plenty of water as altitude increases."],
        emergencyInfo: {
          nearestHospital: "Kathmandu (via Heli)",
          helicopterEvacuation: true,
          phoneSignal: "Weak"
        }
      },
      {
        destinationPointerNumber: 4,
        dayNumber: 2,
        hasMultipleNextDestination: false,
        travelTimeToNext: 2.5,
        travelTimeFromPrevious: 3,
        distanceFromPrevious: 5,
        slug: "panchpokhari-rato-mato",
        name: "Rato Mato",
        altitude: 3081,
        altitudeFt: 10108,
        latLong: [27.9948204, 85.7134353],
        description: "Known for its distinct red soil, this area marks the transition into the higher alpine zones.",
        shortDescription: "Transition to alpine zone.",
        featuredImage: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=2000&auto=format&fit=crop",
        terrainType: "Alpine scrub",
        difficultyRating: "Moderate",
        trailCondition: "Rocky and dusty",
        tags: [],
        facilities: [
          { type: "tea_house", name: "Basic Lodge", icon: "🏠", available: true }
        ],
        destinationTypes: ["hotel_stays"],
        gallery: [],
        panoramicViews: [],
        stays: [],
        weather: {
          bestMonths: ["March", "April", "May", "Oct", "Nov"],
          temperatureRange: { min: 2, max: 15, unit: "°C" },
          typicalConditions: "Cold mornings"
        },
        specialties: [],
        tips: ["Pace yourself, altitude can be felt here."],
        emergencyInfo: {
          nearestHospital: "Kathmandu (via Heli)",
          helicopterEvacuation: true,
          phoneSignal: "None"
        }
      },
      {
        destinationPointerNumber: 5,
        dayNumber: 2,
        hasMultipleNextDestination: false,
        travelTimeToNext: 3.5,
        travelTimeFromPrevious: 2.5,
        distanceFromPrevious: 4,
        slug: "panchpokhari-chokar-danda",
        name: "Chokar Danda",
        altitude: 3230,
        altitudeFt: 10597,
        latLong: [27.9981076, 85.7154601],
        description: "A steep hill climb leading to a flat grazing land used by locals during summer.",
        shortDescription: "High altitude grazing land.",
        featuredImage: "https://images.unsplash.com/photo-1543168256-418811576931?q=80&w=2000&auto=format&fit=crop",
        terrainType: "Meadow",
        difficultyRating: "Challenging",
        trailCondition: "Open trail, exposed",
        tags: [],
        facilities: [],
        destinationTypes: ["hotel_stays"],
        gallery: [],
        panoramicViews: [],
        stays: [],
        weather: {
          bestMonths: ["March", "April", "Oct", "Nov"],
          temperatureRange: { min: 0, max: 12, unit: "°C" },
          typicalConditions: "Often misty in afternoons"
        },
        specialties: [],
        tips: ["Keep rain gear accessible."],
        emergencyInfo: {
          nearestHospital: "Kathmandu (via Heli)",
          helicopterEvacuation: true,
          phoneSignal: "None"
        }
      },
      {
        destinationPointerNumber: 6,
        dayNumber: 2,
        hasMultipleNextDestination: false,
        travelTimeToNext: 4,
        travelTimeFromPrevious: 3.5,
        distanceFromPrevious: 6,
        slug: "panchpokhari-noshyampati",
        name: "Noshyampati",
        altitude: 3660,
        altitudeFt: 12007,
        latLong: [28.0094986, 85.7289598],
        description: "A major rest stop before the final push to Panchpokhari, featuring a small temple and lodges.",
        shortDescription: "Major rest stop before the lakes.",
        featuredImage: "https://images.unsplash.com/photo-1498429152472-9a433d9ddf3b?q=80&w=2000&auto=format&fit=crop",
        terrainType: "Alpine",
        difficultyRating: "Challenging",
        trailCondition: "Rocky path",
        tags: ["Temple"],
        facilities: [
          { type: "tea_house", name: "Tea House", icon: "🏠", available: true },
          { type: "camping", name: "Camping Space", icon: "⛺", available: true }
        ],
        destinationTypes: ["hotel_stays"],
        gallery: [],
        panoramicViews: [],
        stays: [],
        weather: {
          bestMonths: ["Aug", "Sep", "Oct", "Nov"],
          temperatureRange: { min: -2, max: 10, unit: "°C" },
          typicalConditions: "Cold, clear skies in morning"
        },
        specialties: [],
        tips: ["Rest well here to acclimatize."],
        emergencyInfo: {
          nearestHospital: "Kathmandu (via Heli)",
          helicopterEvacuation: true,
          phoneSignal: "None"
        }
      },
      {
        destinationPointerNumber: 7,
        dayNumber: 3,
        hasMultipleNextDestination: false,
        travelTimeToNext: 1,
        travelTimeFromPrevious: 4,
        distanceFromPrevious: 8,
        slug: "panchpokhari-panchpokhari",
        name: "Panchpokhari",
        altitude: 4100,
        altitudeFt: 13451,
        latLong: [28.0424294, 85.7133048],
        description: "The sacred five lakes situated at an altitude of 4,100m. A famous pilgrimage site.",
        shortDescription: "Sacred five alpine lakes.",
        featuredImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2938&auto=format&fit=crop",
        terrainType: "Alpine, rocky",
        difficultyRating: "Moderate",
        trailCondition: "Rocky, high altitude",
        tags: ["Lakes", "Pilgrimage"],
        facilities: [
          { type: "tea_house", name: "Basic Lodge", icon: "🏠", available: true },
          { type: "camping", name: "Camping Ground", icon: "⛺", available: true }
        ],
        destinationTypes: ["lake"],
        gallery: [
          {
            id: "pp-1",
            type: "image",
            src: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2938&auto=format&fit=crop",
            thumbnail: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=300&auto=format&fit=crop",
            caption: "The Five Lakes",
            category: "landscape"
          }
        ],
        panoramicViews: [
          {
            type: "google_embed",
            title: "Panchpokhari 360",
            googleMapsSrc: "https://www.google.com/maps/embed?pb=!4v1788331773880!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJRGUzcHlKTEE.!2m2!1d28.0415936244545!2d85.71675869668344!3f27.46979598011207!4f-15.164704263147996!5f0.7820865974627469",
            thumbnail: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=300&auto=format&fit=crop"
          }
        ],
        stays: [],
        weather: {
          bestMonths: ["August", "September"],
          temperatureRange: { min: -5, max: 10, unit: "°C" },
          typicalConditions: "Cold, windy, sometimes snowy"
        },
        specialties: [
          {
            type: "spiritual",
            title: "Janai Purnima Festival",
            description: "Huge gathering of pilgrims every August."
          }
        ],
        tips: ["Be prepared for altitude sickness.", "Carry warm clothes."],
        emergencyInfo: {
          nearestHospital: "Kathmandu (via Heli)",
          helicopterEvacuation: true,
          phoneSignal: "None"
        }
      },
      {
        destinationPointerNumber: 8,
        dayNumber: 3,
        hasMultipleNextDestination: false,
        travelTimeToNext: null,
        travelTimeFromPrevious: 1,
        distanceFromPrevious: 1.5,
        slug: "panchpokhari-view-point",
        name: "View Point",
        altitude: 4217,
        altitudeFt: 13835,
        latLong: [28.0440621, 85.7231033],
        description: "The highest point on this trek, offering a stunning panoramic view of all five lakes together and the Jugal Himal range.",
        shortDescription: "Best viewpoint for the lakes and mountains.",
        featuredImage: "https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=2000&auto=format&fit=crop",
        terrainType: "Rocky peak",
        difficultyRating: "Challenging",
        trailCondition: "Steep ascent, rocky",
        tags: ["Viewpoint", "Summit"],
        facilities: [],
        destinationTypes: ["viewpoint"],
        gallery: [],
        panoramicViews: [],
        stays: [],
        weather: {
          bestMonths: ["August", "September", "October"],
          temperatureRange: { min: -8, max: 5, unit: "°C" },
          typicalConditions: "Extremely windy and cold"
        },
        specialties: [],
        tips: ["Go early in the morning for clear views.", "Very cold and windy at the top."],
        emergencyInfo: {
          nearestHospital: "Kathmandu (via Heli)",
          helicopterEvacuation: true,
          phoneSignal: "None"
        }
      }
    ]
  }
};
