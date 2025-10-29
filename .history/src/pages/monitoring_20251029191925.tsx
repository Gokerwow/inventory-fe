import { format } from 'date-fns';
import { id } from 'date-fns/locale'; // Impor locale Indonesia
import BurgerDot from '../assets/burgerDot.svg?react'
import Status from '../components/status';
import { logAktivitas } from '../Mock Data/data';

function FormatTanggal(props) {
    const { isoString } = props
    if (!isoString) return null;

    const date = new Date(isoString);
    const formatted = format(date, 'dd MMMM yyyy', { locale: id })

    return <>{formatted}</>
}

export default function MonitoringPage() {
    return (
        <div className="min-h-full p-8 bg-[#F3F7FA] rounded-lg shadow-md">
            <div className="relative mb-8">
                <div className="w-full text-center">

                    <h1 className="text-3xl font-semibold text-black border-b-4 border-black inline-flex leading-15">
                        Log Aktivitas pengguna
                    </h1>

                </div>

                <button aria-label='Menu' className="absolute top-0 right-0 p-3 bg-white rounded-lg shadow-md hover:bg-gray-100 cursor-pointer  hover:scale-110 active:scale-95 transition-all duration-200">
                    <BurgerDot className='w-10 h-10' />
                </button>
            </div>

            <div className="space-y-3">
                <div className="grid grid-cols-[30px_repeat(9,minmax(0,1fr))] gap-4 items-center py-2">
                    <div className="col-span-1 text-sm font-medium text-gray-500"></div>
                    <div className="col-span-1 text-sm font-medium text-gray-500">Foto Akun</div>
                    <div className="col-span-2 text-sm font-medium text-gray-500">Role</div>
                    <div className="col-span-2 text-sm font-medium text-gray-500">Waktu</div>
                    <div className="col-span-2 text-sm font-medium text-gray-500">Tanggal</div>
                    <div className="col-span-1 text-sm font-medium text-gray-500 text-center">Aktivitas</div>
                </div>

                {logAktivitas.map((log, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-[30px_repeat(9,minmax(0,1fr))] gap-4 items-center bg-white rounded-xl shadow-md"
                    >
                        <div className={`col-span-1 h-full bg-[#EFF8FF] rounded-l-lg py-3`}></div>

                        {/* Foto Akun */}
                        <div className="col-span-1 py-3">
                            <img
                                src={log.avatarUrl}
                                alt="Avatar"
                                className="w-10 h-10 rounded-full"
                            />
                        </div>

                        {/* Role */}
                        <div className="col-span-2 py-3">
                            <p className="text-gray-800 font-medium">{log.role}</p>
                        </div>

                        {/* Waktu */}
                        <div className="col-span-2 py-3">
                            <p className="text-gray-600">{log.waktu}</p>
                        </div>

                        {/* Tanggal */}
                        <div className="col-span-2 py-3">
                            <p className="text-gray-600">
                                <FormatTanggal
                                    isoString={log.timestamp}
                                />
                            </p>
                        </div>

                        {/* Aktivitas */}
                        <div className="col-span-1 flex justify-center py-3">
                            <Status 
                            text={log.aktivitas}
                            color={ log.aktivitas === 'Melakukan Logout' ? 'bg-[#FF4C4C]' : 'bg-[#00B998]' }
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}