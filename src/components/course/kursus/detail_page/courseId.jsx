import { useRouter } from "next/router";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const CourseDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!id) {
        console.warn("Course ID is undefined. Skipping fetch...");
        return;
      }

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

        const courses = response.data;
        const selectedCourse = courses.find(
          (course) => course.id === parseInt(id)
        );

        if (selectedCourse) {
          setCourse(selectedCourse);
        } else {
          Swal.fire({
            icon: "error",
            title: "Not Found",
            text: `Course with ID ${id} not found.`,
          });
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch course details. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-700 text-lg font-semibold">Loading...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">No course found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-200 via-purple-100 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl space-y-12">
        {" "}
        {/* Added spacing between course cards */}
        <nav className="mb-8">
          <button
            onClick={() => router.push("/course")}
            className="text-blue-600 hover:text-blue-800 transition-colors flex items-center text-lg"
          >
            <i className="fas fa-arrow-left mr-2"></i> Kembali ke courses
          </button>
        </nav>
        <div className="bg-white rounded-xl shadow-xl p-8 mb-12 transform transition duration-500 hover:scale-[1.05] ease-in-out">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                {course.course_name}
              </h1>
              <p className="text-gray-700 text-lg">{course.description}</p>
            </div>
            <span
              className={`px-6 py-3 rounded-full text-lg font-semibold flex items-center gap-2
              ${
                course.isLock === "enable"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <i
                className={`fas fa-${
                  course.isLock === "enable" ? "unlock" : "lock"
                } text-xl`}
              ></i>
              {course.isLock === "enable" ? "Unlocked" : "Locked"}
            </span>
          </div>
        </div>
        <div className="space-y-12">
          {" "}
          {/* Added spacing between chapter cards */}
          {course.chapters &&
            course.chapters.map((chapter) => (
              <div
                key={chapter.id}
                onClick={() => router.push(`/chapter/${chapter.id}`)}
                className="cursor-pointer border-2 border-gray-100 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 ease-in-out hover:scale-[1.05] flex items-start gap-6 bg-white relative group"
              >
                <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center rounded-xl bg-blue-100 text-blue-600 text-2xl">
                  {chapter.material_type === "video" ? (
                    <i className="fas fa-video"></i>
                  ) : (
                    <i className="fas fa-file-alt"></i>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {chapter.title}
                  </h3>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {chapter.material_type}
                    </span>
                    <span className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      {chapter.language}
                    </span>
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {chapter.content}
                  </p>
                </div>

                <div className="absolute right-6 top-6">
                  <div
                    className={`w-12 h-12 flex items-center justify-center rounded-full ${
                      chapter.isLocked
                        ? "bg-red-100 text-red-500"
                        : "bg-green-100 text-green-500"
                    }`}
                  >
                    <i
                      className={`fas fa-${
                        chapter.isLocked ? "lock" : "unlock"
                      } text-2xl`}
                    ></i>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .container {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default CourseDetailPage;
