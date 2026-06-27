import api from "./Api";

export interface loginRequest {
  email: string;
  password: string;
}

export interface loginResponseData {
  token: string;
}

export async function login(data: loginRequest): Promise<loginResponseData> {
  try {
    const response = await api.post<loginResponseData>("/auth/login", data);
    return response.data;
  } catch (error) {
    throw new Error("Login failed");
  }
}