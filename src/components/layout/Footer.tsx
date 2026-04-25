import Link from "next/link";
import { Landmark, Github, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center">
                <Landmark className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-lg">
                <span className="text-white">Civi</span>
                <span className="text-indigo-400">Civi</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm max-w-sm">
              Government data tells us what happened. CiviCivi tells you what it means for you.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-8">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">Navigate</p>
              <div className="space-y-2">
                <Link href="/bills" className="block text-slate-500 hover:text-slate-300 text-sm transition-colors">
                  Explore Bills
                </Link>
                <Link href="/profile" className="block text-slate-500 hover:text-slate-300 text-sm transition-colors">
                  My Civic Profile
                </Link>
              </div>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">Principles</p>
              <div className="space-y-2">
                <p className="text-slate-500 text-sm">Politically neutral</p>
                <p className="text-slate-500 text-sm">No voting recommendations</p>
                <p className="text-slate-500 text-sm">Transparent uncertainty</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-600 text-xs">
            © 2025 CiviCivi · Built for democracy
          </p>
          <div className="flex items-center gap-4">
            <p className="text-slate-600 text-xs">
              Powered by Gemini AI · ElevenLabs
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
