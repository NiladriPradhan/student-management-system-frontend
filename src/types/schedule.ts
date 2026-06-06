// types/schedule.ts
export interface ClassSchedule {
  id: number;
  teacher_id: number;
  class_id: number;
  teacher_name?: string;
  class_name: string;
  section: string;
  grade?: string;
  subject: string;
  day_of_week: number | string; // API may return day name or 0=Sunday .. 6=Saturday
  start_time: string; // HH:MM:SS
  end_time: string; // HH:MM:SS
  room_number: string;
  created_at?: string;
}

export interface CreateSchedulePayload {
  teacher_id: number;
  class_id: number;
  subject: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  room_number: string;
}

export interface UpdateSchedulePayload extends CreateSchedulePayload {
  id: number;
}

export interface DaySchedule {
  dayName: string;
  classes: ClassSchedule[];
}

export interface WeeklySchedule {
  [dayName: string]: ClassSchedule[];
}

export interface ScheduleFormValues {
  teacher_id: number;
  class_id: number;
  subject: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  room_number: string;
}
