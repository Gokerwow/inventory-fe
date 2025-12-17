import { useEffect, useState } from 'react'; // <-- TAMBAHAN: useEffect
import PfpExample from '../assets/svgs/Pfp Example.jpeg';
import PencilIcon from '../assets/svgs/pencil Icon.svg?react'
// --- HAPUS ---
// import { employees, FAQ } from '../Mock Data/data';
// --- TAMBAHAN ---
import { employees, FAQ } from '../Mock Data/data'; // Impor tipe datanya
import { getPegawaiList, getFaqList } from '../services/pegawaiService'; // <-- Impor service
// -----------------
import { useAuth } from '../hooks/useAuth';
import { PATHS } from '../Routes/path';
import { useNavigate } from 'react-router-dom';
import { ROLES } from '../constant/roles';
import Button from '../components/button';

// --- TAMBAHAN: Tipe data ---
type Employee = typeof employees[0];
type FaqItem = typeof FAQ[0];
// ---------------------------

function Profil() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null) // <-- Perjelas tipenya

    // --- TAMBAHAN: State untuk data, loading, dan error ---
    const [pegawaiList, setPegawaiList] = useState<Employee[]>([]);
    const [faqList, setFaqList] = useState<FaqItem[]>([]);
    const [isLoading, setIsLoading] = useState(false); // Mulai dari false
    const [error, setError] = useState<string | null>(null);
    // ----------------------------------------------------

    // --- TAMBAHAN: useEffect untuk mengambil data Pegawai & FAQ ---
    useEffect(() => {
        // Hanya ambil data jika user ada dan BUKAN Super Admin
        if (user && user.role !== 'Super Admin') {
            const fetchData = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    // Ambil kedua data secara paralel
                    const [pegawaiData, faqData] = await Promise.all([
                        getPegawaiList(),
                        getFaqList()
                    ]);
                    setPegawaiList(pegawaiData);
                    setFaqList(faqData);
                } catch (err) {
                    console.error("Gagal memuat data profil:", err);
                    setError("Gagal memuat data tambahan.");
                } finally {
                    setIsLoading(false);
                }
            };

            fetchData();
        }
    }, [user]); // <-- Dependensi hanya 'user'
    // ---------------------------------------------------------

    // 1. Fungsi untuk mengedit PROFIL (akun) Anda sendiri
    const handleEditProfilClick = (userData: any) => {
        navigate(PATHS.PROFIL.EDIT, {
            state: {
                data: userData,
                isEmployeeEdit: false // <-- Di-set ke 'false'
            }
        });
    }

    // 2. Fungsi untuk mengedit PEGAWAI
    const handleEditPegawaiClick = (pegawaiData: any) => {
        navigate(PATHS.PROFIL.EDIT, {
            state: {
                data: pegawaiData,
                isEmployeeEdit: true // <-- Di-set ke 'true'
            }
        });
    }

    const toggleFAQ = (index: number) => { // <-- Perjelas tipenya
        setOpenFAQIndex(openFAQIndex === index ? null : index)
    }

    // Tampilan loading data diri (dari useAuth)
    if (!user) {
        return (
            <div className="bg-white shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-xl flex justify-center items-center w-full pb-15 h-full">
                Memuat profil...
            </div>
        );
    }

    return (
        <div className="bg-white shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-xl flex flex-col gap-4 w-full pb-15">
            <div className='flex justify-between items-center  p-8 px-15 shadow-lg'>
                <h1 className="text-3xl font-bold">Profil</h1>
                {user.role === ROLES.SUPER_ADMIN && (

                    <Button
                        variant="warning"
                        className="w-48" // Keep the width if you need it specific
                        onClick={() => handleEditProfilClick(user)}
                    >
                        Edit
                    </Button>
                )}
            </div>

            <div className="bg-white rounded-lg p-8">
                {/* ... (Bagian Biodata Diri Anda tidak berubah, ini sudah benar) ... */}
                <div className='flex gap-8'>
                    <div className='p-8'>
                        <div className='bg-white rounded-full w-70 h-70 flex items-center justify-center overflow-hidden shadow-2xl'>
                            <img src={user.photo ?? PfpExample} alt="Profile Picture" className='w-full' />
                        </div>
                    </div>
                    <div className='text-xl p-8 gap-8'>
                        <h1 className='font-bold text-2xl'>Biodata Diri</h1>
                        <table className='border-separate border-spacing-y-8'>
                            <tbody> {/* <-- Tambahkan tbody untuk best practice */}
                                <tr>
                                    <td width="100">Username</td>
                                    <td className='pl-8'>: {user?.nama_pengguna}</td>
                                </tr>
                                <tr>
                                    <td>Role</td>
                                    <td className='pl-8'>: {user?.role}</td>
                                </tr>
                                <tr>
                                    <td>Email</td>
                                    <td className='pl-8'>: {user?.email}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* --- UBAHAN: Logika Loading & Error --- */}
            {user.role !== 'Super Admin' && (
                <>
                    {isLoading ? (
                        <div className="p-8 text-center">Memuat data pegawai dan FAQ...</div>
                    ) : error ? (
                        <div className="p-8 text-center text-red-500">{error}</div>
                    ) : (
                        <>
                            <div className='px-15 w-full'>
                                <h1 className="text-2xl font-bold mb-6 text-gray-900">Daftar Pegawai</h1>
                                <div className="w-full">
                                    <div className="grid grid-cols-[30px_80px_1fr_1fr_1fr_auto] gap-x-4 gap-y-3">
                                        {/* ... (Header Tabel Pegawai tidak berubah) ... */}

                                        {/* --- UBAHAN: Gunakan 'pegawaiList' dari state --- */}
                                        {pegawaiList.map((employee) => (
                                            <div
                                                key={employee.id}
                                                className="col-span-full grid grid-cols-subgrid gap-4 items-center bg-white rounded-xl shadow-sm"
                                            >
                                                {/* ... (Kolom-kolom render tidak berubah) ... */}
                                                <div className="w-full h-full bg-[#EFF8FF] rounded-l px-6 py-4"></div>
                                                <div className="flex justify-center py-4">
                                                    <img
                                                        className="h-12 w-12 rounded-full object-cover"
                                                        src={employee.photo ?? PfpExample}
                                                        alt={`Foto ${employee.name}`}
                                                    />
                                                </div>
                                                <div className="font-medium text-gray-900 py-4">{employee.name}</div>
                                                <div className="text-gray-700 py-4">{employee.job}</div>
                                                <div className="text-gray-700 py-4">{employee.phone}</div>
                                                <div className="flex items-center justify-end gap-3 py-4 px-4">
                                                    <span className="px-3 py-1 w-30 text-center text-md rounded-xl bg-[#00B998] text-white">
                                                        {employee.status}
                                                    </span>
                                                    <PencilIcon onClick={() => handleEditPegawaiClick(employee)} className="text-gray-400 cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className='px-15 w-full'>
                                <h1 className="text-2xl font-bold mb-6 text-gray-900 mt-5">Frequently Asked Questions</h1>
                                <div className="w-full">
                                    <div className="flex flex-col gap-4 w-full">
                                        {/* --- UBAHAN: Gunakan 'faqList' dari state --- */}
                                        {faqList.map((faq, index) => (
                                            <div
                                                key={index} // Menggunakan index di sini tidak ideal, tapi FAQ tidak punya ID
                                                className="w-full bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 "
                                            >
                                                <div
                                                    className='flex items-center cursor-pointer hover:bg-gray-50 transition-colors'
                                                    onClick={() => toggleFAQ(index)}
                                                >
                                                    {/* ... (UI FAQ tidak berubah) ... */}
                                                    <div className="w-[30px] h-15 bg-[#EFF8FF] rounded-l py-4"></div>
                                                    <div className="flex-1 p-4 flex justify-between items-center">
                                                        <p className="font-medium text-gray-900">{faq.question}</p>
                                                        <svg
                                                            className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${openFAQIndex === index ? 'rotate-180' : ''}`}
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                <div
                                                    className={`transition-all duration-300 overflow-hidden flex  ${openFAQIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                                        }`}
                                                >
                                                    <div className="w-[30px] h-20 bg-[#EFF8FF] rounded-l py-4"></div>
                                                    <div className="flex-1 p-4 border-t-2 border-gray-200">
                                                        <p className="text-gray-700">{faq.answer}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}

export default Profil;