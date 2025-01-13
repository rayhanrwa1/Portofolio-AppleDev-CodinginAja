import React, { useEffect } from "react";
import HeaderOne from "@/src/layout/headers/header";
import HeaderTwo from "@/src/layout/headers/header_3_user";
import Footer from "@/src/layout/footers/footer";
import useAuth from "../../Database/Auth/auth"; // Menggunakan useAuth untuk cek login status
import Swal from "sweetalert2";

const Error404Page = () => {
    const { isLoggedIn, checkLoginStatus } = useAuth(); // Menggunakan hook useAuth untuk cek status login

    useEffect(() => {
        // Panggil fungsi untuk mengecek status login
        checkLoginStatus();
    }, [checkLoginStatus]);

    // Render Header berdasarkan status login
    const renderHeader = () => {
        if (isLoggedIn) {
            return <HeaderTwo />;
        } else {
            return <HeaderOne />;
        }
    };

    return (
        <>
            {renderHeader()}
            <div id="smooth-wrapper error_page">
                <div id="smooth-content">
                    <main>
                        <div className="tp-error-area tp-error-ptb p-relative">
                            <div className="container">
                                <div className="row">
                                    <div className="col-xl-12">
                                        <div className="tp-error-content-box text-center mb-40">
                                            <img src="/assets/img/text-404.png" alt="theme-pure" />
                                        </div>
                                        <div className="tp-error-text-box text-center">
                                            <h4 className="error-title-sm">Wah! Halamannya Tidak Ada!</h4>
                                            <p>Coba periksa kembali URL yang Anda masukkan.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Error404Page;
