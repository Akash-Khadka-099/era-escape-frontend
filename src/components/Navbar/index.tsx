import React, { useState } from "react";
import "./navbar.css";
import LogoutConfirmModal from "@/components/Navbar/LogoutConfirmModal";
import { menuItems } from "@/components/Navbar/navbarItems";
import LoginRegister from "@/Pages/LoginRegister";
import useAuthStore from "@/store/authStore";
import { MenuOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Drawer, Dropdown, Flex, Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

interface MenuItem {
  key?: string;
  label: string;
  role: string | string[];
  children?: MenuItem[];
}

const Navbar: React.FC = () => {
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isLoginModalOpen, setISLoginModalOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuthStore();

  const handleCloseLoginModal = () => {
    setISLoginModalOpen(false);
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const dropdownMenu = [
    {
      label: "Logout",
      key: "1",
      icon: <UserOutlined />,
      onClick: () => setIsLogoutOpen(true),
    },
  ];

  const filterNavItems = (items: MenuItem[], userRole: string): any[] => {
    return items
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
      <Header
        style={{
          backgroundColor: "transparent",
          padding: "0",
          width: "100%",
          zIndex: 999,
          background: "#fff",
          position: "sticky",
          top: 0,
        }}
      >
        <Flex
          justify="space-between"
          gap={16}
          style={{ padding: "0 2rem", background: "transparent" }}
        >
          <div
            className="brand-name "
            style={{
              fontSize: "24px",
              fontWeight: 800,
              color: "#2D5A5A",
              cursor: "pointer",
              fontFamily: "'Outfit', sans-serif",
            }}
            onClick={() => navigate("/")}
          >
            Era Escape
          </div>
          <div style={{ flexGrow: 1 }}>
            <Menu
              className="lg-menu-items"
              mode="horizontal"
              style={{
                lineHeight: "64px",
                background: "#fff",
                borderBottom: "none",
              }}
              items={filterNavItems(menuItems, user?.role)}
              onClick={(e) => {
                navigate(e.key);
              }}
            />
          </div>
          <Flex gap={16}>
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
            <div className="hamburger-icon" onClick={showDrawer}>
              <MenuOutlined />
            </div>
          </Flex>
        </Flex>
      </Header>
      <LoginRegister
        isLoginModalOpen={isLoginModalOpen}
        handleCloseLoginModal={handleCloseLoginModal}
      />
      <LogoutConfirmModal isOpen={isLogoutOpen} setIsOpen={setIsLogoutOpen} />
      <Drawer
        closable={{ "aria-label": "Close Button" } as any}
        onClose={onClose}
        open={open}
      >
        <Menu
          mode="vertical"
          style={{ lineHeight: "64px", background: "#fff" }}
          items={filterNavItems(menuItems, user?.role)}
          onClick={(e) => {
            navigate(e.key);
          }}
        />
      </Drawer>
    </>
  );
};

export default Navbar;
