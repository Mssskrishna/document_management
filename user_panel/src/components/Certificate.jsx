import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import ReactSelect from "react-select";
import {
  CheckCircle,
  FileText,
  Upload,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { BaseUrl } from "../utils/baseUrl";

const Certificate = () => {
  const [certificateList, setCertificates] = useState([]);
  const [documents, setDocuments] = useState([]);
  const fetchD = async (endpoint) => {
    try {
      const res = await axios.get(`${BaseUrl}${endpoint}`, {
        withCredentials: true,
      });
      return res.data.body;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };
  const fetchDocuments = async () => {
    const certificateList = await fetchD("/student/documenttypes");
    const documentList = await fetchD("/student/documents");
    setDocuments(documentList[1]);
    setCertificates(certificateList);
    console.log(documentList[1]);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const [selectedCertificate, setSelectedCertificate] = useState(-1);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [subject, setSubject] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingStates, setUploadingStates] = useState([]);
  const [fileNames, setFileNames] = useState([]);

  const handleFileChange = async (event, index) => {
    const file = event.target.files[0];
    if (!file) return;

    // Update file name immediately for better UX
    console.log(file.name)
    const newFileNames = [...fileNames];
    newFileNames[index] = file.name;
    setFileNames(newFileNames);

    const newUploadingState = [...uploadingStates];
    newUploadingState[index] = true;
    setFileNames(newUploadingState);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:8080/file/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      // Update uploaded files array with the new attachment ID
      const newAttachments = [...attachments];
      newAttachments[index] = file;
      setAttachments(newAttachments);

      const newUploadedFiles = [...uploadedFiles];
      newUploadedFiles[index] = response.data.body.attachmentId;
      setUploadedFiles(newUploadedFiles);

      toast.success(`attachment uploaded successfully!`);
    } catch (error) {
      console.error("File upload failed:", error);
      toast.error(`Failed to upload attachment. Please try again.`);

      // Remove the filename on error
      setFileNames((prev) => {
        const updated = [ ...prev ];
        delete updated[index];
        return updated;
      });
    } finally {
      // Clear uploading state
      setUploadingStates((prev) => {
        const updated = [...prev];
        delete updated[index];
        return updated;
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedCertificate === -1) {
      toast.error("Please select a certificate type.");
      return;
    }
    let change = false;
    const requiredDocs =
      certificateList[selectedCertificate].preRequiredTypesArray;
    for (const doc of requiredDocs) {
      if (!documents.includes(doc)) {
        toast.error(`Please request ${certificateList[doc].title} document!`);
        change = true;
        break; // Exit the loop early
      }
    }
    if (change) return;
    console.log(requiredDocs, documents);
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/student/request-application",
        {
          documentTypeId: selectedCertificate + 1,
          coverLetter: subject,
          attachmentIds: uploadedFiles.filter((id) => id), // Filter out any undefined values
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      toast.success("Certificate request submitted successfully!");

      // Reset form
      setUploadedFiles([]);
      setSubject("");
      setSelectedCertificate(-1);
      setFileNames({});
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error(error.response.data.message || "Failed to submit request.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const [attachments, setAttachments] = useState([]);

  const handleAddAttachment = () => {
    setAttachments((prev) => [...(prev ?? []), null]);
    setFileNames((prev) => [...(prev ?? []), ""]);
    setUploadingStates((prev) => [...(prev ?? []), false]);
  };

  const selectStyles = {
    control: (base) => ({
      ...base,
      borderColor: "#e2e8f0",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#cbd5e1",
      },
      padding: "2px",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#1e40af"
        : state.isFocused
        ? "#e2e8f0"
        : null,
      color: state.isSelected ? "white" : "black",
    }),
  };

  return (
    <div className=" flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-xl">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Certificate Request Portal
          </h2>
          <p className="text-gray-600">
            Select and request official certificates
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Certificate Type
            </label>
            {certificateList && (
              <ReactSelect
                styles={selectStyles}
                options={certificateList.map((cert, index) => ({
                  label: cert.title,
                  value: index,
                }))}
                value={
                  selectedCertificate !== -1
                    ? {
                        label: certificateList[selectedCertificate]?.title,
                        value: selectedCertificate,
                      }
                    : null
                }
                onChange={(selectedOption) =>
                  setSelectedCertificate(selectedOption.value)
                }
                placeholder="-- Select Certificate --"
                isDisabled={isSubmitting}
              />
            )}
          </div>
          {selectedCertificate !== "" && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                Required Documents
              </h3>

              <div className="space-y-4">
                {certificateList[
                  selectedCertificate
                ]?.preRequiredTypesArray.map((doc, i) => (
                  <div
                    key={doc}
                    className="flex flex-col sm:flex-row sm:items-center gap-3"
                  >
                    <label className="w-full sm:w-1/3 font-medium text-gray-700 text-sm">
                      {certificateList[doc].title}:
                    </label>
                    <div className="w-full sm:w-2/3 flex items-center">
                      {documents.some((document) => document === doc) ? (
                        documents.map((document) => {
                          if (document === doc) {
                            return (
                              <div key={document} className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                                <span className="text-sm text-gray-700 truncate flex-1">
                                  {document.title || "File present"}
                                </span>
                              </div>
                            );
                          } else return null;
                        })
                      ) : (
                        <button
                          onClick={() => setSelectedCertificate(doc.toString())}
                          className="p-2 border border-gray-300 rounded hover:bg-gray-200 text-sm"
                        >
                          Click to request
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium text-gray-800 mb-4 flex items-center">
              <Upload className="w-5 h-5 mr-2 text-blue-600" />
              Attachments
            </h3>

            <div className="space-y-4">
              {attachments.map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-center gap-3"
                >
                  <label className="w-full sm:w-1/3 font-medium text-gray-700 text-sm">
                    Attachment {i + 1}:
                  </label>
                  <div className="w-full sm:w-2/3">
                    <input
                      type="file"
                      className="hidden"
                      id={`upload-${i}`}
                      disabled={uploadingStates[i]}
                      onChange={(e) => handleFileChange(e, i)}
                    />

                    {attachments[i] ? (
                      <div className="flex items-center bg-green-50 border border-green-200 rounded-md p-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        <span className="text-sm text-gray-700 truncate flex-1">
                          {fileNames[i]}
                        </span>
                        <label
                          htmlFor={`upload-${i}`}
                          className="text-xs text-blue-600 cursor-pointer hover:text-blue-800 ml-2"
                        >
                          Change
                        </label>
                      </div>
                    ) : (
                      <label
                        htmlFor={`upload-${i}`}
                        className="flex items-center justify-center w-full border-2 border-dashed rounded-md p-3 cursor-pointer
                    ${uploadingStates[i] ? 'bg-gray-100 border-blue-300' : 'border-blue-300 hover:border-blue-500 bg-blue-50'}"
                        // onClick={handleFileChange(event, i)}
                      >
                        {uploadingStates[i] ? (
                          <>
                            <Loader2 className="w-5 h-5 text-gray-500 mr-2 animate-spin" />
                            <span className="text-sm text-gray-500">
                              Uploading...
                            </span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-5 h-5 text-blue-500 mr-2" />
                            <span className="text-sm text-gray-700">
                              Choose file
                            </span>
                          </>
                        )}
                      </label>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddAttachment}
              className="text-sm text-blue-600 hover:text-blue-800 mt-4"
            >
              + Add Attachment
            </button>
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Additional Details (Optional)
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              rows="3"
              placeholder="Enter any additional information or special requirements..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={isSubmitting}
            ></textarea>
          </div>

          {selectedCertificate !== "" && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start">
              <AlertCircle className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                Your request for{" "}
                <strong>{certificateList[selectedCertificate]?.title}</strong>{" "}
                will be processed within 3-5 working days. You'll receive email
                notifications about your request status.
              </p>
            </div>
          )}

          <button
            className={`w-full py-3 px-4 rounded-md font-medium text-white transition-all duration-200 flex items-center justify-center
              ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
              }`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Submit Certificate Request"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
