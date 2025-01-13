//index pada course 2
import React, { useEffect } from "react";
import Breadcrumb from "@/src/common/breadcrumbs/breadcrumb_5";
import HeaderOne from "@/src/layout/headers/header";
import HeaderTwo from "@/src/layout/headers/header_3_user";
import Footer from "@/src/layout/footers/footer";
import CoursePage from "./course-page"; // Sesuaikan path jika perlu
import useAuth from "../../../../Database/Auth/auth"; // Pastikan path benar

const SetProfil = () => {
  const { isLoggedIn, loading, logout } = useAuth(); // Ambil fungsi dan state dari Auth.jsx

  useEffect(() => {
    let timer; // Timer untuk logout otomatis

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        logout(); // Logout setelah 5 menit tidak ada aktivitas
      }, 5 * 60 * 1000); // 5 menit
    };

    // Reset timer saat ada aktivitas pengguna
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keypress", resetTimer);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keypress", resetTimer);
    };
  }, [logout]);

  // Tampilkan loading indicator jika status login sedang diperiksa
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {isLoggedIn ? <HeaderTwo /> : <HeaderOne />}
      <Breadcrumb title="Kelas Online" innertitle="Kelas Online" />
      <div className={`overlay ${isLoggedIn ? "hide" : ""}`} />
      <CoursePage />
      <Footer />
    </>
  );
};

export default SetProfil;
