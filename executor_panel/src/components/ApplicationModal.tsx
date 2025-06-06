import { Paperclip } from "lucide-react";
import { useState, useEffect } from "react";
import { ApplicationStatus } from "../enum/ApplicationStatus";
import { Application } from "../enum/ApplicationsResponse";
import { baseUrl } from "../utils/constants";
import axios from "axios";

interface Props {
  application: Application;
  onApprove: (remarks: string) => void;
  onReject: (remarks: string) => void;
  onCancel: () => void;
}

function getTimeAgo(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  return `${days} day${days !== 1 ? "s" : ""}, ${hours} hour${
    hours !== 1 ? "s" : ""
  } ago`;
}

const requestDownload = async (documentId: number) => {
  try {
    const response = await axios.post(
      `${baseUrl}/file/initiate-download`,
      {
        attachmentId: documentId,
      },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    const token = response.data.body.accessToken;

    // Initiate download
    const downloadUrl = `${baseUrl}/file/download/${token}`;
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
export default function ApplicationModalContent({
  application,
  onApprove,
  onReject,
  onCancel,
}: Props) {
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    setRemarks(""); // Reset remarks every time modal opens
  }, [application]);

  const createdAt = new Date(application.createdAt);

  return (
    <div className="p-4 max-h-[80vh] overflow-y-auto">
      <h2 className="text-xl text-white font-semibold mb-4">
        Application Details
      </h2>

      <div className="space-y-4 text-gray-800 dark:text-white">
        <div className="text-base">
          <span className="text-gray-100">Applicant:</span>{" "}
          <span className="font-semibold">{application.user.name}</span> (
          <span className="font-semibold">{application.user.email}</span>)
        </div>
        <div className="text-base">
          <span className="text-gray-100">Document Type:</span>{" "}
          <span className="font-semibold">
            {application.documentType.title}
          </span>
        </div>
        <div className="text-base">
          <span className="text-gray-100">Status:</span>{" "}
          <span className="font-semibold">
            {ApplicationStatus[application.applicationStatus]}
          </span>
        </div>
        <div className="text-base">
          <span className="text-gray-100">Requested At:</span>{" "}
          <span className="font-semibold">
            {createdAt.toLocaleString()} ({getTimeAgo(createdAt)})
          </span>
        </div>

        {application.coverLetter && (
          <div>
            <p className="font-semibold mb-1">Cover Letter:</p>
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm whitespace-pre-wrap">
              {application.coverLetter}
            </div>
          </div>
        )}

        {application.attachment.length > 0 && (
          <div>
            <p className="font-semibold mb-1">Attachments:</p>
            <ul className="space-y-2">
              {application.attachment.map((file) => (
                <li key={file.id} className="flex items-center gap-2 text-sm">
                  <Paperclip className="w-4 h-4 text-gray-500" />
                  <span
                    onClick={() => {
                      requestDownload(file.id);
                    }}
                  >
                    {file.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {application.applicationStatus === ApplicationStatus.PENDING ? (
        <div className="mt-6">
          <label className="text-sm font-medium mb-1 block text-gray-700 dark:text-gray-300">
            Remarks
          </label>
          <textarea
            className="w-full border border-gray-300 dark:border-gray-700 text-white bg-white dark:bg-gray-900 text-sm rounded p-2 resize-none"
            rows={4}
            placeholder="Enter remarks..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>
      ) : (
        <div className="mt-6">
          <label className="text-sm font-medium mb-1 block text-gray-700 dark:text-gray-300">
            Remarks
          </label>
          <div className="bg-gray-100 dark:bg-gray-400 p-3 rounded text-sm whitespace-pre-wrap">
            {application.remarks}
          </div>
        </div>
      )}

      {application.applicationStatus === ApplicationStatus.PENDING && (
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 text-sm text-red-700 bg-red-100 border border-red-200 rounded hover:bg-red-200"
            onClick={() => onReject(remarks)}
          >
            Reject
          </button>

          <button
            className="px-4 py-2 text-sm text-white bg-green-600 rounded hover:bg-green-700"
            onClick={() => onApprove(remarks)}
          >
            Approve
          </button>
        </div>
      )}
    </div>
  );
}
