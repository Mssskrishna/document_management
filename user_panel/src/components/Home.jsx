import axios from "axios";
import { useEffect, useState } from "react";
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  FileText,
  AlertCircle,
} from "lucide-react";
import { BaseUrl } from "../utils/baseUrl";
import { useSelector } from "react-redux";

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

const Home = () => {
  const user = useSelector((state) => state.user.data);
  // Certificate data states
  const [approvedCertificates, setApprovedCertificates] = useState([]);
  const [requestedCertificates, setRequestedCertificates] = useState([]);
  const [rejectedCertificates, setRejectedCertificates] = useState([]);
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    const fetchdocumentTypes = async () => {
      const res = await axios.get(`${BaseUrl}/student/documenttypes`, {
        withCredentials: true,
      });
      setCertificates(res.data.body);
    };
    fetchdocumentTypes();
  }, []);
  // UI states
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState({
    approved: 1,
    requested: 1,
    rejected: 1,
  });
  const itemsPerPage = 5;

  // Filter and search
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

  // Pagination helpers
  const paginate = (array, page) => {
    const startIndex = (page - 1) * itemsPerPage;
    return array.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = (array) => Math.ceil(array.length / itemsPerPage);

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

  const refreshData = async () => {
    setRefreshing(true);
    await getCertificates();
    setTimeout(() => setRefreshing(false), 600); // Add a slight delay for better UX
  };

  const getCertificates = async () => {
    setLoading(true);
    const approved = await fetchData(1); // status 1 = approved
    const requested = await fetchData(0); // status 0 = requested
    const rejected = await fetchData(2); // status 2 = rejected

    setApprovedCertificates(approved || []);
    setRequestedCertificates(requested || []);
    setRejectedCertificates(rejected || []);
    setLoading(false);
  };

  useEffect(() => {
    getCertificates();
    console.log(user);
  }, []);

  // Render loading skeleton
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

  // Render pagination controls
  const renderPagination = (array, type) => {
    const total = totalPages(array);
    const current = currentPage[type];

    if (total <= 1) return null;

    return (
      <div className="flex items-center justify-between mt-4">
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

  // Render certificate status badge
  const renderStatusBadge = (status) => (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[status]} border`}
    >
      {statusIcons[status]}
      {statusLabels[status]}
    </span>
  );

  return (
    <div className="min-h-screen bg-gray-900 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">
            Certificate Dashboard
          </h1>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search certificates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            <button
              onClick={refreshData}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw
                className={`w-5 h-5 mr-2 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* Dashboard Summary */}

        {/* Approved Certificates Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 transform transition-all duration-300 hover:shadow-xl">
          <div className="bg-green-500 from-green-500 to-green-600 px-6 py-4">
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
                  <table className="w-full overflow-scroll">
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

        {/* Requested Certificates Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 transform transition-all duration-300 hover:shadow-xl">
          <div className="bg-orange-300 from-amber-500 to-amber-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Pending Certificates
            </h2>
          </div>

          <div className="p-6">
            {loading ? (
              renderSkeleton()
            ) : requestedCertificates.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full overflow-scroll">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Certificate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cover Letter
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Requested On
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {paginate(
                        filterCertificates(requestedCertificates),
                        currentPage.requested
                      ).map((cert) => (
                        <tr
                          key={cert.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {certificates[cert.documentTypeId - 1]?.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {cert.coverLetter || "No cover letter"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {renderStatusBadge(0)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date().toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {renderPagination(
                  filterCertificates(requestedCertificates),
                  "requested"
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Clock className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  No pending certificates
                </h3>
                <p className="mt-1 text-gray-500">
                  Your pending certificate requests will appear here.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Rejected Certificates Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 transform transition-all duration-300 hover:shadow-xl">
          <div className="bg-red-500 from-red-500 to-red-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center">
              <XCircle className="w-5 h-5 mr-2" />
              Rejected Certificates
            </h2>
          </div>

          <div className="p-6">
            {loading ? (
              renderSkeleton()
            ) : rejectedCertificates.length > 0 ? (
              <>
                <div className="overflow-x-scroll">
                  <table className="w-full overflow-scroll">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Certificate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reason
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rejected On
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {paginate(
                        filterCertificates(rejectedCertificates),
                        currentPage.rejected
                      ).map((cert) => (
                        <tr
                          key={cert.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {certificates[cert.documentTypeId - 1]?.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {cert.remarks || "No reason provided"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {renderStatusBadge(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date().toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {renderPagination(
                  filterCertificates(rejectedCertificates),
                  "rejected"
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <XCircle className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  No rejected certificates
                </h3>
                <p className="mt-1 text-gray-500">
                  Rejected certificate requests will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
