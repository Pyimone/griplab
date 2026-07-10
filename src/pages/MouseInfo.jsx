import Navbar from "../components/Navbar";

export default function MouseInfo() {
  return (
    <div className="min-h-screen bg-[#050505] text-white page-fade">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-14">
        <section className="text-center">

          <h1 className="mt-6 text-6xl font-extrabold tracking-[-0.06em] max-md:text-4xl">
            Informasi Seputar Mouse
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-zinc-300">
            Mouse adalah perangkat input yang digunakan untuk menggerakkan
            kursor, memilih objek, melakukan klik, dan membantu pengguna
            berinteraksi dengan komputer secara lebih cepat dan efisien.
          </p>
        </section>

        <section className="mt-12 grid grid-cols-2 gap-6 max-md:grid-cols-1">
          <article className="card-motion rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
            <h2 className="text-3xl font-extrabold">Fungsi Mouse</h2>
            <p className="mt-4 leading-relaxed text-zinc-300">
              Mouse berfungsi sebagai alat navigasi utama pada komputer. Dengan
              mouse, pengguna dapat menggerakkan pointer, memilih menu,
              menjalankan perintah, melakukan drag and drop, serta mengontrol
              objek visual pada layar.
            </p>
          </article>

          <article className="card-motion rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
            <h2 className="text-3xl font-extrabold">Manfaat Mouse</h2>
            <p className="mt-4 leading-relaxed text-zinc-300">
              Penggunaan mouse membantu pekerjaan menjadi lebih cepat, terutama
              pada aktivitas yang membutuhkan navigasi visual seperti desain,
              editing, pemrograman, browsing, dan permainan berbasis target.
            </p>
          </article>
        </section>

        <section className="mt-6 card-motion rounded-3xl border border-zinc-800 bg-[linear-gradient(180deg,#111111,#070707)] p-8">
          <h2 className="text-3xl font-extrabold">Mouse dalam Pengujian Performa</h2>
          <p className="mt-4 leading-relaxed text-zinc-300">
            Dalam penelitian ini, mouse digunakan sebagai alat utama untuk
            mengukur performa pengguna. Performa tersebut dilihat dari kecepatan
            klik target pada Aim Trainer dan kecepatan respon terhadap perubahan
            stimulus pada Reaction Time.
          </p>
        </section>
      </main>
    </div>
  );
}