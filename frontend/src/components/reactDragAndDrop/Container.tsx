import React from "react";
import { useDroppable } from "@dnd-kit/core";

interface ContainerProps {
  id: string;
  title: string;
  backgroundColor: string;
  textColor: string;
  children: React.ReactNode;
  count: number;
}

const Container: React.FC<ContainerProps> = ({
  id,
  title,
  backgroundColor,
  textColor,
  children,
  count,
}) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      className={`col-span-1 h-full ${backgroundColor} rounded-md`}
      ref={setNodeRef}
    >
      <div
        className={`m-1 bg-white text-center p-2 rounded-md ${textColor} flex items-center justify-between`}
      >
        {title}
        {count === 0 ? "" : <p>{count}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default Container;
