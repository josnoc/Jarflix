import axios from "axios";

export interface Login {
  id: number;
  name: string;
  type: boolean;
  token: string;
}

export interface Error {
  message: string;
  code: string;
}

export default async function login(userName: string, password: string) {
  try {
    const response = await axios.post("/login", { userName, password });
    if (response.data.token) {
      return response.data as Login;
    } else {
      throw response.data;
    }
  } catch (e) {
    throw e as Error;
  }
}
