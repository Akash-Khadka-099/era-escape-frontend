import React, { useEffect, useRef, useState } from "react";
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
import useAuthModalStore from "@/store/authModalStore";
import {
  type TrendingTrekBlog,
  useFetchTrendingTrekBlogsByVisits,
} from "@/services/userHomepageServices/homepageServices";
import { routeLists } from "@/Routes/routeLists";
import {
  ArrowRightOutlined,
  CloseOutlined,
  FireOutlined,
  LeftOutlined,
  MenuOutlined,
  RightOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Drawer, Dropdown, Layout, Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

const { Header } = Layout;
const BASE_API_URL = import.meta.env.VITE_API_URL;

const resolveImageUrl = (imagePath?: string) => {
  if (!imagePath) {
    return "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop";
  }

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  const normalizedPath = imagePath.startsWith("/")
    ? imagePath
    : `/${imagePath}`;
  return `${BASE_API_URL}${normalizedPath}`;
};

const buildTrendSlogan = (blog: TrendingTrekBlog) => {
  if (blog?.trekBlog?.difficulty) {
    return `${blog.trekBlog.difficulty} trail • Popular read`;
  }

  return "Popular read this month";
};

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

const TrendingBlogsMegaMenu: React.FC<{
  label: string;
  blogs: TrendingTrekBlog[];
  isLoading: boolean;
  onSelectBlog: (slug: string) => void;
  onExploreAll: () => void;
}> = ({ label, blogs, isLoading, onSelectBlog, onExploreAll }) => {
  const topBlogs = blogs.slice(0, 4);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeTimerRef = useRef<number | null>(null);

  const clearCloseTimer = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const handleMouseEnter = () => {
    clearCloseTimer();
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      setIsMenuOpen(false);
      closeTimerRef.current = null;
    }, 180);
  };

  useEffect(() => {
    return () => {
      clearCloseTimer();
    };
  }, []);

  return (
    <div
      className={`trending-blogs-menu${isMenuOpen ? " trending-blogs-menu--open" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="trending-blogs-menu-label">{label}</span>
      <div className="trending-blogs-mega">
        <div className="trending-blogs-mega-header">
          <p className="trending-blogs-mega-title">Most Read Right Now</p>
          <span className="trending-blogs-mega-subtitle">
            Curated from recent reader activity
          </span>
        </div>

        <div className="trending-blogs-mega-grid">
          {isLoading ? (
            <div className="trending-blogs-loading">
              Loading trending blogs...
            </div>
          ) : topBlogs.length ? (
            topBlogs.map((item) => (
              <button
                className="trending-blogs-mega-card"
                key={item.trekBlogId}
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onSelectBlog(item?.trekBlog?.slug);
                  setIsMenuOpen(false);
                }}
              >
                <img
                  src={resolveImageUrl(item?.featuredImage?.path)}
                  alt={item?.trekBlog?.title}
                  className="trending-blogs-mega-card-image"
                />
                <div className="trending-blogs-mega-card-content">
                  <div className="trending-blogs-mega-card-chip">
                    <FireOutlined />
                    <span>Trending read</span>
                  </div>
                  <p className="trending-blogs-mega-card-title">
                    {item?.trekBlog?.title}
                  </p>
                  <span className="trending-blogs-mega-card-meta">
                    {buildTrendSlogan(item)}
                  </span>
                </div>
              </button>
            ))
          ) : (
            <div className="trending-blogs-empty">
              No trending blogs available.
            </div>
          )}
        </div>

        <button
          className="trending-blogs-explore"
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onExploreAll();
            setIsMenuOpen(false);
          }}
        >
          Explore all <ArrowRightOutlined />
        </button>
      </div>
    </div>
  );
};

const Navbar: React.FC = () => {
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [drawerView, setDrawerView] = useState<"main" | "destinations">("main");
  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // Check initial scroll
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomePage = location.pathname === "/";
  const isTransparentHero = isHomePage && !isScrolled;

  const { user, isAuthenticated } = useAuthStore();
  const { isAuthModalOpen, openAuthModal, closeAuthModal } =
    useAuthModalStore();
  const { data: trendingBlogsPayload, isLoading: isTrendingBlogsLoading } =
    useFetchTrendingTrekBlogsByVisits({ periodDays: 30, limit: 8 });
  const trendingBlogs = trendingBlogsPayload?.data || [];

  const handleCloseLoginModal = () => {
    closeAuthModal();
  };

  const showDrawer = () => {
    setDrawerView("main");
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setDrawerView("main");
  };

  const handleExploreAllTrending = () => {
    navigate(routeLists.trekTrails);
  };

  const handleOpenTrendingBlog = (slug?: string) => {
    if (!slug) {
      return;
    }
    navigate(`/trek-trails/detail/${slug}`);
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

      if (item.key === "trending-blogs") {
        return {
          ...item,
          label: (
            <TrendingBlogsMegaMenu
              label="Trending Blogs"
              blogs={trendingBlogs}
              isLoading={isTrendingBlogsLoading}
              onSelectBlog={handleOpenTrendingBlog}
              onExploreAll={handleExploreAllTrending}
            />
          ),
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
  const activeKey = baseMenuItems.find(
    (item) => item.key === location.pathname,
  )?.key;
  const activeKeyString = typeof activeKey === "string" ? activeKey : "/";
  const drawerPanelClass =
    drawerView === "destinations"
      ? "drawer-panels drawer-panels--shift"
      : "drawer-panels";

  return (
    <>
      <Header
        className={`navbar-header ${isHomePage ? "navbar-header--home" : ""} ${isTransparentHero ? "navbar-header--transparent" : ""}`}
      >
        <div className="navbar-container margin-container">
          {/* Mobile Hamburger - Left */}
          <div className="hamburger-icon" onClick={showDrawer}>
            <MenuOutlined />
          </div>

          {/* Logo - Center on Mobile, Left on Desktop */}
          <div className="brand-name" onClick={() => navigate("/")}>
            <img
              src="/favicon_era_escape.svg"
              alt="Era Escape logo"
              className="navbar-logo"
            />
            <span className="brand-text">Era Escape</span>
          </div>

          {/* Desktop Menu - Center */}
          <div className="desktop-menu-wrapper">
            <Menu
              className="lg-menu-items"
              mode="horizontal"
              items={desktopMenuItems}
              selectedKeys={[activeKeyString]}
              onClick={(e) => {
                if (e.key === "trending-blogs") {
                  navigate(routeLists.trekTrails);
                  return;
                }
                navigate(e.key);
              }}
              style={{ borderBottom: "none" }}
            />
          </div>

          {/* User/Auth Section - Right */}
          <div className="auth-section">
            {isAuthenticated ? (
              <Dropdown
                menu={{ items: dropdownMenu }}
                trigger={["click"]}
                placement="bottomRight"
              >
                <div className="user-profile-trigger">
                  <div className="user-info">
                    <span className="user-name">{`${user?.firstName} ${user?.lastName}`} </span>
                  </div>
                  <Avatar
                    size="large"
                    icon={<UserOutlined />}
                    className="user-avatar"
                    style={{ backgroundColor: "#2d5a5a" }}
                  />
                </div>
              </Dropdown>
            ) : (
              <div className="navbar-signin-wrapper">
                <Button
                  className="navbar-signin-button"
                  icon={<UserOutlined />}
                  onClick={openAuthModal}
                  // size="large"
                  style={{
                    background: "#2D5A5A",
                    color: "#fefefe",
                  }}
                >
                  SIGN IN
                </Button>
              </div>
            )}
          </div>
        </div>
      </Header>
      <LoginRegister
        isLoginModalOpen={isAuthModalOpen}
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
                          } else if (item.key === "trending-blogs") {
                            navigate(routeLists.trekTrails);
                            onClose();
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
                      openAuthModal();
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
