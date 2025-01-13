import { useState, useEffect } from "react";
import Breadcrumb from "@/src/common/breadcrumbs/breadcrumb_3";
import Login from "./resetPassword";
import Footer from "@/src/layout/footers/footer";
import HeaderTwo from "@/src/layout/headers/header_2";
import HeaderThreeUser from "@/src/layout/headers/header_3_user"; // Sesuaikan dengan struktur file Anda
import Swal from "sweetalert2";
import axios from "axios"; // Using axios for API calls

const Faq = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [timer, setTimer] = useState(null);

    useEffect(() => {
        let timeout;

        // Function to check login status by making API request
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get('https://jagobelajar.cloud/api/auth/user-data'); // Endpoint to check if the user is logged in
                if (response.data.loggedIn) {
                    setLoggedIn(true);
                    resetTimer();
                } else {
                    setLoggedIn(false);
                }
            } catch (error) {
                console.error('Error checking login status:', error);
                setLoggedIn(false);
            }
        };

        // Reset session timer
        const resetTimer = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                handleLogout();
            }, 5 * 30 * 1000); // 5 minutes
            setTimer(timeout);
        };

        // Handle logout
        const handleLogout = async () => {
            try {
                await axios.post('/api/logout'); // Laravel logout endpoint
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

        // Show alert for restricted access if not logged in
        const showLoginAlert = () => {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Akses Dibatasi!!",
                footer: '<a href="/panduan">Ketentuan Login!</a>',
                allowOutsideClick: false,
                showConfirmButton: true,
                didOpen: () => {
                    document.body.classList.add('blur');
                },
                willClose: () => {
                    document.body.classList.remove('blur');
                    window.location.href = '/';
                }
            });
        };

        // Call the function to check login status
        checkLoginStatus();

        // Listeners for mousemove or keypress to reset the timer
        window.addEventListener("mousemove", resetTimer);
        window.addEventListener("keypress", resetTimer);

        // Cleanup on component unmount
        return () => {
            clearTimeout(timeout);
            window.removeEventListener("mousemove", resetTimer);
            window.removeEventListener("keypress", resetTimer);
        };
    }, []);

    return (
        <>
            {loggedIn ? <HeaderThreeUser /> : <HeaderTwo />}
            <Breadcrumb title="Lupa Password" innertitle="Reset Password" />
            <Login />
            <Footer />
        </>
    );
};

export default Faq;
