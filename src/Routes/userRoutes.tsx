import { routeLists } from "@/Routes/routeLists";
import { lazy, ReactNode } from "react";

const Dashboard = lazy(() => import("@/Pages/Dashboard"));
const OrganizationDashboard = lazy(
  () => import("@/Pages/OrganizationPages/OrganizationDashboard"),
);
const OrganizationPackages = lazy(
  () => import("@/Pages/OrganizationPages/OrganizationPackages"),
);
const AddOrganizationPackage = lazy(
  () =>
    import("@/Pages/OrganizationPages/OrganizationPackages/AddOrganizationPackage"),
);
const PackageBooking = lazy(() => import("@/Pages/PackageBooking"));
const Packages = lazy(() => import("@/Pages/Packages"));
const PackageDetail = lazy(() => import("@/Pages/Packages/PackageDetail"));
const TrekTrails = lazy(() => import("@/Pages/TrekTrails"));
const ExploreHikes = lazy(() => import("@/Pages/ExploreHikes"));
const HikeTrailMap = lazy(() => import("@/Pages/ExploreHikes/HikeTrailMap"));
const TrekTrail3DMap = lazy(
  () => import("@/Pages/TrekTrails/TrekTrailMap/TrekTrail3DMap"),
);
const TrekTrailDetail = lazy(
  () => import("@/Pages/TrekTrails/TrekTrailDetails"),
);
const HikeDetail = lazy(() => import("@/Pages/ExploreHikes/HikeDetails"));
const SavedTrekBlogs = lazy(() => import("@/Pages/SavedTrekBlogs"));

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
    path: "/trek-trails/map/:slug",
    // element: <TrekTrailMap />,
    element: <TrekTrail3DMap />,
  },
  {
    path: "/trek-trails/detail/:slug",
    element: <TrekTrailDetail />,
  },
  {
    path: routeLists.exploreHikes,
    element: <ExploreHikes />,
  },
  {
    path: `${routeLists.exploreHikes}/map/:slug`,
    element: <HikeTrailMap />,
  },
  {
    path: `${routeLists.exploreHikes}/detail/:slug`,
    element: <HikeDetail />,
  },
  {
    path: routeLists.savedTrekBlogs,
    element: <SavedTrekBlogs />,
  },
];
