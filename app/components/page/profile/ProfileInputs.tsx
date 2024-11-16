"use client";

import ErrorInput from "../../ErrorInput";
import { Button } from "../../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import UserIcon from "@/icons/User";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import imgToBase64 from "@/util/ImgToBase64";
import { useContext, useEffect, useState } from "react";
import {
  uploadProfilePictureAction,
  updateFirstAndLastname,
} from "@/util/actions/ProfileActions";
import { currentUserCTX } from "@/util/CurrentUserContext";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

export default function ProfileInputs() {
  const [base64Thumbnail, setBase64Thumbnail] = useState("");

  const currentUser = useContext(currentUserCTX);

  const RegisterSchema = z.object({
    first_name: z
      .string({ required_error: "first name is required" })
      .min(3, "first name should be atleast 3 characters"),
    last_name: z
      .string({ required_error: "last name is required" })
      .min(3, "last name should be atleast 3 characters"),
    profile_picture: z.any(),
  });

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      profile_picture: "",
    },
  });

  useEffect(() => {
    if (currentUser && currentUser.first_name && currentUser.last_name) {
      form.setValue("first_name", currentUser.first_name);
      form.setValue("last_name", currentUser.last_name);
    }
  }, [currentUser]);

  async function onSubmit(data: z.infer<typeof RegisterSchema>) {
    if (!currentUser) {
      throw "failed to get the current user";
    }

    try {
      //upload the image if it chenged
      if (form.getFieldState("profile_picture").isTouched) {
        const file = data.profile_picture[0];
        const path = `${currentUser.id}/${uuidv4()}`;

        toast("Uploading The Profile Picture", {
          description: "this might take a moment, please be patient...",
        });
        await uploadProfilePictureAction(
          currentUser.id,
          path,
          file,
          base64Thumbnail
        );
        toast("Profile Picture Changed");
      }

      //upload the first and last name if it chenged
      if (
        form.getFieldState("first_name").isTouched ||
        form.getFieldState("last_name").isTouched
      ) {
        await updateFirstAndLastname(
          currentUser.id,
          data.first_name,
          data.last_name
        );

        toast("Name Updated Successfully");
      }
    } catch (err: any) {
      form.setError("root", { message: err.message });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2"
      >
        {/*Profile */}
        <FormField
          name="profile_picture"
          control={form.control}
          render={() => (
            <FormItem>
              <FormLabel>
                Profile Picture - (
                {
                  <span className="mx-1 text-xs">
                    leave empty to not change
                  </span>
                }
                )
              </FormLabel>
              <FormControl>
                <Input
                  type="file"
                  {...form.register("profile_picture", { required: false })}
                  accept="image/*"
                  onChange={async (e: any) => {
                    if (e.target.files[0]) {
                      imgToBase64(
                        e.target.files[0],
                        (base64) => {
                          setBase64Thumbnail(base64);
                        },
                        10
                      );
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        {form.formState.errors.root && (
          <ErrorInput message={form.formState.errors.root.message} />
        )}
        {/* buttons */}
        <div className="w-full flex gap-2 items-center font-semibold justify-between mt-4">
          <Button
            type="submit"
            className={`w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold disabled:saturate-50 ${
              form.formState.isSubmitting ? "animate-pulse" : ""
            }`}
            variant={"default"}
            disabled={
              form.formState.isSubmitting ||
              (!form.formState.isDirty && !base64Thumbnail)
            }
          >
            {form.formState.isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
