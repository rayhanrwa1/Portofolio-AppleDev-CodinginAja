//index

import React, { useEffect } from "react";
import HeaderOne from "@/src/layout/headers/header";
import HeaderTwo from "@/src/layout/headers/header_3_user";
import Footer from "@/src/layout/footers/footer";
import Privacy from "src/components/panduan/panduan/panduan-env";
import Swal from "sweetalert2";
import useAuth from "../../../../Database/Auth/auth"; // Import fungsi autentikasi

const ElearningPanduanPage = () => {
    const { isLoggedIn, logout, checkLoginStatus } = useAuth(); // Gunakan fungsi dari auth.jsx

    useEffect(() => {
        let timer;

        // Reset timer untuk logout otomatis setelah 5 menit tidak ada aktivitas
        const resetTimer = () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                handleSessionTimeout();
            }, 5 * 60 * 1000); // 5 menit
        };

        // Tangani sesi habis waktu
        const handleSessionTimeout = async () => {
            await logout(); // Gunakan fungsi logout dari auth.jsx
            Swal.fire({
                title: "Session Expired",
                text: "Please login again!",
                icon: "info",
            });
        };

        // Pasang listener untuk aktivitas pengguna
        window.addEventListener("mousemove", resetTimer);
        window.addEventListener("keypress", resetTimer);

        checkLoginStatus(); // Periksa status login saat komponen dimuat

        return () => {
            clearTimeout(timer);
            window.removeEventListener("mousemove", resetTimer);
            window.removeEventListener("keypress", resetTimer);
        };
    }, [checkLoginStatus, logout]);

    return (
        <>
            {isLoggedIn ? <HeaderTwo /> : <HeaderOne />}
            <main>
                <Privacy />
            </main>
            <Footer />
        </>
    );
};

export default ElearningPanduanPage;
