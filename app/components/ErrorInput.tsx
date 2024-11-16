export default function ErrorInput({
  message,
  center = false,
}: {
  message: string | undefined;
  center?: true | false;
}) {
  if (message === "NEXT_REDIRECT") {
    return;
  }
  return (
    <span
      className={`text-red-400 w-full px-2 mt-1 ${center ? "text-center" : ""}`}
    >
      {message}
    </span>
  );
}
