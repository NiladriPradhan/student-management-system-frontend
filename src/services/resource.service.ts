import type { AxiosProgressEvent } from "axios";
import { api, UPLOAD_BASE_URL } from "./api";
import type { ApiResponse } from "../types/auth";
import type { Resource, UploadResourcePayload } from "../types/resource";

const normalizeResource = (resource: Partial<Resource>): Resource => ({
  id: Number(resource.id ?? 0),
  teacher_id: Number(resource.teacher_id ?? 0),
  class_id: Number(resource.class_id ?? 0),
  teacher_name: resource.teacher_name ? String(resource.teacher_name) : "",
  class_name: String(resource.class_name ?? ""),
  section: String(resource.section ?? ""),
  title: String(resource.title ?? ""),
  description: String(resource.description ?? ""),
  file_path: String(resource.file_path ?? ""),
  file_name: String(resource.file_name ?? ""),
  file_type: String(resource.file_type ?? ""),
  created_at: String(resource.created_at ?? ""),
});

export const getResourceFileUrl = (filePath: string) => {
  const backendBaseUrl = UPLOAD_BASE_URL;
  return `${backendBaseUrl}/${filePath.replace(/^\/+/, "")}`;
};

export const getTeacherResources = async (): Promise<Resource[]> => {
  const response = await api.get<ApiResponse<Resource[]>>(
    "/resources",
  );

  return Array.isArray(response.data.data)
    ? response.data.data.map(normalizeResource)
    : [];
};

export const getClassResources = async (
  classId: number,
): Promise<Resource[]> => {
  const response = await api.get<ApiResponse<Resource[]>>(
    `/resources/class/${classId}`,
  );

  return Array.isArray(response.data.data)
    ? response.data.data.map(normalizeResource)
    : [];
};

export const uploadResource = async (
  payload: UploadResourcePayload,
  onUploadProgress?: (progress: number) => void,
): Promise<number> => {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("description", payload.description);
  formData.append("class_id", String(payload.class_id));
  formData.append("file", payload.file);

  const response = await api.post<ApiResponse<{ resource_id: number }>>(
    "/resources",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (event: AxiosProgressEvent) => {
        if (!event.total || !onUploadProgress) {
          return;
        }

        onUploadProgress(Math.round((event.loaded * 100) / event.total));
      },
    },
  );

  return Number(response.data.data?.resource_id ?? 0);
};

export const deleteResource = async (id: number): Promise<void> => {
  await api.delete<ApiResponse<null>>(`/resources/${id}`);
};
