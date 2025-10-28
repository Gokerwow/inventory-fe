export default function WarnButton({ onClick } : { onClick?: () => void }) {
    return (
        <button onClick={onClick} className="text-white hover:bg-red-600 text-black py-2 w-25 rounded-lg hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer">
            Hapus
        </button>
    )
}