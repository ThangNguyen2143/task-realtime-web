export type LoginBody = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};
export type User = {
  id: string;
  email: string;
  nameDisplay: string;
  status?: UserStatus;
  createAt?: Date;
  updateAt?: Date;
};
export enum UserStatus {
  ACTIVE,
  INACTIVE,
  BLOCKED,
}
export type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (data: { user: User; accessToken: string }) => void;
  clearAuth: () => void;
};
export type LoginHookState = {
  data: User | null;
  loading: boolean;
  error: string | null;
};
export type ApiErrorShape = {
  code?: number | string;
  status?: string;
  message?: string;
};
export function mapLoginUserToUser(user: LoginResponse["user"]): User {
  return {
    id: user.id,
    email: user.email,
    nameDisplay: user.name,
  };
}
export type CreateUserDto = {
  name_display: string;

  email: string;

  password: string;
};
