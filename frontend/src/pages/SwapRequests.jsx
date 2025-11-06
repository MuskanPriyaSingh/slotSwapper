import { useEffect, useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import { format } from "date-fns";

function SwapRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch all swap requests
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/swaps/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(data.swaps || []);
    } catch (err) {
      toast.error("Failed to load swap requests");
    } finally {
      setLoading(false);
    }
  };

  // Handle accept/reject
  const handleDecision = async (requestId, decision) => {
    try {
      const { data } = await API.put(
        `/swaps/respond/${requestId}`,
        { decision },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Swap ${decision.toLowerCase()} successfully!`);
      fetchRequests(); // refresh after action
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update swap request");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-gray-600">
        Loading swap requests...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Swap Requests
        </h2>

        {requests.length === 0 ? (
          <p className="text-center text-gray-600">No swap requests found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-md">
              <thead>
                <tr className="bg-gray-100 text-gray-700 uppercase text-md">
                  <th className="p-3 text-left">Requester</th>
                  <th className="p-3 text-left">Their Event</th>
                  <th className="p-3 text-left">Your Event</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => {
                  const isResponder = req.responder?._id === user?._id;
                  const isPending = req.status === "PENDING";

                  return (
                    <tr
                      key={req._id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="p-3 font-medium text-blue-800">
                        {req.requester?.name || "N/A"}
                      </td>
                      <td className="p-3 text-gray-800">
                        {req.theirSlot?.title} <br />
                        <span className="text-sm text-gray-500">
                          {format(
                            new Date(req.theirSlot?.startTime),
                            "dd MMM, hh:mm a"
                          )}{" "}
                          -{" "}
                          {format(
                            new Date(req.theirSlot?.endTime),
                            "hh:mm a"
                          )}
                        </span>
                      </td>
                      <td className="p-3 text-gray-800">
                        {req.mySlot?.title} <br />
                        <span className="text-sm text-gray-500">
                          {format(
                            new Date(req.mySlot?.startTime),
                            "dd MMM, hh:mm a"
                          )}{" "}
                          -{" "}
                          {format(new Date(req.mySlot?.endTime), "hh:mm a")}
                        </span>
                      </td>
                      <td
                        className={`p-3 font-semibold ${
                          req.status === "ACCEPTED"
                            ? "text-green-600"
                            : req.status === "REJECTED"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {req.status}
                      </td>
                      <td className="p-3 text-center">
                        {isResponder && isPending ? (
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() =>
                                handleDecision(req._id, "ACCEPTED")
                              }
                              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() =>
                                handleDecision(req._id, "REJECTED")
                              }
                              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default SwapRequests;
