export default function WarnButton({ onClick, text, disabled, type = 'button' } : { onClick?: () => void, text: string, disabled?: boolean, type?: "button" | "submit" | "reset";}) {
    return (
        <button type={type} disabled={disabled} onClick={onClick} className="hover:bg-red-600 text-black hover:text-white border-2 border-gray-400 py-2 w-25 rounded-lg hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer">
            {text}
        </button>
    )
}