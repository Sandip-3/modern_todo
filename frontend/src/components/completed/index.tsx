import { TaskTable } from "../list";
import { useEffect, useState } from "react";
import { getTaskWithStatus } from "@/apis/task.api";
import { TaskInfo } from "@/types/type";
import { useUser } from "@/context/userContext";

const Completed = () => {
  const [completedTask, setCompletedTask] = useState<TaskInfo[]>([]);
  const { user } = useUser();
  useEffect(() => {
    try {
      const userId = user._id;
      getTaskWithStatus(userId, "completed").then((response) => {
        const data = response.data.data;
        setCompletedTask(data);
      });
    } catch (error) {
      console.log(error);
    }
  }, [setCompletedTask]);
  return (
    <div className="list-table">
      <TaskTable tasks={completedTask} />
    </div>
  );
};

export default Completed;
