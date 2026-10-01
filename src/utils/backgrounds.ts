// Aesthetic vector background artworks and ambient textures
// Fully offline, Zero-Broken-Image guaranteed, resolution-independent

export const BACKGROUND_IMAGES = {
  // Hero Background: Architectural sunlit design atelier with warm wood slats, soft lighting & morning shadows
  heroStudio: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="warmSky" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FDFBF7" />
          <stop offset="40%" stop-color="#F7F3E9" />
          <stop offset="100%" stop-color="#ECE5D8" />
        </linearGradient>

        <linearGradient id="sunBeam" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FEF3C7" stop-opacity="0.45" />
          <stop offset="70%" stop-color="#FDE68A" stop-opacity="0.1" />
          <stop offset="100%" stop-color="#FEF3C7" stop-opacity="0" />
        </linearGradient>

        <linearGradient id="slatWood" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#A16207" stop-opacity="0.25" />
          <stop offset="100%" stop-color="#78350F" stop-opacity="0.4" />
        </linearGradient>

        <radialGradient id="softGlow" cx="75%" cy="30%" r="50%">
          <stop offset="0%" stop-color="#FBBF24" stop-opacity="0.22" />
          <stop offset="60%" stop-color="#F59E0B" stop-opacity="0.05" />
          <stop offset="100%" stop-color="#F59E0B" stop-opacity="0" />
        </radialGradient>

        <pattern id="archGrid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D6D3D1" stroke-width="0.75" opacity="0.35" />
        </pattern>
      </defs>

      <!-- Base Canvas -->
      <rect width="1600" height="900" fill="url(#warmSky)" />
      
      <!-- Architectural Grid Overlay -->
      <rect width="1600" height="900" fill="url(#archGrid)" />

      <!-- Ambient Light Sphere -->
      <circle cx="1200" cy="250" r="450" fill="url(#softGlow)" />

      <!-- Architectural Wall Shadow & Slats on Right -->
      <g opacity="0.35">
        <line x1="1250" y1="0" x2="1250" y2="900" stroke="#78350F" stroke-width="4" />
        <line x1="1300" y1="0" x2="1300" y2="900" stroke="#78350F" stroke-width="4" />
        <line x1="1350" y1="0" x2="1350" y2="900" stroke="#78350F" stroke-width="4" />
        <line x1="1400" y1="0" x2="1400" y2="900" stroke="#78350F" stroke-width="4" />
        <line x1="1450" y1="0" x2="1450" y2="900" stroke="#78350F" stroke-width="4" />
        <line x1="1500" y1="0" x2="1500" y2="900" stroke="#78350F" stroke-width="4" />
        <line x1="1550" y1="0" x2="1550" y2="900" stroke="#78350F" stroke-width="4" />
      </g>

      <!-- Diagonally Diffused Sunbeam Window Shadows -->
      <polygon points="400,0 750,0 1200,900 850,900" fill="url(#sunBeam)" />
      <polygon points="650,0 950,0 1500,900 1200,900" fill="url(#sunBeam)" opacity="0.7" />

      <!-- Minimalist Architectural Shelving silhouette on Left -->
      <g opacity="0.12">
        <rect x="0" y="220" width="380" height="8" fill="#1C1917" />
        <rect x="0" y="480" width="440" height="8" fill="#1C1917" />
        <rect x="0" y="740" width="360" height="8" fill="#1C1917" />
        <!-- Ceramic Vessel silhouettes on shelf -->
        <ellipse cx="180" cy="216" rx="22" ry="4" fill="#1C1917" />
        <path d="M 160 216 C 160 170, 200 170, 200 216 Z" fill="#1C1917" />
        <ellipse cx="280" cy="216" rx="30" ry="5" fill="#1C1917" />
        <path d="M 255 216 C 255 150, 305 150, 305 216 Z" fill="#1C1917" />
      </g>

      <!-- Soft Vignette Gradient at the Bottom -->
      <rect y="700" width="1600" height="200" fill="url(#warmSky)" opacity="0.6" />
    </svg>
  `)}`,

  // Craft Story Workshop Background
  craftWorkshop: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 600" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="darkWorkshop" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1C1917" />
          <stop offset="50%" stop-color="#292524" />
          <stop offset="100%" stop-color="#0C0A09" />
        </linearGradient>
        <radialGradient id="hearthGlow" cx="25%" cy="50%" r="55%">
          <stop offset="0%" stop-color="#D97706" stop-opacity="0.3" />
          <stop offset="50%" stop-color="#B45309" stop-opacity="0.1" />
          <stop offset="100%" stop-color="#1C1917" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="brassGlow" cx="80%" cy="40%" r="45%">
          <stop offset="0%" stop-color="#FBBF24" stop-opacity="0.2" />
          <stop offset="100%" stop-color="#1C1917" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height="600" fill="url(#darkWorkshop)" />
      <circle cx="400" cy="300" r="450" fill="url(#hearthGlow)" />
      <circle cx="1250" cy="250" r="400" fill="url(#brassGlow)" />

      <!-- Subtle geometric atelier lines -->
      <g stroke="#44403C" stroke-width="1" opacity="0.3">
        <line x1="0" y1="150" x2="1600" y2="150" />
        <line x1="0" y1="450" x2="1600" y2="450" />
        <circle cx="800" cy="300" r="180" fill="none" stroke-dasharray="6,6" />
      </g>
    </svg>
  `)}`,

  // Subtle Travertine Texture Card
  travertinePattern: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <rect width="400" height="400" fill="#F7F6F2" />
      <circle cx="80" cy="120" r="40" fill="#EAE7DF" opacity="0.6" filter="blur(10px)" />
      <circle cx="320" cy="280" r="60" fill="#E5E1D5" opacity="0.6" filter="blur(12px)" />
      <path d="M 0 100 Q 150 120 400 80" stroke="#DFDBD0" stroke-width="1.5" fill="none" opacity="0.4" />
      <path d="M 0 260 Q 220 230 400 290" stroke="#DFDBD0" stroke-width="1.5" fill="none" opacity="0.4" />
    </svg>
  `)}`,
};
