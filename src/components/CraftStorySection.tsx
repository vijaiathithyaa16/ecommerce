import React from 'react';
import { BACKGROUND_IMAGES } from '../utils/backgrounds.ts';
import { Compass, Sparkles, Hammer, ShieldCheck } from 'lucide-react';

export const CraftStorySection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-stone-950 text-stone-300 py-16 sm:py-20 my-10">
      {/* Background Workshop Image Artwork */}
      <div className="absolute inset-0 pointer-events-none opacity-80 z-0">
        <img
          src={BACKGROUND_IMAGES.craftWorkshop}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-2xs" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
              The Atelier Philosophy
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-white tracking-tight leading-snug">
              Every curve calibrated. Every surface hand-finished.
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl">
              We partner exclusively with independent workshops that refuse industrial shortcuts. From slow reduction kilns in Kyoto to precision CNC lathe mills in Oregon, our archive is curated for individuals who value permanence over obsolescence.
            </p>

            <div className="pt-2 grid grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <Hammer className="w-4 h-4 text-amber-400 mb-2" />
                <h4 className="font-semibold text-white">Manual Calibrations</h4>
                <p className="text-[11px] text-stone-400 mt-1">Individual switch tension testing & zero-drift driver matching.</p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <Compass className="w-4 h-4 text-amber-400 mb-2" />
                <h4 className="font-semibold text-white">Architectural Purity</h4>
                <p className="text-[11px] text-stone-400 mt-1">Solid walnut, spun brass, and full-grain Wickett & Craig leather.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex justify-center">
            <div className="relative p-8 rounded-2xl bg-stone-900/80 border border-stone-700/80 backdrop-blur-md shadow-2xl max-w-md w-full space-y-6">
              <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                <div>
                  <span className="text-xs text-amber-400 font-mono">STANDARDS REPORT</span>
                  <h3 className="font-serif text-lg font-medium text-white">Provenance Guarantees</h3>
                </div>
                <ShieldCheck className="w-6 h-6 text-amber-400" />
              </div>

              <ul className="space-y-3 text-xs text-stone-300 divide-y divide-stone-800/60">
                <li className="pt-2 flex justify-between items-center">
                  <span>Acoustic Harmonic Distortion</span>
                  <span className="font-mono text-white font-semibold">&lt; 0.05% THD</span>
                </li>
                <li className="pt-3 flex justify-between items-center">
                  <span>Stoneware Firing Temperature</span>
                  <span className="font-mono text-white font-semibold">1,280°C Basalt Reduction</span>
                </li>
                <li className="pt-3 flex justify-between items-center">
                  <span>Leather Tanning Cycle</span>
                  <span className="font-mono text-white font-semibold">60-Day Bark Steep</span>
                </li>
                <li className="pt-3 flex justify-between items-center">
                  <span>Mechanical Life Expectancy</span>
                  <span className="font-mono text-white font-semibold">50M+ Tactile Actuations</span>
                </li>
              </ul>

              <div className="text-[11px] text-stone-400 text-center pt-2">
                All dispatches originate with serialized certificates of authenticity.
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
