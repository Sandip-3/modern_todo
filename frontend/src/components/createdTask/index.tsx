import { TaskTable } from "../list";
import { getCreatedTask } from "@/apis/task.api";
import { useEffect, useState } from "react";
import { TaskInfo } from "@/types/type";
import { useUser } from "@/context/userContext";

const Created = () => {
  const [createdTask, setCreatedTask] = useState<TaskInfo[]>([]);
  const { user } = useUser();
  useEffect(() => {
    try {
      const userId = user._id;
      getCreatedTask(userId).then((response) => {
        const data = response.data.data;
        setCreatedTask(data);
      });
    } catch (error) {
      console.log(error);
    }
  }, [setCreatedTask]);
  return (
    <div className="list-table">
      <TaskTable tasks={createdTask} />
    </div>
  );
};

export default Created;
