import { appAxios } from "@/config/axios";
import { TaskProps } from "@/types/type";

export const getTasks = () => {
  return appAxios.get("/tasks/");
};

export const updateTask = (id: string, values: TaskProps) => {
  return appAxios.patch(`/tasks/${id}`, values);
};

export const createTask = (values: TaskProps) => {
  return appAxios.post("/tasks/", values);
};

export const getTaskWithStatus = (asigneeId: string, query: string) => {
  return appAxios.get(`tasks/completed/${asigneeId}?status=${query}`);
};

export const getIndividualTask = (asigneeId: string) => {
  return appAxios.get(`tasks/asigned/${asigneeId}`);
};

export const getCreatedTask = (asignerId: string) => {
  return appAxios.get(`tasks/created/${asignerId}`);
};

export const updateStatus = (taskId: string, status: string) => {
  return appAxios.patch(`tasks/status/${taskId}?status=${status}`);
};

export const deleteTask = (id: string | string[]) => {
  return appAxios.delete(`/tasks/${id}`);
};

export const getTask = (id: string) => {
  return appAxios.get(`/tasks/${id}`);
};
