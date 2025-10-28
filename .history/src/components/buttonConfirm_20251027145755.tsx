export default function ButtonConfirm({ text, className, onClick }: { text: string, className?:string, onClick: () => void }) {
    return (
        <button onClick={onClick} className={`bg-[#00b998] px-10 py-2 rounded-md text-white self-end font-bold text-lg cursor-pointer active:scale-95 hover:bg-[#02ad8d] transition-all duration-200 hover:scale-110 ${className}`}>
            {text}
        </button>
    )
}