import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";

function EditEvent() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [status, setStatus] = useState("BUSY");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch existing event
  const fetchEvent = async () => {
    try {
      const { data } = await API.get(`/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const event = data.event;
      setTitle(event.title);
      setStartTime(new Date(event.startTime).toISOString().slice(0, 16));
      setEndTime(new Date(event.endTime).toISOString().slice(0, 16));
      setStatus(event.status);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to fetch event");
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    fetchEvent();
  }, [id]);

  // Handle update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const { data } = await API.put(
        `/events/${id}`,
        { title, startTime, endTime, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(data.message || "Event updated successfully");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to update event");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-lg font-semibold">
        Loading event...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Edit Event
        </h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Event Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="startTime" className="block text-sm font-medium mb-1">
              Start Time
            </label>
            <input
              type="datetime-local"
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="endTime" className="block text-sm font-medium mb-1">
              End Time
            </label>
            <input
              type="datetime-local"
              id="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-1">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="BUSY">BUSY</option>
              <option value="SWAPPABLE">SWAPPABLE</option>
              <option value="SWAP_PENDING">SWAP_PENDING</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={updating}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 cursor-pointer transition"
          >
            {updating ? "Updating..." : "Update Event"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditEvent;
