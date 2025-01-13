import React, { useEffect } from "react";
import { useRouter } from "next/router";
import useAuth from "@/Database/Auth/auth"; // Hook custom
import Profile from "./create-profil";
import HeaderTwo from "@/src/layout/headers/header_3_user";
import Footer from "@/src/layout/footers/footer";

const Index = () => {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, loading, router]);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <HeaderTwo />
      {isLoggedIn && <Profile />}
      <Footer />
    </>
  );
};

export default Index;
