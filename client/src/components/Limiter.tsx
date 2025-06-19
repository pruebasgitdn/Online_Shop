import React from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  className?: string;
}

const Limiter = ({ className }: Props) => {
  const newClassName = twMerge(
    "mb-2.5 w-11/12 mx-auto text-slate-400",
    className
  );
  return (
    <>
      <hr className={newClassName} />
    </>
  );
};

export default Limiter;
