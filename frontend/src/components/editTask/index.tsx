import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useUser } from "@/context/userContext";
import { getAllUsers } from "@/apis/user.api";
import { useEffect, useState } from "react";
import { TaskInfo, UserInfo } from "@/types/type";
import { Checkbox } from "@/components/ui/checkbox";
import { Close } from "@radix-ui/react-dialog";
import { updateTask } from "@/apis/task.api";

interface EditTaskProps {
  task: TaskInfo;
}

const EditTask: React.FC<EditTaskProps> = ({ task }) => {
  const { user } = useUser();
  console.log(task);
  const [allUsers, setAllusers] = useState<UserInfo[]>([]);
  const form = useForm({
    defaultValues: {
      _id: task._id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      asignee: task.asignee,
      asigneeId: task.asigneeId,
    },
  });

  useEffect(() => {
    getAllUsers().then((response) => {
      const data = response.data.data;
      setAllusers(data);
    });
  }, [allUsers]);

  const assignedUserInfo = allUsers.filter((use) => use._id !== user._id);
  const onSubmit = async (values: any) => {
    const id = values._id;
    console.log(id);
    try {
      await updateTask(id, values);
      toast.success("Task Update Success");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "An error occurred";
      console.log(errorMessage);
      toast.error("Error Update Task");
    }
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex gap-4 flex-col"
        >
          <FormField
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <Input variant="signup" placeholder="Title" {...field} />
              </FormItem>
            )}
          />
          <FormField
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <Input variant="signup" placeholder="Description" {...field} />
              </FormItem>
            )}
          />
          <FormField
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date("2025-01-01") ||
                        date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
          <FormField
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            name="asignee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assignee</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Asignees" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {assignedUserInfo?.map((item) => (
                      <FormItem key={item._id}>
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item._id)}
                            onCheckedChange={(checked) => {
                              const updatedValue = checked
                                ? [...(field.value || []), item._id]
                                : (field.value || []).filter(
                                    (value: any) => value !== item._id
                                  );
                              field.onChange(updatedValue);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="ml-2">{item.userName}</FormLabel>
                      </FormItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <Close>
            <Button variant={"signup"} type="submit">
              Update Task
            </Button>
          </Close>
        </form>
      </Form>
    </div>
  );
};

export default EditTask;
