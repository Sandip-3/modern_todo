import { appAxios } from "@/config/axios";

export const getActivity = (id : string) => {
  return appAxios.get(`/activitys/${id}`);
};
