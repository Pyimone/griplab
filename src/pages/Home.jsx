import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-14 page-fade">
        <section className="grid min-h-[calc(100vh-160px)] grid-cols-[1.1fr_0.9fr] items-center gap-10 max-lg:grid-cols-1">
          <div className="fade-right">
            <h1 className="max-w-4xl text-7xl font-extrabold leading-[0.95] tracking-[-0.06em] max-md:text-5xl">
              Aplikasi Pengujian Performa Mouse Grip
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-300">
              GripLab adalah aplikasi berbasis web untuk membandingkan performa
              penggunaan mouse berdasarkan dua jenis grip, yaitu Palm Grip dan
              Claw Grip. Pengujian dilakukan melalui Aim Trainer dan Reaction
              Time untuk melihat kecepatan respon serta akurasi pengguna.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/start-test"
                className="rounded-xl bg-green-500 px-7 py-4 font-extrabold text-white transition hover:-translate-y-1 hover:bg-green-600 hover:shadow-xl hover:shadow-green-500/20"
              >
                Mulai Pengujian
              </Link>
            </div>
          </div>

          <div className="fade-left rounded-[32px] border border-zinc-800 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.18),transparent_40%),linear-gradient(180deg,#111111,#070707)] p-8 shadow-2xl float-soft">
            <h2 className="text-3xl font-extrabold">Informasi Aplikasi</h2>

            <div className="mt-7 space-y-4">
              <Link
                to="/mouse-info"
                className="card-motion block rounded-2xl border border-zinc-800 bg-[#050505] p-5"
              >
                <span className="text-sm font-bold text-green-500">01</span>
                <h3 className="mt-2 text-xl font-bold">Informasi Mouse</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  Penjelasan mengenai mouse sebagai perangkat input, fungsi
                  mouse, manfaat, dan perannya dalam penggunaan komputer.
                </p>
              </Link>

              <Link
                to="/grip-guide"
                className="card-motion block rounded-2xl border border-zinc-800 bg-[#050505] p-5"
              >
                <span className="text-sm font-bold text-green-500">02</span>
                <h3 className="mt-2 text-xl font-bold">
                  Apa itu Palm Grip dan Claw Grip?
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  Penjelasan karakteristik Palm Grip dan Claw Grip, termasuk
                  kelebihan serta perbedaannya saat digunakan.
                </p>
              </Link>

              <Link
                to="/mouse-specs"
                className="card-motion block rounded-2xl border border-zinc-800 bg-[#050505] p-5"
              >
                <span className="text-sm font-bold text-green-500">03</span>
                <h3 className="mt-2 text-xl font-bold">Spesifikasi Mouse</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  Informasi mengenai DPI, polling rate, sensor, berat, ukuran,
                  dan bentuk mouse yang dapat memengaruhi performa pengguna.
                </p>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}