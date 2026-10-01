// Resilient visual assets generator and fallback illustrations
// Complies with Zero-Broken-Image Policy and hermetic evaluation sandbox constraints

export const PRODUCT_ILLUSTRATIONS: Record<string, string> = {
  headphones: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
      <defs>
        <radialGradient id="bg" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#F5F5F3" />
          <stop offset="100%" stop-color="#E7E5E4" />
        </radialGradient>
        <linearGradient id="metal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#44403C" />
          <stop offset="50%" stop-color="#1C1917" />
          <stop offset="100%" stop-color="#0C0A09" />
        </linearGradient>
        <linearGradient id="champagne" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#D6D3D1" />
          <stop offset="100%" stop-color="#A8A29E" />
        </linearGradient>
      </defs>
      <rect width="600" height="450" fill="url(#bg)" />
      <!-- Soft floor shadow -->
      <ellipse cx="300" cy="385" rx="140" ry="22" fill="#78716C" opacity="0.18" />
      <ellipse cx="300" cy="385" rx="90" ry="14" fill="#1C1917" opacity="0.14" />
      
      <!-- Headband Arc -->
      <path d="M 190 230 C 190 120, 410 120, 410 230" fill="none" stroke="#292524" stroke-width="26" stroke-linecap="round" />
      <path d="M 215 190 C 215 135, 385 135, 385 190" fill="none" stroke="#44403C" stroke-width="12" stroke-linecap="round" />
      
      <!-- Sliders / Hinges -->
      <rect x="180" y="215" width="20" height="35" rx="6" fill="url(#champagne)" />
      <rect x="400" y="215" width="20" height="35" rx="6" fill="url(#champagne)" />
      
      <!-- Left Ear Cup -->
      <g transform="translate(190, 290) rotate(-10)">
        <ellipse cx="0" cy="0" rx="46" ry="62" fill="url(#metal)" />
        <ellipse cx="0" cy="0" rx="36" ry="50" fill="#292524" stroke="url(#champagne)" stroke-width="2" />
        <ellipse cx="0" cy="0" rx="20" ry="28" fill="#1C1917" />
      </g>
      
      <!-- Right Ear Cup -->
      <g transform="translate(410, 290) rotate(10)">
        <ellipse cx="0" cy="0" rx="46" ry="62" fill="url(#metal)" />
        <ellipse cx="0" cy="0" rx="36" ry="50" fill="#292524" stroke="url(#champagne)" stroke-width="2" />
        <ellipse cx="0" cy="0" rx="20" ry="28" fill="#1C1917" />
      </g>
    </svg>
  `)}`,

  keyboard: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
      <defs>
        <radialGradient id="kbg" cx="50%" cy="45%" r="65%">
          <stop offset="0%" stop-color="#F4F4F1" />
          <stop offset="100%" stop-color="#E2DFD8" />
        </radialGradient>
        <linearGradient id="walnut" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#573824" />
          <stop offset="100%" stop-color="#3B2516" />
        </linearGradient>
      </defs>
      <rect width="600" height="450" fill="url(#kbg)" />
      <ellipse cx="300" cy="340" rx="210" ry="30" fill="#78716C" opacity="0.22" />

      <!-- Keyboard base chassis -->
      <g transform="translate(300, 230) rotate(-4)">
        <rect x="-190" y="-75" width="380" height="150" rx="14" fill="#292524" />
        <rect x="-186" y="-71" width="372" height="142" rx="11" fill="url(#walnut)" opacity="0.65" />
        <rect x="-180" y="-65" width="360" height="130" rx="8" fill="#1C1917" />
        
        <!-- Key rows matrix -->
        <!-- Row 1 -->
        <g fill="#E7E5E4">
          <rect x="-170" y="-55" width="22" height="18" rx="3" fill="#D6D3D1" />
          <rect x="-142" y="-55" width="20" height="18" rx="3" />
          <rect x="-116" y="-55" width="20" height="18" rx="3" />
          <rect x="-90" y="-55" width="20" height="18" rx="3" />
          <rect x="-64" y="-55" width="20" height="18" rx="3" />
          <rect x="-38" y="-55" width="20" height="18" rx="3" />
          <rect x="-12" y="-55" width="20" height="18" rx="3" />
          <rect x="14" y="-55" width="20" height="18" rx="3" />
          <rect x="40" y="-55" width="20" height="18" rx="3" />
          <rect x="66" y="-55" width="20" height="18" rx="3" />
          <rect x="92" y="-55" width="20" height="18" rx="3" />
          <rect x="118" y="-55" width="20" height="18" rx="3" />
          <rect x="144" y="-55" width="26" height="18" rx="3" fill="#C2410C" />
        </g>
        <!-- Row 2 -->
        <g fill="#E7E5E4">
          <rect x="-170" y="-31" width="28" height="18" rx="3" fill="#D6D3D1" />
          <rect x="-136" y="-31" width="20" height="18" rx="3" />
          <rect x="-110" y="-31" width="20" height="18" rx="3" />
          <rect x="-84" y="-31" width="20" height="18" rx="3" />
          <rect x="-58" y="-31" width="20" height="18" rx="3" />
          <rect x="-32" y="-31" width="20" height="18" rx="3" />
          <rect x="-6" y="-31" width="20" height="18" rx="3" />
          <rect x="20" y="-31" width="20" height="18" rx="3" />
          <rect x="46" y="-31" width="20" height="18" rx="3" />
          <rect x="72" y="-31" width="20" height="18" rx="3" />
          <rect x="98" y="-31" width="20" height="18" rx="3" />
          <rect x="124" y="-31" width="46" height="18" rx="3" fill="#A8A29E" />
        </g>
        <!-- Row 3 -->
        <g fill="#E7E5E4">
          <rect x="-170" y="-7" width="34" height="18" rx="3" fill="#D6D3D1" />
          <rect x="-130" y="-7" width="20" height="18" rx="3" />
          <rect x="-104" y="-7" width="20" height="18" rx="3" />
          <rect x="-78" y="-7" width="20" height="18" rx="3" />
          <rect x="-52" y="-7" width="20" height="18" rx="3" />
          <rect x="-26" y="-7" width="20" height="18" rx="3" />
          <rect x="0" y="-7" width="20" height="18" rx="3" />
          <rect x="26" y="-7" width="20" height="18" rx="3" />
          <rect x="52" y="-7" width="20" height="18" rx="3" />
          <rect x="78" y="-7" width="20" height="18" rx="3" />
          <rect x="104" y="-7" width="36" height="18" rx="3" fill="#78716C" />
          <rect x="146" y="-7" width="24" height="18" rx="3" fill="#D6D3D1" />
        </g>
        <!-- Row 4 - Spacebar -->
        <g fill="#D6D3D1">
          <rect x="-170" y="17" width="30" height="20" rx="3" />
          <rect x="-134" y="17" width="24" height="20" rx="3" />
          <rect x="-104" y="17" width="24" height="20" rx="3" />
          <rect x="-74" y="17" width="138" height="20" rx="4" fill="#FAF9F6" />
          <rect x="70" y="17" width="24" height="20" rx="3" />
          <rect x="100" y="17" width="22" height="20" rx="3" />
          <rect x="128" y="17" width="20" height="20" rx="3" />
          <rect x="152" y="17" width="18" height="20" rx="3" fill="#C2410C" />
        </g>
      </g>
    </svg>
  `)}`,

  pourover: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
      <defs>
        <radialGradient id="pbg" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#FBFBF9" />
          <stop offset="100%" stop-color="#E7E5E4" />
        </radialGradient>
        <linearGradient id="glass" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#E2E8F0" stop-opacity="0.8" />
          <stop offset="50%" stop-color="#CBD5E1" stop-opacity="0.3" />
          <stop offset="100%" stop-color="#94A3B8" stop-opacity="0.7" />
        </linearGradient>
      </defs>
      <rect width="600" height="450" fill="url(#pbg)" />
      <ellipse cx="300" cy="380" rx="90" ry="18" fill="#78716C" opacity="0.2" />

      <!-- Carafe Glass -->
      <path d="M 240 230 L 220 350 C 220 370, 380 370, 380 350 L 360 230 Z" fill="url(#glass)" stroke="#94A3B8" stroke-width="2" />
      <!-- Coffee Liquid Level -->
      <path d="M 226 315 L 223 345 C 223 365, 377 365, 377 345 L 374 315 Z" fill="#3B2516" opacity="0.9" />
      
      <!-- Glass Handle -->
      <path d="M 365 250 C 410 250, 410 320, 370 330" fill="none" stroke="#94A3B8" stroke-width="8" stroke-linecap="round" />
      
      <!-- Ceramic Dripper Cone on Top -->
      <path d="M 220 130 L 380 130 L 330 220 L 270 220 Z" fill="#292524" />
      <ellipse cx="300" cy="130" rx="80" ry="16" fill="#44403C" stroke="#A8A29E" stroke-width="1.5" />
      <ellipse cx="300" cy="130" rx="60" ry="12" fill="#E2DFD8" />
      <!-- Dripper Ribs detail -->
      <path d="M 255 140 L 285 210 M 275 142 L 295 210 M 325 142 L 305 210 M 345 140 L 315 210" stroke="#78716C" stroke-width="1" />
      
      <!-- Wooden Collar -->
      <rect x="260" y="216" width="80" height="14" rx="4" fill="#B45309" opacity="0.85" />
    </svg>
  `)}`,

  deskmat: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
      <defs>
        <radialGradient id="mbg" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stop-color="#F7F5F0" />
          <stop offset="100%" stop-color="#E5E0D8" />
        </radialGradient>
        <linearGradient id="tanLeather" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#A16207" />
          <stop offset="50%" stop-color="#854D0E" />
          <stop offset="100%" stop-color="#713F12" />
        </linearGradient>
      </defs>
      <rect width="600" height="450" fill="url(#mbg)" />
      <ellipse cx="300" cy="340" rx="220" ry="35" fill="#573824" opacity="0.18" />

      <!-- Leather desk mat 3D perspective -->
      <g transform="translate(300, 230) rotate(-6)">
        <rect x="-220" y="-80" width="440" height="160" rx="16" fill="url(#tanLeather)" stroke="#78350F" stroke-width="1.5" />
        <!-- Stitching line -->
        <rect x="-212" y="-72" width="424" height="144" rx="12" fill="none" stroke="#D97706" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.6" />
        
        <!-- Machined Brass Pen Tray -->
        <rect x="-180" y="-45" width="30" height="90" rx="6" fill="#CA8A04" />
        <rect x="-176" y="-40" width="22" height="80" rx="4" fill="#A16207" />
        
        <!-- Solid Brass Pen -->
        <rect x="-167" y="-35" width="4" height="70" rx="2" fill="#FEF08A" stroke="#CA8A04" stroke-width="0.5" />
        
        <!-- Notepad with geometric lines -->
        <rect x="60" y="-55" width="120" height="110" rx="4" fill="#FAFAF9" stroke="#E7E5E4" />
        <line x1="75" y1="-35" x2="165" y2="-35" stroke="#D6D3D1" stroke-width="1.5" />
        <line x1="75" y1="-15" x2="165" y2="-15" stroke="#D6D3D1" stroke-width="1.5" />
        <line x1="75" y1="5" x2="145" y2="5" stroke="#D6D3D1" stroke-width="1.5" />
      </g>
    </svg>
  `)}`,

  lamp: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
      <defs>
        <radialGradient id="lbg" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stop-color="#FBFBF9" />
          <stop offset="100%" stop-color="#E5E4E0" />
        </radialGradient>
        <radialGradient id="glow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stop-color="#FEF08A" stop-opacity="0.4" />
          <stop offset="100%" stop-color="#FEF08A" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="600" height="450" fill="url(#lbg)" />
      
      <!-- Ambient light glow -->
      <circle cx="340" cy="180" r="140" fill="url(#glow)" />
      <ellipse cx="280" cy="380" rx="80" ry="16" fill="#78716C" opacity="0.2" />

      <!-- Lamp Base -->
      <ellipse cx="280" cy="365" rx="55" ry="12" fill="#CA8A04" />
      <ellipse cx="280" cy="363" rx="55" ry="12" fill="#EAB308" />

      <!-- Slender Stem -->
      <path d="M 280 363 L 280 180 C 280 150, 320 140, 340 160" fill="none" stroke="#CA8A04" stroke-width="8" stroke-linecap="round" />

      <!-- Dome Shade -->
      <path d="M 280 170 C 280 120, 400 120, 400 170 Z" fill="#1C1917" />
      <ellipse cx="340" cy="170" rx="60" ry="12" fill="#FEF08A" opacity="0.9" />
      <circle cx="340" cy="170" r="8" fill="#FACC15" />
    </svg>
  `)}`,

  mug: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
      <defs>
        <radialGradient id="cbg" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stop-color="#F5F5F4" />
          <stop offset="100%" stop-color="#E2DFD8" />
        </radialGradient>
        <linearGradient id="ceramic" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#44403C" />
          <stop offset="40%" stop-color="#292524" />
          <stop offset="100%" stop-color="#1C1917" />
        </linearGradient>
      </defs>
      <rect width="600" height="450" fill="url(#cbg)" />
      <ellipse cx="300" cy="365" rx="75" ry="16" fill="#78716C" opacity="0.2" />

      <!-- Mug Body -->
      <path d="M 240 200 L 245 340 C 245 355, 355 355, 355 340 L 360 200 Z" fill="url(#ceramic)" />
      <!-- Rim -->
      <ellipse cx="300" cy="200" rx="60" ry="15" fill="#57534E" stroke="#78716C" stroke-width="1.5" />
      <ellipse cx="300" cy="200" rx="52" ry="12" fill="#1C1917" />
      <ellipse cx="300" cy="204" rx="46" ry="10" fill="#3B2516" />

      <!-- Matte Ceramic Handle -->
      <path d="M 358 230 C 405 230, 405 310, 354 310" fill="none" stroke="#292524" stroke-width="16" stroke-linecap="round" />
    </svg>
  `)}`,

  watch: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
      <defs>
        <radialGradient id="wbg" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#F4F4F2" />
          <stop offset="100%" stop-color="#DCD9D2" />
        </radialGradient>
        <linearGradient id="steel" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#E2E8F0" />
          <stop offset="50%" stop-color="#94A3B8" />
          <stop offset="100%" stop-color="#475569" />
        </linearGradient>
      </defs>
      <rect width="600" height="450" fill="url(#wbg)" />
      <ellipse cx="300" cy="380" rx="90" ry="20" fill="#78716C" opacity="0.2" />

      <!-- Leather Strap -->
      <rect x="260" y="70" width="80" height="310" rx="8" fill="#451A03" stroke="#292524" stroke-width="2" />
      <line x1="266" y1="80" x2="266" y2="370" stroke="#78350F" stroke-width="1.5" stroke-dasharray="4,4" />
      <line x1="334" y1="80" x2="334" y2="370" stroke="#78350F" stroke-width="1.5" stroke-dasharray="4,4" />

      <!-- Watch Case -->
      <circle cx="300" cy="225" r="76" fill="url(#steel)" />
      <circle cx="300" cy="225" r="66" fill="#0F172A" />
      <circle cx="300" cy="225" r="64" fill="#020617" stroke="#334155" stroke-width="1" />

      <!-- Crown -->
      <rect x="375" y="217" width="8" height="16" rx="2" fill="url(#steel)" />

      <!-- Hour markers -->
      <line x1="300" y1="168" x2="300" y2="178" stroke="#F8FAFC" stroke-width="2.5" />
      <line x1="300" y1="282" x2="300" y2="272" stroke="#F8FAFC" stroke-width="2.5" />
      <line x1="243" y1="225" x2="253" y2="225" stroke="#F8FAFC" stroke-width="2.5" />
      <line x1="357" y1="225" x2="347" y2="225" stroke="#F8FAFC" stroke-width="2.5" />

      <!-- Watch Hands -->
      <line x1="300" y1="225" x2="330" y2="210" stroke="#F8FAFC" stroke-width="3" stroke-linecap="round" />
      <line x1="300" y1="225" x2="280" y2="180" stroke="#E2E8F0" stroke-width="2" stroke-linecap="round" />
      <line x1="300" y1="225" x2="320" y2="250" stroke="#EF4444" stroke-width="1" />
      <circle cx="300" cy="225" r="4" fill="#EF4444" />
    </svg>
  `)}`,

  stand: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
      <defs>
        <radialGradient id="sbg" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stop-color="#FBFBF9" />
          <stop offset="100%" stop-color="#E5E2DB" />
        </radialGradient>
        <linearGradient id="walnutWood" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#5B3822" />
          <stop offset="50%" stop-color="#452714" />
          <stop offset="100%" stop-color="#341A0B" />
        </linearGradient>
      </defs>
      <rect width="600" height="450" fill="url(#sbg)" />
      <ellipse cx="300" cy="330" rx="200" ry="25" fill="#452714" opacity="0.18" />

      <!-- Solid curved walnut stand -->
      <g transform="translate(300, 240)">
        <!-- Top Shelf Plate -->
        <polygon points="-210,-30 210,-30 230,20 -190,20" fill="url(#walnutWood)" />
        <polygon points="-210,-30 -190,20 -190,32 -210,-18" fill="#2E1609" />
        <polygon points="-190,20 230,20 230,32 -190,32" fill="#3D210F" />
        
        <!-- Aluminum or Steel Legs -->
        <polygon points="-170,25 -155,25 -155,65 -170,65" fill="#64748B" />
        <polygon points="190,25 205,25 205,65 190,65" fill="#64748B" />
      </g>
    </svg>
  `)}`,
};

export function getProductImage(key: string): string {
  return PRODUCT_ILLUSTRATIONS[key] || PRODUCT_ILLUSTRATIONS.headphones;
}
