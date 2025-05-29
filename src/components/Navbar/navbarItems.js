import { routeLists } from "@/Routes/routeLists";

export const menuItems = [
  {
    key: "/",
    label: "Home",
  },
  {
    key: routeLists.package,
    label: "Packages",
  },
  {
    label: "Teams",
    children: [
      {
        key: "dev",
        label: "Development Teams",
      },
      {
        key: "market",
        label: "Marketting Teams",
      },
    ],
  },
  {
    label: "Organization",
    role: ["admin"],
    children: [
      {
        key: "/organization-package-list",
        label: "Package List",
      },
    ],
  },
];
