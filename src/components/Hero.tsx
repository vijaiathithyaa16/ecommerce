import React from 'react';
import { ArrowDown, Sparkles, Compass, ShieldCheck } from 'lucide-react';
import { BACKGROUND_IMAGES } from '../utils/backgrounds.ts';

interface HeroProps {
  onExplore: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore }) => {
  return (
    <section className="relative overflow-hidden border-b border-stone-200/80 bg-[#FDFBF7]">
      {/* Background Architectural Studio Artwork */}
      <div className="absolute inset-0 pointer-events-none opacity-90 z-0">
        <img
          src={BACKGROUND_IMAGES.heroStudio}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center"
        />
        {/* Soft gradient wash ensuring high legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FDFBF7]/95 via-[#FDFBF7]/85 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Campaign Message */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900/5 border border-stone-900/10 text-xs uppercase tracking-widest text-stone-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
              <span>Autumn · Winter 2026 Collection</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-stone-950 leading-[1.15] text-balance drop-shadow-2xs">
              Instruments of focus, craftsmanship, and daily ritual.
            </h1>

            <p className="text-base sm:text-lg text-stone-700 max-w-xl font-normal leading-relaxed">
              Curated precision hardware, hand-thrown ceramics, and architectural workspace essentials sourced directly from independent ateliers across Kyoto, Portland, and Stockholm.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onExplore}
                className="px-6 py-3.5 bg-stone-900 text-stone-50 hover:bg-stone-800 text-sm font-medium rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2 group cursor-pointer"
              >
                <span>Browse The Catalog</span>
                <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
              </button>

              <div className="text-xs text-stone-600 flex items-center gap-2 font-medium">
                <span>In-Stock Inventory</span>
                <span aria-hidden="true">·</span>
                <span>Inspected Before Dispatch</span>
              </div>
            </div>

            {/* Proof Adjacency */}
            <div className="pt-6 border-t border-stone-300/80 grid grid-cols-3 gap-6 text-stone-700">
              <div>
                <div className="text-stone-950 font-serif text-2xl font-bold tabular-nums">100%</div>
                <div className="text-xs text-stone-600 mt-0.5 font-medium">Authentic Provenance</div>
              </div>
              <div>
                <div className="text-stone-950 font-serif text-2xl font-bold tabular-nums">2-Day</div>
                <div className="text-xs text-stone-600 mt-0.5 font-medium">Regional Dispatch</div>
              </div>
              <div>
                <div className="text-stone-950 font-serif text-2xl font-bold tabular-nums">4.9 / 5</div>
                <div className="text-xs text-stone-600 mt-0.5 font-medium">Artisan Ratings</div>
              </div>
            </div>
          </div>

          {/* Featured Showcase Visual */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-stone-300/70 shadow-xl bg-white/80 backdrop-blur-md p-8 flex flex-col justify-between min-h-[400px]">
              <div className="space-y-2">
                <span className="text-xs text-amber-900 font-semibold tracking-wider uppercase">Spotlight Piece</span>
                <h3 className="font-serif text-2xl font-semibold text-stone-900">
                  Acoustic Precision Reference Headphones
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Titanium acoustic chambers tuned for analytical neutrality and long-duration listening.
                </p>
              </div>

              {/* Minimalist Visual Representation with Soft Glow */}
              <div className="my-6 py-4 flex items-center justify-center relative">
                <div className="absolute w-56 h-56 rounded-full bg-amber-400/20 blur-2xl -z-0" />
                <div className="relative z-10 w-48 h-48 rounded-full bg-gradient-to-tr from-stone-300 via-stone-200 to-stone-100 flex items-center justify-center shadow-inner ring-1 ring-stone-900/5">
                  <div className="w-36 h-36 rounded-full border-4 border-stone-800 flex items-center justify-center bg-stone-900 text-stone-200 shadow-md">
                    <span className="font-serif text-sm tracking-widest uppercase">Master Acoustic</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-stone-200/80 text-xs">
                <div>
                  <span className="text-stone-500">Edition: </span>
                  <span className="font-medium text-stone-900">Studio Reference Mk II</span>
                </div>
                <div className="font-mono text-stone-900 font-semibold text-base tabular-nums">
                  $380.00
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
