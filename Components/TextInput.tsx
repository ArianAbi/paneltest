import { ReactNode, Ref } from "react";

interface TextInput {
  placeholder: string;
  type?: "text" | "password" | "email";
  Icon?: ReactNode;
  disabled?: boolean;
}

export default function TextInput(
  { placeholder, type = "text", disabled = false, Icon, ...rest }: TextInput,
  ref: Ref<HTMLInputElement>
) {
  return (
    <div className="relative w-full">
      <input
        className="bg-transparent w-full pl-12 relative pr-3 border border-edge2  py-2 rounded-lg disabled:brightness-[0.8] "
        placeholder={placeholder}
        type={type}
        ref={ref}
        disabled={disabled}
        {...rest}
      />

      <span
        className={`absolute left-3 top-2/4 -translate-y-2/4 z-10 size-6 ${
          disabled ? "disabled:brightness-[0.5]" : ""
        }`}
      >
        {Icon}
      </span>
    </div>
  );
}
