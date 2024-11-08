"use client";

import ErrorInput from "@/Components/ErrorInput";
import EmailIcon from "@/icons/Email";
import LockIcon from "@/icons/Lock";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import UserIcon from "@/icons/User";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/Components/ui/button";
import Link from "next/link";
import { signUpAction } from "../actions";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Modal from "@/Components/Modal";

const RegisterSchema = z
  .object({
    name: z
      .string({ required_error: "name is required" })
      .min(3, "name should be atleast 2 characters"),
    email: z
      .string({ required_error: "email is required" })
      .email("email is not valid"),
    password: z
      .string({ required_error: "password is required" })
      .min(8, "password should be atleast 8 characters"),
    passwordC: z.string({ required_error: "password confirm is required" }),
  })
  .refine((data) => data.password === data.passwordC, {
    message: "passwords do not match",
    path: ["passwordC"],
  });

export default function Register() {
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordC: "",
    },
  });

  const { toast } = useToast();

  async function onSubmit(data: z.infer<typeof RegisterSchema>) {
    try {
      await signUpAction(data.name, data.email, data.password);
      toast({ title: "Account Created", description: `Welcome ${data.name}` });
      setAccountCreatedModal(true);
    } catch (err: any) {
      form.setError("root", { message: err.message });
    }
  }

  const [accountCreatedModal, setAccountCreatedModal] = useState(false);

  return (
    <>
      <Modal
        open={accountCreatedModal}
        setOpen={setAccountCreatedModal}
        title="Verify Email"
        description="verify you'r email so you can login"
      >
        <Button
          className="w-full font-semibold bg-lime-500 hover:bg-lime-400"
          asChild
        >
          <Link href="/login">Login</Link>
        </Button>

        <Button className="text-cyan-400" variant={"link"} asChild>
          <Link href="/">go home</Link>
        </Button>
      </Modal>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-platform px-4 pb-6 pt-4 rounded-lg border border-edge2 flex flex-col gap-4 items-center max-w-sm w-full m-auto"
        >
          <h3>Register</h3>

          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input icon={<UserIcon />} placeholder="name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input icon={<EmailIcon />} placeholder="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    icon={<LockIcon />}
                    placeholder="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="passwordC"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password Confirm</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    icon={<LockIcon />}
                    placeholder="password confirm"
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

          <button
            className="bg-lime-700 hover:bg-lime-600 transition-colors font-semibold w-full py-2 px-3 rounded-lg disabled:saturate-50 disabled:hover:bg-lime-700"
            disabled={form.formState.isSubmitting}
            type="submit"
          >
            {form.formState.isSubmitting ? "Register..." : "Register"}
          </button>
          <Button className="text-cyan-400" variant={"link"} asChild>
            <Link href="/login">have an account? Login</Link>
          </Button>
        </form>
      </Form>
    </>
  );
}
