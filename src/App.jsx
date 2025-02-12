import Navbar from "@/components/Navbar";
import Dashboard from "@/Pages/Dashboard";
import AppProvder from "@/Provider/AppProvder";
import { Flex } from "antd";
import Footer from "@/components/Footer";
import { Route, Routes } from "react-router-dom";
import { routeLists } from "@/Routes/routeLists";
import Package from "@/Pages/Packages";
import PackageDetail from "@/Pages/Packages/PackageDetail";

const App = () => {
  return (
    <>
      <AppProvder>
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
                path={routeLists.packageDetail}
                element={<PackageDetail />}
              />
            </Routes>
          </div>
          <Footer />
        </Flex>
      </AppProvder>
    </>
  );
};

export default App;
