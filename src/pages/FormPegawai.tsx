import { useEffect, useState } from "react";
import { ROLES, type APIJabatan, type APIPegawaiBaru, type DaftarPegawai } from "../constant/roles";
import { useAuthorization } from "../hooks/useAuthorization";
import { useAuth } from "../hooks/useAuth";
import { getJabatanSelect } from "../services/jabatanService";
import { useToast } from "../hooks/useToast";
import Input from "../components/input";
import DropdownInput from "../components/dropdownInput";
import Modal from "../components/modal";
import ButtonConfirm from "../components/buttonConfirm";
import WarnButton from "../components/warnButton";
import { createPegawai, updatePegawai } from "../services/pegawaiService";
import { PATHS } from "../Routes/path";
import { useLocation, useNavigate } from "react-router-dom";
import ConfirmModal from "../components/confirmModal";

export function FormPegawaiPage({ isEdit = false }: { isEdit?: boolean }) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<DaftarPegawai>({
        id: 0,
        name: '',
        nip: '',
        phone: '',
        status: '',
        jabatan_id: 0,
        created_at: '',
        updated_at: '',
        jabatan: {
            id: 0,
            name: ''
        }
    })

    const [jabatan, setJabatan] = useState<APIJabatan[]>([])
    const [selectedJabatan, setSelectedJabatan] = useState<APIJabatan | null>(null)
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const { showToast } = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const location = useLocation()
    const navigate = useNavigate()
    const { checkAccess, hasAccess } = useAuthorization([ROLES.SUPER_ADMIN]);
    const { user } = useAuth();

    const { data } = location.state || {}

    useEffect(() => {
        checkAccess(user?.role);
        if (!hasAccess(user?.role)) {
            return;
        }

        const fetchData = async () => {
            try {
                const response = await getJabatanSelect()
                setJabatan(response)
                if (isEdit) {
                    setFormData(data)
                }
            } catch (err) {
                console.error("Gagal mengambil data jabatan:", err);
                showToast('Gagal mengambil data jabatan.', 'error');
            }
        }

        fetchData()
    }, [user?.role, isEdit, data])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        // Clear error ketika user mulai mengetik
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleJabatanChange = (option: APIJabatan | null) => {
        setSelectedJabatan(option);
        if (option) {
            setFormData(prev => ({
                ...prev,
                jabatan: {
                    id: option.id,
                    name: option.name
                },
            }));
            // Clear error ketika user memilih jabatan
            if (errors.jabatan) {
                setErrors(prev => ({ ...prev, jabatan: '' }));
            }
        }
    };

    const handleNIPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // ✅ Hanya izinkan angka (0-9)
        const onlyNumbers = value.replace(/[^0-9]/g, '');

        setFormData(prevState => ({
            ...prevState,
            [name]: onlyNumbers
        }));

        // Clear error ketika user mulai mengetik
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Nama lengkap wajib diisi';
        }

        if (!formData.nip.trim()) {
            newErrors.nip = 'NIP wajib diisi';
        } else if (!/^\d+$/.test(formData.nip)) {
            // ✅ Validasi bahwa NIP hanya berisi angka
            newErrors.nip = 'NIP hanya boleh berisi angka';
        } else if (formData.nip.length < 5) {
            // ✅ Optional: tambahkan validasi panjang minimum
            newErrors.nip = 'NIP minimal 5 digit';
        }

        if (!formData.jabatan.id || formData.jabatan.id === 0) {
            newErrors.jabatan = 'Jabatan wajib dipilih';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'No. Telepon wajib diisi';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleConfirmSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const pegawaiData: APIPegawaiBaru = {
                name: formData.name,
                nip: formData.nip,
                jabatan_id: formData.jabatan.id,
                phone: formData.phone,
                status: formData.status || 'active'
            };

            if (!isEdit) {
                console.log('✅ Pegawai yang akan ditambahkan:', pegawaiData);

                const response = await createPegawai(pegawaiData)
                console.log(response)

                showToast('Pegawai berhasil ditambahkan!', 'success');
            } else {
                console.log('✅ Pegawai yang akan ditambahkan:', pegawaiData);

                const response = await updatePegawai(formData.id, pegawaiData)
                console.log(response)

                showToast('Pegawai berhasil diubah!', 'success');
            }

            navigate(PATHS.PEGAWAI.INDEX);
            handleCloseModal();

        } catch (err: any) {
            console.error("Gagal menambah pegawai:", err);

            // ✅ Tampilkan pesan error dari backend
            if (err.response?.data?.message) {
                showToast(err.response.data.message, 'error');
            } else if (err.response?.data?.errors) {
                // Jika backend mengirim detail errors per field
                const errorMessages = Object.values(err.response.data.errors).flat().join(', ');
                showToast(errorMessages, 'error');
            } else {
                showToast('Gagal menyimpan data pegawai.', 'error');
            }

            // ✅ Log lengkap untuk debugging
            console.log('Response error:', err.response?.data);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            showToast('Mohon lengkapi semua field yang wajib diisi', 'error');
            return;
        }

        console.log('Data pegawai siap submit:', {
            name: formData.name,
            nip: formData.nip,
            jabatan: {
                id: formData.jabatan.id,
                name: formData.jabatan.name
            },
            phone: formData.phone,
            status: formData.status
        });

        handleOpenModal();
    };

    return (
        <div className={`w-full h-full flex flex-col gap-5 ${isEdit ? 'bg-white rounded-lg' : ''}`}>
            <div className={`text-center ${isEdit ? 'mt-8' : ''}`}>
                <h1 className={`font-bold text-2xl`}>{!isEdit ? 'Tambah Pegawai Baru' : 'Form Manajemen Pegawai'}</h1>
                <p className="mt-2">{!isEdit ? 'Isi form berikut untuk menambahkan akun pegawai baru ke dalam sistem' : 'Edit Identitas Pegawai'}</p>
            </div>
            <div className={`w-full rounded-xl shadow-lg overflow-hidden flex-1 ${isEdit ? '' : 'bg-white rounded-lg'} flex flex-col`}>
                {!isEdit &&
                    <div className="bg-blue-600 p-6 md:p-8 flex justify-between items-start text-white">
                        <div className="flex gap-4 items-center">
                            <div className="bg-white p-2 rounded-lg shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Form Data Pegawai</h1>
                                <p className="text-blue-100 text-sm mt-1">Lengkapi semua informasi di bawah ini</p>
                            </div>
                        </div>
                        <span className="bg-white text-black text-xs font-semibold px-3 py-1 rounded-md shadow-sm whitespace-nowrap">
                            Wajib Diisi
                        </span>
                    </div>
                }

                <div className="p-6 flex flex-col flex-1">

                    <div className="bg-indigo-50 border-l-4 border-blue-600 p-4 rounded-r-md flex gap-4 items-start mb-8">
                        <div className="bg-blue-100 p-1 rounded-full text-blue-600 mt-0.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Informasi Penting</h3>
                            <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                                Pastikan semua data yang dimasukkan sudah benar dan valid. Data yang sudah disimpan akan masuk ke sistem.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                        <h2 className="text-xl font-bold text-gray-900 border-b pb-4 mb-6">Informasi Pribadi</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-6">
                            <div>
                                <Input
                                    id='namaPegawai'
                                    judul="Nama Lengkap"
                                    name='name'
                                    placeholder="Masukkan Nama Lengkap"
                                    onChange={handleChange}
                                    value={formData.name || ''}
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <DropdownInput
                                    judul="Jabatan"
                                    options={jabatan}
                                    placeholder='Pilih Jabatan'
                                    onChange={handleJabatanChange}
                                    name='jabatan'
                                    type='button'
                                    value={formData.jabatan.name || ''}
                                    disabled={isEdit}
                                />
                                {errors.jabatan && (
                                    <p className="text-red-500 text-xs mt-1">{errors.jabatan}</p>
                                )}
                            </div>

                            <div>
                                <Input
                                    id='NIP'
                                    judul="NIP"
                                    name='nip'
                                    placeholder="Masukkan NIP"
                                    onChange={handleNIPChange}
                                    value={formData.nip || ''}
                                    type="text"
                                />
                                {errors.nip && (
                                    <p className="text-red-500 text-xs mt-1">{errors.nip}</p>
                                )}
                            </div>

                            <div>
                                <Input
                                    judul="No. Telepon"
                                    id='phone'
                                    name='phone'
                                    placeholder="Masukkan No. Telepon"
                                    onChange={handleChange}
                                    value={formData.phone || ''}
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                                )}
                            </div>

                        </div>

                        <div className="flex justify-end mt-auto pt-6">
                            <ButtonConfirm
                                text={isSubmitting ? "Menyimpan..." : "Selesai"}
                                type="submit"
                                disabled={isSubmitting}
                            />
                        </div>
                    </form>

                </div>
            </div>
            {/* MODAL / POPUP */}
            <ConfirmModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmSubmit}
                text='Apa anda yakin data yang dibuat sudah benar?'
            />
        </div>
    )
}