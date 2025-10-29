export default function Status() {
                <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium text-white ${item.status === 'Telah Dikonfirmasi' ? 'bg-green-600' : 'bg-[#FFB14C]'
                }`}>
                {item.status}
            </span>
}