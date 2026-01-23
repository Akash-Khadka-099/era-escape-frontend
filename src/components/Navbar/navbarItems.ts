import { routeLists } from "@/Routes/routeLists";

export const menuItems = [
  {
    key: "/",
    label: "Home",
    role: "*",
  },
  // {
  //   key: routeLists.package,
  //   label: "Packages",
  //   role: "*",
  // },

  // {
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
    key: routeLists.trekTrails,
    label: "Explore Trails",
    role: "*",
  },
];
