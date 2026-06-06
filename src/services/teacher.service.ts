import { api } from "./api";
import type { ApiResponse } from "../types/auth";
import type {
  Teacher,
  TeacherFormValues,
  TeacherListPayload,
} from "../types/teacher";

type TeacherListApiData =
  | TeacherListPayload
  | Teacher[]
  | {
      total?: number;
      teachers?: Teacher[];
      data?: Teacher[];
      records?: Teacher[];
    };

/**
 * Normalize teacher data from API response
 */
const normalizeTeacher = (teacher: Partial<Teacher>): Teacher => ({
  id: Number(teacher.id ?? 0),
  name: String(teacher.name ?? ""),
  email: String(teacher.email ?? ""),
  phone: String(teacher.phone ?? ""),
  subject: String(teacher.subject ?? ""),
  employment_type: (teacher.employment_type ?? "full_time") as
    | "full_time"
    | "part_time",
  gender: String(teacher.gender ?? ""),
  date_of_birth: String(teacher.date_of_birth ?? ""),
  address: String(teacher.address ?? ""),
  profile_image: String(teacher.profile_image ?? ""),
  created_at: String(teacher.created_at ?? ""),
});

/**
 * Extract teacher array from various API response formats
 */
const getTeacherArray = (data: TeacherListApiData | undefined): Teacher[] => {
  if (!data) {
    return [];
  }

  if (Array.isArray(data)) {
    return data.map(normalizeTeacher);
  }

  if (Array.isArray(data.teachers)) {
    return data.teachers.map(normalizeTeacher);
  }

  if ("data" in data && Array.isArray(data.data)) {
    return data.data.map(normalizeTeacher);
  }

  if ("records" in data && Array.isArray(data.records)) {
    return data.records.map(normalizeTeacher);
  }

  return [];
};

/**
 * Normalize API response to consistent TeacherListPayload format
 */
const normalizeTeacherListPayload = (
  data: TeacherListApiData | undefined,
): TeacherListPayload => {
  const teachers = getTeacherArray(data);

  return {
    total:
      typeof data === "object" && data && "total" in data && data.total != null
        ? Number(data.total)
        : teachers.length,
    teachers,
  };
};

/**
 * Fetch all teachers with retry fallback for different API endpoints
 */
const fetchTeacherList = async (
  endpoints: string[],
  keyword?: string,
): Promise<TeacherListPayload> => {
  let lastError: unknown;

  for (const endpoint of endpoints) {
    try {
      const response = await api.get<ApiResponse<TeacherListApiData>>(
        endpoint,
        {
          params: keyword ? { keyword } : undefined,
        },
      );

      return normalizeTeacherListPayload(response.data.data);
    } catch (error) {
      lastError = error;
      // Continue to next endpoint
    }
  }

  throw lastError;
};

/**
 * Get all teachers
 * @returns Promise<TeacherListPayload>
 */
export const getTeachers = async (): Promise<TeacherListPayload> => {
  return fetchTeacherList(["/teachers/getTeachers.php"]);
};

/**
 * Search teachers by keyword
 * Searches name, email, and subject
 * @param keyword - Search keyword
 * @returns Promise<TeacherListPayload>
 */
export const searchTeachers = async (
  keyword: string,
): Promise<TeacherListPayload> => {
  if (!keyword.trim()) {
    return getTeachers();
  }

  try {
    const response = await api.get<ApiResponse<TeacherListApiData>>(
      "/teachers/searchTeacher.php",
      {
        params: { keyword: keyword.trim() },
      },
    );

    return normalizeTeacherListPayload(response.data.data);
  } catch (error) {
    // Fallback to client-side search
    const allTeachers = await getTeachers();
    return {
      total: allTeachers.total,
      teachers: allTeachers.teachers.filter((teacher) => {
        const normalizedKeyword = keyword.trim().toLowerCase();
        return [teacher.name, teacher.email, teacher.subject].some((value) =>
          value.toLowerCase().includes(normalizedKeyword),
        );
      }),
    };
  }
};

/**
 * Create a new teacher
 * @param formValues - Teacher form values
 * @returns Promise<number>
 */
export const createTeacher = async (
  formValues: TeacherFormValues,
): Promise<number> => {
  const response = await api.post<ApiResponse<{ teacher_id: number }>>(
    "/teachers/addTeacher.php",
    formValues,
  );

  return Number(response.data.data?.teacher_id ?? 0);
};

/**
 * Update an existing teacher
 * @param id - Teacher ID
 * @param formValues - Updated teacher form values
 * @returns Promise<void>
 */
export const updateTeacher = async (
  id: number,
  formValues: TeacherFormValues,
): Promise<void> => {
  await api.put<ApiResponse<null>>(
    "/teachers/updateTeacher.php",
    {
      id,
      ...formValues,
    },
  );
};

/**
 * Delete a teacher
 * @param id - Teacher ID
 * @returns Promise<void>
 */
export const deleteTeacher = async (id: number): Promise<void> => {
  await api.delete<ApiResponse<null>>(
    "/teachers/deleteTeacher.php",
    {
      data: { id },
    },
  );
};
