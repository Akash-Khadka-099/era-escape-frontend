import CustomFooter from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Flex } from "antd";
import PropTypes from "prop-types";

const UserLayout = ({ children }) => {
  return (
    <>
      <Flex vertical style={{ minHeight: "100vh" }}>
        <Navbar />
        <div
          style={{
            width: "100%",
            background: "#fff",
            flex: 1,
          }}
        >
          {children}
        </div>
        <CustomFooter />
      </Flex>
    </>
  );
};

UserLayout.propTypes = {
  children: PropTypes.node,
};

export default UserLayout;
