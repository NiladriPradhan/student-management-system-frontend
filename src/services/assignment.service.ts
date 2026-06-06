import type { AxiosProgressEvent } from "axios";
import { api, API_BASE_URL } from "./api";
import type { ApiResponse } from "../types/auth";
import type {
  Assignment,
  AssignmentFormValues,
  AssignmentSubmission,
  AssignmentSubmissionsPayload,
  SubmitAssignmentPayload,
} from "../types/assignment";

const normalizeAssignment = (data: Partial<Assignment>): Assignment => ({
  id: Number(data.id ?? 0),
  teacher_id: Number(data.teacher_id ?? 0),
  class_id: Number(data.class_id ?? 0),
  title: String(data.title ?? ""),
  description: String(data.description ?? ""),
  due_date: String(data.due_date ?? ""),
  created_at: String(data.created_at ?? ""),
  class_name: String(data.class_name ?? ""),
  section: String(data.section ?? ""),
  teacher_name: data.teacher_name ? String(data.teacher_name) : undefined,
  total_students:
    data.total_students === undefined ? undefined : Number(data.total_students),
  submissions_count:
    data.submissions_count === undefined
      ? undefined
      : Number(data.submissions_count),
  submission_id:
    data.submission_id === undefined || data.submission_id === null
      ? null
      : Number(data.submission_id),
  file_path: data.file_path ?? null,
  remarks: data.remarks ?? null,
  submitted_at: data.submitted_at ?? null,
  submission_status: data.submission_status
    ? String(data.submission_status)
    : "pending",
});

const normalizeSubmission = (
  data: Partial<AssignmentSubmission>,
): AssignmentSubmission => ({
  id: data.id === null || data.id === undefined ? null : Number(data.id),
  assignment_id: Number(data.assignment_id ?? 0),
  student_id: Number(data.student_id ?? 0),
  student_name: data.student_name ? String(data.student_name) : undefined,
  student_email: data.student_email ? String(data.student_email) : undefined,
  file_path: data.file_path ?? null,
  remarks: data.remarks ?? null,
  submitted_at: data.submitted_at ?? null,
  status: String(data.status ?? "pending"),
  assignment_title: data.assignment_title
    ? String(data.assignment_title)
    : undefined,
  due_date: data.due_date ? String(data.due_date) : undefined,
  class_name: data.class_name ? String(data.class_name) : undefined,
  section: data.section ? String(data.section) : undefined,
});

export const getAssignmentFileUrl = (filePath: string) => {
  const backendBaseUrl = API_BASE_URL.replace(/\/api\/?$/, "");
  return `${backendBaseUrl}/${filePath.replace(/^\/+/, "")}`;
};

export const createAssignment = async (
  payload: AssignmentFormValues,
): Promise<number> => {
  const response = await api.post<ApiResponse<{ assignment_id: number }>>(
    "/assignments/createAssignment.php",
    payload,
  );

  return Number(response.data.data?.assignment_id ?? 0);
};

export const getTeacherAssignments = async (): Promise<Assignment[]> => {
  const response = await api.get<ApiResponse<Assignment[]>>(
    "/assignments/getTeacherAssignments.php",
  );

  return Array.isArray(response.data.data)
    ? response.data.data.map(normalizeAssignment)
    : [];
};

export const getAssignmentSubmissions = async (
  assignmentId: number,
): Promise<AssignmentSubmissionsPayload> => {
  const response = await api.get<ApiResponse<AssignmentSubmissionsPayload>>(
    "/assignments/getTeacherAssignments.php",
    { params: { assignment_id: assignmentId } },
  );

  return {
    assignment: normalizeAssignment(response.data.data?.assignment ?? {}),
    submissions: Array.isArray(response.data.data?.submissions)
      ? response.data.data.submissions.map(normalizeSubmission)
      : [],
  };
};

export const updateAssignment = async (
  payload: AssignmentFormValues & { id: number },
): Promise<void> => {
  await api.put<ApiResponse<null>>(
    "/assignments/updateAssignment.php",
    payload,
  );
};

export const deleteAssignment = async (id: number): Promise<void> => {
  await api.delete<ApiResponse<null>>("/assignments/deleteAssignment.php", {
    data: { id },
  });
};

export const getClassAssignments = async (): Promise<Assignment[]> => {
  const response = await api.get<ApiResponse<Assignment[]>>(
    "/assignments/getClassAssignments.php",
  );

  return Array.isArray(response.data.data)
    ? response.data.data.map(normalizeAssignment)
    : [];
};

export const submitAssignment = async (
  payload: SubmitAssignmentPayload,
  onUploadProgress?: (progress: number) => void,
): Promise<number> => {
  const formData = new FormData();
  formData.append("assignment_id", String(payload.assignment_id));
  formData.append("remarks", payload.remarks);
  formData.append("file", payload.file);

  const response = await api.post<ApiResponse<{ submission_id: number }>>(
    "/assignments/submitAssignment.php",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (event: AxiosProgressEvent) => {
        if (!event.total || !onUploadProgress) {
          return;
        }

        onUploadProgress(Math.round((event.loaded * 100) / event.total));
      },
    },
  );

  return Number(response.data.data?.submission_id ?? 0);
};

export const getMySubmissions = async (): Promise<AssignmentSubmission[]> => {
  const response = await api.get<ApiResponse<AssignmentSubmission[]>>(
    "/assignments/getMySubmissions.php",
  );

  return Array.isArray(response.data.data)
    ? response.data.data.map(normalizeSubmission)
    : [];
};
