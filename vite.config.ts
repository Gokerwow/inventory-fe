import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
  tailwindcss(),
  svgr()
  ],
  server: {
    watch: {
      // Gunakan polling untuk mendeteksi perubahan file
      usePolling: true,
    },
    proxy: {
      // Jika ada request ke frontend Anda
      // yang dimulai dengan '/api',
      // teruskan ke backend Laravel.
      '/api': {
        target: 'http://127.0.0.1:8001', // Alamat backend Laravel Anda
        changeOrigin: true, // Ini wajib untuk memberi tahu Laravel asalnya 'benar'
        secure: false, // Nonaktifkan verifikasi SSL (berguna untuk http)
      }
    }
  }
})
