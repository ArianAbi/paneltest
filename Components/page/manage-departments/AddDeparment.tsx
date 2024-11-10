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
import UserIcon from "@/icons/User";
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
import { createDepartmentAction } from "@/util/actions/Admin/ManageDepartmentsActions";

export default function AddDeparment() {
  const [open, setOpen] = useState(false);

  const { toast } = useToast();

  const CreateDepartmentSchema = z.object({
    name: z
      .string({ required_error: "name is required" })
      .min(3, "name should be atleast 3 characters"),
  });

  const form = useForm<z.infer<typeof CreateDepartmentSchema>>({
    resolver: zodResolver(CreateDepartmentSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(data: z.infer<typeof CreateDepartmentSchema>) {
    try {
      await createDepartmentAction(data.name);
      setOpen(false);
      toast({ title: "Department Added : " + data.name });
    } catch (err: any) {
      form.setError("root", { message: err.message });
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="float-end mx-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold">
            Create Department
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a New Department</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-2"
            >
              {/* name */}
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        icon={<UserIcon />}
                        placeholder="name"
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
                  {form.formState.isSubmitting ? "Creating..." : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
