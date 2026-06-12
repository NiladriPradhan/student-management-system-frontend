export type AttendanceStatus = "present" | "absent" | "late";

export interface Attendance {
  id: number;
  student_id: number;
  student_name: string;
  attendance_date: string;
  status: AttendanceStatus;
  remarks: string;
  class_id?: number;
  class_name?: string;
}

export interface AttendanceListPayload {
  total: number;
  attendance: Attendance[];
}

export interface AttendanceFormValues {
  class_id?: number;
  student_id: number;
  attendance_date: string;
  status: AttendanceStatus;
  remarks: string;
}

export interface CreateAttendancePayload {
  attendance_id: number;
}
