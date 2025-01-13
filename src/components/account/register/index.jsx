import React, { useState, useEffect } from "react";
import axios from 'axios';  // Menggunakan axios untuk request ke API Laravel
import 'sweetalert2/src/sweetalert2.scss';
import Breadcrumb from "@/src/common/breadcrumbs/breadcrumb_3";
import RegisterForm from "./register"; // Pastikan menyesuaikan path dengan struktur proyek Anda
import Footer from "@/src/layout/footers/footer";
import HeaderTwo from "@/src/layout/headers/header_2";
import { useRouter } from 'next/router';

const Register = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Cek status login berdasarkan token dari Laravel
        const checkLoginStatus = async () => {
            const token = localStorage.getItem('auth_token'); // Ambil token dari localStorage
            if (token) {
                try {
                    // Cek token dengan request ke API Laravel
                    const response = await axios.get('http://your-laravel-api.com/api/user', {
                        headers: {
                            Authorization: `Bearer ${token}` // Kirimkan token untuk autentikasi
                        }
                    });

                    if (response.data) {
                        // Pengguna sudah login, kita bisa memeriksa apakah mereka harus logout
                        setLoggedIn(false); // Setel ke false jika sudah login
                    }
                } catch (error) {
                    console.error('Error verifying token:', error);
                    setLoggedIn(false); // Jika token tidak valid, setel ke false
                }
            } else {
                setLoggedIn(false); // Jika tidak ada token, berarti pengguna belum login
            }
        };

        checkLoginStatus();
    }, []);

    // Fungsi ini akan dijalankan saat pengguna berhasil mendaftar
    const handleRegistrationSuccess = () => {
        setLoggedIn(false); // Setelah berhasil mendaftar, set loggedIn menjadi true untuk mengarahkan ke halaman login
    };

    return (
        <>
            {!loggedIn && (
                <>
                    <HeaderTwo />
                    <Breadcrumb title="Register" innertitle="Register" />
                    <RegisterForm onSuccess={handleRegistrationSuccess} /> {/* Anda harus menyesuaikan ini dengan komponen Register yang sebenarnya */}
                    <Footer />
                </>
            )}
        </>
    );
};

export default Register;
