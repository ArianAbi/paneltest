"use client";

import ErrorInput from "@/Components/ErrorInput";
import TextInput from "@/Components/TextInput";
import EmailIcon from "@/icons/Email";
import LockIcon from "@/icons/Lock";
import { createClient } from "@/util/supabase/SupabaseClient";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { signInAction } from "../actions";
import { revalidatePath } from "next/cache";

type LoginType = {
  email: string;
  password: string;
};

export default function Login() {
  const supabase = createClient();

  const {
    register,
    formState: { errors, isSubmitting },
    setError,
    handleSubmit,
  } = useForm<LoginType>();

  async function onSubmit(data: LoginType) {
    signInAction(data.email, data.password);
    // const { data: _data, error } = await supabase.auth.signInWithPassword({
    //   email: data.email,
    //   password: data.password,
    // });

    // if (error) {
    //   setError("root", { message: error.message });
    //   return;
    // }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      // action={signInAction}
      className="bg-platform px-4 pb-6 pt-4 rounded-lg border border-edge2 flex flex-col gap-4 items-center max-w-sm w-full m-auto"
    >
      <h3>Login</h3>

      <div className="w-full">
        <TextInput
          placeholder="email"
          Icon={<EmailIcon />}
          disabled={isSubmitting}
          {...register("email", {
            required: { value: true, message: "email is required" },
            pattern: {
              value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
              message: "Enter a valid email address",
            },
          })}
        />
        {errors.email && <ErrorInput message={errors.email.message} />}
      </div>

      <div className="w-full">
        <TextInput
          placeholder="password"
          type="password"
          Icon={<LockIcon />}
          disabled={isSubmitting}
          {...register("password", {
            required: "password is required",
            minLength: {
              value: 8,
              message: "password must be atleast 8 characters",
            },
          })}
        />
        {errors.password && <ErrorInput message={errors.password.message} />}
      </div>

      {errors.root && <ErrorInput center message={errors.root.message} />}
      <button
        className="bg-lime-700 hover:bg-lime-600 transition-colors font-semibold w-full py-2 px-3 rounded-lg disabled:saturate-50 disabled:hover:bg-lime-700"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Loggin in..." : "Login"}
      </button>
    </form>
  );
}
