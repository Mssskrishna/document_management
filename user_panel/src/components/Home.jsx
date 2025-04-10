import axios from "axios";
import { useEffect, useState } from "react";

const certificates = {
  0: "Id Card",
  1: "Bonafide Certificate",
  2: "transfer certificate",
};

const Home = () => {
  const [approvedCertificates, setapprovedCertificates] = useState([]);
  const [requestedCertificates, setrequestCertificates] = useState([]);
  const [rejectedCertificates, setrejectedCertificates] = useState([]);

  const fetchData = async (status = 0) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/student/applications",
        { status: status },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      return response.data.body;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  useEffect(() => {
    const getCertificates = async () => {
      const approved = await fetchData(2); // status 2 = approved
      const requested = await fetchData(0); // status 0 = requested
      const rejected = await fetchData(1);
      setapprovedCertificates(approved);
      setrequestCertificates(requested);
      setrejectedCertificates(rejected)
    };

    getCertificates();
  }, []);

  return (
    <div className="mt-0 p-8 min-h-screen bg-gray-700">
      <h1 className="text-3xl font-bold text-center text-white">
        Certificate Approval Portal
      </h1>

      {/* Approved Certificates Section */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-green-600">
          ✅ Approved Certificates
        </h2>
        <table className="w-full mt-4 border-collapse border border-gray-300">
          <thead>
            <tr className="bg-green-100">
              <th className="border border-gray-300 p-3">Certificate Name</th>
              <th className="border border-gray-300 p-3">Remarks</th>
              <th className="border border-gray-300 p-3">Status</th>

              <th className="border border-gray-300 p-3">Download</th>
            </tr>
          </thead>
          <tbody>
            {approvedCertificates.length > 0 ? (
              approvedCertificates.map((cert) => (
                <tr key={cert.id} className="text-center">
                  <td className="border border-gray-300 p-3">
                    {certificates[cert.documentTypeId]}
                  </td>
                  <td className="border border-gray-300 p-3">{cert.remarks}</td>
                  <td className="border border-gray-300 p-3 text-green-500">
                    {cert.applicationStatus === 2 ? "Approved" : "Pending"}
                  </td>
                  <td className="border border-gray-300 p-3">
                    {cert.document}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="text-center">
                <td colSpan="3" className="p-4 text-gray-500">
                  No approved certificates found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Requested Certificates Section */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-yellow-600">
          ⏳ Requested Certificates
        </h2>
        <table className="w-full mt-4 border-collapse border border-gray-300">
          <thead>
            <tr className="bg-yellow-100">
              <th className="border border-gray-300 p-3">Certificate Name</th>
              <th className="border border-gray-300 p-3">Remarks</th>
              <th className="border border-gray-300 p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {requestedCertificates.length > 0 ? (
              requestedCertificates.map((cert) => (
                <tr key={cert.id} className="text-center">
                  <td className="border border-gray-300 p-3">
                    {certificates[cert.documentTypeId]}
                  </td>
                  <td className="border border-gray-300 p-3">
                    {cert.coverLetter}
                  </td>
                  <td className="border border-gray-300 p-3 text-yellow-600">
                    {cert.applicationStatus === 0 ? "Pending" : "Approved"}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="text-center">
                <td colSpan="3" className="p-4 text-gray-500">
                  No requested certificates found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-yellow-600">
          ⏳ Rejected Certificates
        </h2>
        <table className="w-full mt-4 border-collapse border border-gray-300">
          <thead>
            <tr className="bg-yellow-100">
              <th className="border border-gray-300 p-3">Certificate Name</th>
              <th className="border border-gray-300 p-3">Remarks</th>
              <th className="border border-gray-300 p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {rejectedCertificates.length > 0 ? (
              rejectedCertificates.map((cert) => (
                <tr key={cert.id} className="text-center">
                  <td className="border border-gray-300 p-3">
                    {certificates[cert.documentTypeId]}
                  </td>
                  <td className="border border-gray-300 p-3">
                    {cert.remarks}
                  </td>
                  <td className="border border-gray-300 p-3 text-yellow-600">
                    {cert.applicationStatus === 0 ? "Pending" : "Approved"}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="text-center">
                <td colSpan="3" className="p-4 text-gray-500">
                  No requested certificates found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
