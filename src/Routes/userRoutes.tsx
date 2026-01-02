import Dashboard from "@/Pages/Dashboard";
import OrganizationDashboard from "@/Pages/OrganizationPages/OrganizationDashboard";
import OrganizationPackages from "@/Pages/OrganizationPages/OrganizationPackages";
import AddOrganizationPackage from "@/Pages/OrganizationPages/OrganizationPackages/AddOrganizationPackage";
import PackageBooking from "@/Pages/PackageBooking";
import Packages from "@/Pages/Packages";
import PackageDetail from "@/Pages/Packages/PackageDetail";
import TrekTrails from "@/Pages/TrekTrails";
import TrekTrailMap from "@/Pages/TrekTrails/TrekTrailMap";
import { routeLists } from "@/Routes/routeLists";
import { ReactNode } from "react";

export interface RouteItem {
  path: string;
  element: ReactNode;
}

export const userRoutes: RouteItem[] = [
  {
    path: routeLists.dashboard,
    element: <Dashboard />,
  },
  {
    path: routeLists.package,
    element: <Packages />,
  },
  {
    path: "/package-details/:package_slug",
    element: <PackageDetail />,
  },
  {
    path: "/organization-dashboard",
    element: <OrganizationDashboard />,
  },
  {
    path: "/organization-package-list",
    element: <OrganizationPackages />,
  },
  {
    path: "/organization-package/add",
    element: <AddOrganizationPackage />,
  },
  {
    path: "/organization-package/edit/:packageSlug",
    element: <AddOrganizationPackage />,
  },
  {
    path: "/package-booking/:package_slug",
    element: <PackageBooking />,
  },
  {
    path: "/trek-trails",
    element: <TrekTrails />,
  },
  {
    path: "/trek-trails/map",
    element: <TrekTrailMap />,
  },
];
