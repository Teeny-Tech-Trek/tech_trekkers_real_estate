// src/types/auth.ts
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  organization?: {
    id: string;
    name: string;
  };
  role: 'owner' | 'admin' | 'member';
}
export interface Organization {
  id: string; // Use 'id' to match the console log and backend response
  name: string;
  plan?: {
    name: string;
    seats: number;
  };
  members?: string[];
  createdAt?: string;
  owner?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: {
    firstName: string;
    lastName: string;
    email: string;
    company?: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  isLoading: boolean;
}