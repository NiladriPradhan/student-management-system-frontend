import { api } from "./api";
import type { ApiResponse } from "../types/auth";
import type { Message, SendMessagePayload } from "../types/message";

const normalizeMessage = (data: Partial<Message>): Message => ({
  id: Number(data.id ?? 0),
  sender_id: Number(data.sender_id ?? 0),
  class_id: Number(data.class_id ?? 0),
  receiver_id:
    data.receiver_id === null || data.receiver_id === undefined
      ? null
      : Number(data.receiver_id),
  subject: String(data.subject ?? ""),
  message: String(data.message ?? ""),
  created_at: String(data.created_at ?? ""),
  sender_name: String(data.sender_name ?? ""),
  class_name: String(data.class_name ?? ""),
  section: String(data.section ?? ""),
  receiver_name: String(data.receiver_name ?? ""),
  message_type: data.message_type === "direct" ? "direct" : "class",
});

export const sendMessage = async (
  payload: SendMessagePayload,
): Promise<number> => {
  const response = await api.post<ApiResponse<{ message_id: number }>>(
    "/messages",
    payload,
  );

  return Number(response.data.data?.message_id ?? 0);
};

export const getTeacherMessages = async (
  classId?: number,
): Promise<Message[]> => {
  const response = await api.get<ApiResponse<Message[]>>(
    "/messages",
    {
      params: classId ? { class_id: classId } : {},
    },
  );

  return Array.isArray(response.data.data)
    ? response.data.data.map(normalizeMessage)
    : [];
};

export const getStudentMessages = async (): Promise<Message[]> => {
  const response = await api.get<ApiResponse<Message[]>>(
    "/messages/student",
  );

  return Array.isArray(response.data.data)
    ? response.data.data.map(normalizeMessage)
    : [];
};

export const getClassMessages = async (classId: number): Promise<Message[]> => {
  const response = await api.get<ApiResponse<Message[]>>(
    `/messages/class/${classId}`,
  );

  return Array.isArray(response.data.data)
    ? response.data.data.map(normalizeMessage)
    : [];
};
