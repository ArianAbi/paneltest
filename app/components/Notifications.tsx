export default function Notification({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="w-full bg-transparent transition-colors duration-150 hover:bg-slate-400 hover:bg-opacity-30 px-3 py-3">
      <p className="line-clamp-2 pt-0">{title}</p>
      <span className="line-clamp-2 text-xs text-gray-300">{description}</span>
    </div>
  );
}
