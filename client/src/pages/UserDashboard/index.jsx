import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CircleUser } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UserProfile() {
  const [complaints, setComplaints] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [complaintDescription, setComplaintDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate=useNavigate()
  const [loggedin,setLoggedin]=useState(true)
  const {id,accessToken}=useSelector((state)=>state.auth)


  useEffect(() => {
    setComplaints([
      {
        id: 1,
        description: "Faulty product received",
        status: "pending",
        createdAt: "2025-02-20 10:30",
        location: "New York, NY",
      },
      {
        id: 2,
        description: "Late delivery",
        status: "resolved",
        createdAt: "2025-02-18 14:45",
        location: "Los Angeles, CA",
      },
    ]);
  }, []);



  const handleComplaintSubmit = async () => {
    if (!complaintDescription) {
        console.error("Complaint description is required");
        return;
    }

    const formData = new FormData();
    formData.append("complaint", complaintDescription); // ✅ Complaint text
    formData.append("status", "pending"); // ✅ Default status

   

    try {
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_BASEURL}/civilian/profile/raise-complaint`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                },
                credentials: "include",
                body: formData, // ✅ Sending FormData
            }
        );

        if (response.ok) {
            console.log("Complaint made successfully");
        } else {
            console.error("Complaint failed:", await response.text());
        }
    } catch (error) {
        console.error("Complaint error:", error);
    }

    // Reset state after submission
    setIsModalOpen(false);
    setComplaintDescription("");
    setSelectedImage(null);
};



  // const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);

  const logout = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_BASEURL}/civilian/logout`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}` 
        },
        credentials: "include", 
        body: JSON.stringify({ data: { _id: id } })
    });
    
  
      if (response.ok) {
        // Remove the token from cookies
        // removeCookie("accessToken", { path: "/" });
        // removeCookie("refreshToken", { path: "/" });
  
        console.log("User logged out successfully");
        navigate("/profile");
      } else {
        console.error("Logout failed:", await response.text());
      }
      setLoggedin(false)
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center h-screen p-4">
      <img
        src="/signup_bg.jpg"
        alt="Background"
        className="absolute inset-0 h-full w-full object-cover opacity-20  pointer-events-none"
      />
      <div className="absolute top-0 w-full flex justify-between items-center px-10 py-5">
        <h1 className="text-4xl font-semibold">SafetyNet</h1>
        <nav className="flex gap-6">
          <a href="#" className="hover:border hover:rounded-2xl p-2 px-4 w-40 text-center" onClick={() => setActiveTab("dashboard")}>
            Dashboard
          </a>
          <a href="#" className="hover:border border-yellow-400 hover:text-yellow-500 hover:rounded-2xl p-2 px-4 w-40 text-center" onClick={() => setActiveTab("complaints")}>
            Complaints
          </a>
        </nav>
        <div className="w-40 h-8 rounded-full flex items-center justify-center gap-5">
          <CircleUser className="h-20" />
          <button className="border p-2 rounded-xl" onClick={() => logout()}>{loggedin?"Log Out":"Login"}</button>
        </div>
      </div>
      
      <div className="flex flex-col justify-center w-full">
        {activeTab === "dashboard" && (
          <>
          <motion.h2 className="text-center text-2xl sm:text-3xl font-semibold px-6" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1 }}>
            Your Safety, Your Control – Empowering You to Act When It Matters Most!
          </motion.h2>
          <div className="mt-10 flex gap-10 justify-center">
            {[
              { value: 100, label: "Complaints Resolved" },
              { value: 175, label: "Emergencies Answered" },
              { value: "150+", label: "Satisfied Clients" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.3 }}
              >
                <h3 className="text-4xl font-bold">{stat.value}</h3>
                <p className="text-white">{stat.label}</p>
              </motion.div>
            ))}
          </div>
          </>
        )}

        {activeTab === "complaints" && (
          <>
          <div className="mt-10 overflow-y-auto max-h-70 p-4 rounded-lg items-center flex flex-col">
            {complaints.map((complaint, i) => (
              <motion.div key={i} className="p-6 bg-gray-900 text-white rounded-md mb-2 w-1/2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <p><strong>Description:</strong> {complaint.description}</p>
                <p><strong>Status:</strong> {complaint.status}</p>
                <div className="flex justify-between">
                  <p><strong>Created At:</strong> {complaint.createdAt}</p>
                  <p><strong>Location:</strong> {complaint.location}</p>
                </div>
              </motion.div>
            ))}
            {/* Added Button */}
            <button onClick={() => setIsModalOpen(true)} className="mt-4 bg-yellow-500 text-black px-6 py-2 rounded-lg">
              File Complaint
            </button>
          </div>
          <div className="flex justify-center mt-4">
          <button onClick={() => setIsModalOpen(true)} className="bg-yellow-500 text-white px-6 py-2 rounded-lg">
            Raise Complaint
          </button>
        </div>
        </>
        )}

{isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-gray-900 p-6 rounded-lg w-96">
      <h2 className="text-xl mb-4 text-white">Describe your issue</h2>

      {/* Complaint Textarea */}
      <textarea
        className="w-full p-2 bg-gray-800 text-white rounded-md mb-4"
        placeholder="Enter details..."
        value={complaintDescription}
        onChange={(e) => setComplaintDescription(e.target.value)}
      />

      {/* File Input for Image */}

      {/* Action Buttons */}
      <div className="flex justify-between">
        <button
          onClick={() => handleComplaintSubmit()}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          Submit
        </button>
        <button
          onClick={() => setIsModalOpen(false)}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
}
