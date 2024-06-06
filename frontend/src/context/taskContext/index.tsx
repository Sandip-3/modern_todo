import { getTasks } from "@/apis/task.api";
import { TaskInfo } from "@/types/type";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

// A context for task data
interface TaskContextType {
  task: TaskInfo[];
  setTask: React.Dispatch<React.SetStateAction<TaskInfo[]>>;
}

const TaskContext = createContext<TaskContextType | null>(null);

// Provider component to set and provide task data
export const TaskProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [task, setTask] = useState<TaskInfo[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await getTasks();
        setTask(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTasks();

    // Polling interval in milliseconds 
    // const pollingInterval =  10 * 1000;

    // Poll for new tasks periodically
    // const intervalId = setInterval(fetchTasks, pollingInterval);

    // Clean up interval on component unmount
    // return () => clearInterval(intervalId);
  }, [setTask]);

  return (
    <TaskContext.Provider value={{ task, setTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};
