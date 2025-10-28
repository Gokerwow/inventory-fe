import PfpExample from '../assets/Pfp Example.jpeg';

function Profil() {
    return (
        <div className="bg-white shadow-[0_0_10px_rgba(0,0,0,0.1)] h-full rounded-xl flex flex-col gap-4">
            <h1 className="text-3xl font-bold p-8 shadow-lg">Profil</h1>
            <div className="bg-white rounded-lg p-8">
                <div className='flex'>
                    <div className='p-10'>
                        <div className='bg-white rounded-full w-70 h-70 flex items-center justify-center overflow-hidden shadow-2xl'>
                            <img src={PfpExample} alt="Profile Picture" className='w-full' />
                        </div>
                    </div>
                    <div className='text-2xl p-8 gap-8'>
                        <h1 className='font-bold'>Biodata Diri</h1>
                        <table className='border-separate border-spacing-y-8'>
                            <tr>
                                <td width="100">Username</td>
                                <td className='pl-8'>: TimPPK</td>
                            </tr>
                            <tr>
                                <td>Role</td>
                                <td className='pl-8'>: Tim PPK</td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td className='pl-8'>: ppkbalung@gmail.com</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profil;