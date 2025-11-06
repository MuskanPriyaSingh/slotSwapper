import { useEffect, useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import { format } from "date-fns";

function SwapMarketplace() {
  const [slots, setSlots] = useState([]);
  const [mySlots, setMySlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedMySlot, setSelectedMySlot] = useState("");
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("token");

  // Fetch all swappable slots (except user's own)
  const fetchSlots = async () => {
    try {
      const { data } = await API.get("/swaps/swappable-slots", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSlots(data.slots);
    } catch {
      toast.error("Failed to load swappable slots");
    }
  };

  // Fetch my slots
  const fetchMySlots = async () => {
    try {
      const { data } = await API.get("/events/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMySlots(data.events.filter((s) => s.status === "SWAPPABLE"));
    } catch {
      toast.error("Failed to load your slots");
    }
  };

  // Send requests to other users for swapping event slot
  const handleRequestSwap = async () => {
    if (!selectedMySlot) return toast.error("Select one of your slots first!");
    try {
      await API.post(
        "/swaps/request",
        { mySlotId: selectedMySlot, theirSlotId: selectedSlot._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Swap request sent successfully!");
      setShowModal(false);
      fetchSlots();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to send request");
    }
  };

  useEffect(() => {
    fetchSlots();
    fetchMySlots();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Swap Marketplace
        </h2>

        {slots.length === 0 ? (
          <p className="text-center text-gray-600">No swappable slots available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-md">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-700 uppercase text-md">
                  <th className="p-3">Event</th>
                  <th className="p-3">Scheduled</th>
                  <th className="p-3">Owner</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {slots.map((slot) => (
                  <tr key={slot._id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-3 font-medium text-blue-800">{slot.title}</td>
                    <td className="p-3 text-gray-800">
                      {format(new Date(slot.startTime), "dd/MM/yyyy, hh:mm a")} -{" "}
                      {format(new Date(slot.endTime), "hh:mm a")}
                    </td>
                    <td className="p-3 text-gray-800">{slot.owner?.name || "N/A"}</td>
                    <td className="p-3">
                      <button
                        onClick={() => {
                          setSelectedSlot(slot);
                          setShowModal(true);
                        }}
                        className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700 cursor-pointer transition"
                      >
                        Request Swap
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirm Request Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Choose one of your slots to swap
            </h3>

            <select
              value={selectedMySlot}
              onChange={(e) => setSelectedMySlot(e.target.value)}
              className="w-full border p-2 rounded-md mb-4"
            >
              <option value="">Select your slot</option>
              {mySlots.map((slot) => (
                <option key={slot._id} value={slot._id}>
                  {slot.title} ({format(new Date(slot.startTime), "dd/MM hh:mm a")})
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestSwap}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Confirm Swap Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SwapMarketplace;
