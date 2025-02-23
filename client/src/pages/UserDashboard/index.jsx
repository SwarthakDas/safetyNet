"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function UserDashboard() {
  const [complaints, setComplaints] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [complaintDescription, setComplaintDescription] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    // Simulating fetching past complaints
    setComplaints([
      {
        id: 1,
        description: "Faulty product received",
        status: "PENDING",
        createdAt: "2025-02-20 10:30",
        location: "New York, NY",
      },
      {
        id: 2,
        description: "Late delivery",
        status: "RESOLVED",
        createdAt: "2025-02-18 14:45",
        location: "Los Angeles, CA",
      },
    ])
  }, [])

  const handleComplaintSubmit = () => {
    const newComplaint = {
      id: complaints.length + 1,
      description: complaintDescription,
      status: "PENDING",
      createdAt: new Date().toLocaleString(),
      location: "Current Location", // In a real app, you'd use geolocation here
    }

    setComplaints([newComplaint, ...complaints])
    setIsModalOpen(false)
    setComplaintDescription("")
    setSelectedImage(null)
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setSelectedImage(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
        <div className="bg-gray-50 w-full flex items-center sm:p-4 p-2 sm:px-10 justify-between mx-10 rounded-2xl sm:text-lg font-semibold text-gray-600">
        <p>Welcome, John Doe</p>
        <button className="border p-1 sm:p-2 rounded-sm sm:rounded-xl">Log Out</button>
      </div>
      <div className="max-w-4xl mx-auto mt-6">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold mb-4 text-blue-600">User Profile</h1>
          <div className="flex items-center space-x-4 mb-6">
            <div>
              <h2 className="text-2xl font-semibold">John Doe</h2>
              <p className="text-gray-600">john.doe@example.com</p>
            </div>
          </div>
          <motion.button
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
          >
            Submit New Complaint
          </motion.button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">Complaint History</h2>
          <ul>
            {complaints.map((complaint) => (
              <motion.li
                key={complaint.id}
                className="border-b border-gray-200 py-4 last:border-b-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{complaint.description}</span>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      complaint.status === "PENDING" ? "bg-yellow-200 text-yellow-800" : "bg-green-200 text-green-800"
                    }`}
                  >
                    {complaint.status}
                  </span>
                </div>
                <p className="text-gray-600">Created: {complaint.createdAt}</p>
                <p className="text-gray-600">Location: {complaint.location}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Submit New Complaint</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <textarea
                placeholder="Describe your complaint..."
                value={complaintDescription}
                onChange={(e) => setComplaintDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {selectedImage && (
                  <div className="mt-2">
                    <image
                      src={selectedImage || "/placeholder.svg"}
                      alt="Selected"
                      width={200}
                      height={200}
                      className="rounded-lg"
                    />
                  </div>
                )}
              </div>
              <button
                onClick={handleComplaintSubmit}
                className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Submit Complaint
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

