import { api } from "./api";
import type { ApiResponse } from "../types/auth";
import type {
  DeleteStudentPayload,
  CreateStudentPayload,
  Student,
  StudentFormValues,
  StudentListPayload,
} from "../types/student";

type StudentListApiData =
  | StudentListPayload
  | Student[]
  | {
      total?: number;
      students?: Student[];
      data?: Student[];
      records?: Student[];
    };

const normalizeStudent = (student: Partial<Student>): Student => ({
  id: Number(student.id ?? 0),
  name: String(student.name ?? ""),
  email: String(student.email ?? ""),
  phone: String(student.phone ?? ""),
  course: String(student.course ?? ""),
  gender: String(student.gender ?? ""),
  date_of_birth: String(student.date_of_birth ?? ""),
  address: String(student.address ?? ""),
  profile_image: String(student.profile_image ?? ""),
  created_at: String(student.created_at ?? ""),
});

const getStudentArray = (data: StudentListApiData | undefined): Student[] => {
  if (!data) {
    return [];
  }

  if (Array.isArray(data)) {
    return data.map(normalizeStudent);
  }

  if (Array.isArray(data.students)) {
    return data.students.map(normalizeStudent);
  }

  if (typeof data === "object" && data && "data" in data && Array.isArray((data as any).data)) {
    return (data as any).data.map(normalizeStudent);
  }

  if (typeof data === "object" && data && "records" in data && Array.isArray((data as any).records)) {
    return (data as any).records.map(normalizeStudent);
  }

  return [];
};

const normalizeStudentListPayload = (
  data: StudentListApiData | undefined,
): StudentListPayload => {
  const students = getStudentArray(data);

  return {
    total:
      typeof data === "object" && data && "total" in data && data.total != null
        ? Number(data.total)
        : students.length,
    students,
  };
};

const fetchStudentList = async (
  endpoints: string[],
  keyword?: string,
): Promise<StudentListPayload> => {
  let lastError: unknown;

  for (const endpoint of endpoints) {
    try {
      const response = await api.get<ApiResponse<StudentListApiData>>(endpoint, {
        params: keyword ? { keyword } : undefined,
      });

      return normalizeStudentListPayload(response.data.data);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
};

export const getStudents = async (): Promise<StudentListPayload> => {
  return fetchStudentList(["/students"]);
};

export const searchStudents = async (
  keyword: string,
): Promise<StudentListPayload> => {
  return fetchStudentList(["/students/search"], keyword);
};

const postStudent = async (
  endpoints: string[],
  payload: StudentFormValues | CreateStudentPayload,
): Promise<Student> => {
  let lastError: unknown;

  for (const endpoint of endpoints) {
    try {
      const response = await api.post<ApiResponse<Student>>(endpoint, payload);
      return normalizeStudent(response.data.data);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
};

export const createStudent = async (
  payload: StudentFormValues | CreateStudentPayload,
): Promise<Student> => {
  return postStudent(["/students"], payload);
};

export const updateStudent = async (
  id: number,
  payload: StudentFormValues,
): Promise<Student> => {
  const response = await api.put<ApiResponse<Student>>(
    `/students/${id}`,
    payload,
  );

  return normalizeStudent(response.data.data);
};

export const deleteStudent = async (
  id: number,
): Promise<DeleteStudentPayload> => {
  const response = await api.delete<ApiResponse<DeleteStudentPayload>>(
    `/students/${id}`,
  );

  return {
    deleted_student: normalizeStudent(response.data.data.deleted_student),
  };
};
