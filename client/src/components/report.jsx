import React, { useEffect, useState } from "react";

const token = localStorage.getItem("token"); // Get the token from local storage

const Report = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}posts/get/reports`, {
          headers: {
            Authorization: `Bearer ${token}`, // Make sure this token belongs to an admin
          },
        });
        const data = await res.json();
        setReports(data.reports);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch reports", error);
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Reported Posts</h2>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : reports.length === 0 ? (
        <p className="text-gray-600">No reports found.</p>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report._id} className="p-4 border rounded shadow">
              <p><strong>Post ID:</strong> {report.postId}</p>
              <p><strong>Reason:</strong> {report.reason}</p>
              <p><strong>Reported By:</strong> {report.reportedBy.username || report.reportedBy.email}</p>
              <p className="text-sm text-gray-500">{new Date(report.reportedAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};


export default Report;