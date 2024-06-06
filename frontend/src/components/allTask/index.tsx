import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateTaskComp from "@/components/createTask";
import { FcPlus } from "react-icons/fc";
import { TaskTable } from "@/components/list";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { TaskInfo } from "@/types/type";
import { getIndividualTask } from "@/apis/task.api";
import { useUser } from "@/context/userContext";
import Drag from "../reactDragAndDrop";

const Main = () => {
  
  const [assignedTask, setAssignedTask] = useState<TaskInfo[]>([]);
  const { user } = useUser();
  const [showList, setShowList] = useState<String>("list");
  const handleTabChange = (value: string) => {
    setShowList(value);
  };
  useEffect(() => {
    try {
      const id = user._id;
      getIndividualTask(id).then((response) => {
        const data = response.data.data;
        setAssignedTask(data);
        // console.log(data);
      });
    } catch (error) {
      console.log(error);
    }
  }, [setAssignedTask]);
  return (
    <>
      <div className="center-section">
        <div className="flex items-center justify-between">
          <div className="tab">
            <Tabs defaultValue="list" className="w-[200px] rounded-full">
              <TabsList className="grid w-full grid-cols-2 rounded-full bg-slate-300 overflow-hidden">
                <TabsTrigger
                  className="rounded-full"
                  value="list"
                  onClick={() => handleTabChange("list")}
                >
                  List
                </TabsTrigger>
                <TabsTrigger
                  className="rounded-full"
                  value="kanban"
                  onClick={() => handleTabChange("kanban")}
                >
                  Kanban
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Dialog>
            <DialogTrigger>
              <div className="create-task w-[300px] h-[40px] bg-purple-500 rounded-full text-white flex items-center justify-between hover:opacity-80 p-4">
                <p className="">Create</p>
                <FcPlus size={25} />
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-center">Create Task</DialogTitle>
                <DialogDescription>
                  <div>
                    <CreateTaskComp />
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        {showList === "list" ? (
          <div className="list-table">
            <TaskTable tasks={assignedTask} />
          </div>
        ) : (
      <Drag/>
        )}
      </div>
    </>
  );
};

export default Main;
