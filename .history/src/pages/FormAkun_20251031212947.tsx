import Input from "../components/input"
import PencilIcon from '../assets/pencil Icon.svg?react'
import ButtonConfirm from "../components/buttonConfirm"
import { useNavigate, useLocation } from "react-router-dom"
import { useEffect, useRef, useState, type ChangeEvent } from "react"
import Modal from "../components/modal"
import WarnButton from "../components/warnButton"
import simbaLogo from '../assets/Light Logo new 1.png'
import { PATHS } from "../Routes/path"
import { useAuthorization } from "../hooks/useAuthorization"
import { useAuth } from "../hooks/useAuth"


export default function TambahAkunPage({ isEdit }: { isEdit?: boolean }) {

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
            last_login: currentTimestamp,
            synced_at: currentTimestamp,
            created_at: currentTimestamp,
            updated_at: currentTimestamp,
        };
    };

    const [formData, setFormData] = useState(defaultFormData());

    const resetForm = () => {
        setFormData(defaultFormData());
    };


    // Auto-fill field yang tidak ada di input
    useEffect(() => {
        const currentTimestamp = new Date().toISOString();

        setFormData({
            user_id: Date.now(),
            sso_user_id: Date.now(),
            username: '',
            avatarUrl: '',
            email: '',
            password: '',
            role: '',
            last_login: currentTimestamp,
            synced_at: currentTimestamp,
            created_at: currentTimestamp,
            updated_at: currentTimestamp,
        });

    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
            updated_at: new Date().toISOString(),
        }));
    };

    const location = useLocation();
    const { data } = location.state || {};

    const { checkAccess, hasAccess } = useAuthorization('Super Admin');
    const { user } = useAuth()

    useEffect(() => {
        checkAccess(user?.role);
    }, [user, checkAccess]);

    if (!hasAccess(user?.role)) {
        return null;
    }

    const handleClick = () => {
        navigate(PATHS.AKUN.INDEX)
    }

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handlePencilClick = () => {
        fileInputRef.current?.click();
    };


    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target?.files?.[0];
        if (file) {
            // Validasi apakah file adalah gambar
            if (!file.type.startsWith('image/')) {
                alert('Harap pilih file gambar saja!');
                return;
            }

            // Validasi ukuran file (contoh: max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Ukuran file maksimal 5MB');
                return;
            }

            // Process file di sini
            console.log('File selected:', file);

            // Contoh: Preview gambar
            const reader = new FileReader();
            reader.onload = (e) => {
                if (typeof e.target?.result === 'string') {
                    setSelectedAvatar(e.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleConfirmSubmit = () => {
        // ← Logic submit dipindahkan ke sini
        console.log('Data barang:', formData);

        // Navigate dengan data
        navigate(PATHS.PENERIMAAN.TAMBAH, {
            state: {
                data: formData
            }
        });
        handleCloseModal();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Data barang:', formData);
        handleOpenModal()
    };

    return (
        <div className="min-h-full bg-[#F3F7FA]  shadow-md flex flex-col rounded-lg">
            <h1 className="bg-[#057CFF] p-8 text-2xl rounded-t-lg text-white text-center font-semibold shadow-lg">{isEdit ? 'EDIT PROFIL' : 'TAMBAH AKUN BARU'}</h1>

            <div className="p-8 flex flex-col flex-1 ">
                <form onSubmit={ handleSubmit } className="flex-1 flex flex-col justify-between">
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
                                            < img
                                                src={selectedAvatar}
                                                alt="Selected Avatar"
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        </div>
                                        :
                                        <div className="bg-gray-600 rounded-full w-[279px] h-[279px] shadow-lg">
                                        </div>
                                }
                                {/* Hidden file input */}
                                <input
                                    aria-label="avatar input"
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*" // Hanya menerima file gambar
                                    className="hidden"
                                />
                                {/* Pencil Icon yang bisa diklik */}
                                <PencilIcon
                                    className="w-20 h-20 absolute right-0 top-2/3 cursor-pointer hover:scale-110 transition-transform duration-200"
                                    onClick={handlePencilClick}
                                />
                            </div>
                        </div>
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
                                    placeholder="Password"
                                    value={isEdit ? data?.password : null}
                                    name="Password"
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
                    </div>
                    <ButtonConfirm
                        text="Selesai"
                        className="place-self-end"
                        type="submit"
                    />
                </form>

                <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                    <img src={simbaLogo} alt="" />
                    <h1 className="text-2xl text-center select-none">Apa anda yakin data yang di buat sudah benar?</h1>

                    <div className="flex gap-4 justify-end">
                        <ButtonConfirm
                            text="Iya"
                            onClick={handleConfirmSubmit}
                        />
                        <WarnButton
                            onClick={handleCloseModal}
                            text="Tidak"
                        />
                    </div>
                </Modal>
            </div>
        </div >
    )
}