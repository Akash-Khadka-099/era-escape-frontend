import React, { useState } from "react";
import "./navbar.css";
import LogoutConfirmModal from "@/components/Navbar/LogoutConfirmModal";
import {
  menuItems,
  nepalTrekCallout,
  nepalTrekPlaces,
  nepalTrekRegions,
  type NavMenuItem,
} from "@/components/Navbar/navbarItems";
import LoginRegister from "@/Pages/LoginRegister";
import useAuthStore from "@/store/authStore";
import {
  CloseOutlined,
  LeftOutlined,
  MenuOutlined,
  RightOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Drawer, Dropdown, Flex, Layout, Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

const { Header } = Layout;

const DestinationsMegaMenu: React.FC<{ label: string }> = ({ label }) => {
  return (
    <div className="destinations-menu">
      <span className="destinations-menu-label">{label}</span>
      <div className="destinations-mega">
        <div className="destinations-mega-inner">
          <div className="destinations-sidebar">
            <p className="destinations-sidebar-title">Nepal Trek Regions</p>
            <ul className="destinations-sidebar-list">
              {nepalTrekRegions.map((region) => (
                <li className="destinations-sidebar-item" key={region}>
                  {region}
                </li>
              ))}
            </ul>
            <div className="destinations-sidebar-link">View all treks</div>
          </div>
          <div className="destinations-grid">
            {nepalTrekPlaces.map((place) => (
              <div className="destinations-card" key={place.title}>
                <img src={place.image} alt={place.title} />
                <div className="destinations-card-info">
                  <p className="destinations-card-title">{place.title}</p>
                  <span className="destinations-card-sub">{place.region}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="destinations-callout">
            <img src={nepalTrekCallout.image} alt={nepalTrekCallout.title} />
            <p className="destinations-callout-title">
              {nepalTrekCallout.title}
            </p>
            <p className="destinations-callout-text">
              {nepalTrekCallout.description}
            </p>
            <button className="destinations-callout-button" type="button">
              {nepalTrekCallout.cta}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Navbar: React.FC = () => {
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isLoginModalOpen, setISLoginModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [drawerView, setDrawerView] = useState<"main" | "destinations">("main");

  const navigate = useNavigate();
  const location = useLocation();

  const { user, isAuthenticated } = useAuthStore();

  const handleCloseLoginModal = () => {
    setISLoginModalOpen(false);
  };

  const showDrawer = () => {
    setDrawerView("main");
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setDrawerView("main");
  };

  const dropdownMenu = [
    {
      label: "Logout",
      key: "1",
      icon: <UserOutlined />,
      onClick: () => setIsLogoutOpen(true),
    },
  ];

  const filterNavItems = (
    items: NavMenuItem[],
    userRole: string | undefined,
  ): NavMenuItem[] => {
    return items
      .map((item) => {
        // Check if item has required role
        const hasRole =
          item.role === "*" ||
          (Array.isArray(item.role) &&
            userRole &&
            item.role.includes(userRole));

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
      .filter((item): item is NavMenuItem => item !== null);
  };

  const buildDesktopMenuItems = (items: NavMenuItem[]): NavMenuItem[] => {
    return items.map((item) => {
      if (item.key === "/destinations") {
        return {
          ...item,
          label: <DestinationsMegaMenu label="Destinations" />,
        };
      }

      if (item.children) {
        return {
          ...item,
          children: buildDesktopMenuItems(item.children),
        };
      }

      return item;
    });
  };

  const baseMenuItems = filterNavItems(menuItems, user?.role);
  const desktopMenuItems = buildDesktopMenuItems(baseMenuItems);
  const activeKey =
    baseMenuItems.find((item) => item.key === location.pathname)?.key;
  const activeKeyString = typeof activeKey === "string" ? activeKey : "/";
  const drawerPanelClass =
    drawerView === "destinations"
      ? "drawer-panels drawer-panels--shift"
      : "drawer-panels";

  return (
    <>
      <Header
        className="margin-container"
        style={{
          backgroundColor: "transparent",
          // padding: "0",
          padding: "12px 0px",
          marginBottom: 12,
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
              display: "flex",
              gap: "8px",
            }}
            onClick={() => navigate("/")}
          >
            <img
              src="/favicon_era_escape.svg"
              alt="Era Escape logo"
              style={{ width: "64px", height: "64px" }}
            />
            <p
              style={{
                whiteSpace: "nowrap",
              }}
            >
              Era Escape
            </p>
          </div>
          <div style={{ flexGrow: 1 }}>
            <Menu
              className="lg-menu-items"
              mode="horizontal"
              style={{
                lineHeight: "64px",
                background: "#fff",
                borderBottom: "none",
                fontFamily: "Inter",
                fontSize: 16,
              }}
              items={desktopMenuItems}
              selectedKeys={[activeKeyString]}
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
              <div className="navbar-signin-wrapper">
                <Button
                  className="navbar-signin-button"
                  icon={<UserOutlined />}
                  onClick={() => setISLoginModalOpen(true)}
                  size="large"
                  style={{
                    background: "#2D5A5A",
                    color: "#fefefe",
                  }}
                >
                  SIGN IN
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
        className="mobile-drawer"
        closable={false}
        onClose={onClose}
        open={open}
        width={320}
        styles={{ body: { padding: 0 } }}
      >
        <div className="mobile-drawer-body">
          <div className="drawer-header">
            <button className="drawer-icon-button" type="button">
              <SearchOutlined />
            </button>
            <button
              className="drawer-brand"
              type="button"
              onClick={() => {
                navigate("/");
                onClose();
              }}
            >
              Era Escape
            </button>
            <button
              className="drawer-icon-button"
              type="button"
              onClick={onClose}
            >
              <CloseOutlined />
            </button>
          </div>
          <div className={drawerPanelClass}>
            <div className="drawer-panel">
              <div className="drawer-list">
                {baseMenuItems
                  .filter(
                    (item): item is NavMenuItem & { label: string } =>
                      "label" in item && typeof item.label === "string",
                  )
                  .map((item) => {
                    const label = item.label;
                  const isDestinations = item.key === "/destinations";

                  return (
                    <button
                      className="drawer-row"
                      key={item.key ?? label}
                      type="button"
                      onClick={() => {
                        if (isDestinations) {
                          setDrawerView("destinations");
                        } else if (typeof item.key === "string") {
                          navigate(item.key);
                          onClose();
                        }
                      }}
                    >
                      <span className="drawer-row-text">
                        {label.toUpperCase()}
                      </span>
                      {isDestinations ? (
                        <span
                          className="drawer-row-icon drawer-row-icon--action"
                          onClick={(event) => {
                            event.stopPropagation();
                            setDrawerView("destinations");
                          }}
                        >
                          <RightOutlined />
                        </span>
                      ) : (
                        <span className="drawer-row-icon">
                          <RightOutlined />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {/* {!isAuthenticated && (
                <div className="drawer-footer">
                  <Button
                    className="navbar-signin-button"
                    icon={<UserOutlined />}
                    onClick={() => {
                      setISLoginModalOpen(true);
                      onClose();
                    }}
                    size="large"
                    block
                  >
                    Sign In
                  </Button>
                </div>
              )} */}
            </div>
            <div className="drawer-panel">
              <div className="drawer-subheader">
                <button
                  className="drawer-back"
                  type="button"
                  onClick={() => setDrawerView("main")}
                >
                  <LeftOutlined />
                  <span>Back</span>
                </button>
                <div className="drawer-subtitle">Destinations</div>
              </div>
              <div className="drawer-callout-card">
                <img
                  src={nepalTrekCallout.image}
                  alt={nepalTrekCallout.title}
                />
                <div>
                  <p className="drawer-callout-title">
                    {nepalTrekCallout.title}
                  </p>
                  <p className="drawer-callout-text">
                    {nepalTrekCallout.description}
                  </p>
                  <button className="drawer-callout-link" type="button">
                    {nepalTrekCallout.cta}
                  </button>
                </div>
              </div>
              <div className="drawer-section">
                <div className="drawer-section-title">Trek Regions</div>
                <div className="drawer-section-list">
                  {nepalTrekRegions.map((region) => (
                    <button className="drawer-row" key={region} type="button">
                      <span className="drawer-row-text">
                        {region.toUpperCase()}
                      </span>
                      <span className="drawer-row-icon">
                        <RightOutlined />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default Navbar;
