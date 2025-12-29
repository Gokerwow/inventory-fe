import { useEffect, useState } from "react";
import { ROLES, type APIJabatan, type APIPegawaiBaru, type DaftarPegawai } from "../constant/roles";
import { useAuthorization } from "../hooks/useAuthorization";
import { useAuth } from "../hooks/useAuth";
import { getJabatanSelect } from "../services/jabatanService";
import { useToast } from "../hooks/useToast";
import Input from "../components/input";
import DropdownInput from "../components/dropdownInput";
import { createPegawai, updatePegawai } from "../services/pegawaiService";
import { PATHS } from "../Routes/path";
import { useLocation, useNavigate } from "react-router-dom";
import ConfirmModal from "../components/confirmModal";
import Button from "../components/button";
import Loader from "../components/loader";
import BackButton from "../components/backButton";

export function FormPegawaiPage({ isEdit = false }: { isEdit?: boolean }) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<DaftarPegawai>({
        id: 0,
        name: '',
        nip: '',
        phone: '',
        status: 'active',
        jabatan_id: 0,
        created_at: '',
        updated_at: '',
        jabatan: ''
    });

    const [jabatanOptions, setJabatanOptions] = useState<APIJabatan[]>([]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const { showToast } = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const { checkAccess, hasAccess } = useAuthorization([ROLES.SUPER_ADMIN]);
    const { user } = useAuth();

    const { data } = location.state || {};

    useEffect(() => {
        checkAccess(user?.role);
        if (!hasAccess(user?.role)) {
            return;
        }

        const fetchData = async () => {
            try {
                const response = await getJabatanSelect();
                setJabatanOptions(response);

                if (isEdit && data) {
                    setFormData(data);
                }
            } catch (err) {
                console.error("Gagal mengambil data jabatan:", err);
                showToast('Gagal mengambil data jabatan.', 'error');
                setError("Gagal memuat data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleJabatanChange = (option: APIJabatan | string) => {
        if (typeof option === 'object' && option !== null) {
            setFormData(prev => ({
                ...prev,
                jabatan: option.name,
                jabatan_id: option.id
            }));

            if (errors.jabatan) {
                setErrors(prev => ({ ...prev, jabatan: '' }));
            }
        }
    };

    const handleNIPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const onlyNumbers = value.replace(/[^0-9]/g, '');

        setFormData(prevState => ({
            ...prevState,
            [name]: onlyNumbers
        }));

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
            newErrors.nip = 'NIP hanya boleh berisi angka';
        } else if (formData.nip.length < 5) {
            newErrors.nip = 'NIP minimal 5 digit';
        }

        if (!isEdit && (!formData.jabatan_id || formData.jabatan_id === 0)) {
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
                jabatan_id: formData.jabatan_id,
                phone: formData.phone,
                status: formData.status || 'active'
            };

            if (!isEdit) {
                await createPegawai(pegawaiData);
                showToast('Anda berhasil membuat daftar pegawai baru', 'success');
            } else {
                await updatePegawai(formData.id, pegawaiData);
                showToast('Anda berhasil mengubah data pegawai', 'success');
            }

            navigate(PATHS.PEGAWAI.INDEX);
            handleCloseModal();

        } catch (err: any) {
            console.error("Gagal menyimpan pegawai:", err);
            handleCloseModal();

            if (err.response?.data?.message) {
                showToast(err.response.data.message, 'error');
            } else if (err.response?.data?.errors) {
                const errorMessages = Object.values(err.response.data.errors).flat().join(', ');
                showToast(errorMessages, 'error');
            } else {
                showToast('Gagal menyimpan data pegawai.', 'error');
            }
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
        handleOpenModal();
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className={`w-full flex flex-col gap-5 ${isEdit ? 'bg-white rounded-lg' : ''}`}>
            {/* HEADER HALAMAN (Biru) - Responsif */}
            <div className="bg-[#005DB9] rounded-xl p-6 text-center text-white shadow-md relative flex flex-col items-center justify-center min-h-[120px]">
                {/* Back Button di kiri atas untuk mobile */}
                <div className="hidden md:block absolute left-6 top-1/2 -translate-y-1/2">
                    <BackButton />
                </div>

                <div className='text-center w-full px-8'>
                    <h1 className="text-xl md:text-2xl font-bold uppercase tracking-wide">
                        {!isEdit ? 'Tambah Pegawai Baru' : 'Form Manajemen Pegawai'}
                    </h1>
                    <p className="text-blue-100 text-xs md:text-sm mt-1 opacity-90 hidden sm:block">
                        {!isEdit ? 'Isi form berikut untuk menambahkan akun pegawai baru ke dalam sistem' : 'Edit Identitas Pegawai'}
                    </p>
                </div>
            </div>

            <div className={`w-full rounded-xl shadow-lg flex-1 ${isEdit ? '' : 'bg-white rounded-lg'} flex flex-col overflow-hidden`}>
                {!isEdit && (
                    <div className="bg-blue-600 p-4 md:p-6 rounded-t-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-white">
                        <div className="flex gap-4 items-center">
                            <div className="bg-white p-2 rounded-lg shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-lg md:text-2xl font-bold">Form Data Pegawai</h1>
                                <p className="text-blue-100 text-xs md:text-sm mt-1">Lengkapi semua informasi di bawah ini</p>
                            </div>
                        </div>
                        <span className="bg-white text-black text-xs font-semibold px-3 py-1 rounded-md shadow-sm whitespace-nowrap self-start sm:self-center">
                            Wajib Diisi
                        </span>
                    </div>
                )}

                {/* Form Content Wrapper */}
                <div className="p-4 md:p-6 flex flex-col flex-1">

                    {/* Info Alert - Stack on mobile */}
                    <div className="bg-indigo-50 border-l-4 border-blue-600 p-4 rounded-r-md flex flex-col sm:flex-row gap-3 sm:gap-4 items-start mb-6 md:mb-8">
                        <div className="bg-blue-100 p-1 rounded-full text-blue-600 mt-0.5 shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 text-sm md:text-base">Informasi Penting</h3>
                            <p className="text-gray-600 text-xs md:text-sm mt-1 leading-relaxed">
                                Pastikan semua data yang dimasukkan sudah benar dan valid. Data yang sudah disimpan akan masuk ke sistem.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                        <h2 className="text-lg md:text-xl font-bold text-gray-900 border-b pb-4 mb-6">Informasi Pribadi</h2>

                        {/* Grid Form: 1 kolom di mobile, 2 kolom di desktop */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 md:gap-y-6 mb-6">
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
                                <span className="text-xs md:text-sm text-gray-500 mt-1 block">Contoh: Rizky Pratama</span>
                            </div>

                            <div>
                                <DropdownInput
                                    judul="Jabatan"
                                    options={jabatanOptions}
                                    placeholder='Pilih Jabatan'
                                    onChange={handleJabatanChange}
                                    name='jabatan'
                                    value={formData.jabatan || ''}
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
                                <span className="text-xs md:text-sm text-gray-500 mt-1 block">Contoh: 197361736176903</span>
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
                                <span className="text-xs md:text-sm text-gray-500 mt-1 block">Contoh: 08123456789</span>
                            </div>
                        </div>

                        {/* Footer Action Buttons */}
                        <div className="flex justify-end mt-auto pt-6 border-t border-gray-100">
                            <Button
                                variant="success"
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full md:w-auto px-8" // Full width di mobile
                            >
                                {isSubmitting ? "Menyimpan..." : "Selesai"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            <ConfirmModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmSubmit}
                text='Apa anda yakin data yang dibuat sudah benar?'
            />
        </div>
    );
}