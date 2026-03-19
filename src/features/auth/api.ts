import { api, refreshAccessToken } from "@/lib/api";
import type { CreateUserDto, LoginBody, LoginResponse, User } from "./types";

export async function loginApi(payload: LoginBody) {
  return api.post<LoginResponse, LoginBody>("/auth/login", payload, {
    auth: false,
  });
}

export async function refreshApi() {
  return await refreshAccessToken();
}

export async function getMeApi() {
  return api.get<User>("/auth/me", {
    auth: true,
  });
}
export async function logoutApi() {
  return api.post("/auth/logout", undefined, {
    auth: true,
  });
}
export async function registerApi(payload: CreateUserDto) {
  return api.post<User, CreateUserDto>("/auth/register", payload, {
    auth: false,
  });
}
