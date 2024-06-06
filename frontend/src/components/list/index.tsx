import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TaskInfo } from "@/types/type";
import { deleteTask, updateStatus } from "@/apis/task.api";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import TaskDetail from "../taskDetail";

interface TaskListComponentProps {
  tasks: TaskInfo[];
}

export type Task = {
  _id: string;
  priority: "low" | "medium" | "high";
  status: "asigned" | "in progress" | "completed";
  title: string;
  asigner: string;
  dueDate: Date;
};

const statusColors: { [key in Task["status"]]: string } = {
  asigned: "text-red-500",
  "in progress": "text-orange-500",
  completed: "text-green-600",
};

const priorityColors: { [key in Task["priority"]]: string } = {
  low: "text-green-600",
  medium: "text-orange-500",
  high: "text-red-500",
};

type PriorityValue = Task["priority"];
type StatusValue = Task["status"];

export const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const statusValue = row.getValue("status") as StatusValue;
      const statusColor = statusColors[statusValue];
      return <div className={`${statusColor}`}>{statusValue}</div>;
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priorityValue = row.getValue("priority") as PriorityValue;
      const priorityColor = priorityColors[priorityValue];
      return <div className={`${priorityColor}`}>{priorityValue}</div>;
    },
  },
  {
    accessorKey: "asigner",
    header: "Asigner",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("asigner")}</div>
    ),
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) => (
      <div className="capitalize">
        {new Date(row.getValue("dueDate")).toLocaleString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        })}
      </div>
    ),
  },

  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row }) => {
      const task = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(task._id);
              }}
            >
              Copy Task ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                deleteTask(task._id.toString())
                  .then((response) => {
                    toast.success(response.data.message);
                    console.log(response);
                  })
                  .catch(() => {
                    toast.error("Unauthorized Access");
                  });
              }}
            >
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                task.status === "asigned"
                  ? updateStatus(task._id, "in progress")
                  : null;
                toast.success("Task moved to In Progress");
              }}
              disabled={
                task.status === "in progress" || task.status === "completed"
              }
            >
              Move To Pending
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                task.status === "in progress"
                  ? updateStatus(task._id, "completed")
                  : null;
                toast.success("Task moved to completed ");
              }}
              disabled={task.status == "completed" || task.status === "asigned"}
            >
              Move To Completed
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const TaskTable: React.FC<TaskListComponentProps> = ({ tasks }: any) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedTaskIds, setSelectedTaskIds] = React.useState<string[]>([]);

  const table = useReactTable({
    data: tasks || [{}],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  React.useEffect(() => {
    const selectedIds = table
      .getSelectedRowModel()
      .rows.map((row) => row.original._id);
    setSelectedTaskIds(selectedIds);
  }, [rowSelection, table]);

  const bulkDelete = () => {
    console.log(selectedTaskIds);
    deleteTask(selectedTaskIds)
      .then((response) => {
        toast.success(response.data.message);
        console.log(response);
      })
      .catch(() => {
        toast.error("Unauthorized Access");
      });
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          variant="search"
          placeholder={`Filter Title...`}
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto rounded-xl">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {cell.column.id !== "actions" &&
                      cell.column.id !== "select" ? (
                        <Sheet>
                          <SheetTrigger>
                            <div>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </div>
                          </SheetTrigger>
                          <SheetContent className="overflow-y-auto">
                            <TaskDetail id={{ id: row.original._id }} />
                          </SheetContent>
                        </Sheet>
                      ) : (
                        <div>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </div>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            className="rounded-md"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            className="rounded-md "
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-center">
        {selectedTaskIds.length === 0 ? (
          ""
        ) : (
          <button
            className="py-1 px-2 rounded-full bg-purple-500 text-white hover:opacity-90"
            onClick={bulkDelete}
          >
            Delete Selected
          </button>
        )}
      </div>
    </div>
  );
};
