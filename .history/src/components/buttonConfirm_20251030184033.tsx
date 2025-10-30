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
    
    const classes = `hover:bg-green-600 text-black hover:text-white border-2 border-gray-400 hover:border-none py-2 w-25 rounded-lg hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer text-center ${className}`;

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