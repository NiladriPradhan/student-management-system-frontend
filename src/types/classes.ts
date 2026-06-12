import type { Student } from "./student";

export interface Class {
  id: number;
  class_name: string;
  section: string;
  created_at: string;
  subject?: string;
  grade?: string;
}

export interface ClassListPayload {
  total: number;
  classes: Class[];
}

export interface ClassFormValues {
  class_name: string;
  section: string;
}

export interface TeacherAssignment {
  id: number;
  teacher_id: number;
  class_id: number;
  subject: string;
  created_at: string;
  class_name: string;
  section: string;
  total_students?: number;
}

export interface ClassStudent extends Student {}
