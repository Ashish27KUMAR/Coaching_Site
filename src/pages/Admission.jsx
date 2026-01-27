import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import emailjs from "@emailjs/browser";
import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const CLASSES = [
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
  "JEE",
  "NEET",
];
const SUBJECTS = ["Physics", "Chemistry", "Maths", "Biology"];
const GENDERS = ["Male", "Female", "Other"];
const HOW_HEARD_OPTIONS = [
  "Friend/Family",
  "Social Media",
  "Google Search",
  "Advertisement",
  "Other",
];

export default function Admission() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    bloodGroup: "",
    dob: "",
    photo: null,
    photoPreview: null,
    email: "",
    phone: "",
    fatherName: "",
    fatherPhone: "",
    motherName: "",
    motherPhone: "",
    tempAddress: "",
    permAddress: "",
    sameAddress: false,
    selectedClass: "",
    selectedSubjects: [],
    gender: "",
    altContact: "",
    heardFrom: "",
    additionalNotes: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (form.sameAddress) {
      setForm((prev) => ({ ...prev, permAddress: prev.tempAddress }));
    }
  }, [form.sameAddress, form.tempAddress]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name === "sameAddress") {
      setForm((prev) => ({ ...prev, sameAddress: checked }));
    } else if (type === "checkbox" && name === "selectedSubjects") {
      if (checked) {
        setForm((prev) => ({
          ...prev,
          selectedSubjects: [...prev.selectedSubjects, value],
        }));
      } else {
        setForm((prev) => ({
          ...prev,
          selectedSubjects: prev.selectedSubjects.filter(
            (sub) => sub !== value,
          ),
        }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSizeInKB = 200;
    if (file.size > maxSizeInKB * 1024) {
      setMessage({
        type: "error",
        text: `Photo size must be less than ${maxSizeInKB}KB.`,
      });
      e.target.value = null;
      return;
    }

    setForm((prev) => ({
      ...prev,
      photo: file,
      photoPreview: URL.createObjectURL(file),
    }));
    setMessage(null);
  };

  const removePhoto = () => {
    if (form.photoPreview) URL.revokeObjectURL(form.photoPreview);
    setForm((prev) => ({ ...prev, photo: null, photoPreview: null }));
  };

  const validateForm = () => {
    const required = [
      "firstName",
      "lastName",
      "bloodGroup",
      "dob",
      "email",
      "phone",
      "fatherName",
      "fatherPhone",
      "motherName",
      "motherPhone",
      "tempAddress",
      "selectedClass",
      "gender",
      "heardFrom",
    ];

    for (let field of required) {
      if (
        !form[field] ||
        (typeof form[field] === "string" && !form[field].trim())
      ) {
        setMessage({ type: "error", text: `Please fill the ${field} field.` });
        return false;
      }
    }

    if (!form.photo) {
      setMessage({ type: "error", text: "Please upload a profile photo." });
      return false;
    }

    if (form.selectedSubjects.length === 0) {
      setMessage({
        type: "error",
        text: "Please select at least one subject.",
      });
      return false;
    }

    return true;
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setMessage(null);
    if (!validateForm()) return;

    setLoading(true);
    try {
      // 1. Cloudinary Upload
      let photoUrl = "";
      const birthYear = new Date(form.dob).getFullYear();
      const fileExt = form.photo.name.split(".").pop();
      const newFileName = `${form.firstName.trim()}_${birthYear}.${fileExt}`;

      const data = new FormData();
      data.append("file", form.photo); // Use original photo
      data.append("upload_preset", "Student_photos");
      data.append("cloud_name", "dsiwf1ane");

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/dsiwf1ane/image/upload`,
        { method: "POST", body: data },
      );
      const cloudData = await cloudRes.json();
      photoUrl = cloudData.secure_url;

      // 2. Clean Data: Remove null, undefined, and empty strings
      const { photo, photoPreview, ...rawData } = form;

      const cleanData = Object.fromEntries(
        Object.entries(rawData).filter(([_, value]) => {
          return value !== "" && value !== null && value !== undefined;
        }),
      );

      // 3. Firebase Firestore
      await addDoc(collection(db, "admissions"), {
        ...cleanData,
        photoUrl,
        status: "Pending",
        createdAt: serverTimestamp(),
      });

      // 4. EmailJS
      await emailjs.send(
        "service_zuocjby",
        "template_kipbe9k",
        {
          to_name: `${form.firstName} ${form.lastName}`,
          to_email: form.email,
          message: "Aapka Application successfully submit ho gaya hai!",
        },
        "6Jyb3jiw7AcgP0POu",
      );

      // Ye line add karein page ko upar bhejne ke liye
      window.scrollTo({ top: 0, behavior: "smooth" });

      setMessage({
        type: "success",
        text: "Admission form submitted successfully!",
      });

      // Reset Form
      setForm({
        firstName: "",
        lastName: "",
        bloodGroup: "",
        dob: "",
        photo: null,
        photoPreview: null,
        email: "",
        phone: "",
        fatherName: "",
        fatherPhone: "",
        motherName: "",
        motherPhone: "",
        tempAddress: "",
        permAddress: "",
        sameAddress: false,
        selectedClass: "",
        selectedSubjects: [],
        gender: "",
        altContact: "",
        heardFrom: "",
        additionalNotes: "",
      });
    } catch (error) {
      console.error(error);
      alert("Error Details: " + (error.message || JSON.stringify(error)));
      setMessage({
        type: "error",
        text: "Submission failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        select {
            padding-right: 2.5rem !important;
            appearance: none !important;
            background-image: url("data:image/svg+xml;utf8,<svg fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><polyline points='6 9 12 15 18 9'></polyline></svg>");
            background-repeat: no-repeat;
            background-position: right 0.75rem center;
            background-size: 1rem;
        }
      `}</style>

      <TopBar />
      <Navbar />

      <section className="py-16 bg-white min-h-screen">
        <div className="max-w-5xl mx-auto px-6 bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200">
          <h2 className="text-4xl font-extrabold mb-10 text-center text-blue-900">
            Online Admission Form
          </h2>

          {message && (
            <div
              className={`mb-6 p-4 rounded-lg text-center font-semibold ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              {message.text}
            </div>
          )}

          <form
            onSubmit={submitForm}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Personal Info */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                First Name <span className="text-red-600">*</span>
              </label>
              <input
                name="firstName"
                type="text"
                placeholder="Enter first name"
                value={form.firstName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Last Name <span className="text-red-600">*</span>
              </label>
              <input
                name="lastName"
                type="text"
                placeholder="Enter last name"
                value={form.lastName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
                required
              />
            </div>

            <div className="md:col-span-2 bg-blue-50 p-6 rounded-xl border border-blue-100">
              <label className="block mb-1 font-bold text-blue-900">
                Upload Student Photo <span className="text-red-600">*</span>
              </label>
              <p className="text-xs text-blue-700 mb-3 font-medium">
                Note: <br /> 1. File must be under **200KB**. <br /> 2. System
                will automatically rename it to **Name_BirthYear** format.
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white cursor-pointer"
                required
              />
              {form.photoPreview && (
                <div className="mt-3 flex items-center gap-4">
                  <img
                    src={form.photoPreview}
                    alt="Preview"
                    className="h-24 w-24 rounded-lg object-cover border-2 border-white shadow-md"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="bg-red-100 text-red-600 px-3 py-1 rounded-md text-sm font-bold hover:bg-red-200 transition"
                  >
                    Remove Photo
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Blood Group <span className="text-red-600">*</span>
              </label>
              <select
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white"
                required
              >
                <option value="">Select</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Date of Birth <span className="text-red-600">*</span>
              </label>
              <input
                name="dob"
                type="date"
                value={form.dob}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Gender <span className="text-red-600">*</span>
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white"
                required
              >
                <option value="">Select</option>
                {GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Email Address <span className="text-red-600">*</span>
              </label>
              <input
                name="email"
                type="email"
                placeholder="Enter email address"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Phone Number <span className="text-red-600">*</span>
              </label>
              <input
                name="phone"
                type="tel"
                placeholder="Enter phone number"
                value={form.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
                required
              />
            </div>

            {/* Academic Info */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Select Class <span className="text-red-600">*</span>
              </label>
              <select
                name="selectedClass"
                value={form.selectedClass}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white"
                required
              >
                <option value="">Select Class</option>
                {CLASSES.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Select Subjects <span className="text-red-600">*</span>
              </label>
              <div className="flex flex-wrap gap-4">
                {SUBJECTS.map((sub) => (
                  <label
                    key={sub}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name="selectedSubjects"
                      value={sub}
                      checked={form.selectedSubjects.includes(sub)}
                      onChange={handleChange}
                      className="w-4 h-4 accent-blue-600"
                    />
                    {sub}
                  </label>
                ))}
              </div>
            </div>
            <br />

            {/* Parents Info */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Father's Name <span className="text-red-600">*</span>
              </label>
              <input
                name="fatherName"
                type="text"
                placeholder="Enter father's name"
                value={form.fatherName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Father's Phone <span className="text-red-600">*</span>
              </label>
              <input
                name="fatherPhone"
                type="tel"
                placeholder="Enter father's phone number"
                value={form.fatherPhone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Mother's Name <span className="text-red-600">*</span>
              </label>
              <input
                name="motherName"
                type="text"
                placeholder="Enter mother's name"
                value={form.motherName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Mother's Phone <span className="text-red-600">*</span>
              </label>
              <input
                name="motherPhone"
                type="tel"
                placeholder="Enter mother's phone number"
                value={form.motherPhone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
                required
              />
            </div>

            {/* Address Details - Shifted Up */}
            <div className="md:col-span-2 border-t pt-8 mt-4">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Address Details
              </h3>
              <div className="mb-6">
                <label className="block mb-2 font-semibold text-gray-700">
                  Temporary Address <span className="text-red-600">*</span>
                </label>
                <textarea
                  name="tempAddress"
                  rows="2"
                  value={form.tempAddress}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 transition resize-none"
                  placeholder="House No, Street, City, State, PIN"
                  required
                ></textarea>
              </div>
              <div>
                <label className="flex items-center gap-3 mb-4 font-semibold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    name="sameAddress"
                    checked={form.sameAddress}
                    onChange={handleChange}
                    className="w-5 h-5 accent-blue-600"
                  />
                  Permanent Address same as Temporary
                </label>
                {!form.sameAddress && (
                  <textarea
                    name="permAddress"
                    rows="2"
                    value={form.permAddress}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 transition resize-none"
                    placeholder="Permanent House No, Street, City, State, PIN"
                    required
                  ></textarea>
                )}
              </div>
            </div>

            {/* Additional Info - Shifted to Bottom */}
            <div className="md:col-span-2 border-t pt-8 mt-4 grid grid-cols-1 md:grid-cols-2 gap-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Address Details
              </h3>
              <br />
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  How did you hear about us?{" "}
                  <span className="text-red-600">*</span>
                </label>
                <select
                  name="heardFrom"
                  value={form.heardFrom}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white"
                  required
                >
                  <option value="">Select</option>
                  {HOW_HEARD_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Alternate Contact Number
                </label>
                <input
                  name="altContact"
                  type="tel"
                  placeholder="Enter alternate number"
                  value={form.altContact}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-2 font-semibold text-gray-700">
                  Additional Notes
                </label>
                <textarea
                  name="additionalNotes"
                  rows="2"
                  value={form.additionalNotes}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 transition resize-none"
                  placeholder="Any additional information..."
                ></textarea>
              </div>
            </div>

            <div className="md:col-span-2 text-center mt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-64 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? "Processing..." : "Submit Application"}
              </button>
            </div>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
}
