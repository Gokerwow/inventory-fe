import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, isWithinInterval, parseISO, startOfMonth, startOfWeek, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { id as indonesia } from 'date-fns/locale'; // Format Bahasa Indonesia

interface CustomCalendarProps {
    startDate: string;
    endDate: string;
    onChange: (start: string, end: string) => void;
}

const CustomCalendar = ({ startDate, endDate, onChange }: CustomCalendarProps) => {
    // State untuk bulan yang sedang dilihat di kalender
    const [viewDate, setViewDate] = useState(new Date());

    const start = startDate ? parseISO(startDate) : null;
    const end = endDate ? parseISO(endDate) : null;

    // Generate hari-hari untuk bulan yang dilihat
    const daysInMonth = useMemo(() => {
        const monthStart = startOfMonth(viewDate);
        const monthEnd = endOfMonth(viewDate);
        const startDateGrid = startOfWeek(monthStart, { weekStartsOn: 1 }); // Mulai Senin
        const endDateGrid = endOfWeek(monthEnd, { weekStartsOn: 1 });

        return eachDayOfInterval({
            start: startDateGrid,
            end: endDateGrid
        });
    }, [viewDate]);

    const handleDayClick = (day: Date) => {
        const formattedDay = format(day, 'yyyy-MM-dd');

        // Logika Pilih Range
        if (!startDate || (startDate && endDate)) {
            // Jika belum ada start, atau sudah ada start & end (reset) -> Set Start baru
            onChange(formattedDay, '');
        } else if (startDate && !endDate) {
            // Jika sudah ada start, tapi belum ada end
            if (day < parseISO(startDate)) {
                // Jika klik tanggal sebelum start -> Jadikan start baru
                onChange(formattedDay, '');
            } else {
                // Jika klik tanggal setelah start -> Jadikan end
                onChange(startDate, formattedDay);
            }
        }
    };

    // Helper untuk styling hari
    const getDayClass = (day: Date) => {
        const isSelectedStart = start && isSameDay(day, start);
        const isSelectedEnd = end && isSameDay(day, end);
        const isInRange = start && end && isWithinInterval(day, { start, end });
        const isCurrentMonth = isSameMonth(day, viewDate);

        let classes = "h-8 w-8 text-xs flex items-center justify-center rounded-full transition-all relative z-10 ";

        if (isSelectedStart || isSelectedEnd) {
            classes += "bg-[#002B5B] text-white font-bold hover:bg-blue-900 ";
        } else if (isInRange) {
            classes += "bg-blue-100 text-blue-800 rounded-none "; // Kotak untuk range tengah
        } else if (!isCurrentMonth) {
            classes += "text-gray-300 hover:text-gray-500 ";
        } else {
            classes += "text-gray-700 hover:bg-gray-100 font-medium ";
        }
        
        return classes;
    };

    return (
        <div className="w-full max-w-[320px] p-2">
            {/* Header Bulan & Navigasi */}
            <div className="flex items-center justify-between mb-4 px-2">
                <button 
                    onClick={() => setViewDate(subMonths(viewDate, 1))}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ChevronLeft size={16} className="text-gray-600" />
                </button>
                <span className="text-sm font-bold text-gray-800">
                    {format(viewDate, 'MMMM yyyy', { locale: indonesia })}
                </span>
                <button 
                    onClick={() => setViewDate(addMonths(viewDate, 1))}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ChevronRight size={16} className="text-gray-600" />
                </button>
            </div>

            {/* Nama Hari */}
            <div className="grid grid-cols-7 mb-2 text-center">
                {['Sn', 'Sl', 'Rb', 'Km', 'Jm', 'Sb', 'Mg'].map(day => (
                    <span key={day} className="text-[10px] font-bold text-gray-400 uppercase">
                        {day}
                    </span>
                ))}
            </div>

            {/* Grid Tanggal */}
            <div className="grid grid-cols-7 gap-y-1">
                {daysInMonth.map((day, idx) => {
                    // Logic khusus untuk styling background range (agar nyambung)
                    const isInRange = start && end && isWithinInterval(day, { start, end });
                    const isStart = start && isSameDay(day, start);
                    const isEnd = end && isSameDay(day, end);
                    
                    return (
                        <div key={idx} className="relative w-full h-8 flex items-center justify-center">
                            {/* Background connector untuk range */}
                            {isInRange && !isStart && (
                                <div className="absolute left-0 top-0 bottom-0 w-[50%] bg-blue-100 z-0"></div>
                            )}
                            {isInRange && !isEnd && (
                                <div className="absolute right-0 top-0 bottom-0 w-[50%] bg-blue-100 z-0"></div>
                            )}

                            <button 
                                onClick={() => handleDayClick(day)}
                                className={getDayClass(day)}
                            >
                                {format(day, 'd')}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CustomCalendar;