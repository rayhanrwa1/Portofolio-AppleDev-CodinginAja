import React, { useState, useEffect } from "react";
import HeaderOne from "@/src/layout/headers/header";
import HeaderTwo from "@/src/layout/headers/header_3_user";
import Support from "./bantuan";
import SupportArea from "./bantuan-area";
import Footer from "@/src/layout/footers/footer";
import Swal from 'sweetalert2';
import axios from 'axios';

const Bantuan = () => {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                // Call to Laravel API to check if the user is authenticated
                const response = await axios.get('https://jagobelajar.cloud/api/auth/user-data');
                if (response.data.loggedIn) {
                    setLoggedIn(true);
                    resetTimer();
                } else {
                    setLoggedIn(false);
                }
            } catch (error) {
                console.error("Error checking login status:", error);
                setLoggedIn(false);
            }
        };

        checkLoginStatus();

        let timer;

        const resetTimer = () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                handleLogout();
            }, 5 * 60 * 1000); // 5 minutes of inactivity
        };

        const handleLogout = async () => {
            try {
                // Send request to Laravel API to logout
                await axios.post('/api/logout');
                setLoggedIn(false);
                Swal.fire({
                    title: "Sesi Habis",
                    text: "Silakan login kembali!",
                    icon: "question"
                });
                window.location.href = '/login';
            } catch (error) {
                console.error("Error logging out:", error);
            }
        };

        window.addEventListener("mousemove", resetTimer);
        window.addEventListener("keypress", resetTimer);

        return () => {
            clearTimeout(timer);
            window.removeEventListener("mousemove", resetTimer);
            window.removeEventListener("keypress", resetTimer);
        };
    }, []);

    const showLoginAlert = () => {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Akses Dibatasi!!",
            footer: '<a href="/panduan">Ketentuan Login!</a>',
            allowOutsideClick: false,
            showConfirmButton: true,
            confirmButtonColor: '#111F2C',
            didOpen: () => {
                document.body.classList.add('blur');
            },
            willClose: () => {
                document.body.classList.remove('blur');
                window.location.href = '/';
            }
        });
    };

    return (
        <>
            {loggedIn ? <HeaderTwo /> : <HeaderOne />}
            <main>
                <Support />
                <SupportArea />
            </main>
            <Footer />
        </>
    );
};

export default Bantuan;
