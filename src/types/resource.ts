export interface Resource {
  id: number;
  teacher_id: number;
  class_id: number;
  teacher_name?: string;
  class_name: string;
  section: string;
  title: string;
  description: string;
  file_path: string;
  file_name: string;
  file_type: string;
  created_at: string;
}

export interface UploadResourcePayload {
  title: string;
  description: string;
  class_id: number;
  file: File;
}
