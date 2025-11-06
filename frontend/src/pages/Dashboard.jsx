import { useEffect, useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null); 
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Fetch user events
  const fetchEvents = async () => {
    try {
      const { data } = await API.get("/events/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(data.events || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load events");
      if (err.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  // Delete event
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await API.delete(`/events/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Event deleted successfully");
      setEvents(events.filter((e) => e._id !== deleteId));
      setDeleteId(null); // close popup
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to delete event");
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-lg font-semibold">
        Loading events...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Events</h1>
          <button
            onClick={() => navigate("/create-event")}
            className="bg-blue-600 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
          >
            + Create Event
          </button>
        </div>

        {events.length === 0 ? (
          <p className="text-center text-gray-500">No events created yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-md">
              <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
                <tr>
                  <th className="px-4 py-3">Event</th>
                  <th className="px-4 py-3">Scheduled</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr
                    key={event._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3 text-blue-800 font-medium">{event.title}</td>
                    <td className="px-4 py-3">
                      {new Date(event.startTime).toLocaleString([], {
                        day: 'numeric',
                        month: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                       })}
                       {" - "}
                      {new Date(event.endTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          event.status === "BUSY"
                            ? "bg-red-100 text-red-600"
                            : event.status === "SWAP_PENDING"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {event.status || "UNKNOWN"}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex justify-center gap-2">
                      <button
                        onClick={() => navigate(`/edit-event/${event._id}`)}
                        className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteId(event._id)}
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inline Delete Popup */}
      {deleteId && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-70 sm:w-96 bg-white rounded-lg shadow-lg p-6 border-2 border-gray-400">

          <div className="flex items-center justify-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Confirm Deletion
            </h2>
          </div>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this event? 
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteId(null)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
