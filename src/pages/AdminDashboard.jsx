import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function AdminDashboard() {
  const [respondents, setRespondents] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  const navigate = useNavigate();

  async function fetchData() {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      navigate("/admin-login");
      return;
    }

    try {
      setLoading(true);

      const [respondentsResponse, resultsResponse] = await Promise.all([
        api.get("/admin/respondents", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        api.get("/admin/results", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      setRespondents(respondentsResponse.data);
      setResults(resultsResponse.data);
    } catch (error) {
      alert("Sesi admin tidak valid. Silakan login ulang.");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      navigate("/admin-login");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin-login");
  }

  async function handleClearData() {
    const token = localStorage.getItem("adminToken");

    const confirmClear = window.confirm(
      "Yakin ingin menghapus SEMUA data responden dan hasil pengujian?"
    );

    if (!confirmClear) return;

    try {
      setClearing(true);

      await api.delete("/admin/clear-data", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRespondents([]);
      setResults([]);

      alert("Semua data berhasil dihapus.");
    } catch (error) {
      alert("Gagal menghapus semua data.");
    } finally {
      setClearing(false);
    }
  }

  async function handleDeleteRespondent(id, name) {
    const token = localStorage.getItem("adminToken");

    const confirmDelete = window.confirm(
      `Yakin ingin menghapus responden "${name}" beserta semua hasil test-nya?`
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/admin/respondents/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchData();
      alert("Data responden berhasil dihapus.");
    } catch (error) {
      alert("Gagal menghapus data responden.");
    }
  }

  async function handleDeleteResult(respondentId, resultId, name, test, grip) {
    const token = localStorage.getItem("adminToken");

    const confirmDelete = window.confirm(
      `Yakin ingin menghapus hasil "${test}" ${grip} milik ${name}?`
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/admin/results/${respondentId}/${resultId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchData();
      alert("Hasil pengujian berhasil dihapus.");
    } catch (error) {
      alert("Gagal menghapus hasil pengujian.");
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <nav className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 px-6 py-4 max-md:flex-col max-md:items-start">
          <div>
            <h1 className="text-2xl font-extrabold">
              Grip<span className="text-green-500">Lab</span> Admin
            </h1>
            <p className="text-sm text-zinc-400">
              Dashboard data responden dan hasil pengujian.
            </p>
          </div>

          <div className="flex gap-3 max-sm:w-full max-sm:flex-col">
            <button
              onClick={handleClearData}
              disabled={clearing}
              className="rounded-xl bg-yellow-600 px-4 py-3 text-sm font-bold transition hover:bg-yellow-700 disabled:cursor-not-allowed disabled:bg-zinc-700"
            >
              {clearing ? "Clearing..." : "Clear All Data"}
            </button>

            <button
              onClick={handleLogout}
              className="rounded-xl bg-red-500 px-4 py-3 text-sm font-bold transition hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </nav>

        {loading ? (
          <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center text-zinc-300">
            Loading data...
          </div>
        ) : (
          <>
            <section className="mt-8 grid grid-cols-3 gap-5 max-md:grid-cols-1">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <p className="text-sm text-zinc-400">Total Responden</p>
                <h2 className="mt-3 text-4xl font-extrabold">
                  {respondents.length}
                </h2>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <p className="text-sm text-zinc-400">Total Hasil Test</p>
                <h2 className="mt-3 text-4xl font-extrabold">
                  {results.length}
                </h2>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-green-500 p-6">
                <p className="text-sm text-white/90">Database</p>
                <h2 className="mt-3 text-4xl font-extrabold">MongoDB</h2>
              </div>
            </section>

            <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <div className="flex items-center justify-between gap-3 max-sm:flex-col max-sm:items-start">
                <h2 className="text-2xl font-extrabold">Data Responden</h2>
                <p className="text-sm text-zinc-400">
                  Total: {respondents.length} responden
                </p>
              </div>

              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-400">
                      <th className="py-3 pr-4">No</th>
                      <th className="py-3 pr-4">Nama</th>
                      <th className="py-3 pr-4">Umur</th>
                      <th className="py-3 pr-4">Jumlah Hasil</th>
                      <th className="py-3 pr-4">Tanggal</th>
                      <th className="py-3 pr-4">Aksi</th>
                    </tr>
                  </thead>

                  <tbody>
                    {respondents.length === 0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="py-6 text-center text-zinc-500"
                        >
                          Belum ada data responden.
                        </td>
                      </tr>
                    ) : (
                      respondents.map((item, index) => (
                        <tr
                          key={item._id}
                          className="border-b border-zinc-800 text-zinc-200"
                        >
                          <td className="py-3 pr-4">{index + 1}</td>
                          <td className="py-3 pr-4 font-bold">{item.name}</td>
                          <td className="py-3 pr-4">{item.age || "-"} tahun</td>
                          <td className="py-3 pr-4">
                            {item.results?.length || 0}
                          </td>
                          <td className="py-3 pr-4">
                            {new Date(item.createdAt).toLocaleString("id-ID")}
                          </td>
                          <td className="py-3 pr-4">
                            <button
                              onClick={() =>
                                handleDeleteRespondent(item._id, item.name)
                              }
                              className="rounded-lg bg-red-500 px-3 py-2 text-xs font-bold text-white transition hover:bg-red-600"
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <div className="flex items-center justify-between gap-3 max-sm:flex-col max-sm:items-start">
                <h2 className="text-2xl font-extrabold">Hasil Pengujian</h2>
                <p className="text-sm text-zinc-400">
                  Total: {results.length} hasil test
                </p>
              </div>

              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[960px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-400">
                      <th className="py-3 pr-4">No</th>
                      <th className="py-3 pr-4">Nama</th>
                      <th className="py-3 pr-4">Umur</th>
                      <th className="py-3 pr-4">Grip</th>
                      <th className="py-3 pr-4">Test</th>
                      <th className="py-3 pr-4">Score</th>
                      <th className="py-3 pr-4">Accuracy</th>
                      <th className="py-3 pr-4">Best</th>
                      <th className="py-3 pr-4">Tanggal</th>
                      <th className="py-3 pr-4">Aksi</th>
                    </tr>
                  </thead>

                  <tbody>
                    {results.length === 0 ? (
                      <tr>
                        <td
                          colSpan="10"
                          className="py-6 text-center text-zinc-500"
                        >
                          Belum ada hasil pengujian.
                        </td>
                      </tr>
                    ) : (
                      results.map((item, index) => (
                        <tr
                          key={item.resultId}
                          className="border-b border-zinc-800 text-zinc-200"
                        >
                          <td className="py-3 pr-4">{index + 1}</td>
                          <td className="py-3 pr-4 font-bold">{item.name}</td>
                          <td className="py-3 pr-4">{item.age || "-"} tahun</td>
                          <td className="py-3 pr-4">
                            <span
                              className={
                                item.grip === "Palm"
                                  ? "rounded-full bg-green-500/10 px-3 py-1 text-xs font-bold text-green-500"
                                  : "rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-400"
                              }
                            >
                              {item.grip}
                            </span>
                          </td>
                          <td className="py-3 pr-4">{item.test}</td>
                          <td className="py-3 pr-4">{item.score} ms</td>
                          <td className="py-3 pr-4">
                            {item.accuracy ? `${item.accuracy}%` : "-"}
                          </td>
                          <td className="py-3 pr-4">
                            {item.best ? `${item.best} ms` : "-"}
                          </td>
                          <td className="py-3 pr-4">
                            {new Date(item.createdAt).toLocaleString("id-ID")}
                          </td>
                          <td className="py-3 pr-4">
                            <button
                              onClick={() =>
                                handleDeleteResult(
                                  item.respondentId,
                                  item.resultId,
                                  item.name,
                                  item.test,
                                  item.grip
                                )
                              }
                              className="rounded-lg bg-red-500 px-3 py-2 text-xs font-bold text-white transition hover:bg-red-600"
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}