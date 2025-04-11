declare namespace Express {
  interface Request {
    email?: string;
    appUser?: {
      id: number;
      role: {
        id: number;
        departmentId?: number;
      } | null;
    };
  }
}
