import { NavLink } from "react-router-dom";
import { twMerge } from "tailwind-merge";

type ButtonConfirmProps = {
    text: string;
    className?: string;
    to?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLFormElement>) => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
};

export default function ButtonConfirm({
    text,
    className,
    to,
    onClick,
    type = "button",
    disabled = false
}: ButtonConfirmProps) {

    const classes = twMerge(
        `text-white text-lg font-medium py-2 px-10 rounded-xl shadow-sm transition-all w-fit text-center`,
        disabled
            ? "bg-gray-400 cursor-not-allowed opacity-60"
            : "bg-[#41C654] hover:bg-[#36a847] cursor-pointer active:scale-95",
        className
    );

    if (to) {
        return (
            <NavLink to={to} className={classes}>
                {text}
            </NavLink>
        );
    }

    return (
        <button disabled={disabled} type={type} onClick={onClick} className={classes}>
            {text}
        </button>
    );
}