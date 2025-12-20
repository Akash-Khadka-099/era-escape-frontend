export const trekData = {
  title: "North Annapurna Base Camp Trek",
  location: "Annapurna Conservation Area, Nepal",
  difficulty: "Hard",
  type: "National Park",
  stats: {
    distance: "45.5 km",
    elevation: "4,130 m",
    time: "7 Days",
    routeType: "Out & Back"
  },
  description: `
    A challenging but rewarding trek to the base of the world's 10th highest mountain, Annapurna I (8,091m). 
    This trail offers diverse landscapes, from terraced fields and rhododendron forests to the alpine sanctuary 
    surrounded by high peaks. You'll experience the rich culture of the Gurung and Magar people along the way.
    
    The trail begins at Nayapul and ascends through Tikhedhunga and Ghorepani, offering spectacular sunrise views 
    from Poon Hill before continuing to the sanctuary. The final stretch into the Annapurna Sanctuary provides 
    a 360-degree panorama of snow-capped giants.
  `,
  note: "Best hiked from March to May and September to December. Snow can persist on the trail in early spring. Altitude sickness is a risk; proper acclimatization is essential.",
  tags: ["Glacier Views", "Wildflowers", "Waterfall", "Rocky", "Alpine", "Cultural"],
  conditions: {
    temp: "12°C",
    weather: "Partly Cloudy",
    wind: "15 km/h NW",
    sunset: "6:45 PM"
  },
  elevationProfile: [
    { dist: "Start", elev: 1070 },
    { dist: "10km", elev: 2800 },
    { dist: "20km", elev: 3210 },
    { dist: "30km", elev: 3700 },
    { dist: "40km", elev: 4130 }, // ABC
    { dist: "End", elev: 1070 }
  ]
};
