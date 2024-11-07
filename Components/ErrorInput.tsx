export default function ErrorInput({
  message,
  center = false,
}: {
  message: string | undefined;
  center?: true | false;
}) {
  return (
    <span
      className={`text-red-400 w-full px-2 mt-1 ${center ? "text-center" : ""}`}
    >
      {message}
    </span>
  );
}
