import { TaskTable } from "../list";
import { getTaskWithStatus } from "@/apis/task.api";
import { useEffect, useState } from "react";
import { TaskInfo } from "@/types/type";
import { useUser } from "@/context/userContext";

const InProgress = () => {
  const [progressTask, setProgressTask] = useState<TaskInfo[]>([]);
  const { user } = useUser();
  useEffect(() => {
    try {
      const userId = user._id;
      getTaskWithStatus(userId, "in progress").then((response) => {
        const data = response.data.data;
        setProgressTask(data);
      });
    } catch (error) {
      console.log(error);
    }
  }, [setProgressTask]);
  return (
    <div className="list-table">
      <TaskTable tasks={progressTask} />
    </div>
  );
};

export default InProgress;
