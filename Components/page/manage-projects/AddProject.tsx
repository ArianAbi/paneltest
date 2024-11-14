"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import {
  DialogClose,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorInput from "@/components/ErrorInput";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { formatDate } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SelectLeader from "./SelectlLeader";
import SelectDepartment from "./SelectDepartment";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import SelectMembers from "./SelectMembers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProjectAction } from "@/util/actions/Admin/ManageProjectsActions";

export default function AddProject() {
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
    department: z.string({ required_error: "department is required" }).min(1),
    leader: z.string({ required_error: "leader is required" }),
    members: z.string().array(),
    started_at: z.date({ required_error: "start date is required" }),
    priority: z.string(),
  });

  const form = useForm<z.infer<typeof CreateProjectSchema>>({
    resolver: zodResolver(CreateProjectSchema),
    defaultValues: {
      title: "",
      desciption: "",
      leader: "",
      members: [],
    },
  });

  async function onSubmit({
    title,
    desciption,
    department,
    deadline,
    started_at,
    leader,
    members,
    priority,
  }: z.infer<typeof CreateProjectSchema>) {
    try {
      await createProjectAction(
        title,
        desciption,
        deadline,
        started_at,
        leader,
        department,
        members,
        priority
      );
      setOpen(false);
      toast({ title: "Project Added : " + title });
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
              Create New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Project</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <Tabs defaultValue="general">
                  <TabsList className="w-full mb-6">
                    <TabsTrigger className="w-2/4" value="general">
                      General
                    </TabsTrigger>
                    <TabsTrigger className="w-2/4" value="members">
                      Members
                    </TabsTrigger>
                  </TabsList>

                  {/* general section */}
                  <TabsContent className="flex flex-col gap-4" value="general">
                    {/* Title */}
                    <FormField
                      name="title"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="project title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* group of two start & deadline date*/}
                    <div className="flex gap-2 items-center">
                      {/* start date */}
                      <FormField
                        control={form.control}
                        name="started_at"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
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
                                      <span>Pick a Start Date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
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
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
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

                    {/* description */}
                    <FormField
                      name="desciption"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Desciption</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="project description"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  {/* Members */}
                  <TabsContent className="flex flex-col gap-4" value="members">
                    {/* select leader */}
                    <FormField
                      name="leader"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Leader</FormLabel>
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

                    {/* select member */}
                    <FormField
                      name="members"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Staff</FormLabel>
                          <FormControl>
                            <SelectMembers
                              value={field.value}
                              setValue={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>

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
                    {form.formState.isSubmitting ? "Creating..." : "Create"}
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
