"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/Components/ui/form";
import UserIcon from "@/icons/User";
import { Input } from "@/Components/ui/input";
import EmailIcon from "@/icons/Email";
import LockIcon from "@/icons/Lock";
import { Dialog, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import {
  DialogClose,
  DialogContent,
  DialogHeader,
} from "@/Components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Button } from "@/Components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminSignUpAction } from "@/util/actions/Admin/ManageUserActions";
import ErrorInput from "@/Components/ErrorInput";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ProfilesType } from "@/types/user";

export default function AdminCreateUser() {
  const [open, setOpen] = useState(false);

  const EmployeeSelect = ({
    employeeType,
  }: {
    employeeType: ProfilesType["employeeType"];
  }) => {
    return <SelectItem value={`${employeeType}`}>{employeeType}</SelectItem>;
  };

  const { toast } = useToast();

  const RegisterSchema = z.object({
    name: z
      .string({ required_error: "name is required" })
      .min(3, "name should be atleast 3 characters"),
    email: z
      .string({ required_error: "email is required" })
      .email("email is not valid"),
    password: z
      .string({ required_error: "password is required" })
      .min(8, "password should be atleast 8 characters"),
    employeeType: z.string({ required_error: "employee type is required" }),
  });

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      employeeType: "unset",
    },
  });

  async function onSubmit(data: z.infer<typeof RegisterSchema>) {
    try {
      await AdminSignUpAction(
        data.name,
        data.email,
        data.password,
        data.employeeType as ProfilesType["employeeType"]
      );
      setOpen(false);
      toast({ title: "Account Created for " + data.name });
    } catch (err: any) {
      form.setError("root", { message: err.message });
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="float-end mx-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold">
            Create User
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
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

              {/* email */}
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        icon={<EmailIcon />}
                        placeholder="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* password */}
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        icon={<LockIcon />}
                        placeholder="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Employee Type */}
              <FormField
                name="employeeType"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="select the employee type" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <EmployeeSelect employeeType={"unset"} />
                        <EmployeeSelect employeeType={"leader"} />
                        <EmployeeSelect employeeType={"frontend-developer"} />
                        <EmployeeSelect employeeType={"backend-developer"} />
                      </SelectContent>
                    </Select>
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
