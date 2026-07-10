import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api";

export default function StartTest() {
  const [showGripOptions, setShowGripOptions] = useState(false);
  const [selectedGrip, setSelectedGrip] = useState("");
  const [respondentName, setRespondentName] = useState("");
  const [respondentAge, setRespondentAge] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function createRespondent() {
    if (!respondentName.trim()) {
      alert("Nama responden wajib diisi");
      return null;
    }

    if (!respondentAge || Number(respondentAge) <= 0) {
      alert("Umur responden wajib diisi dengan benar");
      return null;
    }

    try {
      setLoading(true);

      const response = await api.post("/respondents", {
        name: respondentName,
        age: Number(respondentAge),
      });

      localStorage.setItem("respondentId", response.data.respondentId);
      localStorage.setItem(
        "respondentData",
        JSON.stringify({
          name: respondentName,
          age: Number(respondentAge),
        })
      );

      return response.data.respondentId;
    } catch (error) {
      alert("Gagal menyimpan data responden ke backend");
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function handleStart() {
    if (!showGripOptions) {
      if (!respondentName.trim()) {
        alert("Nama responden wajib diisi");
        return;
      }

      if (!respondentAge || Number(respondentAge) <= 0) {
        alert("Umur responden wajib diisi dengan benar");
        return;
      }

      localStorage.removeItem("respondentId");
      localStorage.removeItem("respondentData");
      localStorage.removeItem("mouseGripResults");
      localStorage.removeItem("currentGrip");

      setShowGripOptions(true);
      return;
    }

    if (!selectedGrip) {
      alert("Pilih grip dulu: Palm atau Claw");
      return;
    }

    const respondentId = await createRespondent();

    if (!respondentId) return;

    localStorage.removeItem("mouseGripResults");
    localStorage.setItem("currentGrip", selectedGrip);

    navigate("/aim-trainer");
  }

  function resetForm() {
    localStorage.removeItem("respondentId");
    localStorage.removeItem("respondentData");
    localStorage.removeItem("mouseGripResults");
    localStorage.removeItem("currentGrip");

    setRespondentName("");
    setRespondentAge("");
    setSelectedGrip("");
    setShowGripOptions(false);
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white page-fade">
      <Navbar />

      <main className="mx-auto flex min-h-[calc(100vh-64px)] max-w-5xl items-center px-6 py-14">
        <section className="grid w-full grid-cols-[0.9fr_1.1fr] gap-8 max-lg:grid-cols-1">
          <div className="fade-right">
            <h1 className="text-6xl font-extrabold leading-tight tracking-[-0.06em] max-md:text-4xl">
              Mulai Pengujian Grip
            </h1>

            <p className="mt-5 leading-relaxed text-zinc-300">
              Isi data responden, pilih grip pertama, lalu lakukan pengujian Aim
              Trainer dan Reaction Time. Setelah grip pertama selesai, sistem
              akan mengarahkan ke pengujian grip berikutnya.
            </p>

            {showGripOptions && (
              <div className="mt-7 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 fade-up delay-200">
                <p className="text-sm text-zinc-400">Data responden</p>
                <h3 className="mt-1 text-xl font-extrabold">
                  {respondentName}
                </h3>
                <p className="mt-1 text-sm text-zinc-400">
                  Umur: {respondentAge} tahun
                </p>
              </div>
            )}
          </div>

          <div className="scale-in rounded-[28px] border border-zinc-800 bg-zinc-900 p-7 shadow-2xl">
            {!showGripOptions ? (
              <>
                <h2 className="fade-up text-center text-3xl font-extrabold">
                  Data Responden
                </h2>

                <p className="fade-up delay-100 mt-2 text-center text-sm text-zinc-400">
                  Isi nama dan umur sebelum memulai pengujian.
                </p>

                <div className="mt-7 space-y-4">
                  <div className="fade-up delay-100">
                    <label className="mb-2 block text-sm font-bold text-zinc-300">
                      Nama
                    </label>
                    <input
                      type="text"
                      value={respondentName}
                      onChange={(e) => setRespondentName(e.target.value)}
                      placeholder="Masukkan nama responden"
                      className="w-full rounded-xl border border-zinc-700 bg-[#050505] px-4 py-3 text-white outline-none transition duration-300 focus:border-green-500 focus:shadow-lg focus:shadow-green-500/10"
                    />
                  </div>

                  <div className="fade-up delay-200">
                    <label className="mb-2 block text-sm font-bold text-zinc-300">
                      Umur
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={respondentAge}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setRespondentAge(value);
                      }}
                      placeholder="Masukkan umur responden"
                      className="w-full rounded-xl border border-zinc-700 bg-[#050505] px-4 py-3 text-white outline-none transition duration-300 focus:border-green-500 focus:shadow-lg focus:shadow-green-500/10"
                    />
                  </div>
                </div>

                <button
                  onClick={handleStart}
                  disabled={loading}
                  className="fade-up delay-300 mt-6 w-full rounded-xl bg-green-500 px-9 py-4 text-lg font-extrabold text-white transition duration-300 hover:-translate-y-1 hover:bg-green-600 hover:shadow-xl hover:shadow-green-500/20 disabled:cursor-not-allowed disabled:bg-zinc-700"
                >
                  {loading ? "Menyimpan..." : "Lanjut Pilih Grip"}
                </button>
              </>
            ) : (
              <>
                <h2 className="fade-up text-center text-3xl font-extrabold">
                  Pilih Grip
                </h2>

                <p className="fade-up delay-100 mt-2 text-center text-sm text-zinc-400">
                  Pilih grip pertama yang ingin diuji.
                </p>

                <div className="mt-7 grid gap-4">
                  <button
                    onClick={() => setSelectedGrip("Palm")}
                    className={
                      selectedGrip === "Palm"
                        ? "scale-in rounded-2xl border border-green-500 bg-green-500 p-6 text-left text-white shadow-xl shadow-green-500/25 transition duration-300 hover:-translate-y-1"
                        : "scale-in rounded-2xl border border-zinc-800 bg-[#050505] p-6 text-left text-white transition duration-300 hover:-translate-y-1 hover:border-green-500 hover:bg-zinc-800 hover:shadow-xl hover:shadow-green-500/10"
                    }
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-2xl font-extrabold">Palm Grip</h3>

                      {selectedGrip === "Palm" && (
                        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
                          Dipilih
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm text-zinc-200">
                      Lebih santai, stabil, dan cocok untuk penggunaan lama.
                    </p>
                  </button>

                  <button
                    onClick={() => setSelectedGrip("Claw")}
                    className={
                      selectedGrip === "Claw"
                        ? "scale-in delay-100 rounded-2xl border border-blue-500 bg-blue-500 p-6 text-left text-white shadow-xl shadow-blue-500/25 transition duration-300 hover:-translate-y-1"
                        : "scale-in delay-100 rounded-2xl border border-zinc-800 bg-[#050505] p-6 text-left text-white transition duration-300 hover:-translate-y-1 hover:border-blue-500 hover:bg-zinc-800 hover:shadow-xl hover:shadow-blue-500/10"
                    }
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-2xl font-extrabold">Claw Grip</h3>

                      {selectedGrip === "Claw" && (
                        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
                          Dipilih
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm text-zinc-200">
                      Lebih responsif, agresif, dan cocok untuk klik cepat.
                    </p>
                  </button>
                </div>

                <div className="fade-up delay-200 mt-5 rounded-2xl border border-zinc-800 bg-[#050505] p-4 text-center">
                  <p className="text-sm text-zinc-400">Grip yang dipilih</p>
                  <h3
                    className={
                      selectedGrip === "Claw"
                        ? "mt-1 text-2xl font-extrabold text-blue-400"
                        : "mt-1 text-2xl font-extrabold text-green-500"
                    }
                  >
                    {selectedGrip ? `${selectedGrip} Grip` : "Belum memilih"}
                  </h3>
                </div>

                <button
                  onClick={handleStart}
                  className={
                    selectedGrip
                      ? "mt-5 w-full rounded-xl bg-green-500 px-9 py-4 text-lg font-extrabold text-white transition duration-300 hover:-translate-y-1 hover:bg-green-600 hover:shadow-xl hover:shadow-green-500/20"
                      : "mt-5 w-full rounded-xl bg-zinc-700 px-9 py-4 text-lg font-extrabold text-zinc-300 transition"
                  }
                >
                  {selectedGrip
                    ? `Mulai dengan ${selectedGrip} Grip`
                    : "Pilih Grip Terlebih Dahulu"}
                </button>

                <button
                  onClick={resetForm}
                  className="mt-3 w-full rounded-xl bg-zinc-800 px-6 py-3 font-bold text-white transition duration-300 hover:-translate-y-1 hover:bg-zinc-700"
                >
                  Isi Ulang Data
                </button>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}