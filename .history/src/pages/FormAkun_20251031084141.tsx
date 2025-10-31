import Input from "../components/input"
import PencilIcon from '../assets/pencil Icon.svg?react'
import ButtonConfirm from "../components/buttonConfirm"
import { useNavigate } from "react-router-dom"
import { useRef, useState } from "react"
import Modal from "../components/modal"
import WarnButton from "../components/warnButton"
import simbaLogo from '../assets/Light Logo new 1.png'
import { useAuth } from "../hooks/useAuth"
import { PATHS } from "../Routes/path"


export default function TambahAkunPage({ isEdit }: { isEdit?: boolean }) {

    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
    const navigate = useNavigate()
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useAuth()


    const handleClick = () => {
        navigate(PATHS.AKUN.INDEX)
    }

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handlePencilClick = () => {
        // Trigger click pada hidden file input
        fileInputRef.current?.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
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

    return (
        <div className="min-h-full bg-[#F3F7FA]  shadow-md flex flex-col">
            <h1 className="bg-[#057CFF] p-8 text-2xl rounded-t-lg text-white text-center font-semibold shadow-lg">{isEdit ? 'EDIT PROFIL' : 'TAMBAH AKUN BARU'}</h1>

            <div className="p-8 flex flex-col justify-between flex-1">
                <div className="flex flex-col items-center">
                    <div className="py-10">
                        <div className="relative">
                            {isEdit ?
                                <div className="bg-gray-600 rounded-full w-[279px] h-[279px] shadow-lg">
                                    <img
                                        src={user?.avatarUrl}
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
                                value={ isEdit ? user?.role : ''}
                            />
                            <Input
                                id="username"
                                judul="Username"
                                placeholder="Username"
                            />
                        </div>
                        <div className="flex flex-col gap-4">
                            <Input
                                id="password"
                                judul="Password"
                                placeholder="Password"
                            />
                            <Input
                                id="email"
                                judul="Email"
                                placeholder="Email"
                            />
                        </div>
                    </div>
                </div>
                <ButtonConfirm
                    text="Selesai"
                    className="place-self-end"
                    onClick={handleOpenModal}
                />

                <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                    <img src={simbaLogo} alt="" />
                    <h1 className="text-2xl text-center select-none">Apa anda yakin data yang di buat sudah benar?</h1>

                    <div className="flex gap-4 justify-end">
                        <ButtonConfirm
                            text="Iya"
                            to='/akun'
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