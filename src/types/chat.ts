
import { User } from './auth';

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
