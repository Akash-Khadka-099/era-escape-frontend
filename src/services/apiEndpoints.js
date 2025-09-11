export const apiEndpoints = {
  users: {
    fetch: "/api/users",
    create: "/api/users",
  },
  login: "/api/login",
  logout: "/api/logout",
  forgetPassword: "/api/forget-password",
  resetPassword: "/api/reset-password",
  destination: {
    create: "/api/destinations/organization",
    fetchPost: "/api/destinations",
    crudById: "/api/destinations/{id}",
    searchFromDashboard: "/api/destination/search/",
  },

  bookPackage: {
    fetchPost: "/api/booking-packages",
  },
  package: {
    fetchPost: "/api/packages",
    // fetchBySlug : "/api/packages/package-slug/{slug}",
    crudBySlug: "/api/packages/{slug}",
    searchPackageList: "/api/packages-search/",
    updateActiveStatus: "/api/packages/active-status/{id}",
  },
  file: {
    deleteFile: "/api/delete/file/{id}",
  },

  organization: {
    dashboardCard: "/api/organization/dashboard/cards",
  },
};
