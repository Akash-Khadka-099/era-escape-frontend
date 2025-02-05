import LoginRegister from "@/Pages/LoginRegister";
import { routeLists } from "@/Routes/routeLists";
import { UserOutlined } from "@ant-design/icons";
import { Button, Flex, Layout, Menu } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const { Header } = Layout;

const menuItems = [
  {
    key: "/",
    label: "Home",
  },
  {
    key: routeLists.package,
    label: "Packages",
  },
  {
    label: "Teams",
    children: [
      {
        key: "dev",
        label: "Development Teams",
      },
      {
        key: "market",
        label: "Marketting Teams",
      },
    ],
  },
];
const Navbar = () => {
  const [isLoginModalOpen, setISLoginModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("/");
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    setActiveMenu(location.pathname);
  }, [location]);

  const handleCloseLoginModal = () => {
    setISLoginModalOpen(false);
  };

  return (
    <>
      {" "}
      <Header
        style={{
          backgroundColor: "transparent",
          padding: "0 24px",
          width: "100%",
          zIndex: 1,
          background: "#fff",
          position: "sticky",
          top: 0,
        }}
      >
        <Flex
          justify="space-between"
          style={{ padding: "0 2rem", background: "transparent" }}
        >
          <div>Logo</div>
          <div style={{ width: "85%" }}>
            <Menu
              mode="horizontal"
              style={{ lineHeight: "64px", background: "#fff" }}
              items={menuItems}
              selectedKeys={[activeMenu]}
              onClick={(e) => {
                navigate(e.key);
                setActiveMenu(e.key);
              }}
            />
          </div>
          <div>
            <Button
              icon={<UserOutlined />}
              onClick={() => setISLoginModalOpen(true)}
            >
              Login/Register
            </Button>
          </div>
        </Flex>
      </Header>
      <LoginRegister
        isLoginModalOpen={isLoginModalOpen}
        handleCloseLoginModal={handleCloseLoginModal}
      />
    </>
  );
};

export default Navbar;
