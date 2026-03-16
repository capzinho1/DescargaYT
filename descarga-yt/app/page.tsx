"use client";
import { useState } from "react";
import { MdSmartDisplay, MdDownload, MdError } from "react-icons/md";

interface VideoData {
  titulo: string;
  miniatura: string;
  enlaceDirecto: string;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setVideoData(null);
    
    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Ocurrió un error al procesar el video.");
      }

      setVideoData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-8 sm:p-10">
        
        <div className="flex flex-col items-center mb-8 text-center">
          {/* El contenedor padre tiene el color text-red-500, el ícono lo hereda */}
          <div className="bg-red-500/10 p-4 rounded-full mb-5 text-red-500">
            <MdSmartDisplay size={56} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Descargador Privado</h1>
          <p className="text-slate-400">Pega el enlace del video y descárgalo directamente a tu equipo.</p>
        </div>

        <form onSubmit={handleProcess} className="flex flex-col gap-5">
          <div className="relative">
            <input
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-200 placeholder-slate-600 transition-all text-lg"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-3 transition-all text-lg shadow-lg shadow-blue-900/20"
          >
            {loading ? (
              <span className="animate-pulse flex items-center gap-2">
                Procesando enlace...
              </span>
            ) : (
              <>
                {/* Usamos size={24} en lugar de w-6 h-6 */}
                <MdDownload size={24} />
                <span>Obtener Video</span>
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-900/30 border border-red-800 rounded-xl flex items-center gap-3 text-red-400">
            <span className="shrink-0">
              <MdError size={24} />
            </span>
            <p>{error}</p>
          </div>
        )}

        {videoData && (
          <div className="mt-8 pt-8 border-t border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col items-center gap-4 text-center">
              <img 
                src={videoData.miniatura} 
                alt="Miniatura del video" 
                className="w-full max-w-sm rounded-lg shadow-md border border-slate-700 object-cover"
              />
              <h3 className="text-lg font-medium text-slate-200 line-clamp-2">
                {videoData.titulo}
              </h3>
              
              <a
                href={videoData.enlaceDirecto}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/20"
              >
                {/* Usamos size={20} en lugar de w-5 h-5 */}
                <MdDownload size={20} />
                Guardar Archivo en mi PC
              </a>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}