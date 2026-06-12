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
    "/dashboard/teacher",
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

export interface StudentDashboardStats {
  enrolled_courses: number;
  completed_assignments: number;
  attendance_percentage: number;
}

export interface StudentDashboardData {
  stats: StudentDashboardStats;
  today_schedule: ClassSchedule[];
  recent_submissions: Array<{
    id: number;
    assignment_title: string;
    class_name: string;
    submitted_at: string | Date | null;
    status: string;
  }>;
}

const emptyStudentDashboard: StudentDashboardData = {
  stats: { enrolled_courses: 0, completed_assignments: 0, attendance_percentage: 0 },
  today_schedule: [],
  recent_submissions: [],
};

export const getStudentDashboard = async (): Promise<StudentDashboardData> => {
  const response = await api.get<ApiResponse<StudentDashboardData>>("/dashboard/student");
  const data = response.data.data;

  if (!data) return emptyStudentDashboard;

  return {
    stats: {
      enrolled_courses: Number(data.stats?.enrolled_courses ?? 0),
      completed_assignments: Number(data.stats?.completed_assignments ?? 0),
      attendance_percentage: Number(data.stats?.attendance_percentage ?? 0),
    },
    today_schedule: Array.isArray(data.today_schedule) ? data.today_schedule : [],
    recent_submissions: Array.isArray(data.recent_submissions) ? data.recent_submissions : [],
  };
};
