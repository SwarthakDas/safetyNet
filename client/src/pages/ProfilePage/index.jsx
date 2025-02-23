import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CircleUser } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

export default function UserProfile() {
  const [complaints, setComplaints] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [complaintDescription, setComplaintDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [emergencies, setEmergencies] = useState([]);
  const navigate=useNavigate()
  console.log(Cookies.get("accessToken"))
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
    
    setEmergencies([
      {
        id: 1,
        raisedBy: "John Doe",
        status: "active",
        createdAt: "2025-02-19 08:00",
        location: "New York, NY",
      },
      {
        id: 2,
        raisedBy: "Jane Smith",
        status: "resolved",
        createdAt: "2025-02-18 16:30",
        location: "New York, NY",
      },
      {
        id: 2,
        raisedBy: "Jane Smith",
        status: "resolved",
        createdAt: "2025-02-18 16:30",
        location: "New York, NY",
      },
      {
        id: 2,
        raisedBy: "Jane Smith",
        status: "resolved",
        createdAt: "2025-02-18 16:30",
        location: "New York, NY",
      },
    ]);
  }, []);

  const handleComplaintSubmit = () => {
    const newComplaint = {
      id: complaints.length + 1,
      description: complaintDescription,
      status: "pending",
      createdAt: new Date().toLocaleString(),
      location: "Current Location",
    };

    setComplaints([newComplaint, ...complaints]);
    setIsModalOpen(false);
    setComplaintDescription("");
    setSelectedImage(null);
  };

  const logout=async()=>{
    try {
      const response=await fetch(`${import.meta.env.VITE_BACKEND_BASEURL}/department/logout`,
        {
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body: JSON.stringify()
        }
      )
      if(response.ok){
        console.log("user logged out")
      }
      navigate("/profile")
    } catch (error) {
      console.error(error)
    }
  }

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
          <a href="#" className="hover:border border-red-500 hover:text-red-500 hover:rounded-2xl p-2 px-4 w-40 text-center" onClick={() => setActiveTab("emergency")}>
            Emergencies
          </a>
          <a href="#" className="hover:border border-yellow-400 hover:text-yellow-500 hover:rounded-2xl p-2 px-4 w-40 text-center" onClick={() => setActiveTab("complaints")}>
            Complaints
          </a>
        </nav>
        <div className="w-40 h-8 rounded-full flex items-center justify-center gap-5">
          <CircleUser className="h-20" />
          <button className="border p-2 rounded-xl" onClick={() => logout()}>Logout</button>
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

{activeTab === "emergency" && (
  <>
          <div className="mt-10 overflow-y-auto max-h-70 p-4 rounded-lg items-center flex flex-col">
            {emergencies.map((emergency, i) => (
              <motion.div key={i} className="p-6 bg-gray-900 text-white rounded-md mb-2 w-3/4 " initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <p><strong>Raised By:</strong> {emergency.raisedBy}</p>
                <p><strong>Status:</strong> {emergency.status}</p>
                <div className="flex justify-between">
                  <p><strong>Created At:</strong> {emergency.createdAt}</p>
                  <p><strong>Location:</strong> {emergency.location}</p>
                </div>
              </motion.div>
            ))}
            
          </div>
          <div className="flex justify-center mt-4">
            <button onClick={() => setIsModalOpen(true)} className="bg-red-600 text-white px-6 py-2 rounded-lg">
              Raise Emergency
            </button>
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
            <textarea
              className="w-full p-2 bg-gray-800 text-white rounded-md mb-4"
              placeholder="Enter details..."
              value={complaintDescription}
              onChange={(e) => setComplaintDescription(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              className="mb-4"
              onChange={(e) => setSelectedImage(e.target.files[0])}
            />
            <div className="flex justify-between">
              <button onClick={handleComplaintSubmit} className="bg-green-600 text-white px-4 py-2 rounded-md">
                Submit
              </button>
              <button onClick={() => setIsModalOpen(false)} className="bg-red-600 text-white px-4 py-2 rounded-md">
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
