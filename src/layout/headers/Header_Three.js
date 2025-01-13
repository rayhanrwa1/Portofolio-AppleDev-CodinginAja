import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import NavMenu from "./nav-menu_user";
import Sidebar from "./sidebar";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import useAuth from "../../../Database/Auth/auth";
import axios from "axios";

const HeaderThree = ({
  handleSearchIconClick,
  isToggleSearch,
  handleSearchInputChange,
  searchTerm,
  handleSearchSubmit,
  handleSubMenuToggle,
  isSubMenuOpen,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const DEFAULT_PROFILE_IMAGE = "/assets/img/icon-profile-manual.svg";

  const api = axios.create({
    baseURL: "https://jagobelajar.cloud/api",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  // Add token to requests
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await api.get("/auth/user-data");
      if (response.data && response.data.data) {
        const userDataResponse = response.data.data;
        setUserData({
          ...userDataResponse,
          photoUrl:
            userDataResponse.photo ||
            userDataResponse.profile_photo_url ||
            DEFAULT_PROFILE_IMAGE,
        });
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      if (error.response?.status === 401) {
        await logout();
        router.push("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const handleLogoutWithAlert = async () => {
    try {
      if (isSubMenuOpen) handleSubMenuToggle();

      const token = localStorage.getItem("token");
      if (token) {
        await api.delete("/auth/logout");
      }

      await Swal.fire({
        title: "Logging out...",
        timer: 1500,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiry");
      setUserData(null);

      await Swal.fire({
        position: "center",
        icon: "success",
        title: "Anda telah logout.",
        showConfirmButton: false,
        timer: 1500,
      });

      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      Swal.fire({
        icon: "error",
        title: "Logout gagal",
        text: "Silakan coba lagi",
      });
    }
  };

  const handleEditProfileClick = () => {
    if (isSubMenuOpen) handleSubMenuToggle();
    router.push("/setting-profil");
  };

  const handleProfileClick = () => {
    if (isSubMenuOpen) handleSubMenuToggle();
    router.push("/profil");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <style jsx global>{`
        .header-area {
          position: relative;
          z-index: 99;
        }
        .profile-image-container {
          position: relative;
          width: 60px;
          height: 60px;
          margin-right: 10px;
          margin-left: 20px;
          cursor: pointer;
          transition: transform 0.3s ease;
          border-radius: 50%;
          overflow: hidden;
        }
        .profile-image-container:hover {
          transform: scale(1.1);
        }
        .header-greeting {
          display: inline-block;
          margin-right: 15px;
          font-weight: 500;
        }
        .sub-menu {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          background-color: #fff;
          border: 1px solid #ccc;
          border-radius: 5px;
          padding: 10px;
          min-width: 180px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          display: none;
          opacity: 0;
          transform: translateY(-10px);
          transition: all 0.3s ease;
        }
        .sub-menu.open {
          display: block;
          opacity: 1;
          transform: translateY(0);
        }
        .sub-menu-item {
          padding: 8px 15px;
          cursor: pointer;
          display: flex;
          align-items: center;
          color: #333;
          transition: all 0.2s ease;
          border-radius: 4px;
        }
        .sub-menu-item:hover {
          background-color: #f5f5f5;
          transform: translateX(5px);
        }
        .sub-menu-item i {
          margin-right: 10px;
          width: 20px;
          text-align: center;
        }
        @media (max-width: 1190px) {
          .profile-image-container {
            display: none;
          }
          .header-greeting {
            display: none;
          }
        }
      `}</style>

      <header>
        <div className="header-area header-1-space pl-60 pr-60">
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col-xl-2 col-lg-6 col-md-5 col-7">
                <div className="logo">
                  <Link href="/">
                    <img src="/assets/img/logo/logo.svg" alt="logo" />
                  </Link>
                </div>
              </div>
              <div className="col-xl-7 d-none d-xl-block text-end">
                <div className="tp-main-menu text-center">
                  <nav id="mobile-menu">
                    <NavMenu />
                  </nav>
                </div>
              </div>
              <div className="col-xl-3 col-lg-6 col-md-7 col-5">
                <div className="search-main p-relative">
                  <div className="tp-header-right">
                    <div className="header-greeting">
                      {userData
                        ? `Halo, ${userData.username || userData.name}`
                        : "Selamat datang"}
                    </div>
                    <button
                      onClick={handleSearchIconClick}
                      className={`tp-header-icon tp-h-search p-relative ${
                        isToggleSearch ? "opened" : ""
                      }`}
                    >
                      <i className="fal fa-search"></i>
                      <i className="fal fa-times"></i>
                    </button>

                    {userData && (
                      <div
                        className="profile-image-container"
                        onClick={handleSubMenuToggle}
                      >
                        <Image
                          src={userData.photoUrl}
                          alt="Profile"
                          layout="fill"
                          objectFit="cover"
                          onError={(e) => {
                            e.target.src = DEFAULT_PROFILE_IMAGE;
                          }}
                        />
                      </div>
                    )}

                    <button
                      onClick={() => setIsOpen(true)}
                      className="tp-menu-toggle tp-header-icon ml-20 d-xl-none"
                    >
                      <i className="far fa-bars"></i>
                    </button>

                    {userData && (
                      <div
                        className={`sub-menu ${isSubMenuOpen ? "open" : ""}`}
                      >
                        <div
                          className="sub-menu-item"
                          onClick={handleProfileClick}
                        >
                          <i className="fal fa-user"></i>
                          <span>Profile</span>
                        </div>
                        <div
                          className="sub-menu-item"
                          onClick={handleEditProfileClick}
                        >
                          <i className="fal fa-cog"></i>
                          <span>Setting</span>
                        </div>
                        <div
                          className="sub-menu-item"
                          onClick={handleLogoutWithAlert}
                        >
                          <i className="fal fa-sign-out"></i>
                          <span>Logout</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {isToggleSearch && (
                    <div
                      className={`search-form ${
                        isToggleSearch ? "header_search-open" : ""
                      }`}
                    >
                      <form onSubmit={handleSearchSubmit}>
                        <input
                          type="text"
                          placeholder="Search here..."
                          value={searchTerm}
                          onChange={handleSearchInputChange}
                        />
                        <button type="submit">
                          <i className="fal fa-search"></i>
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default HeaderThree;
