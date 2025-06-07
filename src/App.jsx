import Navbar from "@/components/Navbar";
import Dashboard from "@/Pages/Dashboard";
import { Flex } from "antd";
import Footer from "@/components/Footer";
import { Route, Routes } from "react-router-dom";
import { routeLists } from "@/Routes/routeLists";
import Package from "@/Pages/Packages";
import PackageDetail from "@/Pages/Packages/PackageDetail";
import AppProvider from "@/Provider/AppProvider";
import axios from "axios";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/authStore";
import OrganizationPackages from "@/Pages/OrganizationPages/OrganizationPackages";
import AddOrganizationPackage from "@/Pages/OrganizationPages/OrganizationPackages/AddOrganizationPackage";

const App = () => {
  const { setAccessToken, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  console.log("user details", user);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/refresh`,
          null,
          { withCredentials: true }
        );
        setAccessToken(data.access_token);
      } catch (error) {
        console.error("Unable to refresh token:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [setAccessToken]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <AppProvider>
        <Flex vertical style={{ minHeight: "100vh" }}>
          <Navbar />
          <div
            style={{
              width: "100%",
              background: "#fff",
              flex: 1,
            }}
          >
            <Routes>
              <Route path={routeLists.dashboard} element={<Dashboard />} />
              <Route path={routeLists.package} element={<Package />} />
              <Route
                path={"/package-details/:package_slug"}
                element={<PackageDetail />}
              />
              <Route
                path="/organization-package-list"
                element={<OrganizationPackages />}
              />
              <Route
                path="/organization-package/add"
                element={<AddOrganizationPackage />}
              />
              <Route
                path="/organization-package/edit/:packageSlug"
                element={<AddOrganizationPackage />}
              />
            </Routes>
          </div>
          <Footer />
        </Flex>
      </AppProvider>
    </>
  );
};

export default App;
