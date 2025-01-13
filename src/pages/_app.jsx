import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import "@/src/styles/index.scss"; // Import your global styles here

function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const logoutTimeout = useRef(null);
    const [isOnline, setIsOnline] = useState(true);

    // Check for userData cookie on initial load and redirect to profile if found
    useEffect(() => {
        const userData = Cookies.get('userData');
        if (userData) {
            const userDataJSON = JSON.parse(userData); // Convert the cookie value to JSON
            router.replace('/profile'); // Use replace to avoid storing the current page in history
        }
    }, []);

    // Handle automatic logout after inactivity and reset logout timer on user interaction
    useEffect(() => {
        const handleLogout = () => {
            Cookies.remove('userData');
            router.replace('/login'); // Redirect to login page
        };

        const resetLogoutTimer = () => {
            if (logoutTimeout.current) {
                clearTimeout(logoutTimeout.current);
            }
            logoutTimeout.current = setTimeout(handleLogout, 10 * 60 * 1000); // 10 minutes of inactivity
        };

        const handleInteraction = () => {
            resetLogoutTimer(); // Reset the timer on any user interaction
        };

        resetLogoutTimer(); // Start the timer on mount

        // Event listeners for user interaction to reset timer
        document.addEventListener('mousemove', handleInteraction);
        document.addEventListener('mousedown', handleInteraction);
        document.addEventListener('keypress', handleInteraction);
        document.addEventListener('touchmove', handleInteraction);

        return () => {
            // Cleanup event listeners
            document.removeEventListener('mousemove', handleInteraction);
            document.removeEventListener('mousedown', handleInteraction);
            document.removeEventListener('keypress', handleInteraction);
            document.removeEventListener('touchmove', handleInteraction);
            clearTimeout(logoutTimeout.current); // Clear the timeout on unmount
        };
    }, []);

    // Handle online/offline status
    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
        };

        const handleOffline = () => {
            setIsOnline(false);
            setTimeout(() => {
                if (!isOnline) {
                    Swal.fire({
                        icon: 'question',
                        title: 'No Internet Connection',
                        text: 'Please check your internet connection and try again.',
                    });
                }
            }, 5000); // Show the alert after 5 seconds if still offline
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [isOnline]);

    // Load Bootstrap only in the browser
    useEffect(() => {
        import('bootstrap/dist/js/bootstrap');
    }, []);

    // Handle mobile view check and show alert if accessed from a mobile device
    useEffect(() => {
        const handleResize = () => {
            const screenWidth = window.innerWidth;
            if (screenWidth <= 768) {
                Swal.fire({
                    icon: "error",
                    title: "Mobile View Not Supported",
                    text: "Sorry, this platform cannot be accessed using a mobile view.",
                    footer: '<a href="#">Need help?</a>',
                    allowOutsideClick: false, // Prevent closing Swal by clicking outside
                }).then(() => {
                    window.location.href = "/";
                });
            }
        };

        // Check for mobile device or screen size on mount
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile) {
            handleResize(); // Trigger on mobile view
        } else {
            window.addEventListener('resize', handleResize); // Trigger on window resize
        }

        return () => {
            window.removeEventListener('resize', handleResize); // Cleanup the event listener on unmount
        };
    }, []);

    return <Component {...pageProps} />;
}

export default MyApp;
