import { motion } from 'framer-motion';
import { Video, ExternalLink } from 'lucide-react';
import { JAWORZNO_FIRMY_VIDEO } from '../../data/firmyData';

/**
 * Odtwarzacz YouTube (embed iframe) dla strony /jaworzno/firmy.
 * ID filmu pochodzi z danych JAWORZNO_FIRMY_VIDEO (src/data/firmyData.ts).
 *
 * Używamy domeny youtube-nocookie.com (wersja bez ciasteczek) oraz parametrów
 * rel=0 / modestbranding=1, aby ograniczyć rekomendacje i branding.
 */
export default function ForCompaniesJaworznoVideo() {
  const video = JAWORZNO_FIRMY_VIDEO;
  const embedSrc = `https://www.youtube-nocookie.com/embed/${video.videoId}?rel=0&modestbranding=1&color=white`;

  return (
    <section className="space-y-8 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-[10px] font-black tracking-[0.2em] text-purple-400 uppercase">Wideo</span>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Zobacz <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-amber-400">Grawitację w akcji</span>
          </h2>
        </div>
        <p className="text-xs text-slate-400 font-medium max-w-xs">{video.description}</p>
      </div>

      {/* Neon glass frame around the player */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-[24px] border border-white/10 bg-slate-950/70 backdrop-blur-xl shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_30px_rgba(244,63,94,0.25)]"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-rose-400 to-transparent shadow-[0_0_12px_#fb7185]" />
        <div className="absolute -top-16 -left-16 w-52 h-52 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-52 h-52 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 p-4 sm:p-6">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl shadow-inner">
            <iframe
              className="absolute inset-0 w-full h-full"
              src={embedSrc}
              title={video.title}
              loading="lazy"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.3)]">
              <Video className="w-5 h-5" />
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium flex-1">
              {video.description}{' '}
              <a
                href={`https://www.youtube.com/watch?v=${video.videoId}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-rose-300 font-bold hover:text-rose-200 transition-colors"
              >
                Obejrzyj na YouTube
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}