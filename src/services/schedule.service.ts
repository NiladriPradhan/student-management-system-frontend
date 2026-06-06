import { api } from "./api";
import type { ApiResponse } from "../types/auth";
import type {
  ClassSchedule,
  CreateSchedulePayload,
  UpdateSchedulePayload,
} from "../types/schedule";

export const getTeacherSchedule = async (): Promise<ClassSchedule[]> => {
  const response = await api.get<ApiResponse<ClassSchedule[]>>(
    "/class_schedules/getTeacherSchedule.php",
  );

  return Array.isArray(response.data.data) ? response.data.data : [];
};

export const getSchedules = async (
  teacher_id?: number,
): Promise<ClassSchedule[]> => {
  const params = teacher_id ? { teacher_id } : {};

  const response = await api.get<ApiResponse<ClassSchedule[]>>(
    "/class_schedules/getSchedules.php",
    { params },
  );

  return Array.isArray(response.data.data) ? response.data.data : [];
};

export const createSchedule = async (
  payload: CreateSchedulePayload,
): Promise<number> => {
  const response = await api.post<ApiResponse<{ schedule_id: number }>>(
    "/class_schedules/createSchedule.php",
    payload,
  );

  return Number(response.data.data?.schedule_id ?? 0);
};

export const updateSchedule = async (
  payload: UpdateSchedulePayload,
): Promise<void> => {
  await api.put<ApiResponse<null>>(
    "/class_schedules/updateSchedule.php",
    payload,
  );
};

export const deleteSchedule = async (id: number): Promise<void> => {
  await api.delete<ApiResponse<null>>(
    "/class_schedules/deleteSchedule.php",
    { data: { id } },
  );
};
