import { createContext, useContext, useState, ReactNode } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type?: 'success' | 'error';
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (title: string, message: string, type?: 'success' | 'error') => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (title: string, message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, title, message, type }]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
      <div className="fixed top-4 right-4 z-[60] space-y-3">
        {notifications.map((notification) => {
          const isError = notification.type === 'error';
          return (
            <div key={notification.id} className={`${isError ? 'bg-red-600' : 'bg-green-600'} text-white px-6 py-4 rounded-lg shadow-2xl max-w-md animate-in slide-in-from-right duration-300`}>
              <div className="flex items-start gap-3">
                {isError ? (
                  <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                <div>
                  <h3 className="font-semibold text-lg mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>{notification.title}</h3>
                  <p className={`text-sm ${isError ? 'text-red-50' : 'text-green-50'} whitespace-pre-line`} style={{ fontFamily: 'Inter, sans-serif' }}>
                    {notification.message}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
}
