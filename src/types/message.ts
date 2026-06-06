export type MessageType = "class" | "direct";

export interface Message {
  id: number;
  sender_id: number;
  class_id: number;
  receiver_id: number | null;
  subject: string;
  message: string;
  created_at: string;
  sender_name: string;
  class_name: string;
  section: string;
  receiver_name: string;
  message_type: MessageType;
}

export interface SendMessagePayload {
  class_id: number;
  receiver_id?: number | null;
  subject: string;
  message: string;
}
