import LogoutConfirmModal from "@/components/Navbar/LogoutConfirmModal";
import { menuItems } from "@/components/Navbar/navbarItems";
import LoginRegister from "@/Pages/LoginRegister";
import useAuthStore from "@/store/authStore";
import { UserOutlined } from "@ant-design/icons";
import { Button, Dropdown, Flex, Layout, Menu } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

const Navbar = () => {
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isLoginModalOpen, setISLoginModalOpen] = useState(false);
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuthStore();

  const handleCloseLoginModal = () => {
    setISLoginModalOpen(false);
  };

  const dropdownMenu = [
    {
      label: "Logout",
      key: "1",
      icon: <UserOutlined />,
      onClick: () => setIsLogoutOpen(true),
    },
    {
      label: "2nd menu item",
      key: "2",
      icon: <UserOutlined />,
    },
  ];

  const filterNavItems = (menuItems, userRole) => {
    return menuItems
      .map((item) => {
        // Check if item has required role
        const hasRole =
          item.role === "*" ||
          (Array.isArray(item.role) && item.role.includes(userRole));

        // If item has children, filter them recursively
        if (item.children) {
          const filteredChildren = filterNavItems(item.children, userRole);
          // Only include item if it has role or has valid children
          if (hasRole || filteredChildren.length > 0) {
            return {
              ...item,
              children: filteredChildren,
            };
          }
          return null;
        }

        // Return item if it has the required role
        return hasRole ? item : null;
      })
      .filter((item) => item !== null);
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
              items={filterNavItems(menuItems, user?.role)}
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
      <LogoutConfirmModal isOpen={isLogoutOpen} setIsOpen={setIsLogoutOpen} />
    </>
  );
};

export default Navbar;
