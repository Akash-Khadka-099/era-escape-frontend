import CustomFooter from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Flex } from "antd";
import { ReactNode } from "react";

interface UserLayoutProps {
  children?: ReactNode;
}

const UserLayout = ({ children }: UserLayoutProps) => {
  return (
    <>
      <Flex vertical style={{ minHeight: "100vh" }}>
        <Navbar />
        <div
          style={{
            width: "100%",
            background: "#fff",
            flex: 1,
            margin: 0,
            padding: 0,
          }}
        >
          {children}
        </div>
        <CustomFooter />
      </Flex>
    </>
  );
};

export default UserLayout;
