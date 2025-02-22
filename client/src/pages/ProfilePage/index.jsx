import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const getPlaceName = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      const data = await response.json();
      return data.display_name || "Location name not found.";
    } catch (err) {
      console.error(err);
      return "Error fetching place name.";
    }
  };

  const [emergencies, setEmergencies] = useState([]);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("emergencies");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);

  useEffect(() => {
    const fetchLocation = async () => {
      const defaultEmergencies = [
        {
          id: 1,
          raisedBy: "John Doe",
          location: await getPlaceName(22.574743, 88.363892),
          status: "pending",
          description: "Fire outbreak at an apartment",
          time: "2025-02-22 14:30",
          requestType: "Emergency",
        },
        {
          id: 2,
          raisedBy: "Alice Smith",
          location: "Los Angeles, CA",
          status: "resolved",
          description: "Road accident near downtown",
          time: "2025-02-21 10:15",
          requestType: "Alert",
        },
      ];
      setEmergencies(defaultEmergencies);
    };

    fetchLocation();
  }, []);

  useEffect(() => {
    setHistory([
      {
        id: 1,
        raisedBy: "David Johnson",
        location: "Houston, TX",
        status: "resolved",
        description: "Fire rescue",
        time: "2025-02-19 08:45",
        requestType: "Emergency",
      },
      {
        id: 2,
        raisedBy: "Michael Lee",
        location: "Miami, FL",
        status: "resolved",
        description: "Medical emergency",
        time: "2025-02-18 12:30",
        requestType: "Emergency",
      },
    ]);
  }, []);

  const handleEmergencySubmit = async (requestType) => {
    const newEmergency = {
      id: emergencies.length + 1,
      raisedBy: "You",
      location: "Fetching location...",
      status: "pending",
      description: description || "Unknown emergency",
      time: new Date().toLocaleString(),
      requestType: requestType,
    };

    setEmergencies([newEmergency, ...emergencies]);
    setIsModalOpen(false);
    setDescription("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const place = await getPlaceName(latitude, longitude);
        setEmergencies((prev) =>
          prev.map((e) => (e.id === newEmergency.id ? { ...e, location: place } : e))
        );
      },
      (err) => {
        console.error("Location access denied", err);
        setEmergencies((prev) =>
          prev.map((e) =>
            e.id === newEmergency.id ? { ...e, location: "Location access denied" } : e
          )
        );
      }
    );
  };

  const handleEmergencyAction = (action) => {
    if (!selectedEmergency) return;

    let updatedStatus;
    switch (action) {
      case 'accept':
        updatedStatus = 'in-progress';
        break;
      case 'resolve':
        updatedStatus = 'resolved';
        break;
      case 'reject':
        updatedStatus = 'rejected';
        break;
      default:
        updatedStatus = selectedEmergency.status;
    }

    setEmergencies(prev =>
      prev.map(e =>
        e.id === selectedEmergency.id
          ? { ...e, status: updatedStatus }
          : e
      )
    );

    if (updatedStatus === 'resolved') {
      setHistory(prev => [{ ...selectedEmergency, status: updatedStatus }, ...prev]);
      setEmergencies(prev => prev.filter(e => e.id !== selectedEmergency.id));
    }

    setIsActionModalOpen(false);
    setSelectedEmergency(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex items-center flex-col">
        <div className="bg-gray-50 w-full flex items-center sm:p-4 p-2 sm:px-10 justify-between mx-10 rounded-2xl sm:text-lg font-semibold text-gray-600">
            <p>Welcome, User</p>
            <button className="border p-1 sm:p-2 rounded-sm sm:rounded-xl">Log Out</button>
        </div>
      <h1 className="sm:text-4xl text-2xl mt-2 font-bold mb-8 text-center text-blue-600">Emergency Dashboard</h1>

      <motion.button
        className="w-auto bg-red-600 text-white font-bold py-4 px-6 rounded-lg mb-8 text-xl hover:bg-red-700 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsModalOpen(true)}
      >
        Issue Emergency
      </motion.button>

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
                <h2 className="text-xl font-bold">Issue Emergency</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <input
                type="text"
                placeholder="Describe the emergency..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-4">
                <button
                  onClick={() => handleEmergencySubmit("Emergency")}
                  className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Emergency
                </button>
                <button
                  onClick={() => handleEmergencySubmit("Alert")}
                  className="w-full py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  Alert
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {isActionModalOpen && selectedEmergency && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Emergency Action</h2>
                <button
                  onClick={() => {
                    setIsActionModalOpen(false);
                    setSelectedEmergency(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-4">
                <p className="font-semibold">{selectedEmergency.location}</p>
                <p className="text-gray-600">{selectedEmergency.description}</p>
                <p className="text-gray-600">Type: {selectedEmergency.requestType}</p>
                <p className="text-gray-600">Status: {selectedEmergency.status}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleEmergencyAction('accept')}
                  className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleEmergencyAction('resolve')}
                  className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Resolve
                </button>
                <button
                  onClick={() => handleEmergencyAction('reject')}
                  className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Reject
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-4xl">
        <div className="flex mb-4">
          <button
            className={`mr-4 px-4 py-2 rounded-md transition-colors ${
              activeTab === "emergencies" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setActiveTab("emergencies")}
          >
            Current Emergencies
          </button>
          <button
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === "history" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setActiveTab("history")}
          >
            Past Helped History
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "emergencies" && (
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {emergencies.map((emergency) => (
                <motion.li
                  key={emergency.id}
                  className="border-b border-gray-200 py-4 cursor-pointer hover:bg-gray-50"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => {
                    setSelectedEmergency(emergency);
                    setIsActionModalOpen(true);
                  }}
                >
                  <div className="flex justify-between items-center mb-2 w-full gap-10">
                    <span className="sm:text-lg font-semibold">{emergency.location}</span>
                    <span className="text-gray-600">{emergency.time}</span>
                  </div>
                  <p className="text-gray-700">Raised by: {emergency.raisedBy}</p>
                  <p className="text-gray-700">Status: {emergency.status}</p>
                  <p className="text-gray-700">Type: {emergency.requestType}</p>
                  <p className="text-gray-700">{emergency.description}</p>
                </motion.li>
              ))}
            </motion.ul>
          )}

          {activeTab === "history" && (
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {history.map((item) => (
                <motion.li
                  key={item.id}
                  className="border-b border-gray-200 py-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-semibold">{item.location}</span>
                    <span className="text-gray-600">{item.time}</span>
                  </div>
                  <p className="text-gray-700">Raised by: {item.raisedBy}</p>
                  <p className="text-gray-700">Status: {item.status}</p>
                  <p className="text-gray-700">Type: {item.requestType}</p>
                  <p className="text-gray-700">{item.description}</p>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}