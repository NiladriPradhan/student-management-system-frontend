export interface Teacher {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  employment_type: "full_time" | "part_time";
  gender: string;
  date_of_birth: string;
  address: string;
  profile_image: string;
  created_at: string;
}

export interface TeacherListPayload {
  total: number;
  teachers: Teacher[];
}

export interface TeacherFormValues {
  name: string;
  email: string;
  password?: string;
  phone: string;
  subject: string;
  employment_type: "full_time" | "part_time";
  gender: string;
  date_of_birth: string;
  address: string;
  profile_image: string;
}

export interface DeleteTeacherPayload {
  deleted_teacher: Teacher;
}
