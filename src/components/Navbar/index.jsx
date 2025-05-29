import { menuItems } from "@/components/Navbar/navbarItems";
import LoginRegister from "@/Pages/LoginRegister";
import useAuthStore from "@/store/authStore";
import { UserOutlined } from "@ant-design/icons";
import { Button, Dropdown, Flex, Layout, Menu } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

const dropdownMenu = [
  {
    label: "1st menu item",
    key: "1",
    icon: <UserOutlined />,
  },
  {
    label: "2nd menu item",
    key: "2",
    icon: <UserOutlined />,
  },
];
const Navbar = () => {
  const [isLoginModalOpen, setISLoginModalOpen] = useState(false);
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuthStore();

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
              onClick={(e) => {
                navigate(e.key);
              }}
            />
          </div>
          {isAuthenticated ? (
            <Flex align="center">
              <Dropdown.Button
                trigger={["click"]}
                menu={{ items: dropdownMenu }}
                placement="bottomRight"
                icon={<UserOutlined />}
                onClick={(e) => console.log("e", e)}
              >
                {user?.name || ""}
              </Dropdown.Button>
            </Flex>
          ) : (
            <div>
              <Button
                icon={<UserOutlined />}
                onClick={() => setISLoginModalOpen(true)}
              >
                Login/Register
              </Button>
            </div>
          )}
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
