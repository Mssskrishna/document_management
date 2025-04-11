import { useEffect, useState } from "react";
import PendingCard from "./PendingCard";
import axios from "axios";
import { baseUrl } from "../../utils/constants";
import { ApplicationStatus } from "../../enum/ApplicationStatus";
import {
  Application,
  ApplicationResponse,
} from "../../enum/ApplicationsResponse";
import { Modal } from "../ui/modal";
import ApplicationModalContent from "../ApplicationModal";
import toast from "react-hot-toast";

export default function Pending() {
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus>(
    ApplicationStatus.PENDING
  );
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      let requestedStatus = [selectedStatus];
      if (selectedStatus === ApplicationStatus.FINALIZED) {
        requestedStatus = [
          ApplicationStatus.APPROVED,
          ApplicationStatus.REJECTED,
        ];
      }
      const response = await axios.post<ApplicationResponse>(
        `${baseUrl}/executive/applications`,
        { status: requestedStatus },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      setApplications(response.data.body || []);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [selectedStatus]);

  const handleStatusChange = (status: ApplicationStatus) => {
    setSelectedStatus(status);
  };

  const handleApprove = async (remarks: string) => {
    if (!selectedApplication) return;
    await updateStatus(ApplicationStatus.APPROVED, remarks);
  };

  const handleReject = async (remarks: string) => {
    if (!selectedApplication) return;
    await updateStatus(ApplicationStatus.REJECTED, remarks);
  };

  const updateStatus = async (status: ApplicationStatus, remarks: string) => {
    try {
      const res = await axios.post(
        `${baseUrl}/executive/update-application`,
        {
          id: selectedApplication?.id,
          status,
          remarks,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setModalOpen(false);
      setSelectedApplication(null);
      fetchApplications();
    } catch (error: any) {
      toast.error(error.toString());
      console.log(error);
      console.error("Failed to update application:", error);
    }
  };

  return (
    <div className="relative p-4 h-[82vh]">
      {/* Toggle Buttons */}
      <div className="flex justify-end mb-4">
        <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
          <button
            className={`px-4 py-2 min-w-[110px] text-sm font-medium text-center ${
              selectedStatus === ApplicationStatus.PENDING
                ? "bg-blue-500 text-white"
                : "text-gray-700 dark:text-white"
            }`}
            onClick={() => handleStatusChange(ApplicationStatus.PENDING)}
          >
            Pending
          </button>
          <button
            className={`px-4 py-2 min-w-[110px] text-sm font-medium text-center ${
              selectedStatus === ApplicationStatus.FINALIZED
                ? "bg-blue-500 text-white"
                : "text-gray-700 dark:text-white"
            }`}
            onClick={() => handleStatusChange(ApplicationStatus.FINALIZED)}
          >
            Finalized
          </button>
        </div>
      </div>

      {/* Application List */}
      {loading ? (
        <div className="text-center mt-6 text-gray-500 dark:text-white/50">
          Loading...
        </div>
      ) : applications.length > 0 ? (
        applications.map((item) => (
          <div key={item.id} className="p-2 dark:border-gray-800 lg:p-2">
            <PendingCard
              data={item}
              onView={(app) => {
                setSelectedApplication(app);
                setModalOpen(true);
              }}
            />
          </div>
        ))
      ) : (
        <div className="text-center text-2xl dark:text-white/50 mt-10">
          No {selectedStatus === 0 ? "pending" : "finalized"} applications.
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        {selectedApplication && (
          <ApplicationModalContent
            application={selectedApplication}
            onApprove={handleApprove}
            onReject={handleReject}
            onCancel={() => setModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
}
