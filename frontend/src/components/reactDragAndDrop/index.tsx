import React, { useEffect, useState } from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { KeyboardSensor } from "@dnd-kit/core";
import Container from "./Container";
import Item from "./Item";
import { getIndividualTask, updateStatus } from "@/apis/task.api";
import { useUser } from "@/context/userContext";
import { toast } from "sonner";

interface Task {
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

const KanbanBoard: React.FC = () => {
  const initialColumns: { [key: string]: Task[] } = {
    assigned: [],
    "in progress": [],
    completed: [],
  };

  const [columns, setColumns] = useState<{ [key: string]: Task[] }>(
    initialColumns
  );
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const { user } = useUser();

  useEffect(() => {
    const id = user._id;
    const fetchTasks = async () => {
      try {
        const asigneeId = id;
        const response = await getIndividualTask(asigneeId);
        const tasks = response.data.data;

        const asigned: Task[] = [];
        const inProgress: Task[] = [];
        const completed: Task[] = [];

        tasks.forEach((task: Task) => {
          switch (task.status) {
            case "asigned":
              asigned.push(task);
              break;
            case "in progress":
              inProgress.push(task);
              break;
            case "completed":
              completed.push(task);
              break;
            default:
              break;
          }
        });

        setColumns({
          asigned,
          "in progress": inProgress,
          completed,
        });
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };

    fetchTasks();
  }, [user]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = ({ active }: { active: any }) => {
    const activeContainer = Object.keys(columns).find((key) =>
      columns[key].some((item) => item._id === active.id)
    );
    if (activeContainer) {
      const activeItem = columns[activeContainer].find(
        (item) => item._id === active.id
      );
      setActiveTask(activeItem || null);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const activeContainer = Object.keys(columns).find((key) =>
      columns[key].some((item) => item._id === active.id)
    );
    const overContainer =
      Object.keys(columns).find((key) =>
        columns[key].some((item) => item._id === over.id)
      ) || over.id;

    if (!activeContainer || !overContainer || activeContainer === overContainer)
      return;

    // Rule
    const rules: {
      from: string;
      to: string;
      message: string;
    }[] = [
      {
        from: "asigned",
        to: "completed",
        message: "Cannot move directly from Asigned to Completed",
      },
      {
        from: "completed",
        to: "asigned",
        message: "Task is already completed",
      },
      {
        from: "completed",
        to: "in progress",
        message: "Task is already completed",
      },
    ];
    const matchingRule = rules.find(
      (rule) => rule.from === activeContainer && rule.to === overContainer
    );
    if (matchingRule) {
      toast.error(matchingRule.message);
      return null;
    }

    // Prevent assigned items from being moved directly to completed
    // if (activeContainer === "asigned" && overContainer === "completed") {
    //   toast.error("Cannot move directly from Assigned to Completed");
    //   return;
    // }

    const activeItems = [...columns[activeContainer]];
    const overItems = [...columns[overContainer]];

    const [movedItem] = activeItems.splice(
      activeItems.findIndex((item) => item._id === active.id),
      1
    );

    movedItem.status = overContainer.toString();

    try {
      await updateStatus(movedItem._id, overContainer.toString());
      toast.success("Task Updated Successfully");
      overItems.push(movedItem);

      setColumns((prevColumns) => ({
        ...prevColumns,
        [activeContainer]: activeItems,
        [overContainer]: overItems,
      }));
    } catch (error) {
      console.error("Failed to update task status:", error);
      toast.error("Error Updating Task");
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-3 h-[87vh] py-4 gap-2">
        {Object.keys(columns).map((columnKey) => (
          <SortableContext
            key={columnKey}
            items={columns[columnKey].map((task) => task._id)}
            strategy={rectSortingStrategy}
          >
            <Container
              id={columnKey}
              title={
                columnKey === "asigned"
                  ? "Assigned"
                  : columnKey === "in progress"
                  ? "In Progress"
                  : "Completed"
              }
              backgroundColor="bg-slate-100"
              textColor={
                columnKey === "asigned"
                  ? "text-red-500"
                  : columnKey === "in progress"
                  ? "text-orange-500"
                  : "text-green-500"
              }
              count={columns[columnKey].length}
            >
              {columns[columnKey].map((task) => (
                <Item key={task._id} {...task} />
              ))}
            </Container>
          </SortableContext>
        ))}
      </div>
      <DragOverlay>
        {activeTask ? <Item key={activeTask._id} {...activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;
