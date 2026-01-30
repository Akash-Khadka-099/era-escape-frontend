interface ApiEndpoints {
  users: {
    fetch: string;
    create: string;
  };
  login: string;
  logout: string;
  forgetPassword: string;
  resetPassword: string;
  destination: {
    create: string;
    fetchPost: string;
    crudById: string;
    searchFromDashboard: string;
  };
  bookPackage: {
    fetchPost: string;
  };
  package: {
    fetchPost: string;
    crudBySlug: string;
    searchPackageList: string;
    updateActiveStatus: string;
    trending: string;
  };
  file: {
    deleteFile: string;
  };
  organization: {
    dashboardCard: string;
  };
  trekBlogs: {
    searchTrekBlogs: string,
    getTrekBlogDetail: string,
    fetchDestinationHotels: string
    fetchTrekBlogItineraryPlans: string
  };
  homepage: {
    fetchTrendingBlogCategories: string
  }
}

export const apiEndpoints: ApiEndpoints = {
  users: {
    fetch: "/api/users",
    create: "/api/users",
  },
  login: "/api/auth/login",
  logout: "/api/auth/logout",
  forgetPassword: "/api/auth/forget-password",
  resetPassword: "/api/auth/reset-password",
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
    trending: "/api/users-trending-packages",
  },
  file: {
    deleteFile: "/api/delete/file/{id}",
  },

  organization: {
    dashboardCard: "/api/organization/dashboard/cards",
  },
  trekBlogs: {
    searchTrekBlogs: "/api/trek-blogs-listing",
    getTrekBlogDetail: "/api/users-trek-blogs/{slug}",
    fetchDestinationHotels: "/api/users-trek-blogs/{trekBlogSlug}/destinations/{destinationSlug}/hotels",
    fetchTrekBlogItineraryPlans: "/api/users-trek-blogs/{trekBlogSlug}/itinerary-plans"
  },
  homepage: {
    fetchTrendingBlogCategories: "/api/trek-blogs-trending-categories"
  }
};
