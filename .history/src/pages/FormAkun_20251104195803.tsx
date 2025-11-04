import Input from "../components/input"
import PencilIcon from '../assets/pencil Icon.svg?react'
import ButtonConfirm from "../components/buttonConfirm"
import { useNavigate, useLocation } from "react-router-dom"
import React, { useEffect, useRef, useState, type ChangeEvent } from "react"
import Modal from "../components/modal"
import { PATHS } from "../Routes/path"
import { useAuthorization } from "../hooks/useAuthorization"
import { useAuth } from "../hooks/useAuth"


export default function TambahAkunPage({ isEdit = false }: { isEdit?: boolean }) {

    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
    const navigate = useNavigate()
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const defaultFormData = () => {
        const currentTimestamp = new Date().toISOString();
        return {
            user_id: Date.now(),
            sso_user_id: Date.now(),
            username: '',
            avatarUrl: '/default-avatar.png',
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

    // Check apakah yang diedit adalah karyawan

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
            updated_at: new Date().toISOString(),
        }));
    };

    // const { checkAccess, hasAccess } = useAuthorization('Super Admin');
    // const { user } = useAuth()

    // useEffect(() => {
    //     checkAccess(user?.role);
    // }, [user, checkAccess]);

    // if (!hasAccess(user?.role)) {
    //     return null;
    // }

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handlePencilClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target?.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Harap pilih file gambar saja!');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                alert('Ukuran file maksimal 5MB');
                return;
            }

            console.log('File selected:', file);

            const reader = new FileReader();
            reader.onload = (e) => {
                if (typeof e.target?.result === 'string') {
                    setSelectedAvatar(e.target.result);
                    setFormData(prevState => ({
                        ...prevState,
                        avatarUrl: e.target?.result as string
                    }));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleConfirmSubmit = () => {
        console.log('Data barang:', formData);

        navigate(PATHS.AKUN.INDEX, {
            state: {
                data: formData,
                toastMessage: isEdit ? 'Anda berhasil mengedit akun!' : 'Anda berhasil membuat akun!'
            }
        });
        handleCloseModal();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Data barang:', formData);
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
                                {isEdit ?
                                    <div className="bg-gray-600 rounded-full w-[279px] h-[279px] shadow-lg">
                                        <img
                                            src={data?.avatarUrl}
                                            alt="Selected Avatar"
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    </div>
                                    :
                                    selectedAvatar ?
                                        <div className="bg-gray-600 rounded-full w-[279px] h-[279px] shadow-lg">
                                            <img
                                                src={selectedAvatar}
                                                alt="Selected Avatar"
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        </div>
                                        :
                                        <div className="bg-gray-600 rounded-full w-[279px] h-[279px] shadow-lg">
                                        </div>
                                }
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

                        {/* Conditional rendering berdasarkan apakah edit karyawan atau bukan */}
                        {isEmployeeEdit ? (
                            // Tampilan untuk edit karyawan - hanya nomor HP
                            <div className="w-full flex bg-amber-700">
                                <Input
                                    id="phone"
                                    judul="Nomor HP"
                                    placeholder="Nomor HP"
                                    value={data?.phone || ''}
                                    name="phone"
                                    onChange={handleChange}
                                />
                                <ButtonConfirm
                                    text="Selesai"
                                    className="place-self-end mt-5"
                                    type="submit"
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
                                        value={isEdit ? data?.role : null}
                                        name="role"
                                        onChange={handleChange}
                                    />
                                    <Input
                                        id="username"
                                        judul="Username"
                                        placeholder="Username"
                                        value={isEdit ? data?.username : null}
                                        name="username"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex flex-col gap-4">
                                    <Input
                                        id="password"
                                        judul="Password"
                                        placeholder="password"
                                        value={isEdit ? data?.password : null}
                                        name="password"
                                        onChange={handleChange}
                                    />
                                    <Input
                                        id="email"
                                        judul="Email"
                                        placeholder="Email"
                                        value={isEdit ? data?.email : null}
                                        name="email"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <ButtonConfirm
                        text="Selesai"
                        className="place-self-end mt-5"
                        type="submit"
                    />
                </form>

                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onConfirm={handleConfirmSubmit}
                    text={isEdit ? "Apa anda yakin mengedit akun ini?" : "Apa anda yakin membuat akun baru?"}
                >
                </Modal>
            </div>
        </div>
    )
}