import Maths from "../assets/subjects/Maths.avif";
import Physics from "../assets/subjects/Physics.webp";
import Chemistry from "../assets/subjects/Chemistry.webp";
import Biology from "../assets/subjects/Biology.webp";

export default function Courses() {
  const courses = [
    {
      title: "Mathematics",
      duration: "Class 10 & 12",
      teacher: "Mr. Sunil Kumar",
      img: Maths,
    },
    {
      title: "Physics",
      duration: "Class 10 & 12",
      teacher: "Mr. Ashish",
      img: Physics,
    },
    {
      title: "Chemistry",
      duration: "Class 10 & 12",
      teacher: "Dr. Ayush",
      img: Chemistry,
    },
    {
      title: "Biology",
      duration: "Class 10 & 12",
      teacher: "Ms. Neha",
      img: Biology,
    },
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">
          Popular <span className="text-blue-600">Courses</span>
        </h2>

        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto italic">
          Explore our specialized courses for Class 10th and 12th students.
          Enhance your skills and boost your academic performance with our
          expert-led classes.
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {courses.map((course, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 flex flex-col"
            >
              <div className="h-40 w-full overflow-hidden rounded-t-xl">
                <img
                  src={course.img}
                  alt={`${course.title} icon`}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <div className="p-6 flex flex-col grow">
                <h3 className="font-semibold text-xl text-gray-800 mb-1 text-center">
                  {course.title}
                </h3>
                <p className="text-gray-500 text-center mb-2">
                  {course.duration}
                </p>
                <p className="text-gray-700 text-center mb-6">
                  Teacher: {course.teacher}
                </p>

                <button className="mt-auto bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Enroll Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
