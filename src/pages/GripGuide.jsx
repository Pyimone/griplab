import Navbar from "../components/Navbar";

export default function GripGuide() {
  return (
    <div className="min-h-screen bg-[#050505] text-white page-fade">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-14">
        <section className="text-center">

          <h1 className="mt-6 text-6xl font-extrabold tracking-[-0.06em] max-md:text-4xl">
            Palm Grip dan Claw Grip
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-zinc-300">
            Mouse grip adalah cara pengguna memegang mouse. Perbedaan teknik
            grip dapat memengaruhi kenyamanan, stabilitas, akurasi, dan kecepatan
            respon saat menggunakan mouse.
          </p>
        </section>

        <section className="mt-12 grid grid-cols-2 gap-6 max-md:grid-cols-1">
          <article className="card-motion rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
            <span className="rounded-full bg-green-500/10 px-4 py-2 text-xs font-bold text-green-500">
              Palm Grip
            </span>

            <h2 className="mt-5 text-4xl font-extrabold">Palm Grip</h2>

            <p className="mt-4 leading-relaxed text-zinc-300">
              Palm Grip adalah teknik memegang mouse dengan telapak tangan
              menempel hampir penuh pada permukaan mouse. Grip ini memberikan
              rasa nyaman dan stabil karena tangan memiliki tumpuan yang luas.
            </p>

            <ul className="mt-6 space-y-3 text-zinc-300">
              <li>• Cocok untuk penggunaan dalam waktu lama.</li>
              <li>• Memberikan kontrol yang lebih stabil.</li>
              <li>• Umumnya nyaman untuk mouse berukuran sedang sampai besar.</li>
              <li>• Cocok untuk pengguna yang mengutamakan kenyamanan.</li>
            </ul>
          </article>

          <article className="card-motion rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
            <span className="rounded-full bg-blue-500/10 px-4 py-2 text-xs font-bold text-blue-400">
              Claw Grip
            </span>

            <h2 className="mt-5 text-4xl font-extrabold">Claw Grip</h2>

            <p className="mt-4 leading-relaxed text-zinc-300">
              Claw Grip adalah teknik memegang mouse dengan posisi jari
              melengkung seperti cakar. Grip ini membuat jari lebih aktif dan
              sering digunakan untuk klik cepat serta gerakan presisi.
            </p>

            <ul className="mt-6 space-y-3 text-zinc-300">
              <li>• Cocok untuk klik cepat.</li>
              <li>• Mendukung gerakan kecil yang presisi.</li>
              <li>• Sering digunakan dalam aktivitas kompetitif.</li>
              <li>• Cocok untuk pengguna yang mengutamakan kecepatan respon.</li>
            </ul>
          </article>
        </section>
      </main>
    </div>
  );
}