import * as React from 'react';

export interface Notification {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  read?: boolean;
  timestamp: number;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = React.createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = (): NotificationContextType => {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      read: false,
      ...notification,
    };
    setNotifications((prev: Notification[]) => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev: Notification[]) =>
      prev.map((notif: Notification) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications((prev: Notification[]) => prev.filter((notif: Notification) => notif.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, markAsRead, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
