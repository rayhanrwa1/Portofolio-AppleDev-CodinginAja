// ProyekIndexPage.jsx
import React from "react";
import HeaderOne from "@/src/layout/headers/header";
import HeaderTwo from "@/src/layout/headers/header_3_user";
import Footer from "@/src/layout/footers/footer";
import ProyekPage from "./ProyekPage";
import useAuth from "../../../../Database/Auth/auth";
import { useRouter } from 'next/router';

const ProyekIndexPage = () => {
    const { isLoggedIn } = useAuth();
    const router = useRouter();

    return (
        <>
            {isLoggedIn ? <HeaderTwo /> : <HeaderOne />}
            <main className="bg-gray-50 min-h-screen">
                {!isLoggedIn ? (
                    <div className="text-center py-8">
                        <h2 className="text-3xl font-bold mb-4 text-gray-800">Please Login</h2>
                        <p className="mb-4 text-gray-600">You need to be logged in to view projects.</p>
                        <button
                            className="px-6 py-2 bg-blue-600 text-gray-900 rounded-lg hover:bg-blue-700 transition-colors duration-300 ease-in-out transform hover:-translate-y-1"
                            onClick={() => router.push('/login')}
                        >
                            Go to Login
                        </button>
                    </div>
                ) : (
                    <ProyekPage />
                )}
            </main>
            <Footer />
        </>
    );
};

export default ProyekIndexPage;