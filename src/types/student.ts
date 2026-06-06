// types/student.ts
export interface Student {
  id: number;
  name: string;
  email: string;
  phone?: string;
  roll_no?: string;
  enrollment_number?: string;
  class?: string;
  class_name?: string;
  section?: string;
  subject?: string;
  course?: string;
  gender?: string;
  date_of_birth?: string;
  address?: string;
  profile_image?: string;
  created_at?: string;
  attendance?: string | number;
  performance?: string;
  grade?: string;
  status?: string;
}

export interface StudentListPayload {
  total: number;
  students: Student[];
}

export interface StudentFormValues {
  name: string;
  email: string;
  phone: string;
  course: string;
  gender: string;
  date_of_birth: string;
  address: string;
  profile_image: string;
}

export interface CreateStudentPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  class_id: number;
}

export interface DeleteStudentPayload {
  deleted_student: Student;
}
