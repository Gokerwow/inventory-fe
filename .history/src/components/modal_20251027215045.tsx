// Simpan sebagai components/KontenOverlay.jsx

// Kita tidak butuh library eksternal, hanya React.
// Prop 'children' akan berisi isi modalnya (judul, tombol, dll.)
export default function KontenOverlay({ isOpen, children }) {
  
  // Jika tidak 'isOpen', jangan render apa-apa
  if (!isOpen) {
    return null;
  }

  return (
    // 1. Latar Belakang Overlay
    //    - 'absolute inset-0' membuatnya menutupi seluruh parent (yang 'relative')
    //    - 'z-40' agar berada di atas form, tapi di bawah topbar/sidebar jika perlu
    //    - 'bg-black/30' adalah background hitam transparan
    <div 
      className="absolute inset-0 z-40 flex items-center justify-center bg-black/30"
      aria-hidden="true"
    >
      
      {/* 2. Panel Konten (Kotak Putih) */}
      {/* Ini adalah kotak yang berisi konten Anda */}
      <div className="max-w-lg space-y-4 border bg-white p-8 shadow-xl rounded-lg z-50">
        {children}
      </div>

    </div>
  );
}