// High-resolution procedural cinematic movie poster generator
// Produces 2:3 ratio (800x1200) authentic theatrical posters with rich visual art

const posterCache = new Map<string, string>();
const canvasCache = new Map<string, HTMLCanvasElement>();

export function getMoviePosterCanvas(movieId: string): HTMLCanvasElement {
  if (canvasCache.has(movieId)) {
    return canvasCache.get(movieId)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 1200;
  const ctx = canvas.getContext('2d')!;

  switch (movieId) {
    case 'mov-1': // Dune: Part Two
      renderDunePoster(ctx);
      break;
    case 'mov-2': // Kantara Chapter 1
      renderKantaraPoster(ctx);
      break;
    case 'mov-3': // Thalapathy 69
      renderThalapathyPoster(ctx);
      break;
    case 'mov-4': // Kalki 2898 AD
      renderKalkiPoster(ctx);
      break;
    case 'mov-5': // Interstellar
      renderInterstellarPoster(ctx);
      break;
    case 'mov-6': // Stree 2
      renderStreePoster(ctx);
      break;
    case 'mov-7': // Viduthalai Part 2
      renderViduthalaiPoster(ctx);
      break;
    case 'mov-8': // Oppenheimer
      renderOppenheimerPoster(ctx);
      break;
    case 'mov-9': // Devara
      renderDevaraPoster(ctx);
      break;
    case 'mov-10': // Meiyazhagan
      renderMeiyazhaganPoster(ctx);
      break;
    case 'mov-11': // Gladiator II
      renderGladiatorPoster(ctx);
      break;
    default:
      renderDefaultSciFiPoster(ctx, movieId);
      break;
  }

  canvasCache.set(movieId, canvas);
  return canvas;
}

export function getMoviePosterDataUrl(movieId: string): string {
  // Return the direct static path to the real official theatrical poster in /public/posters/
  return `/posters/${movieId}.jpg`;
}

// 1. DUNE: PART TWO
function renderDunePoster(ctx: CanvasRenderingContext2D) {
  // Sky: deep amber spice dusk
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 1200);
  skyGrad.addColorStop(0, '#100803');
  skyGrad.addColorStop(0.35, '#3a1805');
  skyGrad.addColorStop(0.65, '#bd631b');
  skyGrad.addColorStop(0.85, '#e59a44');
  skyGrad.addColorStop(1, '#66330c');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, 800, 1200);

  // Twin Suns of Arrakis
  ctx.beginPath();
  const sunGrad1 = ctx.createRadialGradient(400, 320, 20, 400, 320, 180);
  sunGrad1.addColorStop(0, '#fff4cc');
  sunGrad1.addColorStop(0.3, '#f9a825');
  sunGrad1.addColorStop(1, 'rgba(230, 81, 0, 0)');
  ctx.fillStyle = sunGrad1;
  ctx.arc(400, 320, 180, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  const sunGrad2 = ctx.createRadialGradient(250, 260, 10, 250, 260, 70);
  sunGrad2.addColorStop(0, '#ffffff');
  sunGrad2.addColorStop(0.5, '#ffd54f');
  sunGrad2.addColorStop(1, 'rgba(255, 179, 0, 0)');
  ctx.fillStyle = sunGrad2;
  ctx.arc(250, 260, 70, 0, Math.PI * 2);
  ctx.fill();

  // Desert Dunes (Curved layered silhouettes)
  ctx.fillStyle = '#9e4712';
  ctx.beginPath();
  ctx.moveTo(0, 680);
  ctx.bezierCurveTo(240, 620, 500, 740, 800, 660);
  ctx.lineTo(800, 1200);
  ctx.lineTo(0, 1200);
  ctx.fill();

  ctx.fillStyle = '#6d2e07';
  ctx.beginPath();
  ctx.moveTo(0, 780);
  ctx.bezierCurveTo(320, 850, 550, 730, 800, 810);
  ctx.lineTo(800, 1200);
  ctx.lineTo(0, 1200);
  ctx.fill();

  ctx.fillStyle = '#2b1002';
  ctx.beginPath();
  ctx.moveTo(0, 920);
  ctx.bezierCurveTo(300, 880, 600, 950, 800, 890);
  ctx.lineTo(800, 1200);
  ctx.lineTo(0, 1200);
  ctx.fill();

  // Silhouettes of Paul and Chani standing on dune ridge
  ctx.fillStyle = '#0f0501';
  // Figure 1
  ctx.beginPath();
  ctx.arc(380, 705, 12, 0, Math.PI * 2); // Head
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(370, 718);
  ctx.lineTo(390, 718);
  ctx.lineTo(402, 785);
  ctx.lineTo(365, 785);
  ctx.closePath();
  ctx.fill();
  // Flowing cloak
  ctx.beginPath();
  ctx.moveTo(388, 720);
  ctx.bezierCurveTo(420, 735, 435, 775, 440, 795);
  ctx.lineTo(395, 785);
  ctx.fill();

  // Figure 2 (Chani with staff)
  ctx.beginPath();
  ctx.arc(430, 712, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(420, 724);
  ctx.lineTo(440, 724);
  ctx.lineTo(446, 785);
  ctx.lineTo(416, 785);
  ctx.closePath();
  ctx.fill();
  // Staff
  ctx.fillRect(448, 675, 3, 115);

  // Ornithopter in flight (dragonfly wing craft)
  drawOrnithopter(ctx, 580, 360, 0.7);

  // Glowing blue eyes reflection at top
  drawBlueSpiceGaze(ctx, 400, 170);

  // Typography
  drawPosterBilling(ctx, 'DENIS VILLENEUVE', 'TIMOTHÉE CHALAMET • ZENDAYA • REBECCA FERGUSON');
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 84px serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '14px';
  ctx.fillText('D U N E', 400, 1020);

  ctx.fillStyle = '#d4af37';
  ctx.font = '600 24px sans-serif';
  ctx.letterSpacing = '10px';
  ctx.fillText('PART TWO', 400, 1070);

  ctx.fillStyle = '#ffffff';
  ctx.font = '400 16px sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('LONG LIVE THE FIGHTERS • ONLY IN THEATERS', 400, 1120);
}

// 2. KANTARA: CHAPTER 1
function renderKantaraPoster(ctx: CanvasRenderingContext2D) {
  const bg = ctx.createLinearGradient(0, 0, 0, 1200);
  bg.addColorStop(0, '#0d0703');
  bg.addColorStop(0.4, '#240d04');
  bg.addColorStop(0.7, '#6b2005');
  bg.addColorStop(1, '#110602');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 800, 1200);

  // Ancient Jungle Silhouettes
  ctx.fillStyle = '#0a0401';
  for (let i = 0; i < 14; i++) {
    const tx = i * 65 - 30;
    ctx.fillRect(tx, 300, 24, 700);
  }

  // Fire torch glows
  const fireGrad = ctx.createRadialGradient(400, 520, 30, 400, 520, 280);
  fireGrad.addColorStop(0, '#ffeb3b');
  fireGrad.addColorStop(0.3, '#ff5722');
  fireGrad.addColorStop(0.7, '#d50000');
  fireGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = fireGrad;
  ctx.arc(400, 520, 280, 0, Math.PI * 2);
  ctx.fill();

  // Demigod fierce face paint silhouette
  ctx.fillStyle = '#fce4ec';
  ctx.beginPath();
  // Face mask / paint
  ctx.ellipse(400, 480, 85, 120, 0, 0, Math.PI * 2);
  ctx.fill();

  // Ceremonial Red and Black sacred markings
  ctx.fillStyle = '#b71c1c';
  ctx.fillRect(380, 420, 40, 140);
  ctx.fillStyle = '#000000';
  ctx.fillRect(340, 470, 120, 22);

  // Sacred horn headgear
  ctx.fillStyle = '#0f0501';
  ctx.beginPath();
  ctx.moveTo(320, 410);
  ctx.quadraticCurveTo(240, 280, 180, 260);
  ctx.quadraticCurveTo(250, 340, 340, 430);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(480, 410);
  ctx.quadraticCurveTo(560, 280, 620, 260);
  ctx.quadraticCurveTo(550, 340, 460, 430);
  ctx.fill();

  // Sparks
  drawSparks(ctx, 400, 550, 60);

  // Title
  ctx.fillStyle = '#fce4ec';
  ctx.font = '900 68px serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '8px';
  ctx.fillText('KANTARA', 400, 990);

  ctx.fillStyle = '#ffb300';
  ctx.font = '700 24px sans-serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('A LEGEND • CHAPTER 1', 400, 1045);

  ctx.fillStyle = '#ffffff';
  ctx.font = '400 15px sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('WRITTEN & DIRECTED BY RISHAB SHETTY', 400, 1100);
}

// 3. THALAPATHY 69: THE FINAL STRIKE
function renderThalapathyPoster(ctx: CanvasRenderingContext2D) {
  const bg = ctx.createLinearGradient(0, 0, 0, 1200);
  bg.addColorStop(0, '#060a12');
  bg.addColorStop(0.4, '#0d182b');
  bg.addColorStop(0.7, '#1e283b');
  bg.addColorStop(1, '#05080f');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 800, 1200);

  // Rainy city skyscrapers with amber/cyan bokeh
  ctx.fillStyle = '#0a101d';
  ctx.fillRect(100, 340, 140, 500);
  ctx.fillRect(260, 280, 160, 600);
  ctx.fillRect(440, 310, 150, 550);
  ctx.fillRect(610, 360, 130, 480);

  // City lights
  for (let i = 0; i < 80; i++) {
    const lx = 120 + ((i * 37) % 580);
    const ly = 320 + ((i * 53) % 450);
    ctx.fillStyle = i % 3 === 0 ? 'rgba(255, 183, 77, 0.7)' : 'rgba(129, 212, 250, 0.6)';
    ctx.fillRect(lx, ly, 6, 8);
  }

  // Intense back-lit silhouette in stylish sunglasses and blazer
  const heroLight = ctx.createRadialGradient(400, 600, 40, 400, 600, 260);
  heroLight.addColorStop(0, 'rgba(255, 167, 38, 0.8)');
  heroLight.addColorStop(0.5, 'rgba(38, 198, 218, 0.4)');
  heroLight.addColorStop(1, 'transparent');
  ctx.fillStyle = heroLight;
  ctx.arc(400, 600, 260, 0, Math.PI * 2);
  ctx.fill();

  // Central hero silhouette
  ctx.fillStyle = '#04070d';
  ctx.beginPath();
  ctx.arc(400, 500, 50, 0, Math.PI * 2); // Head
  ctx.fill();
  // Shoulders and blazer
  ctx.beginPath();
  ctx.moveTo(330, 550);
  ctx.lineTo(470, 550);
  ctx.lineTo(540, 820);
  ctx.lineTo(260, 820);
  ctx.closePath();
  ctx.fill();
  // Sunglasses gold rim
  ctx.fillStyle = '#ffb74d';
  ctx.fillRect(375, 495, 22, 10);
  ctx.fillRect(405, 495, 22, 10);

  // Neon Title
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 64px serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '6px';
  ctx.fillText('THALAPATHY 69', 400, 990);

  ctx.fillStyle = '#ffa726';
  ctx.font = '700 24px sans-serif';
  ctx.letterSpacing = '8px';
  ctx.fillText('THE FINAL STRIKE', 400, 1045);

  ctx.fillStyle = '#90a4ae';
  ctx.font = '500 15px sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('ANIRUDH MUSICAL • IN CINEMAS WORLDWIDE', 400, 1100);
}

// 4. KALKI 2898 AD
function renderKalkiPoster(ctx: CanvasRenderingContext2D) {
  const bg = ctx.createLinearGradient(0, 0, 0, 1200);
  bg.addColorStop(0, '#090912');
  bg.addColorStop(0.35, '#17142b');
  bg.addColorStop(0.7, '#2f1e42');
  bg.addColorStop(1, '#0c0a17');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 800, 1200);

  // Inverted dystopian pyramid structure of Kasi
  ctx.fillStyle = '#0f0c1c';
  ctx.beginPath();
  ctx.moveTo(100, 180);
  ctx.lineTo(700, 180);
  ctx.lineTo(400, 600);
  ctx.closePath();
  ctx.fill();

  // Floating rings and energy beam
  ctx.strokeStyle = '#e0a93b';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(400, 540, 220, 45, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Glowing staff of Ashwatthama
  ctx.fillStyle = '#ffe082';
  ctx.fillRect(397, 380, 6, 420);
  const glow = ctx.createRadialGradient(400, 380, 5, 400, 380, 90);
  glow.addColorStop(0, '#ffffff');
  glow.addColorStop(0.4, '#ffd54f');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.arc(400, 380, 90, 0, Math.PI * 2);
  ctx.fill();

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 68px serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '10px';
  ctx.fillText('KALKI', 400, 980);

  ctx.fillStyle = '#e0a93b';
  ctx.font = '700 32px sans-serif';
  ctx.letterSpacing = '8px';
  ctx.fillText('2898 AD', 400, 1035);

  ctx.fillStyle = '#cfd8dc';
  ctx.font = '400 15px sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('PRABHAS • AMITABH BACHCHAN • KAMAL HAASAN', 400, 1095);
}

// 5. INTERSTELLAR: IMAX
function renderInterstellarPoster(ctx: CanvasRenderingContext2D) {
  const bg = ctx.createLinearGradient(0, 0, 0, 1200);
  bg.addColorStop(0, '#000000');
  bg.addColorStop(0.5, '#050b1a');
  bg.addColorStop(0.85, '#13233d');
  bg.addColorStop(1, '#000000');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 800, 1200);

  // Gargantua Black Hole Accretion Disk
  ctx.save();
  ctx.translate(400, 440);

  // Outer glowing radiant disk
  const diskGrad = ctx.createRadialGradient(0, 0, 80, 0, 0, 280);
  diskGrad.addColorStop(0, '#ffffff');
  diskGrad.addColorStop(0.3, '#ffcc80');
  diskGrad.addColorStop(0.65, '#e65100');
  diskGrad.addColorStop(1, 'transparent');

  ctx.fillStyle = diskGrad;
  ctx.beginPath();
  ctx.ellipse(0, 0, 320, 85, -0.15, 0, Math.PI * 2);
  ctx.fill();

  // Vertical light gravitational bending arc
  ctx.beginPath();
  ctx.arc(0, -25, 145, Math.PI * 0.85, Math.PI * 2.15);
  ctx.lineWidth = 28;
  ctx.strokeStyle = '#ffe082';
  ctx.stroke();

  // Black hole event horizon (pitch black sphere)
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(0, 0, 82, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Ice cloud frozen planet surface below
  ctx.fillStyle = '#b0bec5';
  ctx.beginPath();
  ctx.moveTo(0, 860);
  ctx.bezierCurveTo(240, 800, 520, 890, 800, 820);
  ctx.lineTo(800, 1200);
  ctx.lineTo(0, 1200);
  ctx.fill();

  // Endurance spacecraft silhouette
  drawEnduranceRing(ctx, 400, 720);

  // Typography
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 56px sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '12px';
  ctx.fillText('INTERSTELLAR', 400, 1000);

  ctx.fillStyle = '#90caf9';
  ctx.font = '600 20px sans-serif';
  ctx.letterSpacing = '8px';
  ctx.fillText('EXPERIENCE IT IN IMAX 70MM', 400, 1050);

  ctx.fillStyle = '#cfd8dc';
  ctx.font = '400 14px sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText('MANKIND WAS BORN ON EARTH. IT WAS NEVER MEANT TO DIE HERE.', 400, 1100);
}

// 6. STREE 2
function renderStreePoster(ctx: CanvasRenderingContext2D) {
  const bg = ctx.createLinearGradient(0, 0, 0, 1200);
  bg.addColorStop(0, '#0d0612');
  bg.addColorStop(0.5, '#230b2e');
  bg.addColorStop(0.8, '#4a1240');
  bg.addColorStop(1, '#0d0612');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 800, 1200);

  // Eerie full moon
  ctx.beginPath();
  const moonGrad = ctx.createRadialGradient(400, 360, 20, 400, 360, 140);
  moonGrad.addColorStop(0, '#ffffff');
  moonGrad.addColorStop(0.5, '#f8bbd0');
  moonGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = moonGrad;
  ctx.arc(400, 360, 140, 0, Math.PI * 2);
  ctx.fill();

  // Haunted Haveli Fortress silhouette
  ctx.fillStyle = '#0a030c';
  ctx.fillRect(180, 520, 440, 300);
  // Domes
  ctx.beginPath();
  ctx.arc(280, 520, 45, Math.PI, 0);
  ctx.arc(520, 520, 45, Math.PI, 0);
  ctx.fill();

  // Floating crimson ghost silhouette
  ctx.fillStyle = '#ad1457';
  ctx.beginPath();
  ctx.moveTo(400, 400);
  ctx.bezierCurveTo(430, 460, 450, 560, 410, 680);
  ctx.bezierCurveTo(390, 650, 370, 560, 400, 400);
  ctx.fill();

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 76px serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '8px';
  ctx.fillText('STREE 2', 400, 990);

  ctx.fillStyle = '#f48fb1';
  ctx.font = '600 22px sans-serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('SARKATE KA AATANK', 400, 1045);

  ctx.fillStyle = '#ffffff';
  ctx.font = '400 15px sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText('SHRADDHA KAPOOR • RAJKUMMAR RAO • PANKAJ TRIPATHI', 400, 1100);
}

// 7. OPPENHEIMER
function renderOppenheimerPoster(ctx: CanvasRenderingContext2D) {
  const bg = ctx.createLinearGradient(0, 0, 0, 1200);
  bg.addColorStop(0, '#000000');
  bg.addColorStop(0.35, '#3e1703');
  bg.addColorStop(0.65, '#e65100');
  bg.addColorStop(0.85, '#ffb300');
  bg.addColorStop(1, '#050201');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 800, 1200);

  // Massive Trinity fireball cloud
  const fireGrad = ctx.createRadialGradient(400, 480, 40, 400, 480, 320);
  fireGrad.addColorStop(0, '#ffffff');
  fireGrad.addColorStop(0.2, '#fff176');
  fireGrad.addColorStop(0.55, '#f57c00');
  fireGrad.addColorStop(0.85, '#b71c1c');
  fireGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = fireGrad;
  ctx.arc(400, 480, 320, 0, Math.PI * 2);
  ctx.fill();

  // Fedora silhouette standing in front of atomic fire
  ctx.fillStyle = '#050201';
  // Fedora hat
  ctx.beginPath();
  ctx.ellipse(400, 680, 65, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(365, 680);
  ctx.lineTo(435, 680);
  ctx.lineTo(425, 640);
  ctx.lineTo(375, 640);
  ctx.closePath();
  ctx.fill();

  // Trench coat
  ctx.beginPath();
  ctx.moveTo(340, 710);
  ctx.lineTo(460, 710);
  ctx.lineTo(490, 880);
  ctx.lineTo(310, 880);
  ctx.closePath();
  ctx.fill();

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 62px sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '10px';
  ctx.fillText('OPPENHEIMER', 400, 1010);

  ctx.fillStyle = '#ffcc80';
  ctx.font = '600 20px sans-serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('A FILM BY CHRISTOPHER NOLAN', 400, 1060);

  ctx.fillStyle = '#ffffff';
  ctx.font = '400 14px sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('THE WORLD FOREVER CHANGES', 400, 1110);
}

// 8. GLADIATOR II
function renderGladiatorPoster(ctx: CanvasRenderingContext2D) {
  const bg = ctx.createLinearGradient(0, 0, 0, 1200);
  bg.addColorStop(0, '#100702');
  bg.addColorStop(0.35, '#3a1b07');
  bg.addColorStop(0.65, '#994a10');
  bg.addColorStop(1, '#1a0902');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 800, 1200);

  // Colosseum silhouette arches
  ctx.fillStyle = '#0d0401';
  ctx.fillRect(80, 480, 640, 260);
  for (let a = 0; a < 8; a++) {
    const ax = 120 + a * 70;
    ctx.beginPath();
    ctx.arc(ax, 540, 22, Math.PI, 0);
    ctx.lineTo(ax + 22, 620);
    ctx.lineTo(ax - 22, 620);
    ctx.fill();
  }

  // Hero with gladiator sword
  ctx.fillStyle = '#060201';
  ctx.beginPath();
  ctx.arc(400, 680, 32, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(360, 715, 80, 160);
  // Sword in hand
  ctx.fillStyle = '#e0e0e0';
  ctx.fillRect(445, 610, 4, 150);

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 68px serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '10px';
  ctx.fillText('GLADIATOR', 400, 1000);

  ctx.fillStyle = '#c8a35b';
  ctx.font = '900 48px serif';
  ctx.letterSpacing = '8px';
  ctx.fillText('II', 400, 1060);

  ctx.fillStyle = '#ffffff';
  ctx.font = '400 15px sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('WHAT WE DO IN LIFE ECHOES IN ETERNITY', 400, 1115);
}

// 9. DEVARA: PART 1
function renderDevaraPoster(ctx: CanvasRenderingContext2D) {
  const bg = ctx.createLinearGradient(0, 0, 0, 1200);
  bg.addColorStop(0, '#050c18');
  bg.addColorStop(0.4, '#10223b');
  bg.addColorStop(0.7, '#641b1b'); // Red sea clash
  bg.addColorStop(1, '#050a14');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 800, 1200);

  // Red sea waves
  ctx.fillStyle = '#8b1e1e';
  ctx.beginPath();
  ctx.moveTo(0, 720);
  ctx.bezierCurveTo(250, 660, 500, 780, 800, 710);
  ctx.lineTo(800, 1200);
  ctx.lineTo(0, 1200);
  ctx.fill();

  // Lighthouse beam
  const beam = ctx.createRadialGradient(200, 360, 10, 450, 420, 340);
  beam.addColorStop(0, '#ffffff');
  beam.addColorStop(0.4, '#ffe082');
  beam.addColorStop(1, 'transparent');
  ctx.fillStyle = beam;
  ctx.beginPath();
  ctx.moveTo(200, 360);
  ctx.lineTo(750, 380);
  ctx.lineTo(720, 520);
  ctx.closePath();
  ctx.fill();

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 76px serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '8px';
  ctx.fillText('DEVARA', 400, 1000);

  ctx.fillStyle = '#e53935';
  ctx.font = '700 24px sans-serif';
  ctx.letterSpacing = '8px';
  ctx.fillText('PART 1', 400, 1055);

  ctx.fillStyle = '#ffffff';
  ctx.font = '400 15px sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('JR NTR • JANHVI KAPOOR • SAIF ALI KHAN', 400, 1110);
}

// 10. VIDUTHALAI PART 2
function renderViduthalaiPoster(ctx: CanvasRenderingContext2D) {
  const bg = ctx.createLinearGradient(0, 0, 0, 1200);
  bg.addColorStop(0, '#0a0d0a');
  bg.addColorStop(0.4, '#1b261b');
  bg.addColorStop(0.7, '#384d38');
  bg.addColorStop(1, '#070a07');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 800, 1200);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 68px serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '6px';
  ctx.fillText('VIDUTHALAI', 400, 1000);

  ctx.fillStyle = '#c8a35b';
  ctx.font = '700 24px sans-serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('PART 2', 400, 1055);

  ctx.fillStyle = '#cfd8dc';
  ctx.font = '400 15px sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText('DIRECTED BY VETRIMAARAN • VIJAY SETHUPATHI', 400, 1110);
}

// 11. MEIYAZHAGAN
function renderMeiyazhaganPoster(ctx: CanvasRenderingContext2D) {
  const bg = ctx.createLinearGradient(0, 0, 0, 1200);
  bg.addColorStop(0, '#0b1617');
  bg.addColorStop(0.4, '#1c3133');
  bg.addColorStop(0.7, '#395356');
  bg.addColorStop(1, '#0c1718');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 800, 1200);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 64px serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '6px';
  ctx.fillText('MEIYAZHAGAN', 400, 1000);

  ctx.fillStyle = '#80cbc4';
  ctx.font = '600 20px sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('A JOURNEY OF KINDNESS AND HOMECOMING', 400, 1055);

  ctx.fillStyle = '#cfd8dc';
  ctx.font = '400 15px sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText('KANDHI • ARVIND SWAMY', 400, 1110);
}

// Default Sci-Fi Poster
function renderDefaultSciFiPoster(ctx: CanvasRenderingContext2D, id: string) {
  const bg = ctx.createLinearGradient(0, 0, 0, 1200);
  bg.addColorStop(0, '#0e1424');
  bg.addColorStop(0.5, '#1e2d4d');
  bg.addColorStop(1, '#0e1424');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 800, 1200);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 60px serif';
  ctx.textAlign = 'center';
  ctx.fillText('CINEMA SELECTION', 400, 1000);
}

// Helpers
function drawOrnithopter(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = '#0a0300';
  ctx.beginPath();
  ctx.ellipse(0, 0, 35, 12, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = '#0a0300';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(80, -45);
  ctx.moveTo(0, 0);
  ctx.lineTo(-75, 40);
  ctx.moveTo(10, 0);
  ctx.lineTo(95, -20);
  ctx.moveTo(-10, 0);
  ctx.lineTo(-85, 20);
  ctx.stroke();
  ctx.restore();
}

function drawBlueSpiceGaze(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(0, 229, 255, 0.45)';
  ctx.beginPath();
  ctx.ellipse(x - 90, y, 40, 12, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 90, y, 40, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawSparks(ctx: CanvasRenderingContext2D, cx: number, cy: number, count: number) {
  ctx.fillStyle = '#ffeb3b';
  for (let i = 0; i < count; i++) {
    const angle = (i * 137.5 * Math.PI) / 180;
    const r = ((i * 19) % 200) + 40;
    const sx = cx + Math.cos(angle) * r;
    const sy = cy + Math.sin(angle) * r * 0.8;
    ctx.beginPath();
    ctx.arc(sx, sy, (i % 3) + 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawEnduranceRing(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.save();
  ctx.strokeStyle = '#050c18';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(cx, cy, 60, 0, Math.PI * 2);
  ctx.stroke();
  // 12 pods
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6;
    ctx.fillRect(cx + Math.cos(a) * 60 - 5, cy + Math.sin(a) * 60 - 5, 10, 10);
  }
  ctx.restore();
}

function drawPosterBilling(ctx: CanvasRenderingContext2D, director: string, cast: string) {
  ctx.fillStyle = '#e0d5c1';
  ctx.font = '600 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '5px';
  ctx.fillText(director, 400, 240);

  ctx.font = '500 13px sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText(cast, 400, 275);
}
