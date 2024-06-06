import { getTask } from "@/apis/task.api";
import { useUser } from "@/context/userContext";
import { TaskInfo } from "@/types/type";
import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { Dialog, DialogContent } from "../ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Select, SelectTrigger } from "../ui/select";
import EditTask from "../editTask";
import { Input } from "../ui/input";
import { IoSend } from "react-icons/io5";
import { createComment, delteComment } from "@/apis/comment.api";
import { toast } from "sonner";
import { MdDelete } from "react-icons/md";
interface TaskId {
  id: string;
}

interface TaskDetailProps {
  id: TaskId;
}

type Comment = {
  content: string;
  userId?: string;
  userName?: string;
  createdAt?: Date;
};

const TaskDetail: React.FC<TaskDetailProps> = ({ id }) => {
  const [content, setContent] = useState<Comment>({ content: "" });
  const [task, setTask] = useState<TaskInfo>();
  const { user } = useUser();
  const [access, setAccess] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTask(id.id);
        setTask(response.data.data);
        if (user._id === response.data.data.asigneeId) {
          setAccess(true);
        }
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };

    fetchData();
  }, [id]);
  // console.log(user._id);
  // console.log(task?.asigneeId);
  const addComment = async () => {
    const taskId = task?._id || "";
    try {
      await createComment(taskId, content)
        .then(() => {
          toast.success("Comment Added");
          setContent({ content: "" });
        })
        .catch(() => {
          toast.error("Unable to add comment");
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="text-center p-4">
        <p className="text-2xl font-serif">Task Detail</p>
      </div>

      <div className="title flex items-center justify-between rounded-lg bg-slate-200 p-2">
        <p>{task?.title}</p>
        <Dialog>
          <DialogTrigger>
            <p>{<FaRegEdit size={20} />}</p>
          </DialogTrigger>
          <DialogContent>
            {access ? <EditTask task={task!} /> : <p>Unauthorized Access</p>}
          </DialogContent>
        </Dialog>
      </div>
      <div className="task_tag mt-4 text-center flex items-center border-b justify-around">
        <p className="text-sm font-medium">Tags:</p>
        {task?.tags?.length === 0 ? (
          <p className="font-thin text-sm text-[#8E8E93]">No tags found</p>
        ) : (
          <div className="text-sm flex gap-8 font-thin  p-1">
            {task?.tags?.map((tag) => (
              <p className="bg-slate-200 font-thin text-xs rounded-full p-1 ">
                #{tag}
              </p>
            ))}
          </div>
        )}
      </div>
      <div className="status flex items-center justify-between ">
        <div className="flex mt-8 gap-2 flex-col">
          <p className="">Status</p>
          <div className="select">
            <Select>
              <SelectTrigger>
                <p
                  className={`${
                    task?.status === "asigned"
                      ? "text-red-500"
                      : task?.status === "completed"
                      ? "text-green-500"
                      : "text-orange-500"
                  }`}
                >
                  {task?.status}
                </p>
              </SelectTrigger>
            </Select>
          </div>
        </div>
        <div className="font-thin text-xs flex  items-center gap-1">
          <p>Asigner:</p>
          <p>{task?.asigner}</p>
        </div>
      </div>
      <div className="description_ mt-8 flex flex-col gap-1 border-t border-b ">
        <p className="text-xl">Description</p>
        <p className="flex items-center text-md font-thin text-[#8E8E93]">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis possimus
          beatae quisquam provident vel ea exercitationem dolorem esse.
          Exercitationem mollitia voluptates dignissimos eligendi. Recusandae
          debitis veniam similique vitae adipisci! Eaque!
          {task?.description}
        </p>
      </div>
      <div className="flex mt-8 gap-4  border-b">
        <p className="">Priority : </p>
        <div className="">
          <p
            className={`${
              task?.priority === "high"
                ? "text-red-500"
                : task?.priority === "low"
                ? "text-green-500"
                : "text-orange-500"
            }`}
          >
            {task?.priority}
          </p>
        </div>
      </div>
      <div className="dueDate flex gap-4 mt-8 items-center border-b">
        <p>Due Date: </p>
        {task?.dueDate && (
          <p className="text-xs text-red-500">
            {new Date(task.dueDate).toLocaleString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}
          </p>
        )}
      </div>
      <div className="add_comment mt-8 justify-center flex flex-col gap-2 border-b">
        <p className="">Add Comment:</p>
        <div className="flex items-center gap-2">
          <Input
            variant="signup"
            placeholder="Type Comment"
            value={content.content}
            onChange={(e) => setContent({ content: e.target.value })}
          />
          <IoSend
            className={`${
              content.content === "" ? "size-0" : "size-10 text-purple-500"
            }`}
            size={30}
            onClick={addComment}
          />
        </div>
        <div className="border-t shadow-sm h-[24vh] no-scrollbar overflow-y-auto">
          <h1 className="mt-4 text-xl font-serif">Comments</h1>
          {task?.comments?.map((comment) => (
            <div className="comment mt-2 p-2 flex-col flex justify-between border rounded-md">
              <div className="flex items-center justify-between">
                <p>{comment.content}</p>
                <p className="text-xs">{comment?.userName}</p>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs font-thin">
                  {new Date(comment?.createdAt || "").toLocaleString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </p>
                <MdDelete
                  className="text-red-500 cursor-pointer"
                  onClick={async () => {
                    try {
                      await delteComment(task?._id || "", comment._id || "")
                        .then(() => {
                          toast.success("Comment Deleted");
                        })
                        .catch(() => {
                          toast.error("Unauthorized Access");
                        });
                    } catch (error) {
                      console.log("Error occured");
                    }
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TaskDetail;
