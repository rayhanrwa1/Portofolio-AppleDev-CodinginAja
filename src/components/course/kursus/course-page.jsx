// components/course/kursus/course-page.jsx
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import axios from "axios";
import useAuth from "@/Database/Auth/auth";
import IndexCourseId from "./detail_page/indexCourseId"; // Import CourseDetailsPage component

const CoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null); // Add state for selected course
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://jagobelajar.cloud/api/courses",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch courses. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchCourses();
    }
  }, [isLoggedIn]);

  const handleCourseClick = (course) => {
    if (course.isLock === "disable") {
      Swal.fire({
        icon: "warning",
        title: "Belum Membayar",
        text: "Anda belum membayar kursus ini. Silakan lakukan pembayaran terlebih dahulu.",
        footer: '<a href="#">Butuh Bantuan?</a>',
      });
    } else {
      setSelectedCourse(course.id); // Set selected course ID
      router.push(`/kursus/${course.id}`, undefined, { shallow: true });
    }
  };

  // If a course is selected, render CourseDetailsPage
  if (selectedCourse) {
    return <IndexCourseId />;
  }

  if (loading) {
    return <div className="container pt-120">Loading...</div>;
  }

  return (
    <div className="service-area pt-120 pb-55">
      <div className="container">
        <h1 className="title pb-20">Kelas E-Learning</h1>
        <p className="title pb-20">
          Tenang, kamu datang ke tempat yang tepat! Di halaman ini, kamu akan
          menemukan kursus e-learning yang dirancang khusus untuk membantu kamu
          memulai perjalananmu di dunia pemrograman.
          <a href="/panduan_elearning" style={{ textDecoration: "underline" }}>
            {" "}
            Baca Selengkapnya
          </a>
        </p>
        <div className="row">
          {courses.map((course) => (
            <div
              key={course.id}
              className={`col-lg-4 col-md-6 pr-10 ${
                course.isLock === "disable" ? "locked" : ""
              }`}
            >
              <div
                className="tpservices"
                onClick={() => handleCourseClick(course)}
                style={{
                  cursor:
                    course.isLock === "enable" ? "pointer" : "not-allowed",
                }}
              >
                <div className="tpservices__thumb">
                  <div className="fix">
                    <img
                      src={course.image || "/default-course-image.jpg"}
                      alt={course.course_name}
                    />
                  </div>
                </div>
                <div className="tpservices__content">
                  <h3 className="tpservices__title pt-20">
                    {course.course_name}
                  </h3>
                  <ul>
                    {course.description &&
                      course.description
                        .split("\n")
                        .map(
                          (point, index) =>
                            point.trim() && <li key={index}>{point.trim()}</li>
                        )}
                    {course.chapters && (
                      <li>Total Chapters: {course.chapters.length}</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
