import { api } from "./api";
import type { ApiResponse } from "../types/auth";
import type {
  Class,
  ClassFormValues,
  ClassListPayload,
  TeacherAssignment,
} from "../types/classes";
import type { Student } from "../types/student";

const normalizeClass = (data: Partial<Class>): Class => ({
  id: Number(data.id ?? 0),
  class_name: String(data.class_name ?? ""),
  section: String(data.section ?? ""),
  created_at: String(data.created_at ?? ""),
  subject: ""
});

const normalizeClassListPayload = (
  data: Class[] | { classes?: Class[] } | undefined,
): ClassListPayload => {
  const classes: Class[] = Array.isArray(data)
    ? data.map(normalizeClass)
    : Array.isArray(data?.classes)
    ? data.classes.map(normalizeClass)
    : [];

  return {
    total: classes.length,
    classes,
  };
};

const normalizeTeacherAssignment = (
  data: Partial<TeacherAssignment>,
): TeacherAssignment => ({
  id: Number(data.id ?? 0),
  teacher_id: Number(data.teacher_id ?? 0),
  class_id: Number(data.class_id ?? 0),
  subject: String(data.subject ?? ""),
  created_at: String(data.created_at ?? ""),
  class_name: String(data.class_name ?? ""),
  section: String(data.section ?? ""),
  total_students: data.total_students ? Number(data.total_students) : undefined,
});

const normalizeStudent = (data: Partial<Student>): Student => ({
  id: Number(data.id ?? 0),
  name: String(data.name ?? ""),
  email: String(data.email ?? ""),
  phone: data.phone ? String(data.phone) : undefined,
  course: data.course ? String(data.course) : undefined,
  gender: data.gender ? String(data.gender) : undefined,
  date_of_birth: data.date_of_birth ? String(data.date_of_birth) : undefined,
  address: data.address ? String(data.address) : undefined,
  profile_image: data.profile_image ? String(data.profile_image) : undefined,
  created_at: data.created_at ? String(data.created_at) : undefined,
  class_name: data.class_name ? String(data.class_name) : undefined,
  section: data.section ? String(data.section) : undefined,
  subject: data.subject ? String(data.subject) : undefined,
});

export const getClasses = async (): Promise<ClassListPayload> => {
  const response = await api.get<ApiResponse<Class[]>>("/classes");

  return normalizeClassListPayload(response.data.data);
};

export const createClass = async (
  payload: ClassFormValues,
): Promise<Class> => {
  const response = await api.post<ApiResponse<Class>>("/classes", payload);

  return normalizeClass(response.data.data);
};

export const updateClass = async (
  id: number,
  payload: ClassFormValues,
): Promise<Class> => {
  await api.put<ApiResponse<null>>(`/classes/${id}`, payload);

  return {
    id,
    ...payload,
    created_at: "",
  };
};

export const deleteClass = async (id: number): Promise<void> => {
  await api.delete<ApiResponse<null>>(`/classes/${id}`);
};

export const getTeacherAssignments = async (): Promise<TeacherAssignment[]> => {
  const response = await api.get<ApiResponse<TeacherAssignment[]>>(
    "/teacher-classes",
  );

  return Array.isArray(response.data.data)
    ? response.data.data.map(normalizeTeacherAssignment)
    : [];
};

export const assignTeacherToClass = async (
  teacher_id: number,
  class_id: number,
  subject: string,
): Promise<void> => {
  await api.post<ApiResponse<null>>("/teacher-classes", {
    teacher_id,
    class_id,
    subject,
  });
};

export const removeTeacherAssignment = async (id: number): Promise<void> => {
  await api.delete<ApiResponse<null>>(`/teacher-classes/${id}`);
};

export const getClassStudents = async (class_id: number): Promise<Student[]> => {
  const response = await api.get<ApiResponse<Student[]>>(
    "/student-classes",
    {
      params: { class_id },
    },
  );

  return Array.isArray(response.data.data)
    ? response.data.data.map(normalizeStudent)
    : [];
};

export const getMyCourses = async (): Promise<Class[]> => {
  const response = await api.get<ApiResponse<Class[]>>("/student-classes/my");

  return Array.isArray(response.data.data)
    ? response.data.data.map((d) => ({
        id: Number((d as any).id ?? (d as any).legacyId ?? 0),
        class_name: String((d as any).className ?? (d as any).class_name ?? ""),
        section: String((d as any).section ?? ""),
        created_at: String((d as any).createdAt ?? (d as any).created_at ?? ""),
      }))
    : [];
};

export const getTeacherStudents = async (class_id?: number): Promise<Student[]> => {
  const response = await api.get<ApiResponse<Student[]>>(
    "/student-classes/teacher-students",
    {
      params: class_id ? { class_id } : {},
    },
  );

  return Array.isArray(response.data.data)
    ? response.data.data.map(normalizeStudent)
    : [];
};

export const assignStudentToClass = async (
  student_id: number,
  class_id: number,
): Promise<void> => {
  await api.post<ApiResponse<null>>("/student-classes", {
    student_id,
    class_id,
  });
};

export const removeStudentFromClass = async (
  student_id: number,
  class_id: number,
): Promise<void> => {
  await api.delete<ApiResponse<null>>("/student-classes", {
    data: {
      student_id,
      class_id,
    },
  });
};
