// Profile.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faMapMarkerAlt,
  faBuilding,
  faGraduationCap,
  faCamera,
  faSpinner,
  faTimes,
  faImage,
} from "@fortawesome/free-solid-svg-icons";

const BASE_URL = "https://jagobelajar.cloud/api/auth";

const PhotoUpload = ({ currentPhoto, onPhotoUpdate }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileUpload(file);
    }
  }, []);

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  }, []);

  const handleFileUpload = async (file) => {
    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Ukuran file terlalu besar! Maksimal 2MB"
      });
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Format file tidak didukung! Gunakan JPG, JPEG, atau PNG"
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to server
    setIsUploading(true);
    const formData = new FormData();
    formData.append('foto', file);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/update-photo?`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onPhotoUpdate(data.photo_url);
      setIsUploading(false);
      
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Foto profil berhasil diperbarui!",
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      setIsUploading(false);
      setPreviewUrl(null);
      
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal mengunggah foto profil!"
      });
    }
  };

  const cancelPreview = () => {
    setPreviewUrl(null);
  };

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Photo container with modern hover effect */}
      <div
        className={`relative rounded-full overflow-hidden cursor-pointer transform transition-all duration-300 ${
          isDragging ? 'ring-4 ring-blue-400' : ''
        } ${isHovered ? 'scale-105 shadow-2xl' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        style={{
          width: '300px',
          height: '300px',
        }}
      >
        {/* Profile photo */}
        <img
          src={previewUrl || currentPhoto || "https://via.placeholder.com/300"}
          alt="Profile"
          className="w-full h-full object-cover transition-all duration-300"
          style={{ 
            opacity: isUploading ? 0.5 : 1,
            filter: isHovered ? 'brightness(0.7)' : 'brightness(1)'
          }}
        />
        
        {/* Modern hover overlay with animation */}
        <div 
          className={`absolute inset-0 bg-gradient-to-b from-transparent to-black/70 flex flex-col items-center justify-center transition-all duration-300`}
          style={{
            opacity: isHovered ? 1 : 0,
            transform: `translateY(${isHovered ? '0' : '20px'})`,
          }}
        >
          <div className="text-white text-center p-4 transform transition-all duration-300">
            <div className="mb-3">
              <FontAwesomeIcon 
                icon={faCamera} 
                className="text-4xl mb-2 animate-pulse" 
              />
            </div>
            <p className="text-sm font-medium">Klik untuk mengganti foto</p>
            <p className="text-xs mt-1 opacity-80">atau drag & drop file foto</p>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/jpeg,image/png,image/jpg"
          onChange={handleFileChange}
        />
      </div>

      {/* Modern floating edit button */}
      <button
        onClick={triggerFileInput}
        className={`absolute bottom-2 right-2 bg-white text-blue-500 rounded-full p-3 shadow-lg transform transition-all duration-300 ${
          isHovered ? 'scale-110 translate-x-0 translate-y-0' : 'scale-90 translate-x-2 translate-y-2'
        }`}
        style={{
          opacity: isHovered ? 1 : 0,
        }}
        type="button"
      >
        <FontAwesomeIcon icon={faImage} className="text-lg" />
      </button>

      {/* Loading spinner */}
      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-full">
          <div className="relative">
            <FontAwesomeIcon 
              icon={faSpinner} 
              className="text-4xl text-white animate-spin" 
            />
            <p className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-white text-sm font-medium">
              Mengupload...
            </p>
          </div>
        </div>
      )}

      {/* Preview cancel button with animation */}
      {previewUrl && !isUploading && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            cancelPreview();
          }}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-110"
        >
          <FontAwesomeIcon icon={faTimes} className="text-sm" />
        </button>
      )}
    </div>
  );
};

const Profile = () => {
    const router = useRouter();
    const [userData, setUserData] = useState({
        id: "",
        name: "",
        email: "",
        address: "",
        age: "",
        instansi: "",
        class: "",
        photo: "",
    });
    const [isUpdateAllowed, setIsUpdateAllowed] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("Token not found");

                const response = await axios.get(`${BASE_URL}/user-data`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });

                const { data } = response.data;
                setUserData({
                    id: data.id,
                    name: data.name || "",
                    email: data.email || "",
                    address: data.address || "",
                    age: data.age || "",
                    instansi: data.instansi || "",
                    class: data.class || "",
                    photo: data.photo || "",
                });

                if (data.lastUpdated) {
                    const lastUpdatedDate = new Date(data.lastUpdated);
                    const currentDate = new Date();
                    const differenceInDays = Math.floor(
                        (currentDate - lastUpdatedDate) / (1000 * 60 * 60 * 24)
                    );
                    setIsUpdateAllowed(differenceInDays > 14);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Gagal mengambil data pengguna",
                });
            }
        };

        fetchUserData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isUpdateAllowed) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Anda belum dapat memperbarui data Anda. Silakan coba lagi dalam 14 hari mendatang!",
            });
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const updateData = {
                id: userData.id,
                address: userData.address,
                age: userData.age,
                instansi: userData.instansi,
            };

            await axios.put(`${BASE_URL}/update`, updateData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });

            Swal.fire({
                position: "center",
                icon: "success",
                title: "Data berhasil diperbarui!",
                showConfirmButton: false,
                timer: 1500,
            }).then(() => {
                router.push("/profil");
            });
        } catch (error) {
            console.error("Error updating profile:", error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Terjadi kesalahan saat menyimpan data!",
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="container py-5">
            <div className="card shadow">
                <div className="card-header text-center">
                    <h2 className="mb-0">Profil Pengguna</h2>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-4 text-center mb-4">
                            <div className="mb-3">
                                <PhotoUpload
                                    currentPhoto={userData.photo}
                                    onPhotoUpdate={(newPhotoUrl) => {
                                        setUserData(prev => ({
                                            ...prev,
                                            photo: newPhotoUrl
                                        }));
                                    }}
                                />
                            </div>
                            <h3 className="h4 mb-1">{userData.name}</h3>
                            <p className="text-muted">{userData.email}</p>
                        </div>

                        <div className="col-md-8">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">
                                        <FontAwesomeIcon icon={faUser} className="me-2" />
                                        Nama
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control bg-light"
                                        name="name"
                                        value={userData.name}
                                        readOnly
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control bg-light"
                                        name="email"
                                        value={userData.email}
                                        readOnly
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        <FontAwesomeIcon icon={faGraduationCap} className="me-2" />
                                        Kelas
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control bg-light"
                                        name="class"
                                        value={userData.class}
                                        readOnly
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
                                        Alamat
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="address"
                                        value={userData.address}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        <FontAwesomeIcon icon={faUser} className="me-2" />
                                        Umur
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="age"
                                        value={userData.age}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        <FontAwesomeIcon icon={faBuilding} className="me-2" />
                                        Universitas/Instansi
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="instansi"
                                        value={userData.instansi}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className={`btn w-100 ${!isUpdateAllowed ? "disabled" : ""}`}
                                    style={{
                                        backgroundColor: "#d3d3d3",
                                        color: "#000",
                                        transition: "background-color 0.3s",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (isUpdateAllowed)
                                            e.target.style.backgroundColor = "#999090";
                                    }}
                                    onMouseLeave={(e) => {
                                        if (isUpdateAllowed)
                                            e.target.style.backgroundColor = "#d3d3d3";
                                    }}
                                    disabled={!isUpdateAllowed}
                                >
                                    {isUpdateAllowed ? "Simpan Perubahan" : "Pembaruan Terkunci"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;