import React from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  titulo: string;
  className?: string;
}

const Title = ({ className, titulo }: Props) => {
  const newClassName = twMerge(
    "text-4xl text-cyan-950 p-2.5 font-extrabold",
    className
  );

  return <h2 className={newClassName}>{titulo}</h2>;
};

export default Title;
