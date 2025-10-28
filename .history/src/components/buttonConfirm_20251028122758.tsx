import { NavLink } from "react-router-dom";

type ButtonConfirmProps = {
    text: string;
    className?: string;
    to?: string; 
    onClick?: () => void;
    type?: "button" | "submit" | "reset"; 
};

export default function ButtonConfirm({ 
    text, 
    className, 
    to, 
    onClick, 
    type = "button"
}: ButtonConfirmProps) {
    
    const classes = `hover:bg-[#00b998] text-black hover:text-white border-2 px-10 py-2 rounded-md text-white self-end font-bold text-lg cursor-pointer active:scale-95  transition-all duration-200 hover:scale-110 ${className}`;

    if (to) {
        return (
            <NavLink to={to} className={classes}>
                {text}
            </NavLink>
        );
    }

    // JIKA TIDAK, render sebagai <button> biasa
    return (
        <button type={type} onClick={onClick} className={classes}>
            {text}
        </button>
    );
}