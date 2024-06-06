import { TabItemProps } from "@/types/type";

export const TabItem = ({
  icon,
  label,
  isActive,
  numbers,
  onClick,
}: TabItemProps) => {
  return (
    <div
      className={`h-10 rounded-md cursor-pointer border-b  ${
        isActive ? "bg-slate-200" : "hover:bg-slate-200"
      } flex gap-2 p-1 items-center justify-between`}
      onClick={onClick}
    >
      <div className="flex gap-2">
        {icon}
        <p>{label}</p>
      </div>
      {numbers != 0 ? (
        <div className="h-6 w-6 bg-slate-100 rounded-full text-center">
          <p>{numbers}</p>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
