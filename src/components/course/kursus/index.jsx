//index.jsx
import React, { useState, useEffect } from "react";
import Breadcrumb from "@/src/common/breadcrumbs/breadcrumb_5";
import HeaderTwo from "@/src/layout/headers/header_3_user";
import Footer from "@/src/layout/footers/footer";
import CoursePage from "./course-page";
import Swal from "sweetalert2";
import useAuth from "../../../../Database/Auth/auth";
import { useRouter } from "next/router";

const SetProfil = () => {
  const { isLoggedIn, loading, logout, checkLoginStatus } = useAuth();
  const [sessionTimer, setSessionTimer] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Fungsi untuk memeriksa token
  const checkToken = () => {
    const token = localStorage.getItem("token");
    const tokenExpiry = localStorage.getItem("tokenExpiry");

    if (!token || !tokenExpiry) {
      return false;
    }

    const now = new Date().getTime();
    const expiryTime = parseInt(tokenExpiry, 10);
    return now < expiryTime;
  };

  useEffect(() => {
    const setupInactivityTimer = () => {
      if (sessionTimer) {
        clearTimeout(sessionTimer);
      }

      const newTimer = setTimeout(() => {
        handleLogout();
      }, 5 * 60 * 1000);

      setSessionTimer(newTimer);
    };

    const initializeAuth = async () => {
      try {
        await checkLoginStatus();

        // Jika tidak ada token atau login gagal
        if (!checkToken()) {
          showAccessDenied();
          return;
        }

        // Jika login berhasil dan token valid
        setIsAuthenticated(true);
        setupInactivityTimer();
      } catch (error) {
        console.error("Error checking authentication:", error);
        showAccessDenied();
      }
    };

    initializeAuth();

    const resetTimer = () => {
      if (checkToken()) {
        setupInactivityTimer();
      }
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keypress", resetTimer);

    return () => {
      if (sessionTimer) {
        clearTimeout(sessionTimer);
      }
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keypress", resetTimer);
    };
  }, [sessionTimer, checkLoginStatus]);

  const showAccessDenied = () => {
    Swal.fire({
      icon: "error",
      title: "Akses Dibatasi",
      text: "Silakan login untuk mengakses konten!",
      footer: '<a href="/panduan">Ketentuan Login</a>',
      allowOutsideClick: false,
      showConfirmButton: true,
      confirmButtonColor: "#111F2C",
      backdrop: true,
      didOpen: () => {
        const backdrop = document.querySelector(".swal2-backdrop");
        if (backdrop) {
          backdrop.style.backdropFilter = "blur(100px)";
        }
      },
      didClose: () => {
        router.push("/login");
      },
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiry");

      Swal.fire({
        icon: "info",
        title: "Sesi Berakhir",
        text: "Sesi Anda telah berakhir. Silakan login kembali.",
        confirmButtonColor: "#111F2C",
      }).then(() => {
        router.push("/login");
      });
    } catch (error) {
      console.error("Logout failed:", error);
      router.push("/login");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // Hanya tampilkan konten jika sudah login dan ada token valid
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <HeaderTwo />
      <Breadcrumb title="E-Learning" innertitle="E-Learning" />
      <CoursePage />
      <Footer />
    </>
  );
};

export default SetProfil;
