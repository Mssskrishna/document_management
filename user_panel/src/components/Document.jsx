import axios from "axios";
import { CheckCircle, Clock, Download, FileText, XCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { BaseUrl } from "../utils/baseUrl";

const statusColors = {
  0: "bg-amber-100 text-amber-500 border-amber-200",
  1: "bg-green-100 text-green-500 border-green-200",
  2: "bg-red-100 text-red-500 border-red-200",
};

const statusIcons = {
  0: <Clock className="w-4 h-4 mr-1" />,
  1: <CheckCircle className="w-4 h-4 mr-1" />,
  2: <XCircle className="w-4 h-4 mr-1" />,
};

const statusLabels = {
  0: "Pending",
  1: "Approved",
  2: "Rejected",
};

export default function Document() {
  const [approvedCertificates, setApprovedCertificates] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const requestDownload = async (documentId) => {
    try {
      const response = await axios.post(
        `${BaseUrl}/file/initiate-download`,
        {
          documentId: documentId,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const token = response.data.body.accessToken;

      // Initiate download
      const downloadUrl = `http://localhost:8080/file/download/${token}`;
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = ""; // optional, lets browser treat it as download
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download certificate. Please try again.");
    }
  };
  const [loading, setLoading] = useState(true);
  const getCertificates = async () => {
    setLoading(true);
    const approved = await fetchData(1); // status 1 = approved
    setApprovedCertificates(approved || []);
    setLoading(false);
  };

  useEffect(() => {
    const fetchdocumentTypes = async () => {
      const res = await axios.get(`${BaseUrl}/student/documenttypes`, {
        withCredentials: true,
      });
      setCertificates(res.data.body);
    };
    fetchdocumentTypes();
  }, []);
  const [currentPage, setCurrentPage] = useState({
    approved: 1,
  });

  const itemsPerPage = 10;
  const renderStatusBadge = (status) => (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[status]} border`}
    >
      {statusIcons[status]}
      {statusLabels[status]}
    </span>
  );

  const filterCertificates = (certificates) => {
    if (!searchTerm) return certificates;

    return certificates.filter(
      (cert) =>
        certificates[cert.documentTypeId]
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        cert.coverLetter?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.remarks?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  const paginate = (array, page) => {
    const startIndex = (page - 1) * itemsPerPage;
    return array.slice(startIndex, startIndex + itemsPerPage);
  };

  useEffect(() => {
    getCertificates();
  }, []);
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

      console.log(response.data.body);
      return response.data.body;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  const renderPagination = (array, type) => {
    const total = totalPages(array);
    const current = currentPage[type];

    if (total <= 1) return null;

    return (
      <div className="flex items-center justify-between mt-4 ">
        <span className="text-sm text-gray-500">
          Page {current} of {total}
        </span>
        <div className="flex space-x-2">
          <button
            onClick={() =>
              setCurrentPage({
                ...currentPage,
                [type]: Math.max(1, current - 1),
              })
            }
            disabled={current === 1}
            className={`p-1 rounded ${
              current === 1
                ? "text-gray-400"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() =>
              setCurrentPage({
                ...currentPage,
                [type]: Math.min(total, current + 1),
              })
            }
            disabled={current === total}
            className={`p-1 rounded ${
              current === total
                ? "text-gray-400"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };
  const totalPages = (array) => Math.ceil(array.length / itemsPerPage);

  const renderSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="h-10 bg-gray-200 rounded mb-4"></div>
      <div className="space-y-3">
        <div className="h-12 bg-gray-200 rounded"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
  return (
    <div className="h-screen p-5 bg-gray-900">
      {/* Approved Certificates Section */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 transform transition-all duration-300 hover:shadow-xl">
        <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Approved Certificates
          </h2>
        </div>

        <div className="p-6">
          {loading ? (
            renderSkeleton()
          ) : approvedCertificates.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Certificate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Remarks
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginate(
                      filterCertificates(approvedCertificates),
                      currentPage.approved
                    ).map((cert) => (
                      <tr
                        key={cert.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {certificates[cert.documentTypeId - 1]?.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {cert.remarks || "No remarks"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderStatusBadge(1)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() =>
                              requestDownload(cert.issuedDocumentId)
                            }
                            className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {renderPagination(
                filterCertificates(approvedCertificates),
                "approved"
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                No approved certificates
              </h3>
              <p className="mt-1 text-gray-500">
                Your approved certificates will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
