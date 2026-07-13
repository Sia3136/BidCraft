const fs = require('fs');
const path = require('path');

const storePath = path.join('C:', 'Bidcraft', 'frontend', 'lib', 'store.ts');
let content = fs.readFileSync(storePath, 'utf8');

// Replace Notification interface
const oldInterface = `interface Notification {
  id: string;
  message: string;
  read: boolean;
  type: 'info' | 'urgent' | 'success';
}`;
const newInterface = `import { notifications as staticNotifications, Notification as NotificationType } from './notifications';\n\ntype Notification = NotificationType;`;
content = content.replace(oldInterface, newInterface);

// Find initialization of notifications
content = content.replace(/notifications: \[\]/g, 'notifications: staticNotifications');

// Add markAllNotificationsRead
const addNotification = `addNotification: (notification: Omit<Notification, 'id' | 'read'>) => void;`;
const addNotificationNew = `addNotification: (notification: Omit<Notification, 'id' | 'read'>) => void;\n  markAllNotificationsRead: () => void;`;
content = content.replace(addNotification, addNotificationNew);

const markNotificationReadImpl = `markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
      })),`;
const markAllImpl = `markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
      })),\n      markAllNotificationsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true }))
      })),`;
content = content.replace(markNotificationReadImpl, markAllImpl);

fs.writeFileSync(storePath, content);
console.log('store.ts updated');
