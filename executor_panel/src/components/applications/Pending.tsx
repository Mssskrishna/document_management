import { useEffect, useState } from "react";
import FilterButton from "./filter";
import PendingCard from "./PendingCard";
import axios from "axios";
import { BaseUrl } from "../../utils/baseurl";

export default function Pending() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    try {
      const response = await axios.post(
        `${BaseUrl}/executive/applications`,
        { status :0 },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const data = response.data;
      console.log("Fetched data:", data.body);
      setPending(data.body || []); // assuming the list is in data.body
    } catch (error) {
      console.error("Failed to fetch pending applications:", error);
      setPending([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Pending Applications";

    fetchPending();
  }, []);

  return (
    <div>
      <FilterButton />
      {loading ? (
        <div>Loading...</div>
      ) : pending.length > 0 ? (
        pending.map((item, index) => (
          <div key={index} className="p-2 dark:border-gray-800 lg:p-2">
            <PendingCard data={item} status={0} refresh={fetchPending} />
          </div>
        ))
      ) : (
        <div className="text-center text-2xl dark:text-white/50">No pending applications.</div>
      )}
    </div>
  );
}
