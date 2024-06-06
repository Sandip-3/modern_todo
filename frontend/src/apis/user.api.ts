import { appAxios } from "@/config/axios";

export const registerUser = (values: any) => {
  return appAxios.post(`/users`, values);
};

export const verifyUser = (values: any) => {
  return appAxios.post("/users/verify", values);
};

export const loginUser = (values: any) => {
  return appAxios.post("/auth/login", values);
};

export const logoutUser = () => {
  return appAxios.get("/auth/logout");
};

export const getAllUsers = () => {
  return appAxios.get("/users/");
};

export const updateUser = (id:string , userName : any) => {
  return appAxios.patch(`/users/${id}`, {userName})
}

export const getUser = (id: string) => {
  return appAxios.get(`/users/${id}`)
}
