import { api } from "./api";
import type { ApiResponse } from "../types/auth";
import type {
  ClassSchedule,
  CreateSchedulePayload,
  UpdateSchedulePayload,
} from "../types/schedule";

type ScheduleFilters = {
  teacher_id?: number;
  class_id?: number;
};

const normalizeSchedule = (schedule: Partial<ClassSchedule>): ClassSchedule => ({
  id: Number(schedule.id ?? 0),
  teacher_id: Number(schedule.teacher_id ?? 0),
  class_id: Number(schedule.class_id ?? 0),
  teacher_name: schedule.teacher_name ? String(schedule.teacher_name) : "",
  class_name: String(schedule.class_name ?? ""),
  section: String(schedule.section ?? ""),
  grade: schedule.grade ? String(schedule.grade) : "",
  subject: String(schedule.subject ?? ""),
  day_of_week: schedule.day_of_week ?? "",
  start_time: String(schedule.start_time ?? ""),
  end_time: String(schedule.end_time ?? ""),
  room_number: String(schedule.room_number ?? ""),
  created_at: schedule.created_at ? String(schedule.created_at) : "",
});

export const getAdminSchedules = async (
  filters: ScheduleFilters = {},
): Promise<ClassSchedule[]> => {
  const params = {
    ...(filters.teacher_id ? { teacher_id: filters.teacher_id } : {}),
    ...(filters.class_id ? { class_id: filters.class_id } : {}),
  };

  const response = await api.get<ApiResponse<ClassSchedule[]>>(
    "/schedules",
    { params },
  );

  return Array.isArray(response.data.data)
    ? response.data.data.map(normalizeSchedule)
    : [];
};

export const createAdminSchedule = async (
  payload: CreateSchedulePayload,
): Promise<number> => {
  const response = await api.post<ApiResponse<{ schedule_id: number }>>(
    "/schedules",
    payload,
  );

  return Number(response.data.data?.schedule_id ?? 0);
};

export const updateAdminSchedule = async (
  payload: UpdateSchedulePayload,
): Promise<void> => {
  await api.put<ApiResponse<null>>(`/schedules/${payload.id}`, payload);
};

export const deleteAdminSchedule = async (id: number): Promise<void> => {
  await api.delete<ApiResponse<null>>(`/schedules/${id}`);
};
