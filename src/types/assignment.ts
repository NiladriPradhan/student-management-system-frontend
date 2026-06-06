export interface Assignment {
  id: number;
  teacher_id: number;
  class_id: number;
  title: string;
  description: string;
  due_date: string;
  created_at: string;
  class_name: string;
  section: string;
  teacher_name?: string;
  total_students?: number;
  submissions_count?: number;
  submission_id?: number | null;
  file_path?: string | null;
  remarks?: string | null;
  submitted_at?: string | null;
  submission_status?: string;
}

export interface AssignmentFormValues {
  id?: number;
  class_id: number;
  title: string;
  description: string;
  due_date: string;
}

export interface AssignmentSubmission {
  id: number | null;
  assignment_id: number;
  student_id: number;
  student_name?: string;
  student_email?: string;
  file_path: string | null;
  remarks: string | null;
  submitted_at: string | null;
  status: string;
  assignment_title?: string;
  due_date?: string;
  class_name?: string;
  section?: string;
}

export interface AssignmentSubmissionsPayload {
  assignment: Assignment;
  submissions: AssignmentSubmission[];
}

export interface SubmitAssignmentPayload {
  assignment_id: number;
  remarks: string;
  file: File;
}
