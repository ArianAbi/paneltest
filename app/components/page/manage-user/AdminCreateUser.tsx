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
import UserIcon from "@/icons/User";
import { Input } from "@/app/components/ui/input";
import EmailIcon from "@/icons/Email";
import LockIcon from "@/icons/Lock";
import { Dialog, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import {
  DialogClose,
  DialogContent,
  DialogHeader,
} from "@/app/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Button } from "@/app/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminSignUpAction } from "@/util/actions/Admin/ManageUserActions";
import ErrorInput from "@/app/components/ErrorInput";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ProfilesType } from "@/types/user";
import PhoneIcon from "@/icons/Phone";
import { useRouter } from "next/navigation";

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
    first_name: z
      .string({ required_error: "first name is required" })
      .min(3, "first name should be atleast 3 characters"),
    last_name: z
      .string({ required_error: "last name is required" })
      .min(3, "last name should be atleast 3 characters"),
    email: z
      .string({ required_error: "email is required" })
      .email("email is not valid"),
    phone: z.string(),
    password: z
      .string({ required_error: "password is required" })
      .min(8, "password should be atleast 8 characters"),
    employeeType: z.string({ required_error: "employee type is required" }),
  });

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
      employeeType: "unset",
    },
  });

  const router = useRouter();

  async function onSubmit(data: z.infer<typeof RegisterSchema>) {
    try {
      await AdminSignUpAction(
        data.first_name,
        data.last_name,
        data.phone,
        data.email,
        data.password,
        data.employeeType as ProfilesType["employeeType"]
      );
      setOpen(false);
      toast({
        title: "Account Created",
        description: (
          <p className="text-emerald-400">
            Account Created Succesfully -{" "}
            <span className="font-bold text-white">{data.email}</span>
          </p>
        ),
      });

      router.refresh();
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
        <DialogContent className="border-emerald-600">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-2"
            >
              {/* group of two */}
              <div className="w-full flex items-center gap-2">
                {/*first name */}
                <FormField
                  name="first_name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          icon={<UserIcon />}
                          placeholder="first name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/*last name */}
                <FormField
                  name="last_name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          icon={<UserIcon />}
                          placeholder="last name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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

              {/* phone */}
              <FormField
                name="phone"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        icon={<PhoneIcon />}
                        placeholder="phone"
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
