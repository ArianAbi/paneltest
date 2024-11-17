"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { Dialog, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import {
  DialogClose,
  DialogContent,
  DialogHeader,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorInput from "@/app/components/ErrorInput";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { formatDate } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/app/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import SelectDepartment from "../SelectDepartment";
import SelectLeader from "../SelectlLeader";
import { addTaskAction } from "@/util/actions/Admin/ManageTasks";

export default function AddTask({ project_id }: { project_id: string }) {
  const [open, setOpen] = useState(false);

  const { toast } = useToast();

  const CreateProjectSchema = z.object({
    title: z
      .string({ required_error: "name is required" })
      .min(3, "name should be atleast 3 characters"),
    desciption: z
      .string({ required_error: "description is required" })
      .min(10, "desciption should be atleast 10 characters")
      .max(1500, "desciption cannot be longer then 1500 characters"),
    deadline: z.date({ required_error: "deadline is required" }),
    status: z.string({ required_error: "status is required" }),
    assigend_to: z.string({ required_error: "assigned to is required" }),
    priority: z.string({ required_error: "priority is required" }),
    department: z.string({ required_error: "department is required" }),
  });

  const form = useForm<z.infer<typeof CreateProjectSchema>>({
    resolver: zodResolver(CreateProjectSchema),
    defaultValues: {
      title: "",
      desciption: "",
      assigend_to: "",
    },
  });

  async function onSubmit(data: z.infer<typeof CreateProjectSchema>) {
    try {
      await addTaskAction(
        project_id,
        data.title,
        data.priority,
        data.deadline,
        data.department,
        data.assigend_to,
        data.status,
        data.desciption
      );
      setOpen(false);
      toast({ title: "Task Added : " + data.title });
    } catch (err: any) {
      form.setError("root", { message: err.message });
    }
  }

  return (
    <>
      <>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="float-end mx-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold mb-4">
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Task</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-2"
              >
                {/* Title */}
                <FormField
                  name="title"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="task title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* group of two start & deadline date*/}
                <div className="flex gap-2 items-center">
                  {/* select priority */}
                  <FormField
                    name="priority"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Priority..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">low</SelectItem>
                            <SelectItem value="medium">medium</SelectItem>
                            <SelectItem value="high">high</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* deadline date */}
                  <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deadline Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  formatDate(field.value, "PPP")
                                ) : (
                                  <span>Pick a Deadline Date</span>
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
                              disabled={(date: any) => date < new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* select department */}
                <FormField
                  name="department"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <SelectDepartment
                          value={field.value}
                          setValue={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* select Assigend To */}
                <FormField
                  name="assigend_to"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assigend To</FormLabel>
                      <FormControl>
                        <SelectLeader
                          value={field.value}
                          setValue={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* select status */}
                <FormField
                  name="status"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Status..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="not-started">
                            not-started
                          </SelectItem>
                          <SelectItem value="pending">pending</SelectItem>
                          <SelectItem value="done">done</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* description */}
                <FormField
                  name="desciption"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="task description"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.formState.errors.root && (
                  <ErrorInput message={form.formState.errors.root.message} />
                )}
                {/* buttons */}
                <div className="w-full flex gap-2 items-center font-semibold justify-between mt-4">
                  <DialogClose asChild>
                    <Button type="button" className="w-full" variant={"ghost"}>
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    className={`w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold disabled:saturate-50 ${
                      form.formState.isSubmitting ? "animate-pulse" : ""
                    }`}
                    variant={"default"}
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? "Adding..." : "Add Task"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </>
    </>
  );
}
