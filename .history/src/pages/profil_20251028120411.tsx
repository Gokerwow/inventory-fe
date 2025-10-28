import PfpExample from '../assets/Pfp Example.jpeg';

function Profil() {
    return (
        <div className="bg-white shadow-[0_0_10px_rgba(0,0,0,0.1)] h-full rounded-xl flex flex-col gap-4">
            <h1 className="text-3xl font-bold p-8 shadow-lg">Profil</h1>
            <div className="bg-white rounded-lg p-8">
                <div className='bg-amber-600'>
                    <div className='bg-white rounded-full w-70 h-70 flex items-center justify-center overflow-hidden shadow-lg'>
                        <img src={PfpExample} alt="Profile Picture" className='w-full' />
                    </div>
                    <div>
                        <h1>Biodata Diri</h1>
                        <h1>Biodata Diri</h1>
                        <h1>Biodata Diri</h1>
                        <h1>Biodata Diri</h1>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profil;