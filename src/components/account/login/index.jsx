import React, { useState, useEffect } from "react";
import Breadcrumb from "@/src/common/breadcrumbs/breadcrumb_3";
import Login from "./login";
import Footer from "@/src/layout/footers/footer";
import HeaderTwo from "@/src/layout/headers/header_2";
import { useRouter } from "next/router";
import axios from "axios";

const LoginPage = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingLogin, setCheckingLogin] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const verifyToken = async () => {
      if (token) {
        try {
          const response = await axios.get(
            "https://jagobelajar.cloud/api/auth/user-data",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (response.data) {
            setLoggedIn(true);
            router.push("/");
          } else {
            setLoggedIn(false);
            localStorage.removeItem("token");
          }
        } catch (error) {
          console.error("Error verifying token:", error);
          setLoggedIn(false);
          localStorage.removeItem("token");
        }
      } else {
        setLoggedIn(false);
      }
      setCheckingLogin(false);
    };

    // Hanya jalankan verifyToken jika bukan dari proses login yang gagal
    const loginFailed = sessionStorage.getItem("loginFailed");
    if (!loginFailed) {
      verifyToken();
    } else {
      sessionStorage.removeItem("loginFailed");
      setCheckingLogin(false);
    }
  }, [router]);

  if (checkingLogin) {
    return null; // Or a loading spinner
  }

  return (
    <>
      {!loggedIn && (
        <>
          <HeaderTwo />
          <Breadcrumb title="Login" innertitle="Login" />
          <Login />
          <Footer />
        </>
      )}
    </>
  );
};

export default LoginPage;
