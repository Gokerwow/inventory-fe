import { useState } from 'react';
import PfpExample from '../assets/Pfp Example.jpeg';
import PencilIcon from '../assets/pencil Icon.svg?react'
import { employees, FAQ } from '../Mock Data/data';
import { useAuth } from '../hooks/useAuth';
import ButtonConfirm from '../components/buttonConfirm';
import { PATHS } from '../Routes/path';
import { useNavigate } from 'react-router-dom';

function Profil() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [openFAQIndex, setOpenFAQIndex] = useState(null)
    
    const handleEditClick = (data) => {
        navigate(PATHS.PROFIL.EDIT, {
            state: {
                data: data
            }
        })
    }

    const toggleFAQ = (index) => {
        setOpenFAQIndex(openFAQIndex === index ? null : index)
    }

    return (
        <div className="bg-white shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-xl flex flex-col gap-4 w-full pb-15">
            <div className='flex justify-between items-center  p-8 px-15 shadow-lg'>
                <h1 className="text-3xl font-bold">Profil</h1>
                <ButtonConfirm
                text='Edit'
                className='bg-[#F4AF0C] hover:bg-[#ce9206] text-white w-48 border-none'
                onClick={() => handleEditClick(user)}
                />
            </div>

            <div className="bg-white rounded-lg p-8">
                <div className='flex gap-8'>
                    <div className='p-8'>
                        <div className='bg-white rounded-full w-70 h-70 flex items-center justify-center overflow-hidden shadow-2xl'>
                            <img src={PfpExample} alt="Profile Picture" className='w-full' />
                        </div>
                    </div>
                    <div className='text-xl p-8 gap-8'>
                        <h1 className='font-bold text-2xl'>Biodata Diri</h1>
                        <table className='border-separate border-spacing-y-8'>
                            <tr>
                                <td width="100">Username</td>
                                <td className='pl-8'>: {user?.username}</td>
                            </tr>
                            <tr>
                                <td>Role</td>
                                <td className='pl-8'>: {user?.role}</td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td className='pl-8'>: {user?.email}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>

            { user && user.role !== 'Super Admin' && 
            <>
            <div className='px-15 w-full'>
                <h1 className="text-2xl font-bold mb-6 text-gray-900">Daftar Pegawai</h1>

                <div className="w-full">
                    <div className="grid grid-cols-[30px_80px_1fr_1fr_1fr_auto] gap-x-4 gap-y-3">
                        <div className="col-span-full grid grid-cols-subgrid gap-4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider items-center">
                            <span></span>
                            <span>Foto Akun</span>
                            <span>Daftar pegawai</span>
                            <span>Jabatan</span>
                            <span>No telepon</span>
                            <span className="text-center">Aktivitas</span>
                        </div>

                        {employees.map((employee) => (
                            <div
                                key={employee.id}
                                className="col-span-full grid grid-cols-subgrid gap-4 items-center bg-white rounded-xl shadow-sm"
                            >
                                <div className="w-full h-full bg-[#EFF8FF] rounded-l px-6 py-4"></div>

                                <div className="flex justify-center py-4">
                                    <img
                                        className="h-12 w-12 rounded-full object-cover"
                                        src={employee.avatarUrl}
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
                                    <PencilIcon className="text-gray-400 cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200"/>
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
                        {FAQ.map((faq, index) => (
                            <div
                                key={index}
                                className="w-full bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 "
                            >
                                <div 
                                    className='flex items-center cursor-pointer hover:bg-gray-50 transition-colors'
                                    onClick={() => toggleFAQ(index)}
                                >
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
                                    className={`transition-all duration-300 overflow-hidden flex  ${
                                        openFAQIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                                >
                                    <div className="w-[30px] h-20 bg-[#EFF8FF] rounded-l py-4"></div>
                                    <div className="flex-1 p-4 border-t-2 border-gray-100">
                                        <p className="text-gray-700">{faq.answer}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            </>
            }
            
        </div>
    );
}

export default Profil;