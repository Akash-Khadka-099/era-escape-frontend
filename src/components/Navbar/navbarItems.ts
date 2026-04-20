import { routeLists } from "@/Routes/routeLists";
import type { MenuProps } from "antd";

export type NavMenuItem = NonNullable<MenuProps["items"]>[number] & {
  role: string | string[];
  children?: NavMenuItem[];
};

export const menuItems: NavMenuItem[] = [
  {
    key: "/",
    label: "Home",
    role: "*",
  },
  // {
  //   key: "/destinations",
  //   label: "Destinations",
  //   role: "*",
  // },
  {
    key: routeLists.trekTrails,
    label: "Explore Trails",
    role: "*",
  },
  {
    key: routeLists.exploreHikes,
    label: "Explore Hikes",
    role: "*",
  },
  {
    key: "trending-blogs",
    label: "Trending Blogs",
    role: "*",
  },
  // {
  //   key: routeLists.package,
  //   label: "Packages",
  //   role: "*",
  // },

  // {
  //   key: "organization",
  //   label: "Organization",
  //   role: ["admin"],
  //   children: [
  //     {
  //       key: "/organization-dashboard",
  //       label: "Dashboard",
  //       role: ["admin"],
  //     },
  //     {
  //       key: "/organization-package-list",
  //       label: "Package List",
  //       role: ["admin"],
  //     },
  //   ],
  // },

  {
    key: routeLists.savedTrekBlogs,
    label: "Saved Blogs",
    role: ["user", "admin", "superAdmin"],
  },
];

export const nepalTrekRegions = [
  "Khumbu (Everest)",
  "Annapurna",
  "Langtang",
  "Manaslu",
  "Mustang",
  "Dolpo",
];

export const nepalTrekPlaces = [
  {
    title: "Everest Base Camp",
    region: "Khumbu",
    image: "/images/mountain-home.png",
  },
  {
    title: "Annapurna Circuit",
    region: "Annapurna",
    image: "/images/religion-home.jpg",
  },
  {
    title: "Annapurna Base Camp",
    region: "Annapurna",
    image: "/images/home.png",
  },
  {
    title: "Langtang Valley",
    region: "Langtang",
    image: "/images/musuem.png",
  },
  {
    title: "Manaslu Circuit",
    region: "Manaslu",
    image: "/images/login.png",
  },
  {
    title: "Upper Mustang",
    region: "Mustang",
    image: "/images/dummyImage.jpg",
  },
];

export const nepalTrekCallout = {
  title: "Not sure where to start?",
  description: "Pick a Nepal trek by time, altitude, and season.",
  cta: "Start Exploring",
  image: "/images/dummyTrailImage.png",
};
