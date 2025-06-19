import React from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  subtitulo: string;
  className?: string;
}

const Subtitle = ({ subtitulo, className }: Props) => {
  const newClassName = twMerge(
    "text-2xl text-indigo-900 p-2.5 font-bold",
    className
  );

  return <h3 className={newClassName}>{subtitulo}</h3>;
};

export default Subtitle;
