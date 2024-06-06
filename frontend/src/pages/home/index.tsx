import { useEffect, useState } from "react";
import HomeAnimation from "../../assets/Lottie/Home.json";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Lottie from "lottie-react";
import {
  FcHome,
  FcTodoList,
  FcAddDatabase,
  FcNook,
  FcAcceptDatabase,
  FcPlus,
  FcAbout,
} from "react-icons/fc";
import { TabItem } from "@/components/tabItem";
import CreateTaskComp from "@/components/createTask";
import Asigned from "@/components/asigned";
import Main from "@/components/allTask";
import InProgress from "@/components/inProgress";
import Completed from "@/components/completed";
import { useUser } from "@/context/userContext";
import { Task } from "@/components/list";
import { getIndividualTask } from "@/apis/task.api";
import Created from "@/components/createdTask";
import Activity from "../../components/activity";
interface Tab {
  name: string;
  icon: JSX.Element;
  numbers?: number | 0;
}

const Home = () => {
  const { user } = useUser();
  const [task, setTask] = useState<Task[]>([]);
  useEffect(() => {
    try {
      getIndividualTask(user._id).then((response) => {
        const data = response.data.data;
        setTask(data);
      });
    } catch (error) {}
  }, [setTask]);
  let assignedCount = 0;
  let progressCount = 0;
  let completedCount = 0;
  task.forEach((newTask) => {
    switch (newTask.status) {
      case "asigned":
        assignedCount++;
        break;
      case "in progress":
        progressCount++;
        break;
      case "completed":
        completedCount++;
        break;
      default:
        break;
    }
  });
  // console.log(task);
  const [activeTab, setActiveTab] = useState<string>("Home");
  const tabs: Tab[] = [
    { name: "Home", icon: <FcHome size={20} /> },
    { name: "Your Created Task", icon: <FcAddDatabase size={20} /> },
    {
      name: "Assigned",
      icon: <FcTodoList size={20} />,
      numbers: assignedCount,
    },
    { name: "In Progress", icon: <FcNook size={20} />, numbers: progressCount },
    {
      name: "Completed",
      icon: <FcAcceptDatabase size={20} />,
      numbers: completedCount,
    },
  ];

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <div className="grid grid-cols-5 h-[92vh] p-1 gap-1  overflow-y-auto">
      <div className="col-span-1 z-10 sticky top-0 flex flex-col gap-6  shadow-md rounded-lg p-4">
        <div className="side_section   flex flex-col gap-2">
          <p className="text text-xl font-sans">Private</p>
          {tabs.map((tab) => (
            <TabItem
              key={tab.name}
              icon={tab.icon}
              label={tab.name}
              numbers={tab.numbers || 0}
              isActive={activeTab === tab.name}
              onClick={() => handleTabClick(tab.name)}
            />
          ))}
          <Sheet>
            <SheetTrigger
              className={`h-10 rounded-md hover:bg-slate-200 cursor-pointer border-b flex gap-2 p-1 items-center`}
            >
              <div className="text-center">
                <FcAbout size={20} />
              </div>
              <div className="flex gap-2">
                <p>View Activity</p>
              </div>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <Activity />
            </SheetContent>
          </Sheet>
        </div>
        <div className="group flex flex-col gap-2">
          <p className="text text-xl font-sans">Task</p>
          <Sheet>
            <SheetTrigger
              className={`h-10 rounded-md cursor-pointer 
            hover:bg-slate-100 border border-slate-200
             flex gap-2 p-1 items-center justify-between `}
            >
              <div className="flex gap-2">
                <p>Create a task</p>
              </div>
              <div className="text-center">
                <FcPlus size={20} />
              </div>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="text-center">Create Task</SheetTitle>
                <SheetDescription>
                  <CreateTaskComp />
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
        <div className="group mt-4">
          <Lottie animationData={HomeAnimation} loop autoplay />
        </div>
      </div>
      <div className="col-span-4  overflow-y-auto no-scrollbar p-4  ">
        {activeTab === "Home" ? (
          <Main />
        ) : activeTab === "Assigned" ? (
          <>
            <Asigned />
          </>
        ) : activeTab === "In Progress" ? (
          <>
            <InProgress />
          </>
        ) : activeTab === "Completed" ? (
          <>
            <Completed />
          </>
        ) : (
          <Created />
        )}
      </div>
    </div>
  );
};

export default Home;
