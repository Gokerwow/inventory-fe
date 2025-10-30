interface SortOption {
  label: string;
  value: string;
  icon: string;
}

interface DropdownProps {
  options: SortOption[];
  onClick: (option: SortOption) => void;
  selected: string;
}

export default function Dropdown({ options, onClick, selected, ref }) {
    return (
        <div className="absolute right-0 z-50 w-56 mt-2 origin-top-right bg-white rounded-lg shadow-lg ">
            {/* Header */}
            <div className="px-4 py-3">
                <h3 className="text-sm font-semibold text-gray-900">Urutkan dari</h3>
            </div>
            <div className="py-2 px-4 flex flex-col gap-2 text-black">
                {options.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => {onClick(option)}}
                        className={`flex items-center w-full px-4 py-2.5 text-sm transition-colors duration-150 rounded-lg border ${selected === option.label
                            ? 'bg-black text-white'
                            : 'text-black hover:text-white hover:bg-black border-gray-300'
                            }`}
                    >
                        <span className="w-6 text-lg">{option.icon}</span>
                        <span className="flex-1 text-left">{option.label}</span>
                        {selected === option.label && (
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        )}
                    </button>
                ))}
            </div>
        </div>
    )
}