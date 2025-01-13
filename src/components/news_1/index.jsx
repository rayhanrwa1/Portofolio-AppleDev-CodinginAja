import React, { useState, useEffect } from "react";
import Breadcrumb from "@/src/common/breadcrumbs/breadcrumb_2";
import HeaderOne from "@/src/layout/headers/header";
import HeaderTwo from "@/src/layout/headers/header_3_user";
import PostboxArea from "./postbox-area";
import Footer from "@/src/layout/footers/footer";
import Swal from 'sweetalert2';
import axios from 'axios'; // Import Axios for API calls

const Blog = () => {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        let timer;

        // Function to reset the session timer
        const resetTimer = () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                handleLogout();
            }, 5 * 60 * 1000); // 5 minutes
        };

        // Function to check if the user is logged in
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get("https://jagobelajar.cloud/api/auth/user-dataa"); // Laravel endpoint to check login status
                if (response.data.loggedIn) {
                    setLoggedIn(true);
                    resetTimer(); // Reset timer if logged in
                } else {
                    setLoggedIn(false);
                    showLoginAlert(); // Show alert if not logged in
                }
            } catch (error) {
                console.error("Error checking login status:", error);
                setLoggedIn(false);
                showLoginAlert(); // Show alert if error occurs
            }
        };

        checkLoginStatus(); // Check login status when the component mounts

        // Reset the timer on any user activity
        window.addEventListener("mousemove", resetTimer);
        window.addEventListener("keypress", resetTimer);

        return () => {
            clearTimeout(timer);
            window.removeEventListener("mousemove", resetTimer);
            window.removeEventListener("keypress", resetTimer);
        };
    }, []);

    // Handle user logout
    const handleLogout = async () => {
        try {
            await axios.post("/api/logout"); // Laravel logout endpoint
            setLoggedIn(false);
            Swal.fire({
                title: "Session Expired",
                text: "Please login again!",
                icon: "info",
            });
            window.location.href = "/login"; // Redirect to login page after logout
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    // Show login alert when user is not logged in
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
                document.body.classList.add('blur'); // Add blur effect
            },
            willClose: () => {
                document.body.classList.remove('blur'); // Remove blur effect
                window.location.href = "/"; // Redirect to homepage after alert is closed
            },
        });
    };

    return (
        <>
            {loggedIn ? <HeaderTwo /> : <HeaderOne />}
            <main>
                <Breadcrumb title="Berita" innertitle="Pusat Berita" />
                <PostboxArea />
            </main>
            <Footer />
        </>
    );
};

export default Blog;
