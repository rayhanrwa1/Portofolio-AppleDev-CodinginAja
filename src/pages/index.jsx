// index.jsx (Home component)
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import SEO from "../common/seo";
import HeaderOne from "../components/homes/home";
import HeaderTwo from "../components/homes/home2";
import Wrapper from "../layout/wrapper";
import useAuth from "Database/Auth/auth";

const Home = () => {
  const router = useRouter();
  const { isLoggedIn, logout, user } = useAuth();
  const [lastActivity, setLastActivity] = useState(Date.now());
  const INACTIVE_TIMEOUT = 60 * 1000; // 1 minute

  const handleLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  useEffect(() => {
    const checkInactivity = () => {
      if (Date.now() - lastActivity >= INACTIVE_TIMEOUT) {
        handleLogout();
      }
    };

    const activityTimer = setInterval(checkInactivity, 10000); // Check every 10 seconds

    const updateActivity = () => {
      setLastActivity(Date.now());
    };

    // Add event listeners for user activity
    window.addEventListener("mousemove", updateActivity);
    window.addEventListener("keypress", updateActivity);
    window.addEventListener("click", updateActivity);
    window.addEventListener("scroll", updateActivity);
    window.addEventListener("touchstart", updateActivity);

    return () => {
      clearInterval(activityTimer);
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("keypress", updateActivity);
      window.removeEventListener("click", updateActivity);
      window.removeEventListener("scroll", updateActivity);
      window.removeEventListener("touchstart", updateActivity);
    };
  }, [lastActivity, handleLogout]);

  return (
    <Wrapper>
      <SEO pageTitle={"Beranda"} />
      {isLoggedIn ? <HeaderTwo /> : <HeaderOne />}
    </Wrapper>
  );
};

export default Home;
