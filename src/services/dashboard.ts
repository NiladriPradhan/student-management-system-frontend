import { api } from "./api";
import type { ApiResponse } from "../types/auth";
import type { ClassSchedule } from "../types/schedule";
import type { Message } from "../types/message";
import type { Resource } from "../types/resource";

export interface TeacherDashboardStats {
  total_classes: number;
  total_students: number;
  todays_classes: number;
  attendance_marked_today: number;
}

export interface TeacherDashboardData {
  stats: TeacherDashboardStats;
  today_schedule: ClassSchedule[];
  recent_messages: Message[];
  recent_resources: Resource[];
}

const emptyDashboard: TeacherDashboardData = {
  stats: {
    total_classes: 0,
    total_students: 0,
    todays_classes: 0,
    attendance_marked_today: 0,
  },
  today_schedule: [],
  recent_messages: [],
  recent_resources: [],
};

export const getTeacherDashboard = async (): Promise<TeacherDashboardData> => {
  const response = await api.get<ApiResponse<TeacherDashboardData>>(
    "/dashboard/getTeacherDashboard.php",
  );

  const data = response.data.data;

  if (!data) {
    return emptyDashboard;
  }

  return {
    stats: {
      total_classes: Number(data.stats?.total_classes ?? 0),
      total_students: Number(data.stats?.total_students ?? 0),
      todays_classes: Number(data.stats?.todays_classes ?? 0),
      attendance_marked_today: Number(
        data.stats?.attendance_marked_today ?? 0,
      ),
    },
    today_schedule: Array.isArray(data.today_schedule)
      ? data.today_schedule
      : [],
    recent_messages: Array.isArray(data.recent_messages)
      ? data.recent_messages
      : [],
    recent_resources: Array.isArray(data.recent_resources)
      ? data.recent_resources
      : [],
  };
};
