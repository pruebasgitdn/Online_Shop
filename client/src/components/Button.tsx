import { ReactNode } from "react";
import { MdSkipNext } from "react-icons/md";
import { twMerge } from "tailwind-merge";

interface Props {
  className?: string;
  text?: string;
  icon?: ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "submit" | "reset" | "button" | undefined;
  loading?: boolean;
}

const Button = ({ className, text, icon, onClick, type, loading }: Props) => {
  const newClassName = twMerge(
    "w-full h-6 p-1 hover:cursor-pointer duration-700 flex items-center justify-center rounded-md focus:overline-0",
    className
  );

  return (
    <button type={type} className={newClassName} onClick={onClick}>
      {loading ? (
        <>
          <span className="mr-3 animate-spin">
            <MdSkipNext size={20} className="text-black" />
          </span>
          &&
          {text == "" && icon == undefined}
        </>
      ) : (
        <>
          {text && <span>{text}</span>}
          {icon && <span className="">{icon}</span>}{" "}
        </>
      )}
    </button>
  );
};

export default Button;
