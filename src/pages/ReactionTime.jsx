import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import api from "../api";

export default function ReactionTime() {
  const navigate = useNavigate();
  const maxAttempts = 5;
  const selectedGrip = localStorage.getItem("currentGrip");
  const respondentId = localStorage.getItem("respondentId");

  const [gameState, setGameState] = useState("idle");
  const [startTime, setStartTime] = useState(null);
  const [reactionTime, setReactionTime] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);
  const [results, setResults] = useState([]);
  const [saveStatus, setSaveStatus] = useState("");

  function saveResultToLocal(data) {
    const oldData = JSON.parse(localStorage.getItem("mouseGripResults")) || [];
    localStorage.setItem("mouseGripResults", JSON.stringify([...oldData, data]));
  }

  async function saveResultToBackend(data) {
    if (!respondentId) {
      setSaveStatus("Data responden belum ditemukan.");
      return;
    }

    try {
      await api.post(`/respondents/${respondentId}/results`, data);
      setSaveStatus("Hasil Reaction Time berhasil disimpan ke database.");
    } catch (error) {
      setSaveStatus("Gagal menyimpan hasil Reaction Time ke database.");
    }
  }

  function startGame() {
    if (!selectedGrip) {
      alert("Pilih grip dulu dari Home.");
      navigate("/");
      return;
    }

    if (!respondentId) {
      alert("Isi data responden terlebih dahulu dari Home.");
      navigate("/");
      return;
    }

    setGameState("waiting");
    setReactionTime(null);
    setSaveStatus("");

    const delay = Math.random() * 3000 + 1000;

    const id = setTimeout(() => {
      setGameState("ready");
      setStartTime(Date.now());
    }, delay);

    setTimeoutId(id);
  }

  function resetTest() {
    clearTimeout(timeoutId);
    setGameState("idle");
    setStartTime(null);
    setReactionTime(null);
    setResults([]);
    setSaveStatus("");
  }

  function getOtherGrip() {
    return selectedGrip === "Palm" ? "Claw" : "Palm";
  }

  function isGripComplete(grip) {
    const data = JSON.parse(localStorage.getItem("mouseGripResults")) || [];

    const hasAim = data.some(
      (item) => item.grip === grip && item.test === "Aim Trainer"
    );

    const hasReaction = data.some(
      (item) => item.grip === grip && item.test === "Reaction Time"
    );

    return hasAim && hasReaction;
  }

  function goNextStep() {
    const otherGrip = getOtherGrip();

    if (isGripComplete(otherGrip)) {
      navigate("/results");
      return;
    }

    localStorage.setItem("currentGrip", otherGrip);
    navigate("/aim-trainer");
  }

  function getNextButtonText() {
    const otherGrip = getOtherGrip();

    if (isGripComplete(otherGrip)) {
      return "See Compare Results";
    }

    return `Continue to ${otherGrip} Grip`;
  }

  function getFinishedMessage() {
    const otherGrip = getOtherGrip();

    if (isGripComplete(otherGrip)) {
      return "Semua test selesai. Lihat hasil perbandingan.";
    }

    return `${selectedGrip} Grip selesai. Lanjutkan test untuk ${otherGrip} Grip.`;
  }

  async function handleClick() {
    if (gameState === "finished") return;

    if (gameState === "idle") {
      startGame();
      return;
    }

    if (gameState === "waiting") {
      clearTimeout(timeoutId);
      setGameState("tooSoon");
      return;
    }

    if (gameState === "tooSoon") {
      startGame();
      return;
    }

    if (gameState === "ready") {
      const endTime = Date.now();
      const time = endTime - startTime;

      const newResults = [
        ...results,
        {
          attempt: results.length + 1,
          time,
        },
      ];

      setReactionTime(time);
      setResults(newResults);

      if (newResults.length === maxAttempts) {
        const avg = Math.round(
          newResults.reduce((total, item) => total + item.time, 0) /
            newResults.length
        );

        const bestScore = Math.min(...newResults.map((item) => item.time));

        const finalResult = {
          test: "Reaction Time",
          grip: selectedGrip,
          score: avg,
          best: bestScore,
          date: new Date().toISOString(),
        };

        saveResultToLocal(finalResult);

        await saveResultToBackend({
          grip: selectedGrip,
          test: "Reaction Time",
          score: avg,
          accuracy: null,
          best: bestScore,
        });

        setGameState("finished");
      } else {
        setGameState("clicked");
      }

      return;
    }

    if (gameState === "clicked") {
      startGame();
    }
  }

  const average =
    results.length > 0
      ? Math.round(
          results.reduce((total, item) => total + item.time, 0) /
            results.length
        )
      : 0;

  const best =
    results.length > 0 ? Math.min(...results.map((item) => item.time)) : 0;

  function getMessage() {
    if (gameState === "idle") return "Klik untuk mulai";
    if (gameState === "waiting") return "Tunggu warna hijau...";
    if (gameState === "ready") return "KLIK SEKARANG!";
    if (gameState === "tooSoon") return "Terlalu cepat! Klik untuk coba lagi.";
    if (gameState === "clicked") return `${reactionTime} ms`;
    if (gameState === "finished") return "Test selesai";
  }

  function getBoxClass() {
    if (gameState === "waiting") {
      return "bg-red-600 hover:bg-red-700";
    }

    if (gameState === "ready") {
      return "bg-green-500 hover:bg-green-600";
    }

    if (gameState === "tooSoon") {
      return "bg-yellow-700 hover:bg-yellow-800";
    }

    return "border border-zinc-800 bg-zinc-900 hover:bg-zinc-800";
  }

  return (
    <div className="min-h-screen bg-[#050505] px-6 py-8 text-white">
      <div className="mx-auto max-w-6xl text-center">
        <Link
          to="/"
          className="inline-flex rounded-lg px-3 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
        >
          ← Back Home
        </Link>

        <div className="mt-6">
          <span className="rounded-full bg-zinc-900 px-4 py-2 text-xs font-bold text-zinc-300">
            Grip yang sedang diuji:{" "}
            <strong className="text-green-500">{selectedGrip || "-"}</strong>
          </span>

          <h1 className="mt-6 text-5xl font-extrabold tracking-[-0.04em] max-sm:text-4xl">
            Reaction Time
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-zinc-400">
            Klik kotak saat berubah menjadi hijau. Jangan klik terlalu cepat.
          </p>
        </div>

        <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-3">
            Attempt:{" "}
            <strong>
              {results.length}/{maxAttempts}
            </strong>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-3">
            Average: <strong>{average} ms</strong>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-3">
            Best: <strong>{best} ms</strong>
          </div>
        </div>

        <div
          onClick={handleClick}
          className={`mx-auto mt-7 flex h-[420px] w-full max-w-[900px] cursor-pointer flex-col items-center justify-center rounded-2xl p-6 text-center shadow-2xl transition max-sm:h-[360px] ${getBoxClass()}`}
        >
          <h2 className="text-5xl font-extrabold tracking-[-0.04em] max-sm:text-3xl">
            {getMessage()}
          </h2>

          {gameState === "idle" && (
            <p className="mt-4 text-zinc-300">
              Klik area ini untuk memulai reaction test.
            </p>
          )}

          {gameState === "clicked" && results.length < maxAttempts && (
            <p className="mt-4 text-zinc-200">
              Klik lagi untuk lanjut percobaan berikutnya.
            </p>
          )}

          {gameState === "finished" && (
            <p className="mt-4 text-zinc-200">{getFinishedMessage()}</p>
          )}
        </div>

        {gameState === "finished" && (
          <div className="mx-auto mt-10 grid max-w-6xl grid-cols-[360px_1fr] gap-6 text-left max-lg:grid-cols-1">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-7 text-center">
              <span className="rounded-full bg-green-500/10 px-4 py-2 text-xs font-bold text-green-500">
                Reaction Result
              </span>

              <h2 className="mt-5 text-3xl font-extrabold">
                {selectedGrip} Grip
              </h2>

              {saveStatus && (
                <p className="mt-4 rounded-xl bg-zinc-800 px-4 py-3 text-sm text-zinc-300">
                  {saveStatus}
                </p>
              )}

              <div className="mt-6 space-y-4 text-zinc-300">
                <div className="flex justify-between border-b border-zinc-800 pb-3">
                  <span>Average</span>
                  <strong className="text-white">{average} ms</strong>
                </div>

                <div className="flex justify-between border-b border-zinc-800 pb-3">
                  <span>Best</span>
                  <strong className="text-white">{best} ms</strong>
                </div>

                <div className="flex justify-between">
                  <span>Total Attempts</span>
                  <strong className="text-white">{results.length}</strong>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <button
                  className="rounded-xl bg-zinc-800 px-5 py-3 font-extrabold transition hover:bg-zinc-700"
                  onClick={resetTest}
                >
                  Retry Reaction Test
                </button>

                <button
                  className="rounded-xl bg-green-500 px-5 py-3 font-extrabold transition hover:bg-green-600"
                  onClick={goNextStep}
                >
                  {getNextButtonText()}
                </button>

                <Link
                  to="/"
                  className="rounded-xl bg-zinc-800 px-5 py-3 text-center font-extrabold transition hover:bg-zinc-700"
                >
                  Back Home
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-7">
              <h2 className="mb-6 text-center text-3xl font-extrabold">
                Reaction Time Chart
              </h2>

              <div className="h-[330px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={results}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                    <XAxis dataKey="attempt" stroke="#cfcfcf" />
                    <YAxis stroke="#cfcfcf" />
                    <Tooltip
                      contentStyle={{
                        background: "#202020",
                        border: "1px solid #333333",
                        borderRadius: "12px",
                        color: "#ffffff",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="time"
                      stroke="#22c55e"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}