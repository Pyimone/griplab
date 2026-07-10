import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function AdminLogin() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/login", {
        username,
        password,
      });

      localStorage.setItem("adminToken", response.data.token);
      localStorage.setItem("adminUser", JSON.stringify(response.data.user));

      navigate("/admin-dashboard");
    } catch (error) {
      setError("Login gagal. Username atau password salah.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-white">
      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-[-0.04em]">
            Admin Login
          </h1>
          <p className="mt-3 text-sm text-zinc-400">
            Masuk untuk melihat data responden dan hasil pengujian.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-7 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-bold text-zinc-300">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-[#050505] px-4 py-3 text-white outline-none transition focus:border-green-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-zinc-300">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-[#050505] px-4 py-3 text-white outline-none transition focus:border-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-green-500 px-5 py-4 font-extrabold transition hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-zinc-700"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-zinc-500">
          Default admin: admin / admin123
        </p>
      </div>
    </div>
  );
}