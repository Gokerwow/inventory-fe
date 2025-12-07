export default function WarnButton({ onClick, text, disabled, type = 'button' } : { onClick?: () => void, text: string, disabled?: boolean, type?: "button" | "submit" | "reset";}) {
    return (
        <button type={type} disabled={disabled} onClick={onClick} className="bg-[#EF4444] hover:bg-[#a60606] text-white text-lg font-medium py-2 px-10 rounded-xl shadow-sm transition-all active:scale-95 w-fit cursor-pointer text-center">
            {text}
        </button>
    )
}