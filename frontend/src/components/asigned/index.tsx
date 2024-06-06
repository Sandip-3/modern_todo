import { TaskTable } from "../list";
import { getTaskWithStatus } from "@/apis/task.api";
import { useEffect, useState } from "react";
import { TaskInfo } from "@/types/type";
import { useUser } from "@/context/userContext";

const Asigned = () => {
  const [assignedTask, setAssignedTask] = useState<TaskInfo[]>([]);
  const { user } = useUser();

  useEffect(() => {
    try {
      const userId = user._id;
      getTaskWithStatus(userId, "asigned").then((response) => {
        const data = response.data.data;
        setAssignedTask(data);
      });
    } catch (error) {
      console.log(error);
    }
  }, [setAssignedTask]);
  return (
    <>
      <div className="list-table">
        <TaskTable tasks={assignedTask} />
      </div>
    </>
  );
};

export default Asigned;
