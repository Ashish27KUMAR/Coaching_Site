import { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function Status() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState(null);

  const checkStatus = async () => {
    const q = query(
      collection(db, "admissions"),
      where("email", "==", email),
      where("phone", "==", phone)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      setResult({ error: "No application found." });
    } else {
      setResult(snapshot.docs[0].data());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Check Admission Status</h2>

        <input
          placeholder="Email"
          className="w-full border p-2 mb-3"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Phone"
          className="w-full border p-2 mb-3"
          onChange={(e) => setPhone(e.target.value)}
        />

        <button
          onClick={checkStatus}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Check Status
        </button>

        {result && (
          <div className="mt-4 p-3 bg-gray-100 rounded">
            {result.error ? (
              <p className="text-red-500">{result.error}</p>
            ) : (
              <>
                <p>
                  <b>Name:</b> {result.firstName} {result.lastName}
                </p>
                <p>
                  <b>Status:</b> {result.status}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
