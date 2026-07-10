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

export default function AimTrainer() {
  const navigate = useNavigate();
  const totalTargets = 30;
  const selectedGrip = localStorage.getItem("currentGrip");
  const respondentId = localStorage.getItem("respondentId");

  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [targetPosition, setTargetPosition] = useState({ x: 50, y: 50 });
  const [hits, setHits] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [finishTime, setFinishTime] = useState(null);
  const [targetStartTime, setTargetStartTime] = useState(null);
  const [responseTimes, setResponseTimes] = useState([]);
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
      setSaveStatus("Hasil Aim Trainer berhasil disimpan ke database.");
    } catch (error) {
      setSaveStatus("Gagal menyimpan hasil Aim Trainer ke database.");
    }
  }

  function getRandomPosition() {
    return {
      x: Math.random() * 90 + 5,
      y: Math.random() * 80 + 10,
    };
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

    setGameStarted(true);
    setGameFinished(false);
    setHits(0);
    setClicks(0);
    setResponseTimes([]);
    setSaveStatus("");

    const now = Date.now();
    setStartTime(now);
    setFinishTime(null);
    setTargetStartTime(now);
    setTargetPosition(getRandomPosition());
  }

  async function handleTargetClick(event) {
    event.stopPropagation();

    const now = Date.now();
    const responseTime = now - targetStartTime;

    const newHits = hits + 1;
    const newClicks = clicks + 1;

    const newResponseTimes = [
      ...responseTimes,
      {
        target: newHits,
        time: responseTime,
      },
    ];

    setHits(newHits);
    setClicks(newClicks);
    setResponseTimes(newResponseTimes);

    if (newHits === totalTargets) {
      setGameStarted(false);
      setGameFinished(true);
      setFinishTime(now);

      const avg =
        newResponseTimes.reduce((total, item) => total + item.time, 0) /
        newResponseTimes.length;

      const finalAccuracy = ((newHits / newClicks) * 100).toFixed(1);

      const finalResult = {
        test: "Aim Trainer",
        grip: selectedGrip,
        score: Math.round(avg),
        accuracy: Number(finalAccuracy),
        date: new Date().toISOString(),
      };

      saveResultToLocal(finalResult);

      await saveResultToBackend({
        grip: selectedGrip,
        test: "Aim Trainer",
        score: Math.round(avg),
        accuracy: Number(finalAccuracy),
        best: null,
      });
    } else {
      setTargetPosition(getRandomPosition());
      setTargetStartTime(now);
    }
  }

  function handleMissClick() {
    if (!gameStarted) return;
    setClicks(clicks + 1);
  }

  const accuracy = clicks === 0 ? 100 : ((hits / clicks) * 100).toFixed(1);

  const totalTime =
    startTime && finishTime
      ? ((finishTime - startTime) / 1000).toFixed(2)
      : 0;

  const averageResponseTime =
    responseTimes.length > 0
      ? (
          responseTimes.reduce((total, item) => total + item.time, 0) /
          responseTimes.length
        ).toFixed(0)
      : 0;

  const lastResponseTime =
    responseTimes.length > 0
      ? responseTimes[responseTimes.length - 1].time
      : 0;

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
            Aim Trainer
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-zinc-400">
            Klik target hijau secepat mungkin. Jangan klik area kosong agar
            accuracy tetap tinggi.
          </p>
        </div>

        {!gameStarted && !gameFinished && (
          <button
            className="mt-8 rounded-xl bg-green-500 px-9 py-4 text-lg font-extrabold text-white transition hover:bg-green-600"
            onClick={startGame}
          >
            Start Aim Test
          </button>
        )}

        {gameStarted && (
          <>
            <div className="mx-auto mt-8 flex max-w-5xl flex-wrap justify-center gap-3">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-3">
                Hits:{" "}
                <strong>
                  {hits}/{totalTargets}
                </strong>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-3">
                Clicks: <strong>{clicks}</strong>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-3">
                Accuracy: <strong>{accuracy}%</strong>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-3">
                Last Response: <strong>{lastResponseTime} ms</strong>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-3">
                Average: <strong>{averageResponseTime} ms</strong>
              </div>
            </div>

            <div
              className="relative mx-auto mt-7 h-[520px] w-full max-w-[900px] cursor-crosshair overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl max-sm:h-[420px]"
              onClick={handleMissClick}
            >
              <div
                className="absolute h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-green-500 shadow-[0_0_25px_rgba(34,197,94,0.6)] transition hover:scale-110 hover:bg-green-600"
                onClick={handleTargetClick}
                style={{
                  left: `${targetPosition.x}%`,
                  top: `${targetPosition.y}%`,
                }}
              />
            </div>
          </>
        )}

        {gameFinished && (
          <div className="mx-auto mt-10 grid max-w-6xl grid-cols-[360px_1fr] gap-6 text-left max-lg:grid-cols-1">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-7 text-center">
              <span className="rounded-full bg-green-500/10 px-4 py-2 text-xs font-bold text-green-500">
                Aim Result
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
                  <span>Total Time</span>
                  <strong className="text-white">{totalTime}s</strong>
                </div>

                <div className="flex justify-between border-b border-zinc-800 pb-3">
                  <span>Hits</span>
                  <strong className="text-white">{hits}</strong>
                </div>

                <div className="flex justify-between border-b border-zinc-800 pb-3">
                  <span>Total Clicks</span>
                  <strong className="text-white">{clicks}</strong>
                </div>

                <div className="flex justify-between border-b border-zinc-800 pb-3">
                  <span>Accuracy</span>
                  <strong className="text-white">{accuracy}%</strong>
                </div>

                <div className="flex justify-between">
                  <span>Average Response</span>
                  <strong className="text-white">
                    {averageResponseTime} ms
                  </strong>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <button
                  className="rounded-xl bg-zinc-800 px-5 py-3 font-extrabold transition hover:bg-zinc-700"
                  onClick={startGame}
                >
                  Retry Aim Test
                </button>

                <Link
                  to="/reaction-time"
                  className="rounded-xl bg-green-500 px-5 py-3 text-center font-extrabold transition hover:bg-green-600"
                >
                  Continue to Reaction Time
                </Link>

                <Link
                  to="/"
                  className="rounded-xl bg-zinc-800 px-5 py-3 text-center font-extrabold transition hover:bg-zinc-700"
                >
                  Back Home
                </Link>
              </div>
            </div>

            {responseTimes.length > 0 && (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-7">
                <h2 className="mb-6 text-center text-3xl font-extrabold">
                  Aim Response Time Chart
                </h2>

                <div className="h-[330px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={responseTimes}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                      <XAxis dataKey="target" stroke="#cfcfcf" />
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}