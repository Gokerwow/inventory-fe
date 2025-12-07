import Input from "../components/input"
import PencilIcon from '../assets/pencil Icon.svg?react'
import ButtonConfirm from "../components/buttonConfirm"
import { useNavigate, useLocation } from "react-router-dom"
import React, { useEffect, useRef, useState, type ChangeEvent, useMemo } from "react"
import { createAkun, updateAkun } from "../services/akunService" // Pastikan updateAkun diimport
import { useToast } from "../hooks/useToast"
import { useAuthorization } from "../hooks/useAuthorization"
import { useAuth } from "../hooks/useAuth"
import { updatePegawai } from "../services/pegawaiService"
import PasswordInput from "../components/passwordInput"
import { ROLES } from "../constant/roles"
import ConfirmModal from "../components/confirmModal"

export default function TambahAkunPage({ isEdit = false }: { isEdit?: boolean }) {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showToast } = useToast();

    // State untuk Preview Gambar (Base64)
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
    // State Baru: Menyimpan File asli untuk dikirim ke Backend
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const defaultFormData = () => {
        return {
            user_id: 0,
            nama_pengguna: '', // Di backend ini adalah 'name'
            email: '',
            password: '',
            role: '',
            phone: '',
        };
    };

    const [formData, setFormData] = useState(defaultFormData());
    const location = useLocation();
    const { data, isEmployeeEdit } = location.state || {};
    const { user } = useAuth();

    // --- Otorisasi ---
    const isOwner = isEdit && data?.user_id === user?.user_id;
    const allRoles = Object.values(ROLES);
    const allowedRoles = useMemo(() => {
        if (isEmployeeEdit || (isEdit && !isEmployeeEdit)) return allRoles;
        return [ROLES.SUPER_ADMIN];
    }, [isEdit, isEmployeeEdit]);
    const { checkAccess, hasAccess } = useAuthorization(allowedRoles);

    // --- Handle Input Change ---
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    // --- Initial Load ---
    useEffect(() => {
        if (user?.role !== 'Super Admin' && !isOwner) {
            checkAccess(user?.role);
        }

        // Populate form jika Edit
        if (isEdit && data) {
            let roleValue = '';
            if (data.roles && Array.isArray(data.roles) && data.roles.length > 0) {
                // Gunakan optional chaining (?.) untuk keamanan
                roleValue = data.roles[0]?.name || '';
            } else if (data.role) {
                roleValue = data.role;
            }
            // Mapping data dari list ke form state
            setFormData({
                ...defaultFormData(),
                ...data,
                nama_pengguna: data.name || data.nama_pengguna, // Handle mapping nama
                role: roleValue
            });

            // Handle preview foto jika ada
            // Backend mungkin mengirim full URL atau path
            if (data.photo) {
                setSelectedAvatar(data.photo);
            }
        }
    }, [user, checkAccess, isEdit, data, isOwner]);

    if (user?.role !== 'Super Admin' && !isOwner && !hasAccess(user?.role)) return null;

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        if (!isSubmitting) setIsModalOpen(false);
    }

    const handlePencilClick = () => {
        fileInputRef.current?.click();
    };

    // --- Handle File Upload ---
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target?.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                showToast('Harap pilih file gambar saja!', 'error');
                return;
            }
            if (file.size > 2 * 1024 * 1024) { // Backend limit: 2MB
                showToast('Ukuran file maksimal 2MB', 'error');
                return;
            }

            // 1. Simpan File asli untuk dikirim ke API
            setSelectedFile(file);

            // 2. Buat Preview untuk UI
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                if (result) {
                    setSelectedAvatar(result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // --- Submit Logic ---
    const handleConfirmSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            let message = '';

            if (isEdit && !isEmployeeEdit) {
                // --- LOGIKA EDIT AKUN KE BACKEND ---

                // 1. Siapkan FormData
                const payload = new FormData();

                // 2. Masukkan field sesuai request validation Backend
                payload.append('name', formData.nama_pengguna); // Mapping: nama_pengguna -> name
                payload.append('role', formData.role);

                // 3. Masukkan foto HANYA jika user mengganti foto
                if (selectedFile) {
                    payload.append('photo', selectedFile);
                }

                // Catatan: Backend AccountUpdateRequest saat ini tidak memvalidasi email/password.
                // Jika ingin update email/pw, pastikan backend support field tersebut.
                // payload.append('email', formData.email); 

                // 4. Panggil Service
                await updateAkun(data.id || data.user_id, payload);
                message = 'Anda berhasil mengedit profil!';

            } else if (isEmployeeEdit) {
                // Logika edit pegawai (sesuai existing code)
                const dataToSubmit = { ...formData, avatarUrl: selectedAvatar || formData.photo };
                await updatePegawai(data.id, dataToSubmit);
                message = 'Anda berhasil mengedit karyawan!';
            } else {
                // Logika create akun (sesuai existing code / perlu update similar to edit)
                const dataToSubmit = { ...formData, avatarUrl: selectedAvatar || formData.photo };
                await createAkun(dataToSubmit);
                message = 'Anda berhasil membuat akun baru!';
            }

            handleCloseModal();
            navigate(-1, {
                state: { toastMessage: message }
            });

        } catch (err: any) {
            console.error(err);
            // Menampilkan pesan error dari backend jika ada
            const errorMsg = err.response?.data?.message || "Terjadi kesalahan saat menyimpan.";
            showToast(errorMsg, "error");
            setIsSubmitting(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validasi Frontend
        if (!isEmployeeEdit && (!formData.nama_pengguna || !formData.role)) {
            showToast("Username dan Role wajib diisi!", "error");
            return;
        }
        // Validasi Phone untuk Pegawai
        if (isEmployeeEdit && !formData.phone) {
            showToast("Nomor HP wajib diisi!", "error");
            return;
        }

        handleOpenModal();
    };

    // ... Return JSX (Tampilan UI sama seperti sebelumnya) ...
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
                                <div className="bg-gray-600 rounded-full w-[279px] h-[279px] shadow-lg overflow-hidden">
                                    {selectedAvatar ? (
                                        <img
                                            src={selectedAvatar}
                                            alt="Avatar Preview"
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        // Placeholder jika tidak ada gambar
                                        <div className="w-full h-full flex items-center justify-center text-white">No Image</div>
                                    )}
                                </div>
                                <input
                                    aria-label="avatar input"
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/png, image/jpeg, image/jpg, image/gif, image/webp" // Sesuai validasi backend
                                    className="hidden"
                                />
                                <PencilIcon
                                    className="w-20 h-20 absolute right-0 top-2/3 cursor-pointer hover:scale-110 transition-transform duration-200"
                                    onClick={handlePencilClick}
                                />
                            </div>
                        </div>

                        {isEmployeeEdit ? (
                            <div className="w-full flex gap-4">
                                <Input
                                    id="phone"
                                    judul="Nomor HP"
                                    placeholder="Nomor HP"
                                    value={formData.phone || ''}
                                    name="phone"
                                    onChange={handleChange}
                                    className="flex-1"
                                />
                                <ButtonConfirm
                                    text={isSubmitting ? "Menyimpan..." : "Selesai"}
                                    className="place-self-end mt-5"
                                    type="submit"
                                    disabled={isSubmitting}
                                />
                            </div>
                        ) : (
                            <div className="grid grid-rows-2 flex-1 w-full gap-8">
                                <div className="flex gap-4 w-full">
                                    <Input
                                        id="role"
                                        judul="Role"
                                        placeholder="Role"
                                        value={formData.role || ''}
                                        name="role"
                                        onChange={handleChange}
                                        className="w-1/2"
                                        readOnly={isEdit} // ReadOnly jika backend belum support edit email via endpoint ini
                                    />
                                    {/* Menggunakan name='nama_pengguna' di state, tapi nanti dikirim sebagai 'name' */}
                                    <Input
                                        id="username"
                                        judul="Username (Nama Lengkap)"
                                        placeholder="Username"
                                        value={formData.nama_pengguna || ''}
                                        name="nama_pengguna"
                                        onChange={handleChange}
                                        type="text"
                                        className="w-1/2"
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <Input
                                        id="email"
                                        judul="Email"
                                        placeholder="Email"
                                        value={formData.email || ''}
                                        name="email"
                                        onChange={handleChange}
                                        className="w-1/2"
                                        readOnly={isEdit} // ReadOnly jika backend belum support edit email via endpoint ini
                                    />
                                    <div className="w-1/2">
                                        {!isOwner && !isEdit && (
                                            <PasswordInput
                                                id="password"
                                                judul="Password"
                                                placeholder="Password"
                                                value={formData.password || ''}
                                                name="password"
                                                onChange={handleChange}
                                            // Password mungkin tidak diproses backend endpoint ini
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {!isEmployeeEdit &&
                        <ButtonConfirm
                            text={isSubmitting ? "Menyimpan..." : "Selesai"}
                            className="place-self-end mt-5"
                            type="submit"
                            disabled={isSubmitting}
                        />
                    }
                </form>

                <ConfirmModal 
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onConfirm={handleConfirmSubmit}
                    text={isEdit ? "Apa anda yakin mengedit akun ini?" : "Apa anda yakin membuat akun baru?"}
                />
            </div>
        </div>
    )
}