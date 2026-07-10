import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-[#111111]/95 backdrop-blur page-fade">
      <div className="mx-auto flex min-h-[64px] max-w-7xl items-center justify-between px-6">
        <Link
          to="/"
          className="text-2xl font-extrabold text-white transition hover:scale-105"
        >
          Grip<span className="text-green-500">Lab</span>
        </Link>

        <div className="flex gap-2 text-sm text-zinc-300 max-sm:gap-1">
          <Link
            className="rounded-lg px-3 py-2 transition hover:-translate-y-0.5 hover:bg-zinc-800 hover:text-white"
            to="/"
          >
            Home
          </Link>

          <Link
            className="rounded-lg px-3 py-2 transition hover:-translate-y-0.5 hover:bg-zinc-800 hover:text-white"
            to="/mouse-info"
          >
            Mouse
          </Link>

          <Link
            className="rounded-lg px-3 py-2 transition hover:-translate-y-0.5 hover:bg-zinc-800 hover:text-white"
            to="/grip-guide"
          >
            Grip
          </Link>

          <Link
            className="rounded-lg px-3 py-2 transition hover:-translate-y-0.5 hover:bg-zinc-800 hover:text-white"
            to="/mouse-specs"
          >
            Specs
          </Link>

          <Link
            className="rounded-lg bg-green-500 px-3 py-2 font-bold text-white transition hover:-translate-y-0.5 hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/20"
            to="/start-test"
          >
            Start Test
          </Link>
        </div>
      </div>
    </nav>
  );
}