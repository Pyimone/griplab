import Navbar from "../components/Navbar";

export default function MouseSpecs() {
  const specs = [
    {
      title: "DPI",
      text: "DPI menentukan sensitivitas mouse. DPI tinggi membuat kursor bergerak lebih cepat, sedangkan DPI rendah memberikan kontrol yang lebih stabil.",
    },
    {
      title: "Polling Rate",
      text: "Polling rate menunjukkan seberapa sering mouse mengirim data ke komputer. Semakin tinggi nilainya, input terasa lebih responsif.",
    },
    {
      title: "Sensor Mouse",
      text: "Sensor membaca pergerakan mouse. Sensor yang baik membantu gerakan kursor menjadi akurat dan konsisten.",
    },
    {
      title: "Berat Mouse",
      text: "Mouse ringan mudah digerakkan dengan cepat, sedangkan mouse lebih berat biasanya terasa stabil.",
    },
    {
      title: "Ukuran Mouse",
      text: "Ukuran mouse perlu disesuaikan dengan ukuran tangan agar penggunaan tetap nyaman.",
    },
    {
      title: "Bentuk Mouse",
      text: "Bentuk mouse memengaruhi posisi tangan dan dapat mendukung jenis grip tertentu.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white page-fade">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-14">
        <section className="text-center">

          <h1 className="mt-6 text-6xl font-extrabold tracking-[-0.06em] max-md:text-4xl">
            Spesifikasi Mouse yang Berpengaruh
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-zinc-300">
            Selain teknik grip, spesifikasi mouse juga dapat memengaruhi
            kenyamanan, kecepatan, dan akurasi pengguna saat melakukan
            pengujian.
          </p>
        </section>

        <section className="mt-12 grid grid-cols-3 gap-5 max-lg:grid-cols-2 max-md:grid-cols-1">
          {specs.map((item) => (
            <article
              key={item.title}
              className="card-motion rounded-3xl border border-zinc-800 bg-zinc-900 p-7 transition hover:-translate-y-1 hover:bg-zinc-800"
            >
              <h2 className="text-2xl font-extrabold">{item.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-zinc-300">
                {item.text}
              </p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}