import React from "react";
import { twMerge } from "tailwind-merge";

//Interface del container
interface Props {
  children: React.ReactNode; //Props
  className?: string;
}

const Container = ({ children, className }: Props) => {
  //Crecion de clase
  const newClassName = twMerge(
    "max-w-screen-xl mx-auto py-10 lg:px-0",
    className
  );

  return <div className={newClassName}>{children}</div>;
};

export default Container;
