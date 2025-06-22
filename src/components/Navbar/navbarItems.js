import { routeLists } from "@/Routes/routeLists";

export const menuItems = [
  {
    key: "/",
    label: "Home",
    role: "*",
  },
  {
    key: routeLists.package,
    label: "Packages",
    role: "*",
  },
  // {
  //   label: "Teams",
  //   children: [
  //     {
  //       key: "dev",
  //       label: "Development Teams",
  //     },
  //     {
  //       key: "market",
  //       label: "Marketting Teams",
  //     },
  //   ],
  // },
  {
    label: "Organization",
    role: ["admin"],
    children: [
      {
        key: "/organization-package-list",
        label: "Package List",
        role: ["admin"],
      },
    ],
  },
];
