export interface Attachment {
  id: number;
  name: string;
}

export interface DocumentType {
  id: number;
  title: string;
  templateName: string;
  canGenerateDigitally: boolean;
  canGeneratePhysically: boolean;
  preRequiredTypes: string;
  multipleAllowed: boolean;
  departmentId: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  role: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: number;
  userId: number;
  documentTypeId: number;
  applicationStatus: number;
  issuedDocumentId: number;
  arpprovedBy: number;
  coverLetter: string;
  remarks: string;
  createdAt: string;
  updatedAt: string;
  documentType: DocumentType;
  user: User;
  attachment: Attachment[];
}

export interface ApplicationResponse {
  success: boolean;
  code: number;
  message: string;
  body: Application[];
}
