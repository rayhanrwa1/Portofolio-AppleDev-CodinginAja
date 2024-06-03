import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import SEO from "../common/seo";
import HeaderOne from "../components/homes/home"; // Import HeaderOne
import HeaderTwo from "../components/homes/home2"; // Import HeaderTwo
import Wrapper from "../layout/wrapper";
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'; // Import signOut
import app from '../../Database/Firebase/firebaseInit';

const Home = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    let timer; // Timer untuk logout otomatis

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        handleLogout();
      }, 60 * 1000); // Waktu dalam milidetik (5 menit)
    };

    const handleLogout = async () => {
      try {
        await signOut(auth);
        setIsLoggedIn(false);
        router.push("/login"); // Redirect ke halaman login setelah logout
      } catch (error) {
        console.error("Error logging out:", error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        resetTimer(); // Reset timer setiap kali ada aktivitas
      } else {
        setIsLoggedIn(false);
        clearTimeout(timer); // Bersihkan timer jika user tidak login
      }
    });

    // Panggil resetTimer setiap kali ada aktivitas
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keypress", resetTimer);

    return () => {
      unsubscribe();
      clearTimeout(timer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keypress", resetTimer);
    };
  }, []);

  return (
    <Wrapper>
      <SEO pageTitle={"Beranda"} />
      {isLoggedIn ? <HeaderTwo /> : <HeaderOne />}
    </Wrapper>
  );
};

export default Home;
