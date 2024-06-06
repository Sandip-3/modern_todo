
import { appAxios } from "@/config/axios";

interface Comment{
    content : string
}

export const createComment = (taskId:string , values : Comment) => {
    return appAxios.post(`/tasks/${taskId}/`, values)
}

export const delteComment = (taskId : string ,commentId: string) => {
    return appAxios.delete(`/tasks/${taskId}/${commentId}`)
}