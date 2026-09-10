import {useState, useEffect} from "react";

export function LogicPuzzleBackground() {
  const [mounted,setMounted]=useState(false);
  useEffect(()=>{
    setMounted(true);
  },[])
  if(!mounted) {
    return <div className="absolute inset-0 pointer-events-none"/>
  }
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Soft lavender-to-sky gradient base */}
      <div className="absolute inset-0 bg-[linear-gradient(145deg,#eef4fb_0%,#e6e8f8_38%,#dce8f5_62%,#edf2fa_100%)]" />

      {/* Corner glow accents */}
      <div className="absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.85)_0%,transparent_70%)]" />
      <div className="absolute -bottom-32 -left-32 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.75)_0%,transparent_70%)]" />
      <div className="absolute -left-20 -top-20 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.6)_0%,transparent_70%)]" />
      <div className="absolute -right-16 -bottom-16 h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.5)_0%,transparent_70%)]" />

      {/* Top-right mandala */}
      <svg
        className="absolute -right-8 top-8 h-56 w-56 opacity-[0.22] sm:h-72 sm:w-72 sm:top-4 sm:right-4"
        viewBox="0 0 200 200"
        fill="none"
        stroke="#7eb8dc"
        strokeWidth="0.75"
      >
        <circle cx="100" cy="100" r="88" />
        <circle cx="100" cy="100" r="64" />
        <circle cx="100" cy="100" r="40" />
        <circle cx="100" cy="100" r="16" />
        {[...Array(12)].map((_, i) => {
          const angle = (i * Math.PI) / 6
          const x1 = 100 + Math.cos(angle) * 16
          const y1 = 100 + Math.sin(angle) * 16
          const x2 = 100 + Math.cos(angle) * 88
          const y2 = 100 + Math.sin(angle) * 88
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
        })}
        {[...Array(8)].map((_, i) => {
          const angle = (i * Math.PI) / 4
          const cx = 100 + Math.cos(angle) * 64
          const cy = 100 + Math.sin(angle) * 64
          return <circle key={`n-${i}`} cx={cx} cy={cy} r="3" fill="#7eb8dc" stroke="none" />
        })}
        {[...Array(6)].map((_, i) => {
          const angle = (i * Math.PI) / 3 + Math.PI / 12
          const x = 100 + Math.cos(angle) * 52
          const y = 100 + Math.sin(angle) * 52
          return (
            <polygon
              key={`s-${i}`}
              points={`${x},${y - 10} ${x + 8},${y + 6} ${x - 8},${y + 6}`}
              stroke="#7eb8dc"
              fill="none"
            />
          )
        })}
      </svg>

      {/* Middle-left constellation */}
      <svg
        className="absolute left-4 top-[38%] h-44 w-44 opacity-[0.22] sm:left-12 sm:h-52 sm:w-52"
        viewBox="0 0 160 160"
        fill="none"
        stroke="#7eb8dc"
        strokeWidth="0.75"
      >
        <line x1="24" y1="40" x2="58" y2="72" />
        <line x1="58" y1="72" x2="96" y2="48" />
        <line x1="96" y1="48" x2="130" y2="88" />
        <line x1="58" y1="72" x2="44" y2="118" />
        <line x1="44" y1="118" x2="88" y2="132" />
        <line x1="88" y1="132" x2="130" y2="88" />
        <line x1="96" y1="48" x2="118" y2="24" />
        {[[24, 40], [58, 72], [96, 48], [130, 88], [44, 118], [88, 132], [118, 24]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="2.5" fill="#7eb8dc" stroke="none" />
        ))}
      </svg>

      {/* Bottom-right wireframe crystal */}
      <svg
        className="absolute -bottom-6 right-6 h-48 w-48 opacity-[0.22] sm:right-16 sm:h-64 sm:w-64"
        viewBox="0 0 180 180"
        fill="none"
        stroke="#7eb8dc"
        strokeWidth="0.75"
      >
        <polygon points="90,20 150,60 150,120 90,160 30,120 30,60" />
        <line x1="90" y1="20" x2="90" y2="160" />
        <line x1="30" y1="60" x2="150" y2="120" />
        <line x1="150" y1="60" x2="30" y2="120" />
        <line x1="90" y1="20" x2="30" y2="60" />
        <line x1="90" y1="20" x2="150" y2="60" />
        <line x1="90" y1="160" x2="30" y2="120" />
        <line x1="90" y1="160" x2="150" y2="120" />
        <polygon points="90,60 120,80 120,110 90,130 60,110 60,80" strokeWidth="0.5" />
        <line x1="90" y1="60" x2="90" y2="130" />
        <line x1="60" y1="80" x2="120" y2="110" />
        <line x1="120" y1="80" x2="60" y2="110" />
      </svg>

      {/* Top-left small mandala */}
      <svg
        className="absolute left-8 top-12 h-32 w-32 opacity-[0.22] sm:left-16 sm:h-40 sm:w-40"
        viewBox="0 0 120 120"
        fill="none"
        stroke="#7eb8dc"
        strokeWidth="0.6"
      >
        <circle cx="60" cy="60" r="50" />
        <circle cx="60" cy="60" r="35" />
        <circle cx="60" cy="60" r="20" />
        {[...Array(8)].map((_, i) => {
          const angle = (i * Math.PI) / 4
          const x1 = 60 + Math.cos(angle) * 20
          const y1 = 60 + Math.sin(angle) * 20
          const x2 = 60 + Math.cos(angle) * 50
          const y2 = 60 + Math.sin(angle) * 50
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
        })}
      </svg>

      {/* Bottom-left small constellation */}
      <svg
        className="absolute left-6 bottom-12 h-36 w-36 opacity-[0.22] sm:left-10 sm:h-44 sm:w-44"
        viewBox="0 0 140 140"
        fill="none"
        stroke="#7eb8dc"
        strokeWidth="0.6"
      >
        <line x1="20" y1="30" x2="50" y2="60" />
        <line x1="50" y1="60" x2="90" y2="40" />
        <line x1="50" y1="60" x2="40" y2="100" />
        <line x1="40" y1="100" x2="80" y2="110" />
        {[[20, 30], [50, 60], [90, 40], [40, 100], [80, 110]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="2" fill="#7eb8dc" stroke="none" />
        ))}
      </svg>

      {/* Top-center small crystal */}
      <svg
        className="absolute left-1/2 top-16 h-28 w-28 -translate-x-1/2 opacity-[0.22] sm:top-20 sm:h-36 sm:w-36"
        viewBox="0 0 100 100"
        fill="none"
        stroke="#7eb8dc"
        strokeWidth="0.6"
      >
        <polygon points="50,10 85,35 85,70 50,95 15,70 15,35" />
        <line x1="50" y1="10" x2="50" y2="95" />
        <line x1="15" y1="35" x2="85" y2="70" />
        <line x1="85" y1="35" x2="15" y2="70" />
      </svg>

      {/* Right side medium constellation */}
      <svg
        className="absolute right-8 top-[45%] h-40 w-40 opacity-[0.22] sm:right-12 sm:h-48 sm:w-48"
        viewBox="0 0 150 150"
        fill="none"
        stroke="#7eb8dc"
        strokeWidth="0.7"
      >
        <line x1="30" y1="25" x2="60" y2="55" />
        <line x1="60" y1="55" x2="100" y2="35" />
        <line x1="60" y1="55" x2="50" y2="95" />
        <line x1="50" y1="95" x2="90" y2="105" />
        <line x1="100" y1="35" x2="120" y2="15" />
        {[[30, 25], [60, 55], [100, 35], [50, 95], [90, 105], [120, 15]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="2.2" fill="#7eb8dc" stroke="none" />
        ))}
      </svg>

      {/* Bottom-center geometric pattern */}
      <svg
        className="absolute left-1/3 bottom-8 h-32 w-32 opacity-[0.22] sm:left-1/4 sm:h-40 sm:w-40"
        viewBox="0 0 120 120"
        fill="none"
        stroke="#7eb8dc"
        strokeWidth="0.6"
      >
        <circle cx="60" cy="60" r="45" />
        <circle cx="60" cy="60" r="30" />
        {[...Array(6)].map((_, i) => {
          const angle = (i * Math.PI) / 3
          const x1 = 60 + Math.cos(angle) * 30
          const y1 = 60 + Math.sin(angle) * 30
          const x2 = 60 + Math.cos(angle) * 45
          const y2 = 60 + Math.sin(angle) * 45
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
        })}
      </svg>

      {/* --- NEW DESIGN 1: Center-Right Floating Hex Grid Lattice --- */}
      <svg
        className="absolute right-[28%] top-[30%] h-36 w-36 opacity-[0.22]"
        viewBox="0 0 120 120"
        fill="none"
        stroke="#7eb8dc"
        strokeWidth="0.55"
      >
        <polygon points="60,10 100,32 100,78 60,100 20,78 20,32" />
        <polygon points="60,30 82,42 82,68 60,80 38,68 38,42" strokeWidth="0.4" />
        <line x1="60" y1="10" x2="60" y2="100" />
        <line x1="20" y1="32" x2="100" y2="78" />
        <line x1="100" y1="32" x2="20" y2="78" />
        {[[60, 10], [100, 32], [100, 78], [60, 100], [20, 78], [20, 32], [60, 60]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="2" fill="#7eb8dc" stroke="none" />
        ))}
      </svg>

      {/* --- NEW DESIGN 2: Upper-Left Starburst Lattice --- */}
      <svg
        className="absolute left-[32%] top-8 h-32 w-32 opacity-[0.22]"
        viewBox="0 0 100 100"
        fill="none"
        stroke="#7eb8dc"
        strokeWidth="0.5"
      >
        <circle cx="50" cy="50" r="42" />
        <circle cx="50" cy="50" r="26" />
        <circle cx="50" cy="50" r="10" />
        {[...Array(8)].map((_, i) => {
          const angle = (i * Math.PI) / 4
          const x1 = 50 + Math.cos(angle) * 10
          const y1 = 50 + Math.sin(angle) * 10
          const x2 = 50 + Math.cos(angle) * 42
          const y2 = 50 + Math.sin(angle) * 42
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
        })}
      </svg>

      {/* --- NEW DESIGN 3: Lower-Left Intersecting Orbital Rings --- */}
      <svg
        className="absolute left-[12%] bottom-[20%] h-36 w-36 opacity-[0.22]"
        viewBox="0 0 120 120"
        fill="none"
        stroke="#7eb8dc"
        strokeWidth="0.5"
      >
        <ellipse cx="60" cy="60" rx="50" ry="20" transform="rotate(30 60 60)" />
        <ellipse cx="60" cy="60" rx="50" ry="20" transform="rotate(-30 60 60)" />
        <circle cx="60" cy="60" r="15" />
        <circle cx="60" cy="60" r="3" fill="#7eb8dc" stroke="none" />
      </svg>

      {/* --- NEW DESIGN 4: Upper-Right Triangle Grid --- */}
      <svg
        className="absolute right-[18%] top-[15%] h-32 w-32 opacity-[0.22]"
        viewBox="0 0 100 100"
        fill="none"
        stroke="#7eb8dc"
        strokeWidth="0.5"
      >
        <polygon points="50,10 90,80 10,80" />
        <polygon points="50,30 75,75 25,75" strokeWidth="0.4" />
        <polygon points="50,45 65,70 35,70" strokeWidth="0.3" />
        <line x1="50" y1="10" x2="50" y2="80" />
        <line x1="25" y1="75" x2="75" y2="75" />
      </svg>

      {/* --- NEW DESIGN 5: Center Spiral Pattern --- */}
      <svg
        className="absolute left-[45%] top-[40%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 opacity-[0.22]"
        viewBox="0 0 140 140"
        fill="none"
        stroke="#7eb8dc"
        strokeWidth="0.6"
      >
        <circle cx="70" cy="70" r="60" />
        <circle cx="70" cy="70" r="45" />
        <circle cx="70" cy="70" r="30" />
        <circle cx="70" cy="70" r="15" />
        {[...Array(12)].map((_, i) => {
          const angle = (i * Math.PI) / 6
          const x1 = 70 + Math.cos(angle) * 15
          const y1 = 70 + Math.sin(angle) * 15
          const x2 = 70 + Math.cos(angle + 0.3) * 60
          const y2 = 70 + Math.sin(angle + 0.3) * 60
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
        })}
      </svg>

      {/* --- NEW DESIGN 6: Bottom-Right Diamond Lattice --- */}
      <svg
        className="absolute right-[8%] bottom-[25%] h-36 w-36 opacity-[0.22]"
        viewBox="0 0 120 120"
        fill="none"
        stroke="#7eb8dc"
        strokeWidth="0.5"
      >
        <polygon points="60,5 115,60 60,115 5,60" />
        <polygon points="60,25 95,60 60,95 25,60" strokeWidth="0.4" />
        <polygon points="60,40 80,60 60,80 40,60" strokeWidth="0.3" />
        <line x1="60" y1="5" x2="60" y2="115" />
        <line x1="5" y1="60" x2="115" y2="60" />
      </svg>

      {/* --- NEW DESIGN 7: Left-Middle Connected Dots --- */}
      <svg
        className="absolute left-[5%] top-[55%] h-32 w-32 opacity-[0.22]"
        viewBox="0 0 100 100"
        fill="none"
        stroke="#7eb8dc"
        strokeWidth="0.6"
      >
        <line x1="20" y1="20" x2="50" y2="35" />
        <line x1="50" y1="35" x2="80" y2="20" />
        <line x1="50" y1="35" x2="50" y2="65" />
        <line x1="50" y1="65" x2="20" y2="80" />
        <line x1="50" y1="65" x2="80" y2="80" />
        <line x1="20" y1="20" x2="20" y2="80" />
        <line x1="80" y1="20" x2="80" y2="80" />
        {[[20, 20], [50, 35], [80, 20], [50, 65], [20, 80], [80, 80]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="2.5" fill="#7eb8dc" stroke="none" />
        ))}
      </svg>

      {/* --- NEW DESIGN 8: Top-Middle Concentric Squares --- */}
      <svg
        className="absolute left-[40%] top-[5%] h-28 w-28 -translate-x-1/2 opacity-[0.22]"
        viewBox="0 0 100 100"
        fill="none"
        stroke="#7eb8dc"
        strokeWidth="0.5"
      >
        <rect x="10" y="10" width="80" height="80" rx="5" />
        <rect x="20" y="20" width="60" height="60" rx="4" strokeWidth="0.4" />
        <rect x="30" y="30" width="40" height="40" rx="3" strokeWidth="0.3" />
        <rect x="40" y="40" width="20" height="20" rx="2" strokeWidth="0.2" />
        <line x1="50" y1="10" x2="50" y2="90" />
        <line x1="10" y1="50" x2="90" y2="50" />
      </svg>

      {/* --- NEW DESIGN 9: Right-Middle Octagon Pattern --- */}
      <svg
        className="absolute right-[5%] top-[35%] h-32 w-32 opacity-[0.22]"
        viewBox="0 0 100 100"
        fill="none"
        stroke="#7eb8dc"
        strokeWidth="0.5"
      >
        <polygon points="50,5 85,25 85,75 50,95 15,75 15,25" />
        <polygon points="50,20 70,32 70,68 50,80 30,68 30,32" strokeWidth="0.4" />
        {[...Array(8)].map((_, i) => {
          const angle = (i * Math.PI) / 4 + Math.PI / 8
          const x1 = 50 + Math.cos(angle) * 20
          const y1 = 50 + Math.sin(angle) * 20
          const x2 = 50 + Math.cos(angle) * 45
          const y2 = 50 + Math.sin(angle) * 45
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
        })}
      </svg>

      {/* --- NEW DESIGN 10: Bottom-Middle Wave Pattern --- */}
      <svg
        className="absolute left-[35%] bottom-[5%] h-24 w-48 opacity-[0.22]"
        viewBox="0 0 160 80"
        fill="none"
        stroke="#7eb8dc"
        strokeWidth="0.5"
      >
        <path d="M10,40 Q40,10 70,40 T130,40" />
        <path d="M10,50 Q40,20 70,50 T130,50" strokeWidth="0.4" />
        <path d="M10,60 Q40,30 70,60 T130,60" strokeWidth="0.3" />
        {[[10, 40], [70, 40], [130, 40], [40, 25], [100, 55]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="2" fill="#7eb8dc" stroke="none" />
        ))}
      </svg>

      {/* --- NEW DESIGN 11: Upper-Center Cross Pattern --- */}
      <svg
        className="absolute left-[52%] top-[22%] h-24 w-24 opacity-[0.22]"
        viewBox="0 0 80 80"
        fill="none"
        stroke="#7eb8dc"
        strokeWidth="0.6"
      >
        <line x1="40" y1="10" x2="40" y2="70" />
        <line x1="10" y1="40" x2="70" y2="40" />
        <line x1="25" y1="25" x2="55" y2="55" />
        <line x1="55" y1="25" x2="25" y2="55" />
        <circle cx="40" cy="40" r="8" />
        <circle cx="40" cy="40" r="3" fill="#7eb8dc" stroke="none" />
      </svg>

      {/* --- NEW DESIGN 12: Lower-Center Pentagon Web --- */}
      <svg
        className="absolute left-[48%] bottom-[15%] h-28 w-28 -translate-x-1/2 opacity-[0.22]"
        viewBox="0 0 100 100"
        fill="none"
        stroke="#7eb8dc"
        strokeWidth="0.5"
      >
        <polygon points="50,10 85,35 72,75 28,75 15,35" />
        <polygon points="50,25 72,42 62,68 38,68 28,42" strokeWidth="0.4" />
        <line x1="50" y1="10" x2="50" y2="75" />
        <line x1="15" y1="35" x2="85" y2="35" />
        {[[50, 10], [85, 35], [72, 75], [28, 75], [15, 35], [50, 42]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="2" fill="#7eb8dc" stroke="none" />
        ))}
      </svg>

      {/* --- NEW DESIGN 13: Scattered Small Star --- */}
      <svg
        className="absolute left-[75%] top-[55%] h-16 w-16 opacity-[0.22]"
        viewBox="0 0 60 60"
        fill="none"
        stroke="#7eb8dc"
        strokeWidth="0.5"
      >
        <polygon points="30,5 35,25 55,25 40,37 45,57 30,45 15,57 20,37 5,25 25,25" />
        <circle cx="30" cy="30" r="5" />
      </svg>

      {/* --- NEW DESIGN 14: Left-Bottom Corner Curve --- */}
      <svg
        className="absolute left-[2%] bottom-[2%] h-24 w-24 opacity-[0.22]"
        viewBox="0 0 80 80"
        fill="none"
        stroke="#7eb8dc"
        strokeWidth="0.5"
      >
        <path d="M10,70 Q10,10 70,10" />
        <path d="M20,70 Q20,20 70,20" strokeWidth="0.4" />
        <path d="M30,70 Q30,30 70,30" strokeWidth="0.3" />
        {[[10, 70], [30, 30], [70, 10]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="2" fill="#7eb8dc" stroke="none" />
        ))}
      </svg>

      {/* --- NEW DESIGN 15: Right-Top Corner Diagonal Lines --- */}
      <svg
        className="absolute right-[2%] top-[2%] h-20 w-20 opacity-[0.22]"
        viewBox="0 0 70 70"
        fill="none"
        stroke="#7eb8dc"
        strokeWidth="0.5"
      >
        <line x1="10" y1="60" x2="60" y2="10" />
        <line x1="20" y1="60" x2="60" y2="20" strokeWidth="0.4" />
        <line x1="30" y1="60" x2="60" y2="30" strokeWidth="0.3" />
        <line x1="40" y1="60" x2="60" y2="40" strokeWidth="0.2" />
        {[[10, 60], [35, 35], [60, 10]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="2" fill="#7eb8dc" stroke="none" />
        ))}
      </svg>

      {/* Additional scattered small elements */}
      <svg
        className="absolute left-[60%] top-[25%] h-24 w-24 opacity-[0.22] sm:left-[65%] sm:h-32 sm:w-32"
        viewBox="0 0 80 80"
        fill="none"
        stroke="#7eb8dc"
        strokeWidth="0.5"
      >
        <circle cx="40" cy="40" r="30" />
        <circle cx="40" cy="40" r="18" />
        {[...Array(4)].map((_, i) => {
          const angle = (i * Math.PI) / 2
          const x1 = 40 + Math.cos(angle) * 18
          const y1 = 40 + Math.sin(angle) * 18
          const x2 = 40 + Math.cos(angle) * 30
          const y2 = 40 + Math.sin(angle) * 30
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
        })}
      </svg>

      <svg
        className="absolute left-[20%] bottom-[30%] h-20 w-20 opacity-[0.22] sm:left-[25%] sm:h-28 sm:w-28"
        viewBox="0 0 60 60"
        fill="none"
        stroke="#7eb8dc"
        strokeWidth="0.5"
      >
        <polygon points="30,5 50,20 50,45 30,55 10,45 10,20" />
        <line x1="30" y1="5" x2="30" y2="55" />
      </svg>

      <svg
        className="absolute right-[15%] bottom-[40%] h-28 w-28 opacity-[0.22] sm:right-[20%] sm:h-36 sm:w-36"
        viewBox="0 0 100 100"
        fill="none"
        stroke="#7eb8dc"
        strokeWidth="0.5"
      >
        <line x1="15" y1="20" x2="40" y2="45" />
        <line x1="40" y1="45" x2="70" y2="30" />
        <line x1="40" y1="45" x2="35" y2="75" />
        {[[15, 20], [40, 45], [70, 30], [35, 75]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="2" fill="#7eb8dc" stroke="none" />
        ))}
      </svg>
    </div>
  )
}