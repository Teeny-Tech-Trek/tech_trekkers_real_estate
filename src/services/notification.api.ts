import api from './api';


export const fetchNotifications = async () => {
  const response = await api.get('/settings/notifications');
  return response.data;
};


export const markNotificationAsRead = async (notificationId: string) => {
  const response = await api.put(`/settings/notifications/${notificationId}/read`);
  return response.data;
};


export const markAllNotificationsAsRead = async () => {
  const response = await api.put('/settings/notifications/read-all');
  return response.data;
};
