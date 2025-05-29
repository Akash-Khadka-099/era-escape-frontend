export const apiEndpoints = {
  users: {
    fetch: "/api/users",
    create: "/api/users",
  },
  login: "/api/login",
  logout: "/api/logout",
  destination: {
    create: "/api/destinations/organization",
    fetchPost: "/api/destinations",
    crudById: "/api/destinations/{id}",
  },
  package: {
    fetchPost: "/api/packages",
    // fetchBySlug : "/api/packages/package-slug/{slug}",
    crudBySlug: "/api/packages/{slug}"
  },
  file: {
    deleteFile: "/api/delete/file/{id}",
  },
};
