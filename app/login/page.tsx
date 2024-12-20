"use client";

import EmailIcon from "@/icons/Email";
import LockIcon from "@/icons/Lock";
import { useForm } from "react-hook-form";
import { signInAction } from "@/util/actions/GeneralActions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorInput from "@/app/components/ErrorInput";

const LoginSchema = z.object({
  email: z
    .string({ required_error: "email is required" })
    .email({ message: "the entered email is not valid" }),
  password: z
    .string({ required_error: "password is required" })
    .min(8, "password should be atleast 8 charachters long"),
});

export default function Login() {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  async function onSubmit(data: z.infer<typeof LoginSchema>) {
    try {
      await signInAction(data.email, data.password);
    } catch (err: any) {
      form.setError("root", { message: err.message });
    }
  }

  return (
    <Form {...form}>
      <form
        className="bg-platform px-4 pb-6 pt-4 mt-12 mx-auto rounded-lg border border-edge2 flex flex-col gap-4 items-center max-w-sm w-full "
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <h3>Login</h3>

        <FormField
          control={form.control}
          name="email"
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
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  icon={<LockIcon />}
                  placeholder="password"
                  type="password"
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
          {form.formState.isSubmitting ? "Loggin in..." : "Login"}
        </button>
      </form>
    </Form>
  );
}
