import React, { useEffect, useState } from 'react';
import HeaderOne from "@/src/layout/headers/header";
import HeaderTwo from "@/src/layout/headers/header_3_user";
import Footer from "@/src/layout/footers/footer";
import Privacy from "./panduan-env";
import Swal from 'sweetalert2';
import axios from 'axios';

const ElearningPanduanPage = () => {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') { // Ensure this runs only in the browser
            let timer;

            const resetTimer = () => {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    handleLogout();
                }, 5 * 60 * 1000);
            };

            const checkLoginStatus = async () => {
                try {
                    const response = await axios.get("/api/user");
                    if (response.data.loggedIn) {
                        setLoggedIn(true);
                        resetTimer();
                    } else {
                        setLoggedIn(false);
                        showLoginAlert();
                    }
                } catch (error) {
                    console.error("Error checking login status:", error);
                    setLoggedIn(false);
                    showLoginAlert();
                }
            };

            checkLoginStatus();

            window.addEventListener("mousemove", resetTimer);
            window.addEventListener("keypress", resetTimer);

            return () => {
                clearTimeout(timer);
                window.removeEventListener("mousemove", resetTimer);
                window.removeEventListener("keypress", resetTimer);
            };
        }
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post("/api/logout");
            setLoggedIn(false);
            Swal.fire({
                title: "Session Expired",
                text: "Please login again!",
                icon: "info",
            });
            window.location.href = "/login";
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const showLoginAlert = () => {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Access Denied!!",
            footer: '<a href="/panduan">Login Guidelines</a>',
            allowOutsideClick: false,
            showConfirmButton: true,
            confirmButtonColor: "#111F2C",
            didOpen: () => {
                document.body.classList.add('blur');
            },
            willClose: () => {
                document.body.classList.remove('blur');
                window.location.href = "/";
            },
        });
    };

    return (
        <>
            {loggedIn ? <HeaderTwo /> : <HeaderOne />}
            <main>
                <Privacy />
            </main>
            <Footer />
        </>
    );
};

export default ElearningPanduanPage;
