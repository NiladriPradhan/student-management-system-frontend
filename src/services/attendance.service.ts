import { api } from "./api";
import type { ApiResponse } from "../types/auth";
import type {
  Attendance,
  AttendanceFormValues,
  AttendanceListPayload,
} from "../types/attendance";

type AttendanceApiData =
  | Attendance[]
  | {
      total?: number;
      attendance?: Attendance[];
      data?: Attendance[];
      records?: Attendance[];
    };

const normalizeAttendance = (data: Partial<Attendance>): Attendance => ({
  id: Number(data.id ?? 0),
  student_id: Number(data.student_id ?? 0),
  student_name: String(data.student_name ?? ""),
  attendance_date: String(data.attendance_date ?? ""),
  status:
    data.status === "absent" || data.status === "late"
      ? data.status
      : "present",
  remarks: String(data.remarks ?? ""),
});

const getAttendanceArray = (data: AttendanceApiData | undefined): Attendance[] => {
  if (!data) {
    return [];
  }

  if (Array.isArray(data)) {
    return data.map(normalizeAttendance);
  }

  if (Array.isArray(data.attendance)) {
    return data.attendance.map(normalizeAttendance);
  }

  if (Array.isArray(data.data)) {
    return data.data.map(normalizeAttendance);
  }

  if (Array.isArray(data.records)) {
    return data.records.map(normalizeAttendance);
  }

  return [];
};

const normalizeAttendanceListPayload = (
  data: AttendanceApiData | undefined,
): AttendanceListPayload => ({
  total:
    typeof data === "object" && data && "total" in data && data.total != null
      ? Number(data.total)
      : getAttendanceArray(data).length,
  attendance: getAttendanceArray(data),
});

export const getAttendance = async (): Promise<AttendanceListPayload> => {
  const response = await api.get<ApiResponse<AttendanceApiData>>(
    "/attendance",
  );

  return normalizeAttendanceListPayload(response.data.data);
};

export const getStudentAttendance = async (
  student_id: number,
): Promise<AttendanceListPayload> => {
  const response = await api.get<ApiResponse<AttendanceApiData>>(
    `/attendance/student/${student_id}`,
  );

  return normalizeAttendanceListPayload(response.data.data);
};

export const getAttendanceByDate = async (
  date: string,
  class_id?: number,
): Promise<AttendanceListPayload> => {
  const params: Record<string, string | number> = { date };
  if (class_id && class_id > 0) {
    params.class_id = class_id;
  }

  const response = await api.get<ApiResponse<AttendanceApiData>>(
    "/attendance/by-date",
    {
      params,
    },
  );

  return normalizeAttendanceListPayload(response.data.data);
};

export const markAttendance = async (
  formValues: AttendanceFormValues,
): Promise<number> => {
  const response = await api.post<ApiResponse<{ attendance_id: number }>>(
    "/attendance",
    formValues,
  );

  return Number(response.data.data?.attendance_id ?? 0);
};

export const updateAttendance = async (
  attendance_id: number,
  formValues: AttendanceFormValues,
): Promise<void> => {
  await api.put<ApiResponse<null>>(`/attendance/${attendance_id}`, formValues);
};

export const deleteAttendance = async (id: number): Promise<void> => {
  await api.delete<ApiResponse<null>>(`/attendance/${id}`);
};

export const getMyAttendance = async (): Promise<AttendanceListPayload> => {
  const response = await api.get<ApiResponse<AttendanceApiData>>("/attendance/my");

  return normalizeAttendanceListPayload(response.data.data);
};
