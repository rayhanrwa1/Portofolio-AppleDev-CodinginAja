import React, { useEffect, useState } from 'react';
import HeaderOne from "@/src/layout/headers/header";
import HeaderTwo from "@/src/layout/headers/header_3_user";
import Privacy from "./carieers";
import Footer from "@/src/layout/footers/footer";
import Swal from 'sweetalert2';
import axios from 'axios';

const PrivacyPage = () => {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                // Call to Laravel API to check if the user is authenticated
                const response = await axios.get('/api/user');
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

        let timer = setTimeout(() => {
            handleLogout();
        }, 30 * 1000); // 30 seconds for example

        const resetTimer = () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                handleLogout();
            }, 30 * 1000); // Reset timeout after 30 seconds of inactivity
        };

        const handleLogout = async () => {
            try {
                // Send logout request to Laravel API
                await axios.post('/api/logout');
                setLoggedIn(false);
                Swal.fire({
                    title: "Sesi Habis",
                    text: "Silakan login kembali!",
                    icon: "question"
                });
                window.location.href = '/login'; // Redirect to login page
            } catch (error) {
                console.error("Error logging out:", error);
            }
        };

        // Reset the timer on mouse move or keypress
        window.addEventListener("mousemove", resetTimer);
        window.addEventListener("keypress", resetTimer);

        // Cleanup the event listeners and timer when component is unmounted
        return () => {
            clearTimeout(timer);
            window.removeEventListener("mousemove", resetTimer);
            window.removeEventListener("keypress", resetTimer);
        };
    }, []);

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

export default PrivacyPage;
