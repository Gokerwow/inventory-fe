export default function Status({ text, color } : { text: string, color: string }) {
    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium text-white ${color}'
            }`}>
            {text}
        </span>
    )
}