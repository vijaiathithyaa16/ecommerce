import React from 'react';
import { ArrowDown, Sparkles, Compass, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore }) => {
  return (
    <section className="relative overflow-hidden border-b border-stone-200/80 bg-gradient-to-b from-[#FBFBF9] via-[#F7F6F2] to-[#F3F2EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Campaign Message */}
          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs uppercase tracking-widest text-stone-500 font-medium">
              Autumn · Winter 2026 Collection
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-stone-900 leading-[1.15] text-balance">
              Instruments of focus, craftsmanship, and daily ritual.
            </h1>

            <p className="text-base sm:text-lg text-stone-600 max-w-xl font-normal leading-relaxed">
              Curated precision hardware, hand-thrown ceramics, and architectural workspace essentials sourced directly from independent ateliers across Kyoto, Portland, and Stockholm.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onExplore}
                className="px-6 py-3.5 bg-stone-900 text-stone-50 hover:bg-stone-800 text-sm font-medium rounded-lg transition-all shadow-sm hover:shadow flex items-center gap-2 group"
              >
                <span>Browse The Catalog</span>
                <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
              </button>

              <div className="text-xs text-stone-500 flex items-center gap-2">
                <span>In-Stock Items</span>
                <span aria-hidden="true">·</span>
                <span>Inspected Before Dispatch</span>
              </div>
            </div>

            {/* Proof Adjacency */}
            <div className="pt-6 border-t border-stone-300/60 grid grid-cols-3 gap-6 text-stone-600">
              <div>
                <div className="text-stone-900 font-serif text-xl font-semibold tabular-nums">100%</div>
                <div className="text-xs text-stone-500 mt-0.5">Authentic Provenance</div>
              </div>
              <div>
                <div className="text-stone-900 font-serif text-xl font-semibold tabular-nums">2-Day</div>
                <div className="text-xs text-stone-500 mt-0.5">Regional Processing</div>
              </div>
              <div>
                <div className="text-stone-900 font-serif text-xl font-semibold tabular-nums">4.9 / 5</div>
                <div className="text-xs text-stone-500 mt-0.5">Craftsman Ratings</div>
              </div>
            </div>
          </div>

          {/* Featured Showcase Visual */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-stone-200/80 shadow-md bg-stone-100 p-8 flex flex-col justify-between min-h-[380px]">
              <div className="space-y-2">
                <span className="text-xs text-stone-500 tracking-wider uppercase font-medium">Spotlight Piece</span>
                <h3 className="font-serif text-2xl font-semibold text-stone-900">
                  Acoustic Precision Reference Headphones
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Titanium acoustic chambers tuned for analytical neutrality and long-duration listening.
                </p>
              </div>

              {/* Minimalist Visual Representation */}
              <div className="my-6 py-4 flex items-center justify-center">
                <div className="relative w-48 h-48 rounded-full bg-gradient-to-tr from-stone-300 via-stone-200 to-stone-100 flex items-center justify-center shadow-inner">
                  <div className="w-36 h-36 rounded-full border-4 border-stone-800 flex items-center justify-center bg-stone-900 text-stone-200">
                    <span className="font-serif text-sm tracking-widest uppercase">Master Acoustic</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-stone-200/80 text-xs">
                <div>
                  <span className="text-stone-500">Edition: </span>
                  <span className="font-medium text-stone-900">Studio Reference Mk II</span>
                </div>
                <div className="font-mono text-stone-900 font-semibold text-sm tabular-nums">
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
