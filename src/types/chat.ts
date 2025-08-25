
import { User } from './auth';

export interface FileAttachment {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  url: string;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
  isAutoReply?: boolean;
  isEdited?: boolean;
  isAdminReply?: boolean;
  isSystemMessage?: boolean;
  fileAttachment?: FileAttachment;
}

export interface Conversation {
  messages: Message[];
  participants: string[];
}

export interface ServiceConversation extends Conversation {
  type: 'service';
  clientInfo?: User;
  unreadCount?: number;
}

export interface ChatWidget {
  isOpen: boolean;
  isMinimized: boolean;
  unreadCount: number;
}

export interface AdminChatState {
  activeConversationId: string | null;
  conversations: { [key: string]: ServiceConversation };
  totalUnreadCount: number;
}
