"use client";

import ErrorInput from "@/Components/ErrorInput";
import TextInput from "@/Components/TextInput";
import EmailIcon from "@/icons/Email";
import LockIcon from "@/icons/Lock";
import { supabase } from "@/util/supabase/SupabaseClient";
import { useForm } from "react-hook-form";

type RegisterType = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

export default function Register() {
  const {
    register,
    formState: { errors, isSubmitting },
    setError,
    handleSubmit,
    watch,
  } = useForm<RegisterType>();

  async function onSubmit(data: RegisterType) {
    const { data: _data, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      // options: {
      //   data: {
      //     name: data.name,
      //   },
      // },
    });

    console.log(error);
    console.log(_data);

    if (error) {
      setError("root", { message: error.message });
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-platform px-4 pb-6 pt-4 rounded-lg border border-edge2 flex flex-col gap-4 items-center max-w-sm w-full m-auto"
    >
      <h3>Register</h3>

      <div className="w-full">
        <TextInput
          placeholder="name"
          Icon={<EmailIcon />}
          disabled={isSubmitting}
          {...register("name", {
            required: { value: true, message: "name is required" },
          })}
        />
        {errors.email && <ErrorInput message={errors.email.message} />}
      </div>

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

      <div className="w-full">
        <TextInput
          placeholder="password confirm"
          type="password"
          Icon={<LockIcon />}
          disabled={isSubmitting}
          {...register("passwordConfirm", {
            required: "password confirm is required",
            minLength: {
              value: 8,
              message: "password must be atleast 8 characters",
            },
            validate: (val: string) => {
              if (val !== watch("password")) {
                return "passwords do not match";
              }
            },
          })}
        />
        {errors.password && <ErrorInput message={errors.password.message} />}
      </div>

      <button
        className="bg-lime-700 hover:bg-lime-600 transition-colors font-semibold w-full py-2 px-3 rounded-lg disabled:saturate-50 disabled:hover:bg-lime-700"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Register..." : "Register"}
      </button>
    </form>
  );
}
