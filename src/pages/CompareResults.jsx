import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function CompareResults() {
  const data = JSON.parse(localStorage.getItem("mouseGripResults")) || [];

  function latest(grip, test) {
    return (
      data
        .filter((item) => item.grip === grip && item.test === test)
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0] || null
    );
  }

  const palmAim = latest("Palm", "Aim Trainer");
  const palmReaction = latest("Palm", "Reaction Time");
  const clawAim = latest("Claw", "Aim Trainer");
  const clawReaction = latest("Claw", "Reaction Time");

  const palmAimScore = palmAim?.score || 0;
  const clawAimScore = clawAim?.score || 0;
  const palmReactionScore = palmReaction?.score || 0;
  const clawReactionScore = clawReaction?.score || 0;

  const palmTotal = palmAimScore + palmReactionScore;
  const clawTotal = clawAimScore + clawReactionScore;

  const winner =
    palmTotal && clawTotal
      ? palmTotal < clawTotal
        ? "Palm Grip"
        : clawTotal < palmTotal
        ? "Claw Grip"
        : "Seimbang"
      : "Data belum lengkap";

  const chartData = [
    { metric: "Aim", Palm: palmAimScore, Claw: clawAimScore },
    { metric: "Reaction", Palm: palmReactionScore, Claw: clawReactionScore },
  ];

  function clearData() {
  localStorage.removeItem("mouseGripResults");
  localStorage.removeItem("currentGrip");
  localStorage.removeItem("respondentId");
  localStorage.removeItem("respondentData");
  window.location.href = "/";
}

  return (
    <div className="min-h-screen bg-[#050505] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <section className="text-center">
          <span className="rounded-full bg-zinc-900 px-4 py-2 text-xs font-bold text-zinc-300">
            Final Result
          </span>

          <h1 className="mt-6 text-6xl font-extrabold tracking-[-0.05em] max-md:text-4xl">
            {winner}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-zinc-400 max-md:text-base">
            Grip dengan total waktu lebih rendah dianggap lebih cocok
            berdasarkan hasil Aim Trainer dan Reaction Time.
          </p>
        </section>

        <section className="mt-10 grid grid-cols-3 gap-5 max-md:grid-cols-1">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center">
            <span className="text-sm text-zinc-400">Palm Total</span>
            <strong className="mt-3 block text-3xl">
              {palmTotal || "-"} ms
            </strong>
          </div>

          <div className="rounded-2xl border border-green-500 bg-green-500 p-6 text-center">
            <span className="text-sm text-white/90">Recommended</span>
            <strong className="mt-3 block text-3xl">{winner}</strong>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center">
            <span className="text-sm text-zinc-400">Claw Total</span>
            <strong className="mt-3 block text-3xl">
              {clawTotal || "-"} ms
            </strong>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-2 gap-6 max-lg:grid-cols-1">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-7">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-3xl font-extrabold">Palm Grip</h2>
              <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-bold text-zinc-300">
                Detail
              </span>
            </div>

            <div className="space-y-4 text-zinc-300">
              <div className="flex justify-between border-b border-zinc-800 pb-3">
                <span>Aim Avg</span>
                <strong className="text-white">{palmAimScore || "-"} ms</strong>
              </div>

              <div className="flex justify-between border-b border-zinc-800 pb-3">
                <span>Aim Accuracy</span>
                <strong className="text-white">
                  {palmAim?.accuracy || "-"}%
                </strong>
              </div>

              <div className="flex justify-between border-b border-zinc-800 pb-3">
                <span>Reaction Avg</span>
                <strong className="text-white">
                  {palmReactionScore || "-"} ms
                </strong>
              </div>

              <div className="flex justify-between">
                <span>Reaction Best</span>
                <strong className="text-white">
                  {palmReaction?.best || "-"} ms
                </strong>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-7">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-3xl font-extrabold">Claw Grip</h2>
              <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-bold text-zinc-300">
                Detail
              </span>
            </div>

            <div className="space-y-4 text-zinc-300">
              <div className="flex justify-between border-b border-zinc-800 pb-3">
                <span>Aim Avg</span>
                <strong className="text-white">{clawAimScore || "-"} ms</strong>
              </div>

              <div className="flex justify-between border-b border-zinc-800 pb-3">
                <span>Aim Accuracy</span>
                <strong className="text-white">
                  {clawAim?.accuracy || "-"}%
                </strong>
              </div>

              <div className="flex justify-between border-b border-zinc-800 pb-3">
                <span>Reaction Avg</span>
                <strong className="text-white">
                  {clawReactionScore || "-"} ms
                </strong>
              </div>

              <div className="flex justify-between">
                <span>Reaction Best</span>
                <strong className="text-white">
                  {clawReaction?.best || "-"} ms
                </strong>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-7">
          <h2 className="mb-6 text-center text-3xl font-extrabold">
            Performance Comparison
          </h2>

          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="metric" stroke="#cfcfcf" />
                <YAxis stroke="#cfcfcf" />
                <Tooltip
                  contentStyle={{
                    background: "#202020",
                    border: "1px solid #333333",
                    borderRadius: "12px",
                    color: "#ffffff",
                  }}
                />
                <Bar dataKey="Palm" fill="#22c55e" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Claw" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <div className="mx-auto mt-8 flex max-w-sm flex-col gap-3">
          <Link
            to="/"
            className="rounded-xl bg-zinc-800 px-5 py-4 text-center font-extrabold transition hover:bg-zinc-700"
          >
            Back Home
          </Link>

          <button
            className="rounded-xl bg-green-500 px-5 py-4 font-extrabold transition hover:bg-green-600"
            onClick={clearData}
          >
            Start New Test
          </button>
        </div>
      </div>
    </div>
  );
}