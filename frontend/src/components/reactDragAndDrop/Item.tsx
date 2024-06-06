import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CiCalendar } from "react-icons/ci";
import { FiDelete } from "react-icons/fi";
import { deleteTask } from "@/apis/task.api";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import TaskDetail from "../taskDetail";

interface ItemProps {
  _id: string;
  title: string;
  status: string;
  priority: string;
  asigner?: string;
  tag?: string[];
  description?: string;
  dueDate: Date;
  asignee?: string[];
  comments?: string[];
  deleted?: boolean;
}

const Item: React.FC<ItemProps> = ({
  _id,
  title,
  status,
  asigner,
  dueDate,
}) => {
  const id = _id;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    boxShadow: isDragging ? "0 3px 6px rgba(0, 0, 0, 0.1)" : "none",
  };

  const formatDate = new Date(dueDate).toLocaleString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteTask(_id.toString());
      toast.success("Task Deleted");
    } catch (error) {
      toast.error("Unauthorized Access");
      console.error("Error deleting task:", error);
    }
  };

  return (
    <>
      <Sheet>
        <SheetTrigger className="w-full">
          <div
            className="m-1 bg-white p-2 rounded-md"
            ref={setNodeRef}
            style={{ ...style, opacity: isDragging ? 0.7 : 1 }}
            {...attributes}
            {...listeners}
          >
            <div className="grid grid-cols-4 p-2">
              <div className="col-span-3 flex justify-start text-sm">
                {title}
              </div>
              <div className="col-span-1 flex justify-end text-red-500">
                <button onClick={handleDelete} aria-label="Delete Task">
                  <FiDelete size={20} />
                </button>
              </div>
            </div>
            {asigner && (
              <div className="m-1 flex items-center gap-2">
                <p className="text-sm">{asigner}</p>
                <p className="bg-orange-100 text-orange-400 text-xs py-[1px] px-[3px]  rounded-full">
                  {status}
                </p>
              </div>
            )}
            <div className="postedDate m-1 pt-2 flex gap-2">
              <CiCalendar size={20} />
              <p className="text-sm font-light text-[#64748B]">{formatDate}</p>
            </div>
          </div>
        </SheetTrigger>
        <SheetContent>
          <TaskDetail id={{ id: _id }} />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Item;
