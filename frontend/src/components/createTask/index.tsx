import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { createTask } from "@/apis/task.api";
import { useUser } from "@/context/userContext";
import { getAllUsers } from "@/apis/user.api";
import { useEffect, useState } from "react";
import { UserInfo } from "@/types/type";
import { Checkbox } from "@/components/ui/checkbox";
import { Close } from "@radix-ui/react-dialog";
import TagInput from "../tag";

const formSchema = z.object({
  title: z.string().nonempty({ message: "Title is required." }),
  description: z.string().nonempty({ message: "Description is required." }),
  dueDate: z.date({ message: "Due Date is required." }),
  status: z.enum(["asigned", "in pending", "completed"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  asignee: z.array(z.string()).default([]),
  asigneeId: z.string().default(""),
});

const CreateTaskComp = () => {
  const { user } = useUser();
  const [tags, setTags] = useState<string[]>([]);

  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags);
  };
  const [allUsers, setAllusers] = useState<UserInfo[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "in pending",
      priority: "low",
      asignee: [],
      asigneeId: "",
    },
  });

  useEffect(() => {
    getAllUsers().then((response) => {
      const data = response.data.data;
      setAllusers(data);
    });
  }, [setAllusers]);

  const assignedUserInfo = allUsers.filter((use) => use._id !== user?._id);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const asigner = user && user?.userName;
      const asigneeId = user && user?._id;
      const updatedValues = {
        ...values,
        asigner: asigner || null,
        asigneeId: asigneeId || "",
        tags: tags,
      };
      // console.log(updatedValues);
      await createTask(updatedValues);
      toast.success("Task Created Success");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "An error occurred";
      console.log(errorMessage);
      toast.error("Error creating Task");
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
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <Input variant="signup" placeholder="Title" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <Input variant="signup" placeholder="Description" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
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
                <FormMessage />
              </FormItem>
            )}
          />
          <TagInput tags={tags} onChange={handleTagsChange} />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="asigned">Asigned</SelectItem>
                    <SelectItem value="in pending">In Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
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
            control={form.control}
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
                      <FormItem>
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item._id)}
                            onCheckedChange={(checked) => {
                              const updatedValue = checked
                                ? [...(field.value || []), item._id]
                                : (field.value || []).filter(
                                    (value) => value !== item._id
                                  );
                              field.onChange(updatedValue);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="ml-2">{item.userName}</FormLabel>
                      </FormItem>
                    ))}
                    {/* <SelectItem key={item._id} value={item._id}> */}

                    {/* </SelectItem> */}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <Close>
            <Button variant={"signup"} type="submit">
              Create Task
            </Button>
          </Close>
        </form>
      </Form>
    </div>
  );
};

export default CreateTaskComp;
