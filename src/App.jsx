import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login"; // ✅ ADD
import Admission from "./pages/Admission";
// Admin Portal
import AdminDashboard from "./portals/admin/AdminDashboard";
import AdminAdmissions from "./portals/admin/AdminAdmissions";
import AdminLayout from "./portals/admin/AdminLayout";
import AdminAdd from "./portals/admin/AdminAdd";
// Student Portal
import StudentDashboard from "./portals/student/StudentDashboard";
import StudentNotes from "./portals/student/StudentNotes";
import StudentAttendance from "./portals/student/StudentAttendance";
import StudentProfile from "./portals/student/StudentProfile";
import StudentFeedbackForm from "./portals/student/StudentFeedbackForm";
import StudentTimeTable from "./portals/student/StudentTimeTable";
import StudentExam from "./portals/student/StudentExam";
import StudentHelpCenter from "./portals/student/StudentHelpCenter";
import StudentSafetyTips from "./portals/student/StudentSafetyTips";
import StudentSettings from "./portals/student/StudentSettings";
import StudentEBook from "./portals/student/StudentEBook";
// import Register from "./pages/Register";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/login" element={<Login />} /> {/* ✅ ADD */}
        <Route path="/admission" element={<Admission />} />
        {/* Student Portal */}
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/notes" element={<StudentNotes />} />
        <Route path="/student/attendance" element={<StudentAttendance />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/student/feedback" element={<StudentFeedbackForm />} />
        <Route path="/student/timetable" element={<StudentTimeTable />} />
        <Route path="/student/exams" element={<StudentExam />} />
        <Route path="/student/support" element={<StudentHelpCenter />} />
        <Route path="/student/security" element={<StudentSafetyTips />} />
        <Route path="/student/settings" element={<StudentSettings />} />
        <Route path="/student/resources" element={<StudentEBook />} />
        {/* Admin Portal */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/admissions" element={<AdminAdmissions />} />
        <Route path="/admin/notes" element={<AdminLayout />} />
        <Route path="/admin/add-admin" element={<AdminAdd />} />
      </Routes>
      <ScrollToTop />
    </BrowserRouter>
  );
}
