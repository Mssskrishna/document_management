import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const Certificate = () => {
  const certificateList = [
    {
      name: "Bonafide Certificate",
      requiredDocs: ["Aadhaar Card", "Previous Semester Marks Memo"],
    },
    {
      name: "Transfer Certificate",
      requiredDocs: ["Bonafide Certificate", "ID Card"],
    },
    {
      name: "Study Certificate",
      requiredDocs: ["Aadhaar Card", "SSC Memo"],
    },
  ];

  const [selectedCertificate, setSelectedCertificate] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [subject, setSubject] = useState("");

  const handleFileChange = async (event, doc) => {
    const file = event.target.files[0];
    if (!file) return;

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
      console.log(response.data);
      // Assuming backend returns uploaded file info (like URL or filename)
      setUploadedFiles((prev) => [...prev, response.data.body.attachmentId]);
    } catch (error) {
      console.error("File upload failed:", error);
      toast.error("Failed to upload file. Try again.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(uploadedFiles);
    if (selectedCertificate === "") {
      toast.error("Please select a certificate type.")
      return;
    }

    const requiredDocs = certificateList[selectedCertificate].requiredDocs;

    if (uploadedFiles.length < requiredDocs.length) {
      toast.error("Upload files");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8080/student/request-application",
        {
          documentTypeId: parseInt(selectedCertificate) + 1,
          coverLetter: subject,
          attachmentIds: uploadedFiles, // Send the file metadata
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      toast.success("Certificate request submitted successfully!");
      setUploadedFiles({});
      setSubject("");
      setSelectedCertificate("");
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Submission failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-700 flex items-center justify-center p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-2xl font-bold text-blue-600 text-center mb-4">
          Request a Certificate
        </h2>

        <label className="block font-semibold mb-2">Select Certificate:</label>
        <select
          className="w-full p-2 border rounded mb-4"
          value={selectedCertificate}
          onChange={(e) => setSelectedCertificate(e.target.value)}
        >
          <option value="">-- Select Certificate --</option>
          {certificateList.map((cert, index) => (
            <option key={index} value={index}>
              {cert.name}
            </option>
          ))}
        </select>

        {selectedCertificate !== "" && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Upload Required Documents:</h3>
            {certificateList[selectedCertificate].requiredDocs.map((doc, i) => (
              <div key={doc} className="mb-2 flex items-center space-x-4">
                <label className="w-40 font-medium">{doc}:</label>
                <div className="relative">
                  <input
                    type="file"
                    className="hidden"
                    id={`upload-${doc}`}
                    onChange={(e) => handleFileChange(e, doc)}
                  />
                  <label
                    htmlFor={`upload-${doc}`}
                    className="cursor-pointer bg-gray-900 text-white py-2 px-4 rounded-md font-bold hover:bg-gray-800 transition"
                  >
                    Choose File
                  </label>
                </div>
                {uploadedFiles[i] && (
                  <span className="text-gray-700">
                    {uploadedFiles[i] ? "File Uploaded" : "No file chosen"}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        <label className="block font-semibold mb-2">Subject (Optional):</label>
        <textarea
          className="w-full p-2 border rounded mb-4"
          rows="3"
          placeholder="Enter any additional details..."
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        ></textarea>

        <button
          className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition"
          onClick={handleSubmit}
        >
          Request Certificate
        </button>
      </div>
    </div>
  );
};

export default Certificate;
