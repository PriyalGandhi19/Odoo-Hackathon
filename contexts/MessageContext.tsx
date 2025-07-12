import * as React from 'react';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: number;
  read?: boolean;
}

interface MessageContextType {
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  removeMessage: (id: string) => void;
}

const MessageContext = React.createContext<MessageContextType | undefined>(undefined);

export const useMessages = (): MessageContextType => {
  const context = React.useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = React.useState<Message[]>([]);

  const addMessage = (message: Omit<Message, 'id' | 'timestamp' | 'read'>) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      read: false,
      ...message,
    };
    setMessages((prev) => [newMessage, ...prev]);
  };

  const markAsRead = (id: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, read: true } : msg))
    );
  };

  const removeMessage = (id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  return (
    <MessageContext.Provider
      value={{ messages, addMessage, markAsRead, removeMessage }}
    >
      {children}
    </MessageContext.Provider>
  );
};
