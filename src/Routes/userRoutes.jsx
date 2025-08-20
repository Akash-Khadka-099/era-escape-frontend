import Dashboard from "@/Pages/Dashboard";
import OrganizationPackages from "@/Pages/OrganizationPages/OrganizationPackages";
import AddOrganizationPackage from "@/Pages/OrganizationPages/OrganizationPackages/AddOrganizationPackage";
import PackageBooking from "@/Pages/PackageBooking";
import Packages from "@/Pages/Packages";
import PackageDetail from "@/Pages/Packages/PackageDetail";
import { routeLists } from "@/Routes/routeLists";

export const userRoutes = [
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
];
