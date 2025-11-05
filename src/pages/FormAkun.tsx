import Input from "../components/input"
import PencilIcon from '../assets/pencil Icon.svg?react'
import ButtonConfirm from "../components/buttonConfirm"
import { useNavigate, useLocation } from "react-router-dom"
// --- UBAHAN: Tambahkan useEffect dan useMemo ---
import React, { useEffect, useRef, useState, type ChangeEvent, useMemo } from "react"
import Modal from "../components/modal"
import { PATHS } from "../Routes/path"
// --- TAMBAHAN: Impor service, auth, dan toast ---
import { createAkun, updateAkun } from "../services/akunService"
import { useToast } from "../context/toastContext"
// ---------------------------------------------
import { useAuthorization } from "../hooks/useAuthorization"
import { useAuth } from "../hooks/useAuth"
import WarnButton from "../components/warnButton"


export default function TambahAkunPage({ isEdit = false }: { isEdit?: boolean }) {

    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
    const navigate = useNavigate()
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // --- TAMBAHAN: State untuk loading submit ---
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showToast } = useToast();
    // -------------------------------------------

    const defaultFormData = () => {
        const currentTimestamp = new Date().toISOString();
        return {
            user_id: Date.now(),
            sso_user_id: Date.now(),
            username: '',
            avatarUrl: selectedAvatar || '/default-avatar.png', // <-- Gunakan avatar yg di-upload
            email: '',
            password: '',
            role: 'user',
            phone: '', // Tambah field phone
            last_login: currentTimestamp,
            synced_at: currentTimestamp,
            created_at: currentTimestamp,
            updated_at: currentTimestamp,
        };
    };

    const [formData, setFormData] = useState(defaultFormData());

    const location = useLocation();
    const { data, isEmployeeEdit } = location.state || {};
    
    // --- TAMBAHAN: Otorisasi (kita aktifkan) ---
    // Logika: Super Admin bisa, atau user biasa HANYA jika 'isEdit' dan 'data.user_id' cocok
    const { user } = useAuth();
    const isOwner = isEdit && data?.user_id === user?.user_id;
    const allowedRoles = useMemo(() => 
        (isEdit && !isEmployeeEdit) ? ['Super Admin', 'Admin Gudang Umum', 'Tim PPK', 'Tim Teknis', 'Penanggung Jawab', 'Instalasi'] : ['Super Admin'],
      [isEdit, isEmployeeEdit]
    );
    const { checkAccess, hasAccess } = useAuthorization(allowedRoles);
    // ---------------------------------------------

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
            updated_at: new Date().toISOString(),
        }));
    };

    // --- UBAHAN: useEffect untuk otorisasi & memuat data edit ---
    useEffect(() => {
        // Cek otorisasi
        // Jika Super Admin, boleh.
        // Jika bukan Super Admin, cek apakah dia mengedit profilnya sendiri
        if (user?.role !== 'Super Admin' && !isOwner) {
            checkAccess(user?.role); // Ini akan redirect jika tidak boleh
        }

        // Jika mode edit, isi form dengan data dari location
        if (isEdit && data) {
            setFormData(data);
            if (data.avatarUrl) {
                setSelectedAvatar(data.avatarUrl); // Tampilkan avatar yang ada
            }
        }
    }, [user, checkAccess, isEdit, data, isOwner]);

    // Early return jika tidak punya akses
    if (user?.role !== 'Super Admin' && !isOwner && !hasAccess(user?.role)) {
       return null; // Otorisasi sudah di-handle 'checkAccess', tapi ini utk safety
    }
    // -----------------------------------------------------------

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        if (!isSubmitting) setIsModalOpen(false); // Jangan tutup jika sedang loading
    }

    const handlePencilClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target?.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                showToast('Harap pilih file gambar saja!', 'error');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                showToast('Ukuran file maksimal 5MB', 'error');
                return;
            }
            console.log('File selected:', file);
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                if (result) {
                    setSelectedAvatar(result);
                    setFormData(prevState => ({
                        ...prevState,
                        avatarUrl: result // Simpan avatar baru (sebagai base64 string)
                    }));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // --- UBAHAN: Logika submit sekarang memanggil service ---
    const handleConfirmSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            let message = '';
            
            // Tentukan data yang akan dikirim
            const dataToSubmit = {
                ...formData,
                avatarUrl: selectedAvatar || formData.avatarUrl, // Pastikan avatar terkirim
            };

            if (isEdit) {
                // Mode Edit
                await updateAkun(data.user_id, dataToSubmit);
                message = isEmployeeEdit ? 'Anda berhasil mengedit karyawan!' : 'Anda berhasil mengedit profil!';
            } else {
                // Mode Tambah Akun Baru
                await createAkun(dataToSubmit);
                message = 'Anda berhasil membuat akun baru!';
            }
            
            // Jika sukses, tutup modal dan kembali
            handleCloseModal();
            navigate(-1, { // Kembali ke halaman sebelumnya
                state: {
                    toastMessage: message
                }
            });

        } catch (err) {
            console.error(err);
            showToast(isEdit ? "Gagal mengupdate akun." : "Gagal membuat akun.", "error");
            setIsSubmitting(false); // Tetap di modal jika error
        } 
        // 'finally' tidak perlu setIsSubmitting(false) karena kita navigasi jika sukses
    };
    // ---------------------------------------------------------

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Validasi sederhana
        if (!isEmployeeEdit && (!formData.username || !formData.role)) {
            showToast("Username dan Role wajib diisi!", "error");
            return;
        }
        if (isEmployeeEdit && !formData.phone) {
             showToast("Nomor HP wajib diisi!", "error");
             return;
        }
        console.log('Form data disiapkan:', formData);
        handleOpenModal()
    };

    return (
        <div className="min-h-full bg-[#F3F7FA] shadow-md flex flex-col rounded-lg">
            <h1 className="bg-[#057CFF] p-8 text-2xl rounded-t-lg text-white text-center font-semibold shadow-lg">
                {isEdit ? (isEmployeeEdit ? 'EDIT KARYAWAN' : 'EDIT PROFIL') : 'TAMBAH AKUN BARU'}
            </h1>

            <div className="p-8 flex flex-col flex-1">
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
                    <div className="flex flex-col items-center">
                        <div className="py-10">
                            <div className="relative">
                                {/* --- UBAHAN: Logika menampilkan gambar --- */}
                                <div className="bg-gray-600 rounded-full w-[279px] h-[279px] shadow-lg overflow-hidden">
                                    {selectedAvatar ? (
                                        <img
                                            src={selectedAvatar}
                                            alt="Avatar Preview"
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        data?.avatarUrl && (
                                            <img
                                                src={data.avatarUrl}
                                                alt="Current Avatar"
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        )
                                    )}
                                </div>
                                <input
                                    aria-label="avatar input"
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <PencilIcon
                                    className="w-20 h-20 absolute right-0 top-2/3 cursor-pointer hover:scale-110 transition-transform duration-200"
                                    onClick={handlePencilClick}
                                />
                            </div>
                        </div>

                        {/* --- UBAHAN: Pastikan 'value' di-bind ke state 'formData' --- */}
                        {isEmployeeEdit ? (
                            // Tampilan untuk edit karyawan - hanya nomor HP
                            <div className="w-full flex gap-4">
                                <Input
                                    id="phone"
                                    judul="Nomor HP"
                                    placeholder="Nomor HP"
                                    value={formData.phone || ''} // <-- Bind ke state
                                    name="phone"
                                    onChange={handleChange}
                                    className="flex-1"
                                />
                                <ButtonConfirm
                                    text={isSubmitting ? "Menyimpan..." : "Selesai"}
                                    className="place-self-end mt-5"
                                    type="submit"
                                    disabled={isSubmitting} // <-- Disable saat loading
                                />
                            </div>
                        ) : (
                            // Tampilan untuk tambah akun baru atau edit admin
                            <div className="grid grid-cols-2 flex-1 w-full gap-8">
                                <div className="flex flex-col gap-4">
                                    <Input
                                        id="role"
                                        judul="Role"
                                        placeholder="Role"
                                        value={formData.role || ''} // <-- Bind ke state
                                        name="role"
                                        onChange={handleChange}
                                    />
                                    <Input
                                        id="username"
                                        judul="Username"
                                        placeholder="Username"
                                        value={formData.username || ''} // <-- Bind ke state
                                        name="username"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex flex-col gap-4">
                                    <Input
                                        id="password"
                                        judul="Password"
                                        placeholder={isEdit ? "(Biarkan kosong jika tidak berubah)" : "Password"}
                                        value={formData.password || ''} // <-- Bind ke state
                                        name="password"
                                        onChange={handleChange}
                                        type="password"
                                    />
                                    <Input
                                        id="email"
                                        judul="Email"
                                        placeholder="Email"
                                        value={formData.email || ''} // <-- Bind ke state
                                        name="email"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    {!isEmployeeEdit &&
                        <ButtonConfirm
                            text={isSubmitting ? "Menyimpan..." : "Selesai"}
                            className="place-self-end mt-5"
                            type="submit"
                            disabled={isSubmitting} // <-- Disable saat loading
                        />
                    }
                </form>

                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onConfirm={handleConfirmSubmit}
                    text={isEdit ? "Apa anda yakin mengedit akun ini?" : "Apa anda yakin membuat akun baru?"}
                >
                    {/* --- UBAHAN: Beri tombol dinamis di dalam Modal --- */}
                    <div className="flex gap-4 justify-end">
                        <ButtonConfirm
                            text={isSubmitting ? "Menyimpan..." : "Iya"}
                            type="button"
                            onClick={handleConfirmSubmit}
                            disabled={isSubmitting}
                        />
                        <WarnButton
                            onClick={handleCloseModal}
                            text="Tidak"
                            disabled={isSubmitting}
                        />
                    </div>
                </Modal>
            </div>
        </div>
    )
}