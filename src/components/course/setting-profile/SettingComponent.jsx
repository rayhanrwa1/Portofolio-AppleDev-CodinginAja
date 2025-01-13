import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import useAuth from '../../../../Database/Auth/auth';

const SettingComponent = () => {
    const { isLoggedIn, user, checkLoginStatus } = useAuth(); // Ambil fungsi dan state dari auth.js
    const [profileImage, setProfileImage] = useState('');
    const router = useRouter();

    useEffect(() => {
        // Panggil checkLoginStatus untuk memastikan pengguna terautentikasi
        checkLoginStatus();
    }, [checkLoginStatus]);

    useEffect(() => {
        if (user) {
            setProfileImage(user.profile_picture || '/assets/img/Icon-Profil_Set.svg');
        }
    }, [user]);

    const handleProfileImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('foto', file);

            try {
                const token = localStorage.getItem('token'); // Ambil token dari localStorage melalui auth.js
                const response = await fetch('https://jagobelajar.cloud/api/auth/update-photo', {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json();
                    setProfileImage(data.profile_image_url || '/assets/img/Icon-Profil_Set.svg');
                } else {
                    console.error('Failed to update profile image:', response.statusText);
                }
            } catch (error) {
                console.error('Error uploading profile image:', error);
            }
        }
    };

    const getProfileImage = () => {
        return profileImage || '/assets/img/Icon-Profil_Set.svg'; // Gambar default jika tidak ada
    };

    const styles = {
        container: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: '50px',
            backgroundColor: '#ffffff',
            minHeight: '100vh',
        },
        profileInfo: {
            display: 'flex',
            padding: '10px',
            width: '60%',
            maxWidth: '800px',
            marginBottom: '20px',
            paddingTop: '80px',
            paddingBottom: '70px',
            backgroundColor: '#111F2C',
            color: '#ffffff',
            borderRadius: '10px',
        },
        profilePictureContainer: {
            width: '50%',
            padding: '0 10px',
        },
        profilePicture: {
            borderRadius: '50%',
            width: '100%',
            height: 'auto',
            objectFit: 'cover',
            border: '5px solid #ffffff',
            backgroundColor: '#111F2C',
        },
        editIcon: {
            position: 'absolute',
            bottom: '5px',
            right: '5px',
            backgroundColor: '#ffffff',
            padding: '5px',
            borderRadius: '50%',
            cursor: 'pointer',
        },
        inputGroup: {
            marginBottom: '15px',
            width: '100%',
        },
        inputLabel: {
            display: 'block',
            marginBottom: '5px',
            fontWeight: 'bold',
            fontSize: '18px',
        },
        inputField: {
            width: '100%',
            padding: '12px',
            border: '5px solid #111F2C',
            borderRadius: '5px',
            fontSize: '16px',
            backgroundColor: '#ffffff',
            color: '#111F2C',
            transition: 'border-color 0.3s ease',
        },
    };

    return (
        <div className="container" style={styles.container}>
            <div className="row" style={styles.profileInfo}>
                <div className="col-md-6" style={styles.profilePictureContainer}>
                    <img src={getProfileImage()} alt="Profile" style={styles.profilePicture} />
                    <input
                        type="file"
                        id="profileImageInput"
                        style={{ display: 'none' }}
                        accept="image/*"
                        onChange={handleProfileImageChange}
                    />
                    <label htmlFor="profileImageInput" style={styles.editIcon}>
                        <FontAwesomeIcon icon={faEdit} />
                    </label>
                </div>
                <div className="col-md-6">
                    <div style={styles.inputGroup}>
                        <label style={styles.inputLabel}>Nama</label>
                        <input
                            type="text"
                            value={user ? user.name : ''}
                            readOnly
                            style={styles.inputField}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.inputLabel}>Email</label>
                        <input
                            type="text"
                            value={user ? user.email : ''}
                            readOnly
                            style={styles.inputField}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.inputLabel}>Nomor Telepon</label>
                        <input
                            type="text"
                            value={user ? user.phone_number : ''}
                            readOnly
                            style={styles.inputField}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingComponent;
