export interface OptionType {
  label: string;
  value: string;
}

export const packageVehicleOptions: OptionType[] = [
  { label: "Car", value: "car" },
  { label: "Sumo", value: "sumo" },
  { label: "Hiace", value: "hiace" },
  { label: "Bus", value: "bus" },
  { label: "Scorpio", value: "scorpio" },
  { label: "Van", value: "van" },
  { label: "Jeep", value: "jeep" },
  { label: "Helicopter", value: "helicopter" },
  { label: "Plane", value: "plane" },
];

export const packageRoomOptions: OptionType[] = [
  { label: "Average", value: "average" },
  { label: "Standard", value: "standard" },
  { label: "Deluxe", value: "deluxe" },
  { label: "VIP", value: "vip" },
];


export const packageSeasonOptions: OptionType[] = [
  { label: "Spring", value: "spring" },
  { label: "Summer", value: "summer" },
  { label: "Autumn", value: "autumn" },
  { label: "Winter", value: "winter" },
];

export const hotelTypeOptions: OptionType[] = [
  { label: "Tea House", value: "TEA_HOUSE" },
  { label: "Snacks & Meal", value: "SNACKS_MEAL" },
  { label: "Guest House / Home Stay", value: "GUEST_HOUSE_HOME_STAY" },
];




export const trekStopTypes = [
  {
    value: "final_destination",
    label: "Final Destination",
  },
  {
    value: "hotel_stays",
    label: "Hotel Stays",
  },
  {
    value: "lake",
    label: "Lake",
  },
  {
    value: "religious_place",
    label: "Religious Place",
  },
  {
    value: "tea_houses",
    label: "Tea Houses",
  },

  {
    value: "waterfalls",
    label: "Waterfalls",
  },

  {
    value: "viewpoint",
    label: "Viewpoint",
  },
];
