export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  read?: boolean;
  timestamp: string;
}

export interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  notifications: Notification[];
}

export const initialState: AppState = {
  user: {
    name: 'tran Minh Phu',
    id: '1232123',
    email: 'trm@gmail',
  },
  theme: 'light',
  notifications: [],
};
