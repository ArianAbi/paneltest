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
import { AdminUpdateUserAction } from "@/util/actions/Admin/ManageUserActions";
import ErrorInput from "@/app/components/ErrorInput";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ProfilesType } from "@/types/user";
import PhoneIcon from "@/icons/Phone";
import { useRouter } from "next/navigation";
import { Database } from "@/database.types";
import EditIcon from "@/icons/Edit";

export default function AdminEditUser({
  user,
}: {
  user: Database["public"]["Tables"]["users"]["Update"];
}) {
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
    password: z.string({ required_error: "password is required" }),
    employeeType: z.string({ required_error: "employee type is required" }),
  });

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      first_name: user.first_name ? user.first_name : "",
      last_name: user.last_name ? user.last_name : "",
      email: user.email ? user.email : "",
      phone: user.phone ? user.phone : "",
      password: "",
      employeeType: user.employeeType ? user.employeeType : "",
    },
  });

  const router = useRouter();

  async function onSubmit(data: z.infer<typeof RegisterSchema>) {
    try {
      if (!user.id) {
        throw "failed to get the user id";
      }
      await AdminUpdateUserAction(
        user.id,
        data.first_name,
        data.last_name,
        data.phone,
        data.email,
        data.password,
        data.employeeType as Database["public"]["Tables"]["users"]["Row"]["employeeType"]
      );
      setOpen(false);
      toast({
        title: "Account Updated",
        description: (
          <p className="text-emerald-400">Account Updated Successfully</p>
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
          <Button className="float-end first:mx-0 mx-2 bg-cyan-700 hover:bg-cyan-600 text-white font-semibold">
            <EditIcon />
          </Button>
        </DialogTrigger>
        <DialogContent className="border-cyan-600">
          <DialogHeader>
            <DialogTitle className="font-bold">Edit - {user.email}</DialogTitle>
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
                    <FormLabel>
                      Password - {`( leave empty for unchanged )`}
                    </FormLabel>
                    <FormControl>
                      <Input
                        icon={<LockIcon />}
                        placeholder="leave empty to keep the password"
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
                  className={`w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold disabled:saturate-50 ${
                    form.formState.isSubmitting ? "animate-pulse" : ""
                  }`}
                  variant={"default"}
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Updating..." : "Update"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
