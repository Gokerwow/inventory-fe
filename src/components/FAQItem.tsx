import { useState } from "react";
import type { FAQItem } from "../constant/roles";
import { ChevronDown } from "lucide-react";

// Komponen Kecil untuk Item Dropdown FAQ
const FAQComponent = ({ question, answer }: FAQItem) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden mb-4 transition-all duration-300 hover:shadow-md">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between p-5 text-left bg-white transition-colors duration-200 ${isOpen ? 'bg-gray-50' : ''}`}
            >
                <span className="font-semibold text-gray-800">{question}</span>
                <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
                />
            </button>
            
            <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="p-5 border-t border-gray-100 bg-white text-gray-600 text-sm leading-relaxed">
                    {answer}
                </div>
            </div>
        </div>
    );
};

export default FAQComponent